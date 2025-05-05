from django.urls import path
from user.views import loginView, registerView, CookieTokenRefreshView, logoutView, user, MovieListCreate, MovieDelete, RateMovie, MarkAsWatched, recommendView, stream_answer

app_name = "user"

urlpatterns = [
    path('login', loginView, name="login"),
    path('register', registerView, name="register"),
    path('refresh-token', CookieTokenRefreshView.as_view(), name="refresh-token"),
    path('logout', logoutView, name="logout"),
    path("user", user, name="user"),
    path('movies', MovieListCreate.as_view(), name="watchlist"),
    path('watchlist/delete/<int:pk>', MovieDelete.as_view(), name="movie-delete"),
    path("update_rating/<int:pk>/", RateMovie.as_view(), name="rate-movie"),
    path("movies/update_movie_state/<int:pk>/", MarkAsWatched.as_view(), name="mark-as-watched"),
    path('recommended', recommendView, name="recommended"),
    path("stream_answer", stream_answer, name="stream-answer"),



]
