import React from "react";
import { ThemeProvider } from "styled-components";

import { ethers } from "ethers";

import Body from "./components/Body"
import Navbar from "./components/Navbar"

function App() {
  return (
    <ThemeProvider theme={theme} className="GlobalWrapper">
      <Body>
        <Navbar/>
        <center>Swap</center>
        <center>Footer</center>
      </Body>
    </ThemeProvider>
  );
}

const theme = {
  primaryBackground: "#e6f0f0",
};

export default App;
