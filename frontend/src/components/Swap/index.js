import React from "react";
import styled, { css } from "styled-components";

import { SwapInput } from "./SwapInput";
import { SwapOutput } from "./SwapOutput";
import { Button } from "../Button/Button";
import Fab from "@material-ui/core/Fab";
import Tooltip from "@material-ui/core/Tooltip";
import { Button as MaterialButton, Box } from "@material-ui/core";

const Swap = (props) => {
  const { onClickSwap, onClickApprove, onClickDelegate, ...otherProps } = props;
  return (
    <Box>
        <SwapWrapper>
            <SwapConstaints>
            <SwapUIRow></SwapUIRow>
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
        </SwapWrapper>
    </Box>
  );
};

const SwapButtonRow = (props) => {
  const { onClickSwap, onClickDelegate, onClickApprove, ...otherProps } = props;
  console.log("Swap Buttons", props.approved, props.delegated);
  if (props.approved && props.delegated) {
    return (
        <ButtonRow>
        <MaterialButton
        {...otherProps}
        height="38px"
        variant="contained"
        width="160px"
        onClick={onClickSwap}
        style={{borderRadius:50, minWidth: '150px'}}
        >
            <ButtonText>
                Swap
            </ButtonText>
        </MaterialButton>
        </ButtonRow>
    );
  }
  return (
    <ButtonRow>
      {props.approved || (
            <MaterialButton
            {...otherProps}
            height="38px"
            variant="contained"
            width="160px"
            onClick={onClickApprove}
            style={{borderRadius:50, minWidth: '140px'}}
            >
                <ButtonText>
                    Approve
                </ButtonText>
            </MaterialButton>
      )}
      {props.delegated || (
        
        <Tooltip title="Explain">
            <MaterialButton
              {...otherProps}
              height="38px"
              width="160px"
              variant = "contained"
              onClick={onClickDelegate}
              style={{borderRadius:50, minWidth: '140px'}}
            >
                <ButtonText>
                    Delegate
                </ButtonText>
            </MaterialButton>
        </Tooltip>
      )}
    </ButtonRow>
  );
};

const SwapWrapper = styled.div`
  background-color: ${(props) => props.theme.swapBackground};

  height: 360px;
  width: 540px;
  border-style: solid;
  border-radius: 50px;
  border-width: 2px;
  border-color: ${(props) => props.theme.borderColor};
  box-shadow: 2px 2px 2px grey;
  margin-left: auto;
  margin-right: auto;
`;

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
  justify-items:center;
  margin-left: auto;
  margin-right: auto;
`;

const ButtonText = styled.div`
	font-size: ${(props) => props.theme.fontSizes.buttonSize};
	font-family: ${(props) => props.theme.fonts.monty};
`;


export default Swap;
