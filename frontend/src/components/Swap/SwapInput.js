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
                width="400px"
                type="number"
                value={props.inputAmount}
                onChange={(e) => props.setInputAmount(e.target.value)}
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
