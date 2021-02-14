import React from "react";
import { ThemeProvider } from "styled-components";

import { ethers } from "ethers";

import TeslaSwapArtifact from "./contracts/TeslaSwap.json";
import ERC20 from "./contracts/erc20.json";
import ERC20Addresses from "./contracts/erc20-addresses.json";
import TeslaSwapAddress from "./contracts/teslaswap-address.json";

import Body from "./components/Body"
import Navbar from "./components/Navbar"

export class TeslaSwap extends React.Component {
  constructor(props) {
    super(props);

    this.initialBalances = {
      usdc: 0,
      susd: 0,
      stsla: 0
    }

    this.initialState = {
      balances: this.initialBalances,
    };

    this.state = this.initialBalances; 
    this.connecting = false;
  }

  render() {
    if (window.ethereum === undefined) {
      // We don't want to crash is the user does not have Web3
      // TODO: Make this pretty :)
      return (
        <h1>Please Install MetaMask</h1>
      )
    }

    if(this._address === undefined && !this.connecting){
      this.connecting = true;
      this._connectWallet();
    }

    if (window.ethereum.networkVersion == 31337) {
      console.log("Connected to Dev")
    }

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
    // TODO: this is deprecated, use eth_requestAccounts
    const [_address] = await window.ethereum.enable();

    this._address = _address;

    window.ethereum.on("accountsChanged", ([newAddress]) => {
      // TODO:
      // Handle Account Change Logic
    });


    window.ethereum.on("chainChanged", ([networkId]) => {
      // TODO: Handle network change
    });

    this._initializeBlockChainConnect();
    this._startPollingData();
  }

  _startPollingData() {
    setInterval(() => this._pollData(), 10000);
    
    this.state.balances = this.initialBalances;

    this._pollData();
  }

  async _pollData() {
    console.log("Polling");
    const usdcBalance = await this._usdc.balanceOf(this._address);
    const susdBalance = await this._susd.balanceOf(this._address);
    const stslaBalance = await this._stsla.balanceOf(this._address);

    this.state.balances.usdcBalance = usdcBalance;
    this.state.balances.susdBalance = susdBalance;
    this.state.balances.stslaBalance = stslaBalance;
  }

  _initializeBlockChainConnect() {
    this._provider = new ethers.providers.Web3Provider(window.ethereum);
  
    this._initializeContracts();
  }

  _initializeContracts() {
    this._teslaSwap = new ethers.Contract(TeslaSwapAddress.Token, TeslaSwapArtifact.abi, this._provider.getSigner(0));

    this._usdc = new ethers.Contract(ERC20Addresses.USDC, ERC20.abi, this._provider.getSigner(0));
    this._susd = new ethers.Contract(ERC20Addresses.sUSD, ERC20.abi, this._provider.getSigner(0));
    this._stsla = new ethers.Contract(ERC20Addresses.sTSLA, ERC20.abi, this._provider.getSigner(0));
  }
}

const theme = {
  primaryBackground: "#e6f0f0",
};

