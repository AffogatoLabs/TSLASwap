In order to compile contracts first do an 
```
npm install
```
in this directory.
After this set up a .env file in this directory with your provider, 
example:
```
MAINNET_NODE_URL=https://infura.io
```

Now you are ready to compile and deploy. In order to set up your local chain first run
```
npx hardhat node
```
then you can run
```
npx hardhat run ./scripts/deploy_test.js --network localhost
```
In order to compile, deploy, and generate relevant artifacts.
You can now launch the front end by going into the frontend folder and running 
```
npm install
npm start
```

If you want to acquire test USDC you can run 
```
npx hardhat run ./scripts/acquire_usdc.js --network localhost
```