import React from "react";
import styled, { css } from "styled-components";
import Text from "../Text";

const Button = (props) => {
	return (
		<MainButton {...props}>
			<ButtonText
				fontSize={props.fontSize}
				colorText={props.fontColor}
				fontWeight={props.fontWeight}
				noHighlight
			>
				{props.text}
			</ButtonText>
		</MainButton>
	);
};

const MainButton = styled.div`
	position: relative;
	border-style: solid;
	border-radius: 4px;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: auto;
	margin-left: auto;
	margin-bottom: 20px;
	z-index: 0;
	background-color: ${(props) => props.theme.buttonColor};
	border-width: 0px;
	border-color: ${(props) => props.theme.buttonColor};
	border-right: 4px solid ${(props) => props.theme.shadowColor};
	border-bottom: 4px solid ${(props) => props.theme.shadowColor};
	transition: 0.1s;
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
	:hover {
		cursor: pointer;
	}
	:active {
		${(props) =>
			!props.disabled &&
			css`
				transform: translateY(1.5px);
			`}
	}
	${(props) =>
		props.disabled &&
		css`
			pointer-events: none;
		`}

	:after {
		content: url(${(props) => props.icon});
		display: block;
		height: ${(props) => props.iconHeight};
		width: ${(props) => props.iconWidth};
	}
`;

const ButtonText = styled(Text)`
	font-size: ${(props) => props.theme.fontSizes.navBarButtons};
	font-family: ${(props) => props.theme.fonts.tesla};
	:active {
	}
`;

export { Button };