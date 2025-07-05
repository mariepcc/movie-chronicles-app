import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { axiosInstance } from "../../api/apiConfig";
import useAuth from "../../hooks/useAuth";
import {
  Flex,
  Heading,
  Input,
  Button,
  VStack,
  FormLabel,
  Box,
  FormControl,
} from "@chakra-ui/react";

export default function Login() {
  const { setAccessToken, setCSRFToken, setIsLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const fromLocation = location?.state?.from?.pathname || "/";
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function onSubmitForm(event) {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await axiosInstance.post(
        "auth/login",
        JSON.stringify({ email, password })
      );

      setAccessToken(response?.data?.access_token);
      setCSRFToken(response.headers["x-csrftoken"]);
      setIsLoggedIn(true);
      setEmail("");
      setPassword("");
      setLoading(false);

      navigate(fromLocation, { replace: true });
    } catch (error) {
      setLoading(false);
      // handle errors
    }
  }

  return (
    <Flex height="100vh" alignItems="center" justifyContent="center" p={4}>
      <Box
        maxW="md"
        w="100%"
        p={8}
        borderWidth={1}
        borderRadius="lg"
        boxShadow="lg"
      >
        <Heading as="h2" size="lg" mb={6} textAlign="center">
          Login
        </Heading>
        <form onSubmit={onSubmitForm}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="off"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="off"
              />
            </FormControl>

            <Button
              type="submit"
              colorScheme="yellow"
              width="full"
              marginTop="10px"
              isLoading={loading}
              loadingText="Logging in..."
            >
              Login
            </Button>
          </VStack>
        </form>
      </Box>
    </Flex>
  );
}
