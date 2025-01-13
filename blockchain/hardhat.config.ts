import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const { ALCHEMI_KEY, PRIVATE_KEY } = process.env;

if (!ALCHEMI_KEY || !PRIVATE_KEY) {
  throw new Error("Missing environment variables: ALCHEMI_KEY or PRIVATE_KEY");
}

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMI_KEY}`,
      accounts: [PRIVATE_KEY!],
      gasPrice: 20000000000, // Adjust the gas price here if necessary (in wei)
    },
  },
};

export default config;