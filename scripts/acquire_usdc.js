
const hre = require("hardhat");

const UniswapRouterV2Address = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

async function main() {
    const accounts = await ethers.getSigners();
    const uniswapRouter = await ethers.getContractAt("IUniswapV2Router", UniswapRouterV2Address, accounts[0]);

    const result = await uniswapRouter.swapExactETHForTokens(
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

    console.log(usdcBalance.toString());
    console.log(network.name)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });