import React from 'react'
import styled, { css } from "styled-components"

const Body = (props) => {
    return (
        <BodyStyled>
            {props.children}
        </BodyStyled>
    )
};

const BodyStyled = styled.div`
    display: grid;
    align-items: center;
    grid-template-rows: 1fr auto 1fr;
    background-color: ${((props) => props.theme.primaryBackground)};
    width: 100%;
`;

export default Body;
