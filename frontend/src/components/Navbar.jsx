import React from "react";
import { NavLink } from "react-router-dom";
import {
  Box,
  Flex,
  HStack,
  IconButton,
  VStack,
  Text,
  useColorModeValue,
  useDisclosure,
  Collapse,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import useAuth from "../hooks/useAuth";

export default function Navbar() {
  const { isLoggedIn } = useAuth();
  const { isOpen, onToggle } = useDisclosure();

  const linkHoverBg = useColorModeValue("orange.300", "orange.300");
  const activeColor = useColorModeValue("orange.300", "orange.300");

  const navLinkStyle = (isActive) => ({
    fontWeight: isActive ? "bold" : "normal",
    color: isActive ? activeColor : "inherit",
    padding: "8px",
    borderRadius: "md",
    textDecoration: "none",
    transition: "0.2s ease",
    borderBottom: isActive ? "3px solid white" : "3px solid transparent",
    _hover: {
      backgroundColor: linkHoverBg,
    },
  });

  return (
    <Box
      as="nav"
      bg="black"
      color="white"
      width="100%"
      _after={{
        content: '""',
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        height: "2px",
        background: "linear-gradient(to right, white, transparent)",
      }}
    >
      <Flex alignItems="center" justifyContent="space-between">
        <Text
          fontSize="2xl"
          fontWeight="extrabold"
          bgGradient="linear(to-r, orange.500, yellow.200)"
          bgClip="text"
          fontFamily="'Cinzel', serif"
          letterSpacing="wide"
          mt={3}
          marginLeft="15px"
        >
          Movie Chronicles&nbsp;🎬
        </Text>
        <IconButton
          display={{ base: "block", md: "none" }}
          onClick={onToggle}
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          variant="ghost"
          aria-label="Toggle Navigation"
        />
        <HStack spacing={4} display={{ base: "none", md: "flex" }}>
          <NavLink to="/" style={({ isActive }) => navLinkStyle(isActive)}>
            Home
          </NavLink>
          {isLoggedIn ? (
            <NavLink
              to="/auth/user"
              style={({ isActive }) => navLinkStyle(isActive)}
            >
              User
            </NavLink>
          ) : (
            <>
              <NavLink
                to="/auth/login"
                style={({ isActive }) => navLinkStyle(isActive)}
              >
                Login
              </NavLink>
              <NavLink
                to="/auth/register"
                style={({ isActive }) => navLinkStyle(isActive)}
              >
                Register
              </NavLink>
            </>
          )}
        </HStack>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <VStack display={{ md: "none" }} mt={4} spacing={2} align="start">
          <NavLink to="/" style={({ isActive }) => navLinkStyle(isActive)}>
            Home
          </NavLink>
          {isLoggedIn ? (
            <NavLink
              to="/auth/user"
              style={({ isActive }) => navLinkStyle(isActive)}
            >
              User
            </NavLink>
          ) : (
            <>
              <NavLink
                to="/auth/login"
                style={({ isActive }) => navLinkStyle(isActive)}
              >
                Login
              </NavLink>
              <NavLink
                to="/auth/register"
                style={({ isActive }) => navLinkStyle(isActive)}
              >
                Register
              </NavLink>
            </>
          )}
        </VStack>
      </Collapse>
    </Box>
  );
}
