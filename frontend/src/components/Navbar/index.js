import React from 'react'
import styled from 'styled-components'

import ClipLoader from "react-spinners/ClipLoader";
import {FormGroup, FormControlLabel, Switch, Slide } from "@material-ui/core";

const Navbar = (props) => {
    return (
        <NavbarWrapper>
            <TeslaText>
                TESLASWAP
            </TeslaText>
            <div>

            </div>
            <SpinnerWrapper>
                <ClipLoader loading={props.transactionProcessing} size={10} />
            </SpinnerWrapper>
            <SliderWrapper>
                <FormGroup>
                    <FormControlLabel
                    control={<Switch size="small" checked={props.model3mode} onChange={(e) => {props.setModel3Mode()}} />}
                    label="MODEL 3"
                    />
                </FormGroup>
            </SliderWrapper>
            <TeslaText>
                {/* TODO: Replace this with an account button/account address*/}
                {console.log(props)}
                {
                    props.account ? 
                        props.account.substring(0,6) + "..." + props.account.substring(props.account.length - 4)
                        : "CONNECT"
                }
            </TeslaText>
            
        </NavbarWrapper>
    )
}

const NavbarWrapper = styled.div`
    position: sticky;
	top: 0;
    z-index: 1;
    padding: 20px 20px 20px 20px;
    display: grid;
    grid-template-columns: 20% auto 10% 20% 30%;
`;

const SliderWrapper = styled.div`
    margin-left: auto;
    margin-right: 1px;
`;

const TeslaText = styled.div`
    text-align: center;
    font-size: ${(props) => props.theme.fontSizes.navBarButtons};
    font-family: ${(props) => props.theme.fonts.tesla};
`;

const SpinnerWrapper = styled.div`
    margin-top: auto;
    margin-bottom: auto;
    margin-left: auto;
    margin-right: 10px;
`;

export default Navbar;
