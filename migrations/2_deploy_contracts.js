const DappToken = artifacts.require('DappToken')
const DaiToken = artifacts.require('DaiToken')
const TokenFarm = artifacts.require('TokenFarm')

module.exports = async function(deployer,network,accounts) {

  //deploy DaiToken to the ganache blockchain network
  await deployer.deploy(DaiToken)
  const daiToken = await DaiToken.deployed()

  //deploy DappToken
  await deployer.deploy(DappToken)
  const dappToken = await DappToken.deployed()

  //Deploy TokeFarm
  await deployer.deploy(TokenFarm, daiToken.address, dappToken.address)
  const tokenFarm = await TokenFarm.deployed()

  //Transfer all the dapp to tokenfarm (1million),
  // there's no decimal in etherium and 18 decimal places so 1 dapp = 1000000000000000000dapp= 1.000.....

  await dappToken.transfer(tokenFarm.address, '1000000000000000000000000')

  //deploy 100 dai tokens to the first investor
  await daiToken.transfer(accounts[1], '100000000000000000000')
}
