import React from "react";
import { ThemeProvider } from "styled-components";

import { ethers } from "ethers";

import TeslaSwapArtifact from "./contracts/TeslaSwap.json";
import TeslaSwapAddress from "./contracts/teslaswap-address.json";

import Body from "./components/Body"
import Navbar from "./components/Navbar"

export class TeslaSwap extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (window.ethereum === undefined) {
      // We don't want to crash is the user does not have Web#
      return (
        <h1>Please Install MetaMask</h1>
      )
    }

    this._connectWallet();

    return (
      <ThemeProvider theme={theme} className="GlobalWrapper">
        <Body>
          <Navbar />
          <center>Swap</center>
          <center>Footer</center>
        </Body>
      </ThemeProvider>
    );
  }

  async _connectWallet() {
    await window.ethereum.enable();

    window.ethereum.on("accountsChanged", ([newAddress]) => {
      // Handle Account Change Logic
    });


    window.ethereum.on("chainChanged", ([networkId]) => {
      // Handle network change
    });
  }

  _initializeBlockChainConnect() {
    this._provider = new ethers.providers.Web3Provider(window.ethereum);
  
    this._initializeContracts();
  }

  _initializeContracts() {
    //this._teslaSwap = new ethers.Contract(../);
  }
}

const theme = {
  primaryBackground: "#e6f0f0",
};

