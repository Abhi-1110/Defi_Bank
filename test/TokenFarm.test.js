const { assert } = require('chai')
const { default: Web3 } = require('web3')
const _deploy_contracts = require('../migrations/2_deploy_contracts')

const DappToken = artifacts.require('DappToken')
const DaiToken = artifacts.require('DaiToken')
const TokenFarm = artifacts.require('TokenFarm')

require('chai')
.use(require('chai-as-promised'))
.should()

function tokens(n) {
    return web3.utils.toWei(n,'ether')
}

contract('TokenFarm', ([owner, investor]) => {
    let daiToken, dappToken, tokenFarm
    
    before(async() => {
        //load contracts
        daiToken = await DaiToken.new()
        dappToken = await DappToken.new()
        tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address)
        //Transfer all dapps to tokenfarm(1mil)
        await dappToken.transfer(tokenFarm.address, tokens('1000000'))
        //transfer daitokens to the investor
        await daiToken.transfer(investor, tokens('100'), {from: owner})

    })
    //write tests here..
    describe('Mock DAI deployment', async () => {
        it('has a name', async () => {
            const name= await daiToken.name()
            assert.equal(name, 'Mock DAI Token')
        })
    })
    describe('Dapp Token deployment', async () => {
        it('has a name', async () => {
            const name= await dappToken.name()
            assert.equal(name, 'DApp Token')
        })
    })
    describe('Token farm deployment', async () => {
        it('has a name', async () => {
            const name= await tokenFarm.name()
            assert.equal(name, 'Dapp token farm')
        })
    })
    it('contract has tokens', async() => {
        let balance = await dappToken.balanceOf(tokenFarm.address)
        assert.equal(balance.toString(), tokens('1000000'))
    })


    describe('Farming Tokens', async()=>{

        it('rewards tokens for staking mDai tokens', async() => {
            let result

        //check investor balance before staking
        result = await daiToken.balanceOf(investor)
        assert.equal(result.toString(), tokens('100'), 'investor mock Dai wallet balance correct before staking')

        //stake mock Dai tokens
        await daiToken.approve(tokenFarm.address, tokens('100'), { from: investor})
        await tokenFarm.stakeTokens(tokens('100'), {from: investor})

        //check staking results
        result = await daiToken.balanceOf(investor)
        assert.equal(result.toString(), tokens('0'), 'investor mockDai token correct after staking')

        result = await daiToken.balanceOf(tokenFarm.address)
        assert.equal(result.toString(), tokens('100'), 'token Farm mock Dai address correct after staking')

        result = await tokenFarm.stakingBalance(investor)
        assert.equal(result.toString(), tokens('100'), 'investor staking bal correct after staking')

        result = await tokenFarm.isStaking(investor)
        assert.equal(result.toString(), 'true', 'investor staking status correct after staking') 

        //issue tokens
        await tokenFarm.issueTokens({from: owner})

        //check balance after issuance
        result= await dappToken.balanceOf(investor)
        assert.equal(result.toString(), tokens('100'), 'investor Dapp token wallet bal. correct after issuance')

        //ensure that only owner can issue tokens
        await tokenFarm.issueTokens({from: investor}).should.be.rejected;

        //unstake tokens
        await tokenFarm.unstakeTokens({from:investor})

        //check results after unstaking
        result = await daiToken.balanceOf(investor)
        assert.equal(result.toString(), tokens('100'), 'investor mockDai token correct after unstaking')

        result = await daiToken.balanceOf(tokenFarm.address)
        assert.equal(result.toString(), tokens('0'), 'token Farm mock Dai address correct after unstaking')

        result = await tokenFarm.stakingBalance(investor)
        assert.equal(result.toString(), tokens('0'), 'investor staking bal correct after unstaking')

        result = await tokenFarm.isStaking(investor)
        assert.equal(result.toString(), 'false', 'investor staking status correct after unstaking') 


        })
    })








})
