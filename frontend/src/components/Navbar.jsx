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

  // Hooks used at the top level
  const linkHoverBg = useColorModeValue("gray.200", "gray.700");
  const activeColor = useColorModeValue("teal.600", "teal.300");

  const navLinkStyle = (isActive) => ({
    fontWeight: isActive ? "bold" : "normal",
    color: isActive ? activeColor : "inherit",
    padding: "8px",
    borderRadius: "md",
    textDecoration: "none",
    transition: "0.2s ease",
    _hover: {
      backgroundColor: linkHoverBg,
    },
  });

  return (
    <Box
      as="nav"
      bg="black"
      color="white"
      position="relative" 
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
          bgGradient="linear(to-r, teal.500, pink.200)"
          bgClip="text"
          fontFamily="heading"
          letterSpacing="wide"
          mt={3}
        >
          MovieChronicles&nbsp;🎬
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

      {/* Mobile Menu */}
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
