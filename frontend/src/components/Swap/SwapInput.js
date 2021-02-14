import React from 'react';
import styled from 'styled-components'

import InputBox from "../InputBox";

const SwapInput = (props) => {
    return (
        <InputWrapper>
            <InputBox 
                {...props}
                id="SwapInput"
                height="36px"
                width="300px"
                type="number"
                value={props.depositAmt}
                onChange={(e) => console.log(e)}
                placeholder="Enter amount of USDC to Swap"
                step="any"
                disabled={props.depositStatus === "depositing"}
                />

        </InputWrapper>
    )
};

const InputWrapper = styled.div`
	display: grid;
	grid-template-columns: 1fr;
	column-gap: 1rem;
	row-gap: 0.1rem;
`;

export {SwapInput}
