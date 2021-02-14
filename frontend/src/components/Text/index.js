import styled, { css } from "styled-components";

const Text = styled.div`
	display: flex;
	font-size: ${(props) => props.fontSize};
	font-weight: ${(props) => props.fontWeight};
	color: ${(props) => props.colorText};
	margin: ${(props) => props.margin};
	${(props) =>
		props.centerHorizontal &&
		css`
			justify-content: center;
		`}
	${(props) =>
		props.centerVertical &&
		css`
			align-items: center;
		`}
	${(props) =>
		props.noHighlight &&
		css`
			-webkit-touch-callout: none;
			-webkit-user-select: none;
			-khtml-user-select: none;
			-moz-user-select: none;
			-ms-user-select: none;
			user-select: none;
		`}
`;

export default Text;
