from django.contrib.auth import authenticate
from django.conf import settings
from django.middleware import csrf
from rest_framework import generics, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import (
    exceptions as rest_exceptions,
    response,
    decorators as rest_decorators,
    permissions as rest_permissions,
)
from rest_framework_simplejwt import (
    tokens,
    views as jwt_views,
    serializers as jwt_serializers,
    exceptions as jwt_exceptions,
)
from user import serializers, models
from .utils import find_movie_id_by_title_and_year, save_rating, normalize_title
from .recommend import recommend
import os
import requests
import re
import time
import json
from django.http import JsonResponse, StreamingHttpResponse, HttpResponse
from dotenv import load_dotenv

LAST_ID = 2205
load_dotenv()
TMDB_API_KEY = os.getenv("TMDB_API_KEY")

RATINGS_CSV = (
    "/Users/marysiapacocha/Desktop/filmy/movie-chronicles-app/backend/user/ratings.csv"
)
MOVIES_CSV = (
    "/Users/marysiapacocha/Desktop/filmy/movie-chronicles-app/backend/user/movies.csv"
)
BASE_URL = "https://api.themoviedb.org/3/search/movie"
LLAMA_URL = "http://localhost:11434/api/generate"


def get_user_tokens(user):
    refresh = tokens.RefreshToken.for_user(user)
    return {"refresh_token": str(refresh), "access_token": str(refresh.access_token)}


@rest_decorators.api_view(["POST"])
@rest_decorators.permission_classes([])
def loginView(request):
    serializer = serializers.LoginSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    email = serializer.validated_data["email"]
    password = serializer.validated_data["password"]

    user = authenticate(email=email, password=password)

    if user is not None:
        tokens = get_user_tokens(user)
        res = response.Response()
        res.set_cookie(
            key=settings.SIMPLE_JWT["AUTH_COOKIE"],
            value=tokens["access_token"],
            expires=settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"],
            secure=settings.SIMPLE_JWT["AUTH_COOKIE_SECURE"],
            httponly=settings.SIMPLE_JWT["AUTH_COOKIE_HTTP_ONLY"],
            samesite=settings.SIMPLE_JWT["AUTH_COOKIE_SAMESITE"],
        )

        res.set_cookie(
            key=settings.SIMPLE_JWT["AUTH_COOKIE_REFRESH"],
            value=tokens["refresh_token"],
            expires=settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"],
            secure=settings.SIMPLE_JWT["AUTH_COOKIE_SECURE"],
            httponly=settings.SIMPLE_JWT["AUTH_COOKIE_HTTP_ONLY"],
            samesite=settings.SIMPLE_JWT["AUTH_COOKIE_SAMESITE"],
        )

        res.data = tokens
        res["X-CSRFToken"] = csrf.get_token(request)
        return res
    raise rest_exceptions.AuthenticationFailed("Email or Password is incorrect!")


@rest_decorators.api_view(["POST"])
@rest_decorators.permission_classes([])
def registerView(request):
    serializer = serializers.RegistrationSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    user = serializer.save()

    if user is not None:
        return response.Response("Registered!")
    return rest_exceptions.AuthenticationFailed("Invalid credentials!")


@rest_decorators.api_view(["POST"])
@rest_decorators.permission_classes([rest_permissions.IsAuthenticated])
def logoutView(request):
    try:
        refreshToken = request.COOKIES.get(settings.SIMPLE_JWT["AUTH_COOKIE_REFRESH"])
        token = tokens.RefreshToken(refreshToken)
        token.blacklist()

        res = response.Response()
        res.delete_cookie(settings.SIMPLE_JWT["AUTH_COOKIE"])
        res.delete_cookie(settings.SIMPLE_JWT["AUTH_COOKIE_REFRESH"])
        res.delete_cookie("X-CSRFToken")
        res.delete_cookie("csrftoken")
        res["X-CSRFToken"] = None

        return res
    except jwt_exceptions.TokenError:
        raise rest_exceptions.ParseError("Invalid token")


class CookieTokenRefreshSerializer(jwt_serializers.TokenRefreshSerializer):
    refresh = None

    def validate(self, attrs):
        attrs["refresh"] = self.context["request"].COOKIES.get("refresh")
        if attrs["refresh"]:
            return super().validate(attrs)
        else:
            raise jwt_exceptions.InvalidToken(
                "No valid token found in cookie 'refresh'"
            )


class CookieTokenRefreshView(jwt_views.TokenRefreshView):
    serializer_class = CookieTokenRefreshSerializer

    def finalize_response(self, request, response, *args, **kwargs):
        if response.data.get("refresh"):
            response.set_cookie(
                key=settings.SIMPLE_JWT["AUTH_COOKIE_REFRESH"],
                value=response.data["refresh"],
                expires=settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"],
                secure=settings.SIMPLE_JWT["AUTH_COOKIE_SECURE"],
                httponly=settings.SIMPLE_JWT["AUTH_COOKIE_HTTP_ONLY"],
                samesite=settings.SIMPLE_JWT["AUTH_COOKIE_SAMESITE"],
            )

            del response.data["refresh"]
        response["X-CSRFToken"] = request.COOKIES.get("csrftoken")
        return super().finalize_response(request, response, *args, **kwargs)


@rest_decorators.api_view(["GET"])
@rest_decorators.permission_classes([rest_permissions.IsAuthenticated])
def user(request):
    try:
        user = models.User.objects.get(id=request.user.id)
    except models.User.DoesNotExist:
        return response.Response(status_code=404)

    serializer = serializers.UserSerializer(user)
    return response.Response(serializer.data)


