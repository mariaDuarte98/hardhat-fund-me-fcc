const { network } = require("hardhat")
const {
    developmentChains,
    DECIMALS,
    INITIAL_ANWSER,
} = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    if (developmentChains.includes(network.name)) {
        log("Local Network detected! Deploying mocks...")
        await deploy("MockV3Aggregator", {
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_ANWSER],
        })
        log("Mock Deployed")
    }
    log("---------------------------------------------------")
}

module.exports.tags = ["all", "mocks"]
