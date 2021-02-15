import React from "react";
import styled, { css } from "styled-components";

import { SwapInput } from "./SwapInput";
import { SwapOutput } from "./SwapOutput";
import { Button } from "../Button/Button";
import Fab from "@material-ui/core/Fab";
import Tooltip from "@material-ui/core/Tooltip";
import { Button as MaterialButton } from "@material-ui/core";

const Swap = (props) => {
  const { onClickSwap, onClickApprove, onClickDelegate, ...otherProps } = props;
  return (
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
  );
};

const SwapButtonRow = (props) => {
  const { onClickSwap, onClickDelegate, onClickApprove, ...otherProps } = props;
  console.log("Swap Buttons", props.approved, props.delegated);
  if (props.approved && props.delegated) {
    return (
      <Button
        {...otherProps}
        id="Swap"
        height="38px"
        width="140px"
        text="Swap"
        onClick={onClickSwap}
        style={{borderRadius:50}}
        disabled={false}
      />
    );
  }
  return (
    <ButtonRow>
      {props.approved || (
        <ButtonWrapper>
            <MaterialButton
            {...otherProps}
            height="38px"
            variant="contained"
            width="10px"
            onClick={onClickApprove}
            style={{borderRadius:50}}
            >
                <ButtonText>
                    Approve
                </ButtonText>
            </MaterialButton>
        </ButtonWrapper>
      )}
      {props.delegated || (
        
        <ButtonWrapper>
        <Tooltip title="Explain">
            <MaterialButton
              {...otherProps}
              height="38px"
              width="140px"
              variant = "contained"
              onClick={onClickDelegate}
              style={{borderRadius:50}}
            >
                <ButtonText>
                    Delegate
                </ButtonText>
            </MaterialButton>
        </Tooltip>
        </ButtonWrapper>
      )}
    </ButtonRow>
  );
};

const SwapWrapper = styled.div`
  background-color: ${(props) => props.theme.swapBackground};

  height: 360px;
  width: 540px;
  border-style: solid;
  border-radius: 25px;
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
  grid-template-columns: 50% 50%;
  margin-left: auto;
  margin-right: auto;
`;

const ButtonText = styled.div`
	font-size: ${(props) => props.theme.fontSizes.navBarButtons};
	font-family: ${(props) => props.theme.fonts.tesla};
`;

const ButtonWrapper = styled.div`
    width: 80px;
    border-radius: 50;
`;

export default Swap;
