import { ethers } from "hardhat";

async function main() {
    const token = await ethers.deployContract("Certify");
    console.log("Deployed Contract Address:", await token.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});