import React from 'react'
import styled, { css } from 'styled-components'

import { SwapInput } from "./SwapInput";
import { SwapOutput } from './SwapOutput';
import { Button } from '../Button/Button';

const Swap = (props) => {
    const {onClickSwap, onClickApprove, onClickDelegate, ...otherProps} = props;
    return (
        <SwapWrapper>
            <SwapUIRow>
                Swap USDC into Tesla
            </SwapUIRow>
            <SwapUIRow>
                <SwapInput {...otherProps}/>
            </SwapUIRow>
            <SwapUIRow>
                <SwapOutput {...otherProps}/>
            </SwapUIRow>
            <SwapUIRow>
                <SwapButtonRow {...props} />
            </SwapUIRow>
            { /* TODO: Show approval buttons first */}
        </SwapWrapper>
    )
}

const SwapButtonRow = (props) => {
    const {onClickSwap, onClickDelegate, onClickApprove, ...otherProps} = props;
    console.log("Swap Buttons", props.approved, props.delegated);
    if (props.approved && props.delegated) {
        return (
            <Button
                {...otherProps}
                id="Swap"
                height="38px"
                width="140px"
                text="Swap"
                onClick={onClickSwap}
                disabled={
                        false
                }
            />
        );
    }
    return (
        <div>
            {
                (props.approved) ||
                    <Button
                        {...otherProps}
                        id="Approve"
                        height="38px"
                        width="140px"
                        text="Approve"
                        onClick={onClickApprove}
                        disabled={
                                false
                        }
                    />
            }
            {
                (props.delegated) || <Button
                    {...otherProps}
                    id="Delegate"
                    height="38px"
                    width="140px"
                    text="Delegate"
                    onClick={onClickDelegate}
                    disabled={
                            false
                    }
                />
            }
        </div>
    )
}

const SwapWrapper = styled.div`
    background-color: ${(props) => props.theme.swapBackground};
    display: grid;
    grid-template-rows: 3fr 4fr 4fr;
    height: 360px;
    width: 375px;
    border-style: solid;
    border-radius: 19px;
    border-width: 2px;
    border-color: ${(props) => props.theme.borderColor};
    box-shadow: 2px 2px 5px grey;
    margin-left: auto;
    margin-right: auto;
`;


const SwapUIRow = styled.div`
	padding: ${(props) => props.padding};
	${(props) =>
		props.centerVertical &&
		css`
			display: grid;
			align-items: center;
		`}
	${(props) =>
		props.borderBottomWidth &&
		css`
			border-bottom-style: solid;
			border-bottom-width: ${(props) => props.borderBottomWidth};
			border-bottom-color: ${(props) => props.theme.borderColor};
		`};
`;


export default Swap;
