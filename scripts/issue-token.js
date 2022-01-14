//use of scripts is to run it thorugh the command lien itself, you don't have to open the console everytime.

const TokenFarm = artifacts.require('TokenFarm')

module.exports = async function(callback){
  let tokenFarm = await TokenFarm.deployed()
  await tokenFarm.issueTokens()

  //code goes here..
  console.log("Tokens issued")
  callback()
}