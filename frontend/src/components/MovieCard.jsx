import React, { useRef, useState, useEffect } from "react";
import ModalComponent from "./Modal";
import ReactStars from "react-stars";
import useAxiosPrivate from "../hooks/usePrivate";
import { DeleteIcon, ViewIcon } from "@chakra-ui/icons";
import {
  VStack,
  Text,
  Button,
  Heading,
  Center,
  Badge,
  Box,
  Flex,
  useToast,
  Image,
  Icon,
  Tooltip,
} from "@chakra-ui/react";

export default function MovieCard({ status, movie, fetchData }) {
  const axiosPrivateInstance = useAxiosPrivate();
  const MovedMovieToast = useToast();

  const [isModalOpen, setModalOpen] = useState(false);
  const [streamedText, setStreamedText] = useState("");

  const query = `Explain the ending of the movie "${movie.original_title}" (released in ${movie.release_date}). 
                Please cover the major plot points, character arcs, any symbolism, twists, and the overall meaning behind the conclusion. 
                If the ending is open to interpretation, discuss potential theories and their implications. 
                Keep the explanation concise and do not exceed 200 words or provide a response that is not too long.`;

  useEffect(() => {
    if (!isModalOpen) return;

    async function fetchLlamaData(query) {
      const response = await axiosPrivateInstance.get(
        `auth/stream_answer?query=${encodeURIComponent(query)}`
      );
      setStreamedText(response.data);
    }

    fetchLlamaData(query);
  }, [isModalOpen]);

  const deleteMovie = (id, status) => {
    axiosPrivateInstance
      .delete(`/auth/${status}/delete/${id}`)
      .then((res) => {
        console.log(res.data);
      })
      .then((data) => {
        MovedMovieToast({
          title: "Deleted",
          description: "Movie deleted from watchlist",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        fetchData();
      })
      .catch((error) => alert(error));
  };

  const moveFilm = (id) => {
    axiosPrivateInstance
      .put(`/auth/movies/update_movie_state/${id}/`, {
        status: "watched",
      })
      .then((res) => {
        console.log(res.data);
      })
      .then((data) => {
        MovedMovieToast({
          title: "Moved",
          description: "Movie moved to watched section",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        fetchData();
      })
      .catch((error) => alert(error));
  };

  
  const addMovie = async (movie) => {
    axiosPrivateInstance
      .post("auth/movies", {
        original_title: movie.original_title,
        tmdb_id: movie.id,
        overview: movie.overview,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        status: "watchlist",
        rating: null,
        poster_path: movie.poster_path,
      })
      .then((data) => {
        MovedMovieToast({
          title: "Added",
          description: `Movie added to watchlist.`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        fetchData();
      })
      .catch((error) => alert(error));
  };
  const ratingChanged = async (id, rating) => {
    axiosPrivateInstance
      .put(`/auth/update_rating/${id}/`, {
        rating: rating,
      })
      .then((res) => {
        console.log(res.data);
      })
      .then((data) => {
        MovedMovieToast({
          title: "Rated",
          description: "Movie rated.",
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
      bgImage="url('https://img.freepik.com/premium-vector/vintage-element-design_1263052-1650.jpg?w=155')"
      bgPosition="center"
      bgRepeat="no-repeat"
      bgSize="cover"
      w="70%"
      h="auto"
    >
      <Box
        key={movie.tmdb_id}
        w="100%"
        sm="50%"
        lg="25%"
        p={4}
        minH="250px"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        borderRadius="lg"
      >
        <Image
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/original/${movie.poster_path}`
              : "https://via.placeholder.com/200x300"
          }
          width="85%"
          height="auto"
          transform="rotate(-1deg)"
          objectFit="cover"
          ml="7px"
          mb={10}
        />
        <Flex direction="column" align="center" mb={4}>
          <Badge
            borderRadius="full"
            px="2"
            variant="subtle"
            colorScheme="purple"
            mb={2}
          >
            {movie.release_date}
          </Badge>
          <Badge borderRadius="full" colorScheme="teal" variant="subtle" mb={2}>
            Rating: {movie.vote_average ? movie.vote_average : "N/A"}
          </Badge>
        </Flex>
        <Center flexGrow={1} align="center">
          <Heading
            size="sm"
            maxW="100px"
            textAlign="center"
            wordBreak="break-word"
            lineHeight="normal"
            className="title-text"
          >
            {movie.original_title}
          </Heading>
        </Center>
      </Box>

      {status === "watched" && !movie.rating && (
        <Text fontSiza="sm">Rate Movie? </Text>
      )}
      {status === "watched" && (
        <>
          <ReactStars
            count={5}
            value={movie.rating}
            onChange={(newRating) => ratingChanged(movie.id, newRating)}
            size={20}
            color2={"#ffd700"}
          />
          <Tooltip label="Want to know ending explained?">
            <Icon
              name="helpSquare"
              boxSize={5}
              color="gray.500"
              className="cursor-pointer hover:text-blue-500"
              onClick={() => {
                console.log("Icon clicked, opening modal...");
                setModalOpen(true);
                console.log("opened modal", isModalOpen);
              }}
            />
          </Tooltip>

          <ModalComponent
            isOpen={isModalOpen}
            onClose={() => setModalOpen(false)}
            movie={movie}
            content={streamedText || "Loading..."}
          />
        </>
      )}
      {status === "watchlist" && (
        <>
          <Button
            size="sm"
            w="100px"
            leftIcon={<DeleteIcon color="white" boxSize={4} />}
            variant="outline"
            colorScheme="white"
            onClick={() => deleteMovie(movie.id, status)}
          >
            Delete
          </Button>
          <Button
            size="sm"
            w="100px"
            leftIcon={<ViewIcon color="white" boxSize={4} />}
            variant="outline"
            colorScheme="white"
            onClick={() => moveFilm(movie.id)}
          >
            Watched
          </Button>
        </>
      )}
      {status === "recommended" && (
        <>
          <Button
            w="110px"
            h="70px"
            p={2}
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            alignItems="center"
            leftIcon={<ViewIcon color="white" boxSize={4} />}
            variant="outline"
            colorScheme="white"
            wordBreak="break-word"
            whiteSpace="normal"
            onClick={() => addMovie(movie)}
          >
            Add to watchlist!
          </Button>
        </>
      )}
    </VStack>
  );
}
