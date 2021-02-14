import React, { useContext } from "react";
import styled, { css, ThemeContext } from "styled-components";

const InputBox = (props) => {
	const themeContext = useContext(ThemeContext);
	return (
		<StyledInput
			{...props}
			type={props.type}
			step={props.step}
			placeholder={props.placeholder}
			disabled={props.disabled}
		></StyledInput>
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
	border-style: solid;
	border-radius: 10px 10px 10px 10px;
	font-size: ${(props) => props.theme.fontSizes.swapInput};
	background-color: white; 
	border-color: black;
	margin: auto;

	-moz-appearance: textfield !important;
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
`;

export default InputBox ;
