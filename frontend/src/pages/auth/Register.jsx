import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../api/apiConfig";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  VStack,
  useToast,
} from "@chakra-ui/react";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const first_name = useRef();
  const last_name = useRef();
  const email = useRef();
  const password = useRef();
  const password2 = useRef(undefined);

  async function onSubmitForm(event) {
    event.preventDefault();
    const data = {
      first_name: first_name.current.value,
      last_name: last_name.current.value,
      email: email.current.value,
      password: password.current.value,
      password2: password2.current.value,
    };

    setLoading(true);

    try {
      const response = await axiosInstance.post(
        "auth/register",
        JSON.stringify(data)
      );

      setLoading(false);

      navigate("/auth/login");
    } catch (error) {
      setLoading(false);
    }
  }

  return (
    <Box
      maxW="md"
      mx="auto"
      mt={10}
      p={8}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="lg"
    >
      <Heading as="h2" size="lg" mb={6} textAlign="center">
        Register
      </Heading>
      <form onSubmit={onSubmitForm}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>First Name</FormLabel>
            <Input
              type="text"
              placeholder="First Name"
              ref={first_name}
              autoComplete="off"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Last Name</FormLabel>
            <Input
              type="text"
              placeholder="Last Name"
              ref={last_name}
              autoComplete="off"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              placeholder="Email"
              ref={email}
              autoComplete="off"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              placeholder="Password"
              ref={password}
              autoComplete="off"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Confirm Password</FormLabel>
            <Input
              type="password"
              placeholder="Confirm Password"
              ref={password2}
              autoComplete="off"
            />
          </FormControl>

          <Button
            colorScheme="teal"
            type="submit"
            isLoading={loading}
            loadingText="Registering..."
            width="full"
          >
            Register
          </Button>
        </VStack>
      </form>
    </Box>
  );
}
