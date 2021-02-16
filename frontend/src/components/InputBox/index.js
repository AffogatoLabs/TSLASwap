import React, { useContext } from "react";
import styled, { css, ThemeContext } from "styled-components";
import { Button, Paper} from "@material-ui/core";

const toModel3Price = (intValue) => {
  return intValue / 37990;
};

const InputBox = (props) => {
  const themeContext = useContext(ThemeContext);
  return (
		<Paper 
			style={{borderRadius:20, padding: 5}}>

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
                    props.balances[props.currency] * props.exchangeRateTesla
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
		<StyledInputBox>
			<StyledInput
				{...props}
				type={props.type}
				step={props.step}
				placeholder={props.placeholder}
				disabled={props.disabled}
				></StyledInput>
		</StyledInputBox>
        <Button
          variant="outlined"
          disableElevation
          onClick={(e) => props.setMaxValue(props.currency)}
          style={{ borderRadius: 10, minWidth: "20px", maxWidth: "50px",maxHeight: "30px", marginTop: "9px", }}
        >
          <ButtonText>Max</ButtonText>
        </Button>
      </StyledInputRow>
		</Paper>
  );
};

const StyledInput = styled.input`
	*:focus {
		outline: none;
	}

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

  width: 180px;
`;

const StyledInputBox = styled.div`
	*:focus {
		outline: none;
	}

	border-color: "#f1f1f1f1"
	border-style: solid;

	padding-top:6px;
	width: 180px;

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
  grid-auto-flow: column;

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

const ButtonText = styled.div`
  font-size: ${(props) => props.theme.fontSizes.buttonSize};
  font-family: ${(props) => props.theme.fonts.monty};
  color: rgb(137 138 138);
`;

export default InputBox;
