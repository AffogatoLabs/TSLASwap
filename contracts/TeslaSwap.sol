// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
import "hardhat/console.sol";

import "./interfaces/ICurve.sol";
import "./interfaces/IERC20.sol";
import "./interfaces/ISynthetix.sol";
import "./interfaces/IDelegateApprovals.sol";
import "./interfaces/IBPool.sol";

contract TeslaSwap {
  ICurve public curve;
  ISynthetix public synthetix;
  IBPool public balancer;
  IERC20 public USDC;
  IERC20 public sUSD;
  IERC20 public sTSLA;
  
  
  // 0x055db9aff4311788264798356bbf3a733ae181c6
  constructor(address _USDC, address _sUSDC, address _sTSLA, address _curve, address _synthetix, address _balancer) {
    USDC = IERC20(_USDC);
    sUSD = IERC20(_sUSDC);
    sTSLA = IERC20(_sTSLA);
    curve = ICurve(_curve);
    synthetix = ISynthetix(_synthetix);
    balancer = IBPool(_balancer);

    USDC.approve(address(curve), 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff);
  }

  function swapUSDCForTequila (
    uint256 amountIn,
    uint256 amountOutMin
  ) external {
    USDC.transferFrom(msg.sender, address(this), amountIn);

    curve.exchange(1, 3, amountIn, amountOutMin);
    uint256 sUSDOut = sUSD.balanceOf(address(this));
    sUSD.transfer(msg.sender, sUSDOut);

    synthetix.exchangeOnBehalf(msg.sender, "sUSD", sUSDOut, "sTSLA");
  }

  function swapTequilaForUSDC (
    uint256 amountIn,
    uint256 amountOutMin
  ) external {
    uint256 sUSDOut = synthetix.exchangeOnBehalf(msg.sender, "sTSLA", amountIn, "sUSD");
    //sUSD.transferFrom(msg.sender, address(this), sUSDOut);

    //curve.exchange(3, 1, sUSDOut, amountOutMin);
    //USDC.transfer(msg.sender, amountIn);
  }

}
