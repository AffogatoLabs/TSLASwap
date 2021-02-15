import React, { useState, useEffect, useRef } from "react";
import { ThemeProvider, createGlobalStyle } from "styled-components";

import { ethers } from "ethers";

import TeslaSwapArtifact from "./contracts/TeslaSwap.json";
import ERC20 from "./contracts/erc20.json";
import DelegateApprovals from "./contracts/delegateapprovals.json";
import MainnetAddresses from "./contracts/mainnet-addresses.json";
import TeslaSwapAddress from "./contracts/teslaswap-address.json";
import ExchangeRates from "./contracts/exchangerates.json";

import Body from "./components/Body";
import Navbar from "./components/Navbar";
import Swap from "./components/Swap";

import teslaFont from "./TESLA.ttf";
import Footer from "./components/Footer";
import SvgTesting1 from "./components/SVG/Testing1.js";

const strToBytes = (text, length = text.length) => {
  if (text.length > length) {
    throw new Error(
      `Cannot convert String of ${text.length} to bytes${length} (it's too big)`
    );
  }
  // extrapolated from https://github.com/ethers-io/ethers.js/issues/66#issuecomment-344347642
  let result = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(text));
  while (result.length < 2 + length * 2) {
    result += "0";
  }
  return ethers.utils.arrayify(result);
};

const toUtf8Bytes32 = (stringValue) => {
  return strToBytes(stringValue, 32);
};

