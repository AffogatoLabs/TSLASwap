const hre = require("hardhat");

async function main() {
  const TeslaSwap = await hre.ethers.getContractFactory("TeslaSwap");
  const teslaSwap = await TeslaSwap.deploy(
    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" /* USDC */,
    "0x57Ab1ec28D129707052df4dF418D58a2D46d5f51" /* sUSD */,
    "0x918dA91Ccbc32B7a6A0cc4eCd5987bbab6E31e6D" /* sTSLA */,
    "0xA5407eAE9Ba41422680e2e00537571bcC53efBfD" /* Curve sUSD */,
    "0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F" /* Synthetix */,
    "0x055db9aff4311788264798356bbf3a733ae181c6" /* Balancer */
  );

  await teslaSwap.deployed();

  console.log("TeslaSwap Deployed To: ", teslaSwap.address);

  console.log(network.name);
  saveFrontendFiles(teslaSwap);
}

function saveFrontendFiles(token) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../frontend/src/contracts";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/teslaswap-address.json",
    JSON.stringify({ Token: token.address }, undefined, 2)
  );

  const TokenArtifact = artifacts.readArtifactSync("TeslaSwap");

  fs.writeFileSync(
    contractsDir + "/TeslaSwap.json",
    JSON.stringify(TokenArtifact, null, 2)
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