class MovieListCreate(generics.ListCreateAPIView):
    serializer_class = serializers.MovieSerializer
    permission_classes = [rest_permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = models.Movie.objects.filter(author=user)
        return queryset

    def perform_create(self, serializer):
        try:
            serializer.save(author=self.request.user)
        except Exception as e:
            print(f"Error creating movie: {e}")

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)

        return Response(serializer.data)


class MovieDelete(generics.DestroyAPIView):
    serializer_class = serializers.MovieSerializer
    permission_classes = [rest_permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return models.Movie.objects.filter(author=user)


class MarkAsWatched(APIView):
    serializer_class = serializers.MovieSerializer
    permission_classes = [rest_permissions.IsAuthenticated]

    def get_object(self, pk):
        return models.Movie.objects.get(
            pk=pk, author=self.request.user, status=models.Movie.WATCHLIST
        )

    def put(self, request, pk, format=None):
        movie = self.get_object(pk)

        movie.status = models.Movie.WATCHED

        serializer = serializers.MovieSerializer(movie, data=request.data, partial=True)

        if serializer.is_valid():
            movie.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RateMovie(APIView):
    permission_classes = [rest_permissions.IsAuthenticated]

    def get_object(self, pk):
        return models.Movie.objects.get(
            pk=pk, author=self.request.user, status=models.Movie.WATCHED
        )

    def put(self, request, pk, format=None):
        movie = self.get_object(pk)
        movie_id = find_movie_id_by_title_and_year(
            MOVIES_CSV, movie.original_title, movie.release_date
        )
        rating = request.data.get("rating")
        movie.rating = int(rating)
        save_rating(
            RATINGS_CSV,
            MOVIES_CSV,
            int(self.request.user.id) + 2204,
            movie_id,
            movie.original_title,
            movie.release_date,
            rating,
        )
        movie.save()
        return Response({"detail": "Rating updated!"}, status=status.HTTP_200_OK)


class GetWatchedMovies(viewsets.ModelViewSet):
    permission_classes = [rest_permissions.IsAuthenticated]
    serializer_class = serializers.MovieSerializer

    def list(self):
        user = self.request.user
        return models.Movie.objects.filter(author=user, status=models.Movie.WATCHED)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


@rest_decorators.api_view(["GET"])
@rest_decorators.permission_classes([rest_permissions.IsAuthenticated])
def get_watched_movies(request):
    user = models.User.objects.get(id=request.user.id)
    queryset = models.Movie.objects.filter(author=user, status="watched")
    serializer = serializers.MovieSerializer(queryset, many=True)
    serializer = models.Movie(queryset, many=True)
    filtered_data = [
        {"id": movie["tmdb_id"], "title": movie["original_title"]}
        for movie in serializer.data
    ]
    return filtered_data


@rest_decorators.api_view(["GET"])
@rest_decorators.permission_classes([rest_permissions.IsAuthenticated])
def recommendView(request):
    user_id = request.user.id

    user_movies = models.Movie.objects.filter(
        author=user_id, status__in=[models.Movie.WATCHLIST, models.Movie.WATCHED]
    ).values_list("original_title", flat=True)

    print(user_movies)

    recommended = recommend(int(user_id) + LAST_ID, 32)

    movie_results = []

    for movie, predicted_rating in recommended:
        title = movie.split(" (")[0]
        title = normalize_title(title)
        print(f"Processing movie: {title}")
        year_match = re.search(r"\((\d{4})\)", movie)
        year = year_match.group(1) if year_match else ""

        if title in user_movies:
            print(f"Skipping already watched movie: {title} ({year})")
            continue

        try:
            response = requests.get(
                BASE_URL,
                params={
                    "api_key": TMDB_API_KEY,
                    "include_adult": True,
                    "language": "en-US",
                    "page": 1,
                    "query": title,
                    "year": year,
                },
            )
            data = response.json()
            if data["results"]:
                tmdb_movie = data["results"][0]
                movie_data = {
                    "original_title": tmdb_movie.get("original_title"),
                    "tmdb_id": tmdb_movie.get("id"),
                    "overview": tmdb_movie.get("overview"),
                    "release_date": tmdb_movie.get("release_date"),
                    "vote_average": tmdb_movie.get("vote_average"),
                    "poster_path": tmdb_movie.get("poster_path"),
                    "status": "recommended",
                }
                movie_results.append(movie_data)
        except Exception as e:
            print(f"Error fetching data for '{title} ({year})':", str(e))

    return JsonResponse(movie_results, safe=False)


def stream_from_ollama(query: str):
    headers = {"Content-Type": "application/json"}
    payload = {"model": "llama3.2", "prompt": query, "stream": True}
    response = requests.post(LLAMA_URL, headers=headers, data=json.dumps(payload))

    for line in response.iter_lines(decode_unicode=True):
        if line:
            yield line


def non_stream_from_ollama(query: str):
    headers = {"Content-Type": "application/json"}
    payload = {"model": "llama3.2", "prompt": query, "stream": False}

    response = requests.post(LLAMA_URL, headers=headers, data=json.dumps(payload))
    result = response.json()
    print(result.get("response", "No response generated"))
    return result.get("response", "No response generated")


rest_decorators.api_view(["GET"])


@rest_decorators.permission_classes([rest_permissions.IsAuthenticated])
def stream_answer(request):
    query = request.GET.get("query", "")
    print("query: ", query)
    streaming = False

    start_time = time.time()

    if streaming:
        response = StreamingHttpResponse(
            stream_from_ollama(query), content_type="text/plain"
        )
    else:
        content = non_stream_from_ollama(query)
        response = HttpResponse(content, content_type="text/plain")

    end_time = time.time()
    duration = end_time - start_time
    print(f"Response time: {duration} seconds")

    return response
