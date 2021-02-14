import React, { useContext } from "react";
import { ThemeContext } from "styled-components";
import { Button } from "./Button.js";

const StakingButton = (props) => {
	const themeContext = useContext(ThemeContext);
	const colors = themeContext["colors"];
	const buttonColor = colors["buttonColor"];
	const shadowColor = colors["buttonShadow"];
	const textColor = colors["buttonText"];
	return (
		<Button
			fontSize={themeContext.fontSizes.swapButton}
			border={props.border}
			fontWeight={600}
			buttonColor={buttonColor}
			shadowColor={shadowColor}
			fontColor={textColor}
			height={props.height}
			width={props.width}
			text={props.text}
			onClick={props.onClick}
			disabled={props.disabled}
			icon={props.icon}
			iconHeight={props.iconHeight}
			iconWidth={props.iconWidth}
		/>
	);
};

export { StakingButton };
