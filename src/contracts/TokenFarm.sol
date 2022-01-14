pragma solidity >=0.5.0;
// SPDX-License-Identifier: MIT
import "./DaiToken.sol";
import "./DappToken.sol";

contract TokenFarm{
// the code
 string public name = "Dapp token farm";
 address public owner;
 DappToken public dappToken;
 DaiToken public daiToken;

 address[] public stakers;
 mapping(address => uint) public stakingBalance;
 mapping(address => bool) public hasStaked;
 mapping(address => bool) public isStaking;

 constructor(DaiToken _daiToken, DappToken _dappToken ) public{
     dappToken= _dappToken;
     daiToken= _daiToken;
     owner=msg.sender;
 }
 // 1. staking tokens(invest)
     function stakeTokens(uint _amount) public{
         
         require (_amount>0,"ammount cannot be 0");
         //msg.sender is the address of the one who triggers this function, bascially the investor
         // address(this) is the address of TokenFarm, teh smartcontract. SO the money is gonna stay in the app itself
         // but in real world it goes in for investing.
         daiToken.transferFrom(msg.sender, address(this), _amount);

         //update staking balance
         stakingBalance[msg.sender]= stakingBalance[msg.sender] + _amount;
         // add to stakers list only if it hasn't been added before.
         if(!hasStaked[msg.sender]){
             stakers.push(msg.sender);
         }
         //update staking status
         isStaking[msg.sender]= true;
         hasStaked[msg.sender]= true;
         }
     //unstaking tokens(withdraw)
     function unstakeTokens() public {
         //Fetch staking balance
         uint balance = stakingBalance[msg.sender];

         require(balance>0,"staking balance cannot be greater than 0");
         //transfer the balance
         daiToken.transfer(msg.sender, balance);
         //update staking balance
         stakingBalance[msg.sender]=0;
         //update status
         isStaking[msg.sender] = false;
     }
     //issuing tokens(issue dapp by the owner of the contract, we'll set that up)
     function issueTokens() public {
         //only owner can call this func.
         require(msg.sender == owner, "caller must be the owner");

         //issue tokens to all stakers
         for(uint i=0; i<stakers.length ; i++){
             address recipient = stakers[i];
             uint balance = stakingBalance[recipient];
             if(balance>0){
                 dappToken.transfer(recipient, balance);
             }
         }
     }





}
