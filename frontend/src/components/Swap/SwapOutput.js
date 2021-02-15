import React from 'react';
import styled from 'styled-components'

import InputBox from "../InputBox";

const SwapOutput = (props) => {
    return (
        <OutputWrapper>
            <InputBox 
                {...props}
                id="SwapOutput"
                height="36px"
                width="300px"
                type="number"
                value={props.outputAmount}
                onChange={(e) => props.setOutputAmount(e.target.value)} 
                placeholder="Enter target of sTesla"
                step="any"
                disabled={props.depositStatus === "depositing"}
                />
        </OutputWrapper>
    )
};

const OutputWrapper = styled.div`
	display: grid;
	grid-template-columns: 1fr;
	column-gap: 1rem;
	row-gap: 0.1rem;
`;

export {SwapOutput};
