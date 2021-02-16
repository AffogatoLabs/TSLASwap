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
  background-image: url(${SvgTestSrc});
  
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  height: 425px;
  position: relative;
  z-index: -1;
`;

export default Body;
