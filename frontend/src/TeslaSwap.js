import React, { useState, useEffect, useRef } from "react";
import styled, { ThemeProvider, createGlobalStyle } from "styled-components";
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
import SvgTestSrc from "./SVGsource/TESTING 1.svg";
import { Snackbar } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";

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

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const TeslaSwap = () => {
  const [address, setAddress] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [slippage, setSlippage] = useState(0.5);
  const [price, setPrice] = useState({ input: undefined, output: undefined });
  const [transactionProcessing, setTransactionProcessing] = useState(false);
  const [model3mode, setModel3Mode] = useState(false);
  const [approved, setApproved] = useState(false);
  const [delegated, setDelegated] = useState(false);
  const [balances, setBalances] = useState({ USDC: 0.0, sTSLA: 0.0 });
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
  const refStatusMessage = useRef("");
  const refStatus = useRef("");

  useEffect(() => {
    //_startPollingData(address);
  }, [address]);

  useEffect(() => {
    if (
      !transactionProcessing &&
      !failedTransaction &&
      refAddress.current != ""
    ) {
      refStatusMessage.current = "Transaction completed successfully";
      refStatus.current = "success";

      setOpen(true);
      _pollData();
    } else if (!transactionProcessing && failedTransaction) {
      if(balances.USDC < price.input) {
        refStatusMessage.current = "Insufficient funds";
      } else{
        refStatusMessage.current = "Transaction failed";
      }
      refStatus.current = "error";

      setOpen(true);
    }
  }, [transactionProcessing]);

  const setOutputAmount = async (output) => {
    const usdcAmount = output * exchangeRateTesla; 
    setPrice({ input: usdcAmount, output: output });
  };

  const setInputAmount = async (input) => {
    console.log("Exchange Rate", exchangeRateTesla)
    const teslaAmount = input / exchangeRateTesla;
    setPrice({ input: input, output: teslaAmount });
  };

  const getUSDCPerTesla = async () => {
    try {
      // Get cost of one share
      const teslaAmount = ethers.BigNumber.from(1 * 10 ** 6);
      let result = await exchangerates.current.effectiveValue(
        toUtf8Bytes32("sTSLA"),
        teslaAmount,
        toUtf8Bytes32("sUSD")
      );
      result = result.toNumber();
      result = result / 10 ** 6;

      return result;
    } catch (e) {}
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
      let tslaRate = await getUSDCPerTesla();

      usdcBalance = usdcBalance.toNumber() / 10 ** 6;
      let decimals = ethers.BigNumber.from(10).pow(18);
      let decimals2 = ethers.BigNumber.from(10).pow(12);

      let modResult = stslaBalance.mod(decimals).div(decimals2);
      stslaBalance = stslaBalance.div(decimals).toString();
      stslaBalance += "." + modResult;

      setBalances({ USDC: usdcBalance, sTSLA: stslaBalance });
      setExchangeRateTesla(tslaRate);
      // TODO: Consume These
    } catch (err) {}
  };

  const _initializeBlockChainConnect = () => {
    let provider = new ethers.providers.Web3Provider(window.ethereum);

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

      console.log(price.input)
      const bigNumberInput = ethers.BigNumber.from(Math.trunc(price.input * 10 ** 6));

      let calculatedSlippage = slippage * 100;

      const response = await teslaSwap.current.swapUSDCForTequila(
        bigNumberInput,
        bigNumberInput.sub(bigNumberInput.mul(calculatedSlippage).div(10000))
      );
      await _pollData();
      setTransactionProcessing(false);
    } catch (e) {
      console.log(e)
      setFailedTransaction(true);
      setTransactionProcessing(false);
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
    }
  };

  const setMaxValue = (currency) => {
    switch (currency) {
      case "USDC":
        setInputAmount(balances[currency]);
        break;
      case "sTSLA":
        setOutputAmount(balances[currency]);
        break;
    }
  };

  const isApproved = async () => {
    try {
      const approval = await usdc.current.allowance(
        refAddress.current,
        TeslaSwapAddress.Token
      );
      setApproved(approval.gt(0));
    } catch (e) {}
  };

  const isDelegateApproved = async () => {
    try {
      const delegatedResponse = await delegateApprovals.current.canExchangeFor(
        refAddress.current,
        TeslaSwapAddress.Token
      );

      setDelegated(delegatedResponse);
    } catch (e) {}
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

    console.log("Network", window.ethereum.networkVersion);
    if (window.ethereum.networkVersion == 31337) {
    }
  }

  return (
    <HttpsRedirect>
      <ThemeProvider theme={theme} className="GlobalWrapper">
        <GlobalStyle />
        {/*          <SVGTestImg />
         */}
        <SVGTestObj
          type="image/svg+xml"
          data={SvgTestSrc}
          style={{ backgroundColor: theme.primaryBackground, margin: "auto" }}
        />
        <Body>
          <Navbar
            account={address}
            transactionProcessing={transactionProcessing}
            model3mode={model3mode}
            setModel3Mode={onToggleModel3Mode}
            failedTransaction={failedTransaction}
            slippage={slippage}
            setSlippage={setSlippage}
          />
          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            open={open}
            onClose={() => {
              setOpen(false);
            }}
          >
            <Alert severity={refStatus.current}>
              {refStatusMessage.current}
            </Alert>
          </Snackbar>
          <Swap
            onClickSwap={onClickSwap}
            inputAmount={price.input}
            setInputAmount={setInputAmount}
            outputAmount={price.output}
            setOutputAmount={setOutputAmount}
            onClickApprove={onClickApprove}
            onClickDelegate={onClickDelegate}
            approved={approved}
            delegated={delegated}
            balances={balances}
            setMaxValue={setMaxValue}
            model3mode={model3mode}
            exchangeRateTesla={exchangeRateTesla}
          />
          <Footer />
        </Body>
      </ThemeProvider>
    </HttpsRedirect>
  );
};

const SVGWrap = styled.div`
  display: grid;
  grid-template-columns: 1fr 5fr 1fr;
`;

const SVGTestImg = styled.div`
  background-image: url(${SvgTestSrc});
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  height: 425px;
  position: relative;
  z-index: -1;
`;

const SVGTestObj = styled.object`
  width: 100%;
  z-index: -10;
  position: absolute;
  top: 0;
  left: 0;
`;

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: tesla;
    src: url(${teslaFont}) format('truetype');
    font-weight: normal;
    font-style: normal;
  };
  @font-face {
    font-family: monty;
    src: url(${montyFont});
    font-weight:normal;
    font-style: normal;
  };
  background-color: "azure";
  background-image: ${SvgTestSrc}
`;

const theme = {
  primaryBackground: "azure",
  borderColor: "#cececece",
  swapBackground: "#B0BBBF",

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

    titleText: "28px",
    descriptionText: "12px",

    footerText: "8px",
    swapTitle: "35px",
    swapPanelTitle: "28px",
    swapPanelSubtitle: "28px",
    swap: "29px",
    swapFooter: "21px",
    swapBody: "27px",
    swapButton: "23px",
    swapInput: "20px",
    swapNumStaked: "28px",
    swapMaxButton: "20px",
  },
};

export default TeslaSwap;
