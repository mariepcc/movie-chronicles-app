import { useEffect, useState } from "react";
import CircleLoader from "react-spinners/CircleLoader";
import useAxiosPrivate from "../hooks/usePrivate";
import MovieCard from "../components/MovieCard";
import useAuth from "../hooks/useAuth";
import { VStack, SimpleGrid, Text, Center } from "@chakra-ui/react";

export default function Recommended({ refreshData, isActive }) {
  const { isLoggedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [loadedOnce, setLoadedOnce] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const axiosPrivateInstance = useAxiosPrivate();

  useEffect(() => {
    if (isLoggedIn) {
      getRecommendations();
    }
  }, [isActive, isLoggedIn]);

  const getRecommendations = async () => {
    setIsLoading(true);
    try {
      const res = await axiosPrivateInstance.get(`auth/recommended`);
      setRecommendations(res.data);
    } catch (err) {
      alert("Failed to load recommendations.");
      console.error(err);
    } finally {
      setIsLoading(false);
      setLoadedOnce(true);
    }
  };

  return (
    <VStack spacing={7} paddingTop={5}>
      <Center>
        <Text>
          Ready for something new? These movies match your vibe! The more movies
          you watch, the better the recs get!
        </Text>
      </Center>

      {isLoading ? (
        <div className="w-full flex justify-center h-60 pt-10">
          <Center>
            <CircleLoader
              color={"white"}
              loading={isLoading}
              size={100}
              aria-label="Loading"
              data-testid="loader"
            />
          </Center>
        </div>
      ) : (
        <>
          {loadedOnce ? (
            recommendations.length > 0 ? (
              <VStack spacing={7}>
                <SimpleGrid columns={6} spacing={3}>
                  {recommendations.map((movie) => (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      status="recommended"
                      fetchData={refreshData}
                    />
                  ))}
                </SimpleGrid>
              </VStack>
            ) : (
              <p className="text-center text-gray-600 mt-4">
                No recommended movies found.
              </p>
            )
          ) : null}
        </>
      )}
    </VStack>
  );
}
