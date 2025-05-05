import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { axiosInstance } from '../../api/apiConfig'
import useAuth from '../../hooks/useAuth'
import {
  Flex,
  Heading,
  Input,
  Button,
  InputGroup,
  Stack,
  InputLeftElement,
  chakra,
  Box,
  Link,
  Avatar,
  FormControl,
  FormHelperText,
  InputRightElement,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { FaUserAlt, FaLock } from "react-icons/fa";

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

export default function Login() {
  const bgBox = useColorModeValue("gray.100", "gray.800");
  const bgInput = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

    const { setAccessToken, setCSRFToken, setIsLoggedIn } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const fromLocation = location?.state?.from?.pathname || '/'
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [showPassword, setShowPassword] = useState(false);

    const handleShowClick = () => setShowPassword(!showPassword);



    function onEmailChange(event) {
        setEmail(event.target.value)
    }

    function onPasswordChange(event) {
        setPassword(event.target.value)
    }

    async function onSubmitForm(event) {
        event.preventDefault()

        setLoading(true)

        try {
            const response = await axiosInstance.post('auth/login', JSON.stringify({
                email,
                password
            }))

            setAccessToken(response?.data?.access_token)
            setCSRFToken(response.headers["x-csrftoken"])
            setIsLoggedIn(true);
            setEmail()
            setPassword()
            setLoading(false)

            navigate(fromLocation, { replace: true })
        } catch (error) {
            setLoading(false)
            // TODO: handle errors
        }
    }

    const bgColor = useColorModeValue("gray.100", "gray.900");
  const formBg = useColorModeValue("whiteAlpha.900", "gray.800");

    return (
      <Flex
      flexDirection="column"
      width="100vw"
      height="100vh"
      bg={bgColor}
      justifyContent="center"
      alignItems="center"
      px={4}
    >
      <Stack
        spacing={6}
        align="center"
        mb={4}
      >
        <Avatar bg="teal.500" />
        <Heading color="teal.300">Welcome Back</Heading>
      </Stack>
      <Box minW={{ base: "90%", md: "420px" }}>
        <form onSubmit={onSubmitForm}>
          <Stack
            spacing={6}
            p="2rem"
            bg={formBg}
            boxShadow="2xl"
            borderRadius="xl"
          >
            <FormControl isRequired>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <CFaUserAlt color="gray.300" />
                </InputLeftElement>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="off"
                />
              </InputGroup>
            </FormControl>

            <FormControl isRequired>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <CFaLock color="gray.300" />
                </InputLeftElement>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="off"
                />
                <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={handleShowClick}>
                    {showPassword ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormHelperText textAlign="right">
                <Link href="#" color="teal.300">
                  Forgot password?
                </Link>
              </FormHelperText>
            </FormControl>

            <Button
              borderRadius="full"
              type="submit"
              variant="solid"
              colorScheme="teal"
              width="full"
              size="lg"
              isLoading={loading}
              loadingText="Logging in..."
            >
              Log In
            </Button>
          </Stack>
        </form>
        <Box textAlign="center" mt={4} color="gray.400">
          New here?{" "}
          <Link color="teal.300" href="#">
            Create an account
          </Link>
        </Box>
      </Box>
    </Flex>
  );
}
