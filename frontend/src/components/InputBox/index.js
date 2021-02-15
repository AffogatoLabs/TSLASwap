import React, { useContext } from "react";
import styled, { css, ThemeContext } from "styled-components";
import { Button } from "@material-ui/core";

const toModel3Price = (intValue) => {
  return intValue / 37990;
};

const InputBox = (props) => {
  const themeContext = useContext(ThemeContext);
  return (
    <StyledInputBox>
      <StyledCurrencyRow>
        <StyledCurrencyName>{props.currency}</StyledCurrencyName>
        <StyledCurrencyBalance
          onClick={(e) => props.setMaxValue(props.currency)}
        >
          Balance:{" "}
          {props.model3mode
            ? (props.currency == "USDC"
                ? toModel3Price(props.balances[props.currency])
                    .toString()
                    .substring(0, 5)
                : toModel3Price(
                    props.balances[props.currency] / props.exchangeRateTesla
                  )
                    .toString()
                    .substring(0, 5)) + " $MODEL3"
            : props.balances[props.currency]}
        </StyledCurrencyBalance>
      </StyledCurrencyRow>
      <StyledInputRow>
        <ImageWrapper>
          {props.currency == "USDC" ? (
            <img
              width="25"
              height="25"
              src="https://cryptologos.cc/logos/usd-coin-usdc-logo.svg?v=010"
            />
          ) : (
            <img
              width="25"
              height="25"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Tesla_T_symbol.svg/200px-Tesla_T_symbol.svg.png"
            />
          )}
        </ImageWrapper>
        <StyledInput
          {...props}
          type={props.type}
          step={props.step}
          placeholder={props.placeholder}
          disabled={props.disabled}
        ></StyledInput>
      </StyledInputRow>
    </StyledInputBox>
  );
};

const StyledInput = styled.input`
  ${(props) =>
    props.height &&
    css`
      height: ${(props) => props.height};
    `}
  ${(props) =>
    props.width &&
    css`
      width: ${(props) => props.width};
    `}
	font-size: ${(props) => props.theme.fontSizes.swapInput};
  border-style: none;
  margin: auto;

  *:focus {
    outline: none;
  }

  width: 200px;

  -moz-appearance: textfield !important;
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const StyledInputBox = styled.div`
	border-radius: 15px;
	padding: 5px;
	margin: auto;
	display: grid;
	grid-template-rows: 1fr auto;
	background-color:white;

	*:focus {
		outline: none;
	}

	border-color: "#f1f1f1f1"
	border-style: solid;

	width: 310px;

	/* Chrome, Safari, Edge, Opera */
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	/* Firefox */
	input[type=number] {
		-moz-appearance: textfield;
	}
`;

const StyledInputRow = styled.div`
  display: grid;
  grid-template-columns: 10% 90%;
`;

const StyledCurrencyRow = styled.div`
  display: grid;
  grid-template-columns: 20% 80%;
`;

const StyledCurrencyBalance = styled.div`
  margin-left: auto;
  margin-right: 10px;

  :hover {
    cursor: pointer;
  }
`;

const StyledCurrencyName = styled.div`
  margin-left: 10px;
`;

const ImageWrapper = styled.div`
  margin-left: 15px;
  margin-top: auto;
  margin-bottom: auto;
  width: 20px;
  height: 20px;
`;

export default InputBox;
