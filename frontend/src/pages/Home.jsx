import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/usePrivate"
import useAuth from "../hooks/useAuth";
import {
  ChakraProvider,
  Center,
  VStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Heading
} from "@chakra-ui/react";

import Discover from "./Discover";
import Watchlist from "./Watchlist";
import Watched from "./Watched";
import Recommended from "./Recommended";

const TMDB_API_KEY = "95f1c012c3da9231ef8a54bdffe0485e";
const BASE_URL = "https://api.themoviedb.org/3/search/movie";

export default function Home() {
  const { isLoggedIn } = useAuth();
  const [allMovies, setAllMovies] = useState("");
  const [refreshData, setRefreshData] = useState(false);
  const axiosPrivateInstance = useAxiosPrivate()

  const fetchData = () => {
    setRefreshData(!refreshData)
  }

  useEffect(() => {
    if (!isLoggedIn) return;

    axiosPrivateInstance
      .get(`auth/movies`)
      .then((res) => {
        setAllMovies(res.data);
      })
      .catch((err) => alert(err));
  }, [refreshData, isLoggedIn]);
  
  return (
    <ChakraProvider>
      <Center bg="black" color="white" minHeight="100vh" padding={8}>
        <VStack spacing={7} width="100%">
          <Tabs variant="soft-rounded" colorScheme="red" width="100%">
            <TabList justifyContent="center" gap={4}>
              <Tab>
                <Heading size="md">Discover</Heading>
              </Tab>
              <Tab>
                <Heading size="md">Watchlist</Heading>
              </Tab>
              <Tab>
                <Heading size="md">Watched</Heading>
              </Tab>
              <Tab>
                <Heading size="md">Recommended</Heading>
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Discover allMovies={allMovies} refreshData={fetchData} />
              </TabPanel>
              <TabPanel>
                <Watchlist allMovies={allMovies} refreshData={fetchData} />
              </TabPanel>
              <TabPanel>
                <Watched allMovies={allMovies} refreshData={fetchData} />
              </TabPanel>
              <TabPanel>
                <Recommended allMovies={allMovies} refreshData={fetchData}/>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </Center>
    </ChakraProvider>
  );
};
