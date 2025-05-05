import { useState, useEffect } from "react";
import {
  VStack,
  Text,
  SimpleGrid,
  Input,
  HStack,
} from "@chakra-ui/react";
import MovieCard from "../components/MovieCard";
import "bootstrap/dist/css/bootstrap.min.css";

export default function MoviesList({ status, allMovies, refreshData }) {
  const [query, setQuery] = useState("");
  const [filteredMovies, setFilteredMovies] = useState([]);

  useEffect(() => {
    filterMovies(query);
  }, [query, allMovies]);

  const filterMovies = (searchQuery) => {
    const filtered = [];
    for (const movie of allMovies) {
      if (
        movie.original_title.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        filtered.push(movie);
      }
    }
    setFilteredMovies(filtered);
  };

  const moviesToDisplay = query.trim() === "" ? allMovies : filteredMovies;

  return (
    <VStack spacing={7} paddingTop={5}>
      {status === "watchlist" && (
        <Text>
        Start building your movie queue! Add titles, explore your picks, and check off them as you watch!
      </Text>
      )}
      {status === "watched" && (
        <Text>
        Track your movie journey! Browse what you’ve seen, rate your experience, and keep the list growing!
      </Text>
      )}
      <HStack spacing={12}>
        <Input
          width="600px"
          placeholder="Search movie..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </HStack>

      <VStack spacing={7}>
        <SimpleGrid columns={6} spacing={3}>
          {moviesToDisplay?.length !== 0 &&
            moviesToDisplay.map((movie) =>
              movie.status === status ? (
                <MovieCard
                  key={movie.id}
                  status={status}
                  movie={movie}
                  fetchData={refreshData}
                />
              ) : null
            )}
        </SimpleGrid>
      </VStack>
    </VStack>
  );
}
