import React from 'react'
import styled from 'styled-components'

import ClipLoader from "react-spinners/ClipLoader";

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
    grid-template-columns: 20% auto 1% 20%;
`;


const TeslaText = styled.div`
    text-align: center;
    font-size: ${(props) => props.theme.fontSizes.navBarButtons};
    font-family: ${(props) => props.theme.fonts.tesla};
`;

const SpinnerWrapper = styled.div`
    margin-top: auto;
    margin-bottom: auto;
`;

export default Navbar;
