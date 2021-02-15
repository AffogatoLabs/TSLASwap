import React, { useState, useEffect, useRef } from "react";
import { ThemeProvider, createGlobalStyle } from "styled-components";
import HttpsRedirect from "react-https-redirect";

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
import montyFont from "./monty.otf";
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
  const [approved, setApproved] = useState(false);
  const [delegated, setDelegated] = useState(false);
  const [balances, setBalances] = useState({"USDC": 0.0, "sTSLA": 0.0});
  const [open, setOpen] = React.useState(false);
  const [exchangeRateTesla, setExchangeRateTesla] = useState(0.0);
  const [failedTransaction, setFailedTransaction] = useState(false);
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

  useEffect(() => {
    if(!transactionProcessing && !failedTransaction) {
      _pollData();
    }
  }, [transactionProcessing]);

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
      let teslaAmount = 1;
      if (!outputAmount){
        teslaAmount = ethers.BigNumber.from(outputAmount * 10 ** 6);
      }
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
    isDelegateApproved();

    _startPollingData();
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
    try {
      let usdcBalance = await usdc.current.balanceOf(refAddress.current);
      let stslaBalance = await stsla.current.balanceOf(refAddress.current);
      let tslaRate = await getUSDCPerTesla(1);

      usdcBalance = usdcBalance.toNumber() / 10 ** 6;
      let decimals = ethers.BigNumber.from(10).pow(18);
      let decimals2 = ethers.BigNumber.from(10).pow(12);


      let modResult = stslaBalance.mod(decimals).div(decimals2);
      stslaBalance = stslaBalance.div(decimals).toString();
      stslaBalance += "." + modResult;

      setBalances({USDC: usdcBalance, sTSLA:stslaBalance});
      console.log(tslaRate);
      setExchangeRateTesla(tslaRate);
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
    try {
      // TODO: Fix these numbers
      setFailedTransaction(false);
      setTransactionProcessing(true);
      const bigNumberInput = ethers.BigNumber.from(price.input * 10 ** 6);

      const response = await teslaSwap.current.swapUSDCForTequila(bigNumberInput, bigNumberInput.sub(bigNumberInput.mul(slippage)));
      await _pollData();
      setTransactionProcessing(false);
    } catch (e) {
      setFailedTransaction(true);
      setTransactionProcessing(false);
      console.log(e);
    }
  };

  const onClickApprove = async () => {
    try {
      setFailedTransaction(false);
      setTransactionProcessing(true);
      const response = await usdc.current.approve(
        TeslaSwapAddress.Token,
        ethers.constants.MaxUint256
      );
      setApproved(true);
      setTransactionProcessing(false);
    } catch (e) {
      setFailedTransaction(true);
      setTransactionProcessing(false);
      console.log(e);
    }
  };

  const onClickDelegate = async () => {
    try {
      setFailedTransaction(false);
      setTransactionProcessing(true);
      const delegateApproval = await delegateApprovals.current.approveExchangeOnBehalf(
        TeslaSwapAddress.Token
      );
      setDelegated(true);
      setTransactionProcessing(false);
    } catch (e) {
      setTransactionProcessing(false);
      setFailedTransaction(true);
      console.log(e);
    }
  };

  const setMaxValue = (currency) => {
    switch(currency){
      case "USDC":
        setInputAmount(balances[currency]);
        break;
      case "sTSLA":
        setOutputAmount(balances[currency]);
        break;
    }
  }

  const isApproved = async () => {
    try {
      const approval = await usdc.current.allowance(
        refAddress.current,
        TeslaSwapAddress.Token
      );
      setApproved(approval.gt(0));
    } catch (e) {
      console.log(e);
    }
  }

  const isDelegateApproved = async () => {
    try {
      const delegatedResponse = await delegateApprovals.current.canExchangeFor(refAddress.current, TeslaSwapAddress.Token);
      
      setDelegated(delegatedResponse);
    } catch (e) {
      console.log(e);
    }
  };

  const onToggleModel3Mode = () => {
    setModel3Mode(!model3mode);
  };

  //#endregion

  if (window.ethereum) {
    // We don't want to crash is the user does not have Web3
    if (address == "" && !connecting) {
      setConnecting(true);
      _connectWallet();
    }

    if (window.ethereum.networkVersion == 31337) {
      console.log("Connected to Dev");
    }
  } 


  return (
    <HttpsRedirect>
      <ThemeProvider theme={theme} className="GlobalWrapper">
        <GlobalStyle />
        <Body>
          <Navbar 
            account = {address}
            transactionProcessing = {transactionProcessing} 
            model3mode = {model3mode}
            setModel3Mode = {onToggleModel3Mode}
            failedTransaction = {failedTransaction}/>
          <Swap
            onClickSwap = {onClickSwap}
            inputAmount = {price.input}
            setInputAmount = {setInputAmount} 
            outputAmount = {price.output}
            setOutputAmount = {setOutputAmount}
            onClickApprove = {onClickApprove}
            onClickDelegate = {onClickDelegate}
            approved = {approved}
            delegated = {delegated}
            balances = {balances}
            setMaxValue = {setMaxValue}
            model3mode = {model3mode}
            exchangeRateTesla = {exchangeRateTesla}
            />
          <Footer />
        </Body>
      </ThemeProvider>
    </HttpsRedirect>
  );
};

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: tesla;
    src: url(${teslaFont}) format('truetype');
    font-weight: normal;
    font-style: normal;
  }
  @font-face {
    font-family: monty;
    src: url(${montyFont});
    font-weight:normal;
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
    monty: "monty",
    mainFamily: `monty, "Nunito Sans", Arial, sans-serif`,
    tesla: "tesla",
  },

  fontSizes: {
    navBarLogo: "37px",
    navBarButtons: "20px",
    buttonSize: "16px",

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
