import React from "react";
import styled, { css } from "styled-components";
import SvgTestSrc from "../../SVGsource/TESTING 1.svg";

const Body = (props) => {
  return <BodyStyled>{props.children}</BodyStyled>;
};

const BodyStyled = styled.div`
  display: grid;
  align-items: center;
  grid-template-rows: 1fr auto 1fr;
  width: 100%;
`;

const SVGTestImg = styled.div`
  background: url(${SvgTestSrc}) no-repeat, rgb(240, 255, 255);
  height: 100%;
  position: absolute;
  z-index: -1;
`;

export default Body;
