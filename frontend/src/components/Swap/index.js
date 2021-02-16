import React, { useContext } from "react";
import styled, { css, ThemeContext } from "styled-components";

import { SwapInput } from "./SwapInput";
import { SwapOutput } from "./SwapOutput";
import Fab from "@material-ui/core/Fab";
import Tooltip from "@material-ui/core/Tooltip";
import { Button as MaterialButton, Box, Paper } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";

const Swap = (props) => {
  const themeContext = useContext(ThemeContext);

  const { onClickSwap, onClickApprove, onClickDelegate, ...otherProps } = props;
  return (    
  
    <Paper
        style={{
            maxWidth: "40em",
            minWidth: "30em",
            paddingTop: 2,
            paddingBottom: 2,
            paddingRight: 2,
            paddingLeft:2,
            backgroundColor: "grey",
            marginTop: "5em",
            marginBottom: 200,
            marginLeft: "auto",
            marginRight: "auto",
            borderRadius: 50,

        }}>
    <Paper
        style={{
            maxWidth: "40em",
            minWidth: "30em",
            paddingTop: 12,
            paddingBottom: 20,
            paddingRight: 12,
            paddingLeft: 12,
            backgroundColor: "black",
            marginLeft: "auto",
            marginRight: "auto",
            borderRadius: 50,

        }}>
    <Paper
      elevation={4}
      style={{
        maxWidth: "50em",
        minWidth: "30em",
        padding: 20,
        backgroundColor: "#8aa1ff",
        marginLeft: "auto",
        marginRight: "auto",
        borderRadius: 50,
      }}
    >
      <SwapConstaints>
        <SwapUIRow style={{alignContent:"center",
      }}>
            <TitleText>
                <center style={{fontVariant: "small-caps"}}>
                    ⚡️ 
                    TeslaSwap
                    ⚡️
                </center>
            </TitleText>
            <DescriptionText style={{
              fontSize: "0.8em",
              padding: 5,
            }}>
                <center>
                    Swap from $USDC into Synthetic Tesla ($sTSLA)
                </center>
            </DescriptionText>
        </SwapUIRow>
        <SwapUIRow>
          <SwapInput {...otherProps} currency="USDC" />
        </SwapUIRow>
        <SwapUIRow>
          <SwapOutput {...otherProps} currency="sTSLA" />
        </SwapUIRow>
        <SwapUIRow>
          <SwapButtonRow {...props} />
        </SwapUIRow>
        {/* TODO: Show approval buttons first */}
      </SwapConstaints>
    </Paper>
    </Paper>
    </Paper>

  );
};

const SwapButtonRow = (props) => {
  const { onClickSwap, onClickDelegate, onClickApprove, ...otherProps } = props;
  if (props.approved && props.delegated) {
    return (
      <ButtonRow>
        <MaterialButton
          {...otherProps}
          height="38px"
          variant="contained"
          width="160px"
          onClick={onClickSwap}
          style={{ borderRadius: 50, minWidth: "150px" }}
        >
            <Tooltip title="Swap from $USDC to $sTSLA in a single seamless transaction">
                <ButtonText>Swap</ButtonText>
            </Tooltip>
        </MaterialButton>
      </ButtonRow>
    );
  }
  return (
    <ButtonRow>
      {props.approved || (
        <Tooltip title="Approve the contract to spend your $USDC on your behalf. It will not be spent unless you go through with the swap.">
        <MaterialButton
          {...otherProps}
          height="38px"
          variant="contained"
          width="160px"
          onClick={onClickApprove}
          style={{ borderRadius: 50, minWidth: "140px" }}
        >
          <ButtonText>Approve</ButtonText>
        </MaterialButton>
        </Tooltip>
      )}
      {props.delegated || (
        <Tooltip title="In order to be able to seamlessly swap from $USDC to $sTSLA on the Synthetix exchange, you will need to approve this contract to trade for you.">
          <MaterialButton
            {...otherProps}
            height="38px"
            width="160px"
            variant="contained"
            onClick={onClickDelegate}
            style={{ borderRadius: 50, minWidth: "140px" }}
          >
            <ButtonText>Delegate</ButtonText>
          </MaterialButton>
        </Tooltip>
      )}
    </ButtonRow>
  );
};

const SwapConstaints = styled.div`
  height: 300px;
  width: 320px;
  margin: auto;
  display: grid;
  grid-template-rows: 3fr 4fr 4fr;
`;

const SwapUIRow = styled.div`
  padding: ${(props) => props.padding};
  ${(props) =>
    props.centerVertical &&
    css`
      display: grid;
      align-items: center;
    `}
  ${(props) =>
    props.borderBottomWidth &&
    css`
      border-bottom-style: solid;
      border-bottom-width: ${(props) => props.borderBottomWidth};
      border-bottom-color: ${(props) => props.theme.borderColor};
    `};
`;

const ButtonRow = styled.div`
  display: grid;
  grid-auto-flow: column;
  justify-items: center;
  margin-left: auto;
  margin-right: auto;
`;
const DescriptionText = styled.div`
  font-size: ${(props) => props.theme.fontSizes.descriptionText};
  font-family: ${(props) => props.theme.fonts.monty};
  padding: 5px;
`;

const TitleText = styled.div`
  font-size: ${(props) => props.theme.fontSizes.titleText};
  font-family: ${(props) => props.theme.fonts.monty};
  padding: 5px;
`;

const ButtonText = styled.div`
  font-size: ${(props) => props.theme.fontSizes.buttonSize};
  font-family: ${(props) => props.theme.fonts.monty};
`;

export default Swap;
