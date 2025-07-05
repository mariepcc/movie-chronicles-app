import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/usePrivate";
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
  Heading,
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
  const [tabIndex, setTabIndex] = useState(0);

  const axiosPrivateInstance = useAxiosPrivate();

  const fetchData = () => {
    setRefreshData(!refreshData);
  };

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
      <Center color="white" minHeight="100vh" padding={8}>
        <VStack spacing={7} width="100%">
          <Tabs
            index={tabIndex}
            onChange={(index) => setTabIndex(index)}
            variant="soft-rounded"
            colorScheme="yellow"
            width="100%"
          >
            <TabList justifyContent="center" gap={4} minHeight="48px">
              <Tab
                minHeight="48px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                textColor={"white"}
              >
                <Heading size="md" fontFamily="'Special Elite', cursive" m={0}>
                  Discover
                </Heading>
              </Tab>
              <Tab
                minHeight="48px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                textColor={"white"}
              >
                <Heading size="md" fontFamily="'Special Elite', cursive" m={0}>
                  Watchlist
                </Heading>
              </Tab>
              <Tab
                minHeight="48px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                textColor={"white"}
              >
                <Heading size="md" fontFamily="'Special Elite', cursive" m={0}>
                  Watched
                </Heading>
              </Tab>
              <Tab
                minHeight="48px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                textColor={"white"}
              >
                <Heading size="md" fontFamily="'Special Elite', cursive" m={0}>
                  Recommended
                </Heading>
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
                <Recommended
                  refreshData={fetchData}
                  isActive={tabIndex === 3}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </Center>
    </ChakraProvider>
  );
}
