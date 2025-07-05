import { useState, useEffect } from "react";
import MovieCardDiscover from "../components/MovieCardDiscover";
import {
  VStack,
  HStack,
  Text,
  Input,
  Heading,
  Center,
  SimpleGrid,
} from "@chakra-ui/react";

const TMDB_API_KEY = "95f1c012c3da9231ef8a54bdffe0485e";

export default function Discover({ allMovies, refreshData }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    OnSearchClick();
  }, [searchQuery]);

  const OnSearchClick = async () => {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&include_adult=false&language=en-US&page=1&query=${searchQuery}`
    );
    const data = await response.json();
    setSearchResults(data.results);
  };

  return (
    <VStack spacing={7} paddingTop={5}>
      <Text>Start your movie adventure — add new titles to your lists!</Text>
      <HStack spacing={12}>
        <Input
          width="600px"
          placeholder="Search movie..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </HStack>
      {searchResults.length === 0 && (
        <Center>
          <Heading></Heading>
        </Center>
      )}
      <SimpleGrid columns={4} spacing={8}>
        {searchResults.length !== 0 &&
          searchResults.map((movie) => (
            <MovieCardDiscover
              key={movie.id}
              movie={movie}
              userMovies={allMovies}
              fetchData={refreshData}
            />
          ))}
      </SimpleGrid>
    </VStack>
  );
}
