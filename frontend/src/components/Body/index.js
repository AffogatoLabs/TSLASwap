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
    background-color: ${((props) => props.theme.primaryBackground)};
    width: 100%;
`;

export default Body;
