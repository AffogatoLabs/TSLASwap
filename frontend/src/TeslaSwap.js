import React, { useState, useEffect, useRef } from "react";
import { ThemeProvider, createGlobalStyle } from "styled-components";

import { ethers } from "ethers";

import TeslaSwapArtifact from "./contracts/TeslaSwap.json";
import ERC20 from "./contracts/erc20.json";
import ERC20Addresses from "./contracts/erc20-addresses.json";
import TeslaSwapAddress from "./contracts/teslaswap-address.json";

import Body from "./components/Body";
import Navbar from "./components/Navbar";
import Swap from "./components/Swap";

import teslaFont from "./TESLA.ttf";
import Footer from "./components/Footer";

const TeslaSwap = () => {
  const [address, setAddress] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [slippage, setSlippage] = useState(1.0);
  const [inputAmount, setInputAmount] = useState(0.0);
  const [outputAmount, setOutputAmount] = useState(0.0);
  const usdc = useRef(undefined);
  const susd = useRef(undefined);
  const stsla = useRef(undefined);
  const teslaSwap = useRef(undefined);
  const refAddress = useRef("");

  useEffect(() => {
    //_startPollingData(address);
  }, [address]);

  const _connectWallet = async () =>  {
    _initializeBlockChainConnect();
    // TODO: this is deprecated, use eth_requestAccounts
    const [retrievedAddress] = await window.ethereum.enable();

    setAddress(retrievedAddress);
    refAddress.current = retrievedAddress;
    
    window.ethereum.on("accountsChanged", ([newAddress]) => {
      // TODO:
      // Handle Account Change Logic
    });


    window.ethereum.on("chainChanged", ([networkId]) => {
      // TODO: Handle network change
    });
  }

  const _startPollingData = () => {
    setInterval(() => _pollData(), 10000);
    _pollData();
  }

  const _pollData = async () =>  {
    console.log("Polling");
    try {
      console.log("Polling balances");
      const usdcBalance = await usdc.current.balanceOf(refAddress.current);
      const susdBalance = await susd.current.balanceOf(refAddress.current);
      const stslaBalance = await stsla.current.balanceOf(refAddress.current);


      // TODO: Consume These
    } catch (err) {
      console.log(err);
    }
  }

  const _initializeBlockChainConnect = () => {
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    console.log(provider);
  
    if (provider) {
      _initializeContracts(provider);
    }
  }

  const _initializeContracts = (provider) => {
    teslaSwap.current = new ethers.Contract(TeslaSwapAddress.Token, TeslaSwapArtifact.abi,provider.getSigner(0));

    usdc.current = new ethers.Contract(ERC20Addresses.USDC, ERC20.abi, provider.getSigner(0));
    susd.current = new ethers.Contract(ERC20Addresses.sUSD, ERC20.abi, provider.getSigner(0));
    stsla.current = new ethers.Contract(ERC20Addresses.sTSLA, ERC20.abi, provider.getSigner(0));
  }

  const onClickSwap = async () => {
    console.log("Swap");
    try{
      // TODO: Fix these numbers
      const response = await teslaSwap.current.swap(inputAmount, inputAmount.minus(inputAmount.mul(slippage)));
    } catch (e) {
      console.log(e);
    }
  }

  const onClickApprove = async () => {
    console.log("Approve Withdrawal");
    try {
      const response = await usdc.current.approve(TeslaSwapAddress.Token, ethers.constants.MaxUint256);
    } catch (e) {
      console.log(e);
    }
  }


  if (window.ethereum === undefined) {
    // We don't want to crash is the user does not have Web3
    // TODO: Make this pretty :)
    return (
      <h1>Please Install MetaMask</h1>
    )
  }

  if(address == "" && !connecting){
    setConnecting(true);
    _connectWallet();
  }

  if (window.ethereum.networkVersion == 31337) {
    console.log("Connected to Dev")
  }

  return (
    <ThemeProvider theme={theme} className="GlobalWrapper">
      <GlobalStyle />
      <Body>
        <Navbar account = {address}/>
        <Swap onClickSwap = {onClickSwap}/>
        <Footer />
      </Body>
    </ThemeProvider>
  );
}


const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: tesla;
    src: url(${teslaFont}) format('truetype');
    font-weight: normal;
    font-style: normal;
  }
`;

const theme = {
  primaryBackground: "#e6f0f0",
  borderColor: "#cececece",
  swapBackground: "##f4f4f4",

  buttonColor: "#f1f1f1f1",
  buttonShadow: "#f2f2f2f2",
  buttonText: "#ababab",

  fonts: {
    mainFamily: `"Nunito Sans", Arial, sans-serif`,
    tesla: "tesla"
  },

  fontSizes: {
    navBarLogo: "37px",
    navBarButtons: "24px",

    swapTitle: "35px",
    swapPanelTitle: "28px",
    swapPanelSubtitle: "28px",
    swap: "29px",
    swapFooter: "21px",
    swapBody: "27px",
    swapBodySmallScreen: "24px",
    swapButton: "23px",
    swapInput: "20px",
    swapNumStaked: "28px",
    swapMaxButton: "20px",
  }
};

export default TeslaSwap;