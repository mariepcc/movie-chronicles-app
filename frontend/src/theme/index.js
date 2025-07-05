// theme.js
import { extendTheme } from "@chakra-ui/react";
import "@fontsource/cinzel"; // for headings
import "@fontsource/special-elite"; // for body

const theme = extendTheme({
  fonts: {
    heading: `'Cinzel', serif`,
    body: `'Special Elite', cursive`,
  },
  styles: {
    global: {
      body: {
        fontFamily: `'Special Elite', cursive`,
        bg: "black",
        color: "white",
      },
      "*": {
        fontFamily: `'Special Elite', cursive`,
      },
    },
  },
});

export default theme;
