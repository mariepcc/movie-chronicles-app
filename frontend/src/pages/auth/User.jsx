import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useLogout from "../../hooks/useLogout";
import useUser from "../../hooks/useUser";
import {
  Box,
  Flex,
  Heading,
  Text,
  Stack,
  Button,
  Spinner,
  useColorModeValue,
  Divider,
} from "@chakra-ui/react";

export default function User() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const logout = useLogout();
  const [loading, setLoading] = useState(false);
  const getUser = useUser();

  useEffect(() => {
    getUser();
  }, []);

  async function onLogout() {
    setLoading(true);
    await logout();
    navigate("/");
  }

  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.700", "gray.200");

  return (
    <Flex
      justify="center"
      align="center"
      minH="100vh"
      bg={useColorModeValue("gray.100", "gray.900")}
      px={4}
    >
      <Box
        bg={cardBg}
        p={8}
        rounded="lg"
        shadow="lg"
        maxW="md"
        w="full"
        textAlign="center"
      >
        <Heading mb={4}>User Profile</Heading>
        <Divider mb={6} />

        <Stack spacing={3} color={textColor} textAlign="left">
          <Text>
            <strong>User ID:</strong> {user?.id}
          </Text>
          <Text>
            <strong>Email:</strong> {user?.email}
          </Text>
          <Text>
            <strong>First Name:</strong> {user?.first_name}
          </Text>
          <Text>
            <strong>Last Name:</strong> {user?.last_name}
          </Text>
          <Text>
            <strong>Staff:</strong> {user?.is_staff ? "Yes" : "No"}
          </Text>
        </Stack>

        <Button
          mt={6}
          colorScheme="red"
          onClick={onLogout}
          isLoading={loading}
          loadingText="Logging out"
          w="100px"
        >
          Logout
        </Button>
      </Box>
    </Flex>
  );
}
