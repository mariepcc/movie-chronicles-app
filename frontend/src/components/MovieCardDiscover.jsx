import useTruncatedElement from "../hooks/useTruncatedElement";
import { useRef } from "react";
import useAxiosPrivate from "../hooks/usePrivate";
import { AddIcon, ViewIcon } from "@chakra-ui/icons";
import {
  VStack,
  Text,
  Button,
  Box,
  Heading,
  Center,
  Badge,
  Image,
  useToast,
} from "@chakra-ui/react";

export default function MovieCardDiscover({ movie, userMovies, fetchData }) {
  const axiosPrivateInstance = useAxiosPrivate();
  const MovedAddedToast = useToast();

  const ref = useRef(null);

  const { isTruncated, isShowingMore, toggleIsShowingMore } =
    useTruncatedElement({
      ref,
    });

  const isInWatchlist = userMovies.some(
    (m) => m.tmdb_id === movie.id && m.status === "watchlist"
  );

  const isInWatched = userMovies.some(
    (m) => m.tmdb_id === movie.id && m.status === "watched"
  );

  const addMovie = async (movie, status) => {
    if (status === "watched") {
      const existingInWatchlist = userMovies.find(
        (m) => m.tmdb_id === movie.id && m.status === "watchlist"
      );

      if (existingInWatchlist) {
        await axiosPrivateInstance.delete(
          `/auth/watchlist/delete/${existingInWatchlist.id}`
        );
      }
    }

    axiosPrivateInstance
      .post("auth/movies", {
        original_title: movie.original_title,
        tmdb_id: movie.id,
        overview: movie.overview,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        status: status,
        rating: null,
        poster_path: movie.poster_path,
      })
      .then((data) => {
        MovedAddedToast({
          title: "Added",
          description: `Movie added to ${status}.`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        fetchData();
      })
      .catch((error) => alert(error));
  };

  return (
    <VStack
      maxW="sm"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      spacing={8}
      key={movie.id}
    >
      <Image
        src={
          movie.poster_path
            ? `https://image.tmdb.org/t/p/original/${movie.poster_path}`
            : "https://via.placeholder.com/200x300"
        }
        width={40}
        height={60}
        paddingTop={2}
        borderRadius="lg"
      />
      <Badge borderRadius="full" px="2" colorScheme="teal">
        {movie.release_date}
      </Badge>
      <Badge borderRadius="full" colorScheme="red">
        Rating: {movie.vote_average ? movie.vote_average : "N/A"}
      </Badge>
      <Box
        maxW="sm"
        borderWidth="1px"
        display="flex"
        flexDirection="column"
        height={isShowingMore ? "auto" : "250px"}
      >
        <VStack>
          <Center>
            <Heading
              size="md"
              textAlign="center"
              marginTop="15px"
              fontFamily={`'Cinzel', serif`}
            >
              {movie.original_title}
            </Heading>
          </Center>

          <Text
            padding={3}
            color="white"
            ref={ref}
            className={`break-words text-xl ${
              !isShowingMore && "line-clamp-3"
            }`}
            style={{
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: isShowingMore ? "unset" : 3,
              WebkitBoxOrient: "vertical",
              height: isShowingMore ? "auto" : "5.5em",
            }}
          >
            {movie.overview}
          </Text>

          {isTruncated && (
            <Button variant="surface" onClick={toggleIsShowingMore}>
              {isShowingMore ? "Show less" : "Show more"}
            </Button>
          )}
        </VStack>
      </Box>
      <Center paddingBottom={2}>
        <VStack spacing={4} align="stretch">
          {/* Already in watched list */}
          {isInWatched && (
            <Button colorScheme="pink" variant="solid" isDisabled>
              Already in Watched
            </Button>
          )}

          {/* Already in watchlist but not in watched */}
          {!isInWatched && isInWatchlist && (
            <Button colorScheme="teal" variant="solid" isDisabled>
              Already in Watchlist
            </Button>
          )}

          {/* Show 'Add to Watchlist' if not in any list */}
          {!isInWatchlist && !isInWatched && (
            <Button
              leftIcon={
                <AddIcon
                  color="white"
                  boxSize={4}
                  paddingRight="3px"
                  marginBottom="3px"
                />
              }
              variant="outline"
              colorScheme="teal"
              onClick={() => addMovie(movie, "watchlist")}
              display="flex"
              alignItems="center"
            >
              Add to Watchlist!
            </Button>
          )}

          {/* Show 'Already watched' if not in watched */}
          {!isInWatched && (
            <Button
              leftIcon={
                <ViewIcon
                  color="white"
                  boxSize={5}
                  paddingRight="3px"
                  marginBottom="3px"
                />
              }
              variant="outline"
              colorScheme="pink"
              onClick={() => addMovie(movie, "watched")}
            >
              Already watched!
            </Button>
          )}
        </VStack>
      </Center>
    </VStack>
  );
}
