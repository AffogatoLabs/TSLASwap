const { expect } = require("chai");

const UniswapRouterV2Address = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
const DelegateApprovalsAddress = "0x15fd6e554874B9e70F832Ed37f231Ac5E142362f";
const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const sTSLA = "0x918dA91Ccbc32B7a6A0cc4eCd5987bbab6E31e6D";
const sUSD = "0x57Ab1ec28D129707052df4dF418D58a2D46d5f51";

const decimals = ethers.BigNumber.from(10).pow(18);

describe("TeslaSwap", function() {
  let teslaBalance;
  let teslaSwap;
  it("Should have Tesla Stock", async function() {
    const TeslaSwap = await hre.ethers.getContractFactory("TeslaSwap");
    teslaSwap = await TeslaSwap.deploy(
      "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" /* USDC */,
      "0x57Ab1ec28D129707052df4dF418D58a2D46d5f51" /* sUSD */,
      "0x918dA91Ccbc32B7a6A0cc4eCd5987bbab6E31e6D" /* sTSLA */,
      "0xA5407eAE9Ba41422680e2e00537571bcC53efBfD" /* Curve sUSD */,
      "0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F" /* Synthetix */
    );
  
    await teslaSwap.deployed();

    const accounts = await ethers.getSigners();
    const uniswapRouter = await ethers.getContractAt("IUniswapV2Router", UniswapRouterV2Address, accounts[0]);

    await uniswapRouter.swapExactETHForTokens(
      1, 
      [WETH, USDC],
      accounts[0].address,
      2525644800,
      {
        gasLimit: 4000000,
        value: ethers.utils.parseEther("100"),
      },
    );

    const usdc = await ethers.getContractAt("IERC20", USDC, accounts[0]);
    const usdcBalance = await usdc.balanceOf(accounts[0].address);

    expect(usdcBalance.gt(10000.0));
    await usdc.approve(teslaSwap.address, ethers.BigNumber.from(1000000).mul(decimals));

    const delegateApprovals = await ethers.getContractAt("IDelegateApprovals", DelegateApprovalsAddress, accounts[0]);
    await delegateApprovals.approveExchangeOnBehalf(teslaSwap.address);

    await teslaSwap.swapUSDCForTequila(1000000, 0);

    const sTesla = await ethers.getContractAt("IERC20", sTSLA, accounts[0]);
    teslaBalance = await sTesla.balanceOf(accounts[0].address);
    expect(teslaBalance.gt(0.0));
  });

  it("Should sell Tesla Stock", async function() {
    const accounts = await ethers.getSigners();
    const susdc = await ethers.getContractAt("IERC20", sUSD, accounts[0]);
    await susdc.approve(teslaSwap.address, ethers.BigNumber.from(1000000).mul(decimals));

    const provider = ethers.providers.Provider;
    await network.provider.send('evm_increaseTime', [60*30]);
    await network.provider.send('evm_mine', []);

    await teslaSwap.swapTequilaForUSDC(teslaBalance, 0);
    const sTesla = await ethers.getContractAt("IERC20", sTSLA, accounts[0]);
    teslaBalance = await sTesla.balanceOf(accounts[0].address);
    expect(teslaBalance.eq(0.0));
  });
});
