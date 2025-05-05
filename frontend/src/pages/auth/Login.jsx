import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { axiosInstance } from '../../api/apiConfig'
import useAuth from '../../hooks/useAuth'
import {
  Flex,
  Heading,
  Input,
  Button,
  VStack,
  FormLabel,
  InputGroup,
  Stack,
  InputLeftElement,
  chakra,
  Box,
  Link,
  Avatar,
  FormControl,
  Switch,
  useColorMode,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { FaUserAlt, FaLock } from "react-icons/fa";



export default function Login() {
    const { setAccessToken, setCSRFToken, setIsLoggedIn } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const fromLocation = location?.state?.from?.pathname || '/'
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [showPassword, setShowPassword] = useState(false);
    const { toggleColorMode } = useColorMode();
    const handleShowClick = () => setShowPassword(!showPassword);


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

    
    return (
      <Box maxW="md" mx="auto" mt={10} p={8} borderWidth={1} borderRadius="lg" boxShadow="lg">
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
            colorScheme="teal"
            width="full"
            isLoading={loading}
            loadingText="Logging in..."
          >
            Login
          </Button>
          <FormControl display="flex" alignItems="center">
          <FormLabel htmlFor="dark_mode" mb="0">
            Enable Dark Mode?
          </FormLabel>
          <Switch
            id="dark_mode"
            colorScheme="teal"
            size="lg"
            onChange={toggleColorMode}
          />
        </FormControl>
        </VStack>
      </form>
    </Box>
  );
}