const TeslaSwap = () => {
  const [address, setAddress] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [slippage, setSlippage] = useState(1.0);
  const [price, setPrice] = useState({ input: undefined, output: undefined });
  const [transactionProcessing, setTransactionProcessing] = useState(false);
  const [model3mode, setModel3Mode] = useState(false);
  const usdc = useRef(undefined);
  const susd = useRef(undefined);
  const stsla = useRef(undefined);
  const teslaSwap = useRef(undefined);
  const synthetix = useRef(undefined);
  const exchangerates = useRef(undefined);
  const delegateApprovals = useRef(undefined);
  const refAddress = useRef("");

  const refInput = useRef(0.0);
  const refOutput = useRef(0.0);

  useEffect(() => {
    //_startPollingData(address);
  }, [address]);

  const setOutputAmount = async (output) => {
    const usdcAmount = await getUSDCPerTesla(output);
    setPrice({ input: usdcAmount, output: output });
  };

  const setInputAmount = async (input) => {
    const teslaAmount = await getTeslaRate(input);
    setPrice({ input: input, output: teslaAmount });
  };

  const getTeslaRate = async (inputAmount) => {
    try {
      const usdcAmount = ethers.BigNumber.from(inputAmount * 10 ** 6);
      let result = await exchangerates.current.effectiveValue(
        toUtf8Bytes32("sUSD"),
        usdcAmount,
        toUtf8Bytes32("sTSLA")
      );
      result = result.toNumber();
      result = result / 10 ** 6;

      return result;
    } catch (e) {
      console.log(e);
    }
  };

  const getUSDCPerTesla = async (outputAmount) => {
    try {
      const teslaAmount = ethers.BigNumber.from(outputAmount * 10 ** 6);
      let result = await exchangerates.current.effectiveValue(
        toUtf8Bytes32("sTSLA"),
        teslaAmount,
        toUtf8Bytes32("sUSD")
      );
      result = result.toNumber();
      result = result / 10 ** 6;

      return result;
    } catch (e) {
      console.log(e);
    }
  };

  //#region initialization
  const _connectWallet = async () => {
    _initializeBlockChainConnect();
    // TODO: this is deprecated, use eth_requestAccounts
    const [retrievedAddress] = await window.ethereum.enable();

    setAddress(retrievedAddress);
    refAddress.current = retrievedAddress;
    isApproved();

    window.ethereum.on("accountsChanged", ([newAddress]) => {
      // TODO:
      // Handle Account Change Logic
    });

    window.ethereum.on("chainChanged", ([networkId]) => {
      // TODO: Handle network change
    });
  };

  const _startPollingData = () => {
    setInterval(() => _pollData(), 10000);
    _pollData();
  };

  const _pollData = async () => {
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
  };

  const _initializeBlockChainConnect = () => {
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    console.log("Provdider loaded", provider);

    if (provider) {
      _initializeContracts(provider);
    }
  };

  const _initializeContracts = (provider) => {
    const signer = provider.getSigner(0);

    teslaSwap.current = new ethers.Contract(
      TeslaSwapAddress.Token,
      TeslaSwapArtifact.abi,
      signer
    );

    delegateApprovals.current = new ethers.Contract(
      MainnetAddresses.DelegateApprovals,
      DelegateApprovals.abi,
      signer
    );

    exchangerates.current = new ethers.Contract(
      MainnetAddresses.ExchangeRates,
      ExchangeRates.abi,
      signer
    );

    usdc.current = new ethers.Contract(
      MainnetAddresses.USDC,
      ERC20.abi,
      signer
    );
    susd.current = new ethers.Contract(
      MainnetAddresses.sUSD,
      ERC20.abi,
      signer
    );
    stsla.current = new ethers.Contract(
      MainnetAddresses.sTSLA,
      ERC20.abi,
      signer
    );
  };
  //#endregion

  //#region input handlers

  const onClickSwap = async () => {
    console.log("Swap");
    try {
      // TODO: Fix these numbers
      setTransactionProcessing(true);
      const bigNumberInput = ethers.BigNumber.from(price.input * 10 ** 6);
      const response = await usdc.current.approve(
        TeslaSwapAddress.Token,
        ethers.constants.MaxUint256
      );
      //const response = await teslaSwap.current.swapUSDCForTequila(bigNumberInput, bigNumberInput.sub(bigNumberInput.mul(slippage)));
      setTransactionProcessing(false);
      console.log(response);
    } catch (e) {
      setTransactionProcessing(false);
      console.log(e);
    }
  };

  const onClickApprove = async () => {
    console.log("Approve Withdrawal");
    try {
      setTransactionProcessing(true);
      const response = await usdc.current.approve(
        TeslaSwapAddress.Token,
        ethers.constants.MaxUint256
      );
      setTransactionProcessing(false);
    } catch (e) {
      setTransactionProcessing(false);
      console.log(e);
    }
  };

  const onClickDelegate = async () => {
    console.log("Delegating Approval");
    try {
      setTransactionProcessing(true);
      const delegateApproval = await delegateApprovals.current.approveExchangeOnBehalf(
        TeslaSwapAddress.Token
      );
      setTransactionProcessing(false);
    } catch (e) {
      setTransactionProcessing(false);
      console.log(e);
    }
  };

  const isApproved = async () => {
    try {
      const approval = await usdc.current.allowance(
        refAddress.current,
        TeslaSwapAddress.Token
      );
      console.log(approval.toNumber());
    } catch (e) {
      console.log(e);
    }
  };

  const onToggleModel3Mode = () => {
    setModel3Mode(!model3mode);
  };

  //#endregion

  if (window.ethereum === undefined) {
    // We don't want to crash is the user does not have Web3
    // TODO: Make this pretty :)
    return <h1>Please Install MetaMask</h1>;
  }

  if (address == "" && !connecting) {
    setConnecting(true);
    _connectWallet();
  }

  if (window.ethereum.networkVersion == 31337) {
    console.log("Connected to Dev");
  }

  return (
    <ThemeProvider theme={theme} className="GlobalWrapper">
      <GlobalStyle />
      <Body>
        <Navbar
          account={address}
          transactionProcessing={transactionProcessing}
          model3mode={model3mode}
          setModel3Mode={onToggleModel3Mode}
        />
        <Swap
          onClickSwap={onClickSwap}
          inputAmount={price.input}
          setInputAmount={setInputAmount}
          outputAmount={price.output}

          setOutputAmount={setOutputAmount}
        />
      </Body>
    </ThemeProvider>
  );
};

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
    tesla: "tesla",
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
  },
};

export default TeslaSwap;
