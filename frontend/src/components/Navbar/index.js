import React from 'react'
import styled from 'styled-components'

import ClipLoader from "react-spinners/ClipLoader";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import {FormGroup, FormControlLabel, Switch, Slide, Paper} from "@material-ui/core";
import {ToggleButtonGroup, ToggleButton} from "@material-ui/lab";

const Navbar = (props) => {
    const classes = useStyles();
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
            <Paper elevation={0} className={classes.paper}>
                <SlippageInput style={{padding: 4, marginTop: 0}}>

                    <ToggleText>
                        SLIPPAGE:
                    </ToggleText>
                    <SlippageInputBox placeholder="0.5" value={props.slippage} onChange={(e)=> props.setSlippage(e.target.value)}/>
                    <ToggleText>
                        %
                    </ToggleText>
                </SlippageInput>
            </Paper>
            <Paper elevation={0} className={classes.paper}>
                <StyledToggleButtonGroup
                    value={props.model3mode ? "true" : "false"}
                    exclusive
                    style={{
                        padding: 0
                    }}
                    onChange={() => {props.setModel3Mode()}}>
                    <ToggleButton value="false" >
                        <ToggleText>
                            USD
                        </ToggleText>
                    </ToggleButton>
                    <ToggleButton value="true" >
                        <ToggleText>
                            Model 3
                        </ToggleText>
                    </ToggleButton>
                </StyledToggleButtonGroup>
            </Paper>
            <div>
                <TeslaText style={{padding: 1}}>
                    {/* TODO: Replace this with an account button/account address*/}
                    {console.log(props)}
                    {
                        props.account ? 
                            props.account.substring(0,6) + "..." + props.account.substring(props.account.length - 4)
                            : "CONNECT"
                    }
                </TeslaText>
                { props.failedTransaction ? <FailureText>Failure executing transaction</FailureText> : <div></div>}
            </div>
            
        </NavbarWrapper>
    )
}

const NavbarWrapper = styled.div`
    position: sticky;
	top: 0;
    z-index: 1;
    padding: 20px 20px 20px 20px;
    display: grid;
    grid-auto-flow:column;
    min-width: 80%;
    margin-left: auto;
    margin-right: auto;
    justify-items:center;
`;

const TeslaText = styled.div` 
    padding-top: 6px;
    padding-bottom: 6px;
    text-align: center;
    font-size: ${(props) => props.theme.fontSizes.navBarButtons};
    font-family: ${(props) => props.theme.fonts.tesla};
`;

const SpinnerWrapper = styled.div`
    margin-top: 5px;
    margin-bottom: auto;
    margin-left: auto;
    margin-right: 20px;
`;

const FailureText = styled.div`
    color:red;

    padding:3px;
    font-size: 12px;
`;

const ToggleText = styled.div`
    font-size: 20px;
`;

const SlippageInput = styled.div`
    color: rgba(0,0,0,0.29);
    font-size: 11px;
    border: none;
    padding: 8px;
    *:focus {
		outline: none;
    }
    display: grid;
    grid-auto-flow: column;
`;

const SlippageInputBox = styled.input`
    color: rgba(0,0,0,0.29);
    width: 30px;
    margin:auto;
    font-size: 20px;
    border: none;
`;

const useStyles = makeStyles((theme) => ({
    paper: {
      display: 'flex',
      flexWrap: 'wrap',
      borderRadius: 50,
      maxHeight: 30,
    },
    divider: {
      margin: theme.spacing(1, 0.5),
    },
  }));

const StyledToggleButtonGroup = withStyles((theme) => ({
    grouped: {
      margin: theme.spacing(0.5),
      border: 'none',
      maxHeight: 12,
      '&:not(:first-child)': {
        borderRadius: 50,
      },
      '&:first-child': {
        borderRadius: 50
      },
    },
  }))(ToggleButtonGroup);

export default Navbar;
