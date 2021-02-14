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
	border-radius: 10px;
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 0;
	background-color: ${(props) => props.buttonColor};
	border-width: 0px;
	border-color: ${(props) => props.buttonColor};
	border-right: 4px solid ${(props) => props.shadowColor};
	border-bottom: 4px solid ${(props) => props.shadowColor};
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
	:active {
	}
`;

export { Button };
