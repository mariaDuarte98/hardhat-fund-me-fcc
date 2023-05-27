const { deployments, ethers, getNamedAccounts } = require("hardhat")
const { assert, expect } = require("chai")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", async function () {
          let fundMe
          let deployer
          let mockV3Aggregator
          const sendValue = ethers.utils.parseEther("1")
          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer
              await deployments.fixture(["all"])
              fundMe = await ethers.getContract("FundMe", deployer)
              mockV3Aggregator = await ethers.getContract(
                  "MockV3Aggregator",
                  deployer
              )
          })

          describe("constructor", async function () {
              it("sets the aggregator constructor corretly", async function () {
                  const response = await fundMe.getPriceFeed()
                  assert.equal(response, mockV3Aggregator.address)
              })
          })

          describe("fund", async function () {
              it("fails if you dont send enough eth", async function () {
                  await expect(fundMe.fund()).to.be.revertedWith(
                      "You need to spend more ETH!"
                  )
              })

              it("Updated the amount funded data structure", async function () {
                  await fundMe.fund({ value: sendValue })
                  const response = await fundMe.getaddressToAmountFunded(
                      deployer
                  )
                  assert.equal(response.toString(), sendValue.toString())
              })

              it("Adds funders to an array of funders", async function () {
                  await fundMe.fund({ value: sendValue })
                  const funder = await fundMe.getFunder(0)
                  assert.equal(funder, deployer)
              })
          })

          describe("withdraw", async function () {
              beforeEach(async function () {
                  await fundMe.fund({ value: sendValue })
              })

              it("Withdraw ETH from a single funder", async function () {
                  const startFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  const startDeployerBalance = await fundMe.provider.getBalance(
                      deployer
                  )

                  const transactionResponse = await fundMe.withdraw()
                  const transactionReceipt = await transactionResponse.wait(1)
                  const { gasUsed, effectiveGasPrice } = transactionReceipt
                  const gasCost = gasUsed.mul(effectiveGasPrice)

                  const endFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  const endDeployerBalance = await fundMe.provider.getBalance(
                      deployer
                  )

                  await assert.equal(endFundMeBalance, 0)
                  await assert.equal(
                      endDeployerBalance.add(gasCost).toString(),
                      startDeployerBalance.add(startFundMeBalance).toString()
                  )
                  // how to get gascost need debug 11:30:48
              })

              it("single cheaper", async function () {
                  const startFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  const startDeployerBalance = await fundMe.provider.getBalance(
                      deployer
                  )

                  const transactionResponse = await fundMe.cheaperWithdraw()
                  const transactionReceipt = await transactionResponse.wait(1)
                  const { gasUsed, effectiveGasPrice } = transactionReceipt
                  const gasCost = gasUsed.mul(effectiveGasPrice)

                  const endFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  const endDeployerBalance = await fundMe.provider.getBalance(
                      deployer
                  )

                  await assert.equal(endFundMeBalance, 0)
                  await assert.equal(
                      endDeployerBalance.add(gasCost).toString(),
                      startDeployerBalance.add(startFundMeBalance).toString()
                  )
                  // how to get gascost need debug 11:30:48
              })

              it("allow us to withdraw with multiple funders", async function () {
                  const accounts = await ethers.getSigners()
                  for (let i = 1; i < 6; i += 1) {
                      const fundMeConnecedContract = await fundMe.connect(
                          accounts[i]
                      )
                      await fundMeConnecedContract.fund({ value: sendValue })
                  }

                  const startFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  const startDeployerBalance = await fundMe.provider.getBalance(
                      deployer
                  )

                  const transactionResponse = await fundMe.withdraw()
                  const transactionReceipt = await transactionResponse.wait(1)
                  const { gasUsed, effectiveGasPrice } = transactionReceipt
                  const gasCost = gasUsed.mul(effectiveGasPrice)

                  const endFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  const endDeployerBalance = await fundMe.provider.getBalance(
                      deployer
                  )

                  await assert.equal(endFundMeBalance, 0)
                  await assert.equal(
                      endDeployerBalance.add(gasCost).toString(),
                      startDeployerBalance.add(startFundMeBalance).toString()
                  )
                  // how to get gascost need debug 11:30:48

                  await expect(fundMe.getFunder(0)).to.be.reverted
                  for (let i = 1; i < 6; i += 1) {
                      await assert.equal(
                          await fundMe.getaddressToAmountFunded(
                              accounts[i].address
                          ),
                          0
                      )
                  }
              })

              it("cheaper", async function () {
                  const accounts = await ethers.getSigners()
                  for (let i = 1; i < 6; i += 1) {
                      const fundMeConnecedContract = await fundMe.connect(
                          accounts[i]
                      )
                      await fundMeConnecedContract.fund({ value: sendValue })
                  }

                  const startFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  const startDeployerBalance = await fundMe.provider.getBalance(
                      deployer
                  )

                  const transactionResponse = await fundMe.cheaperWithdraw()
                  const transactionReceipt = await transactionResponse.wait(1)
                  const { gasUsed, effectiveGasPrice } = transactionReceipt
                  const gasCost = gasUsed.mul(effectiveGasPrice)

                  const endFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  const endDeployerBalance = await fundMe.provider.getBalance(
                      deployer
                  )

                  await assert.equal(endFundMeBalance, 0)
                  await assert.equal(
                      endDeployerBalance.add(gasCost).toString(),
                      startDeployerBalance.add(startFundMeBalance).toString()
                  )
                  // how to get gascost need debug 11:30:48

                  await expect(fundMe.getFunder(0)).to.be.reverted
                  for (let i = 1; i < 6; i += 1) {
                      await assert.equal(
                          await fundMe.getaddressToAmountFunded(
                              accounts[i].address
                          ),
                          0
                      )
                  }
              })

              it("only allows owner to withdraw", async function () {
                  const accounts = await ethers.getSigners()
                  const attacker = accounts[1]
                  const attackerConnecedContract = await fundMe.connect(
                      attacker
                  )
                  await expect(
                      attackerConnecedContract.withdraw()
                  ).to.be.revertedWith("FundMe_NotOwner")
              })
          })
      })
