// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title StakeZNX
 * @dev Let the ZNX owners to stake ZNX and make profit by getting reward as ZNX
 *      - The source of reward is from Zilionixx foundation to provide incentive and let the early owners to get benefit from that.
 *      - To get rewards, investors have to take part in fully at least one round
 *        This means that you can take your reward after 2 rounds you have deposited.
 *      - Each round take same period each and will be  charged same amount
 *      - Each investor can deposit and withdraw their investment and reward at any time
 *      - The reward amount is calculated in a linear proportion according to the total amount invested in the round to the amount invested in the round.
 *          My Round reward = My Round Investment * Round Charged Amount / Total Round investment
 *      - This staking will only last upto certain rounds. (i.e; up to 100 rounds)
 */

struct User {
    uint256 stakeAmount; // stake amount in round
    uint256 rewardAmount; // reward until current round
}

struct RoundPool {
    mapping(address => User) users;
    uint256 roundIndex;
    uint256 startTime;
}

contract StakeZNX is Ownable, ReentrancyGuard {
    using SafeMath for uint256;

    /**********************************************************************************************************/
    /*                                                                                                        */
    /*                                               STORAGE                                                  */
    /*                                                                                                        */
    /**********************************************************************************************************/
    uint256 public roundCharge = 10 ether;
    uint256 public totalRounds = 5;
    uint256 public claimedReward = 0; // withdrawed reward until now
    uint256 public roundDuration = 1800; // 8 hours in second
    address[] public activeUsers;
    address[] public roundUsers;
    RoundPool public currentRoundPool;
    RoundPool public nextRoundPool; // user's new deposit applys till next round
    bool public isStarted; // shows if staking program is started
    bool public isCompleted; // shows if staking program is completed
    uint256 public roundStaked; // round staked amount that is used for reward calculation
    uint256 public roundStaking; // round staking amount
    uint256 public totalStaked; // total staked amount - totalStaked = roundStaking + depositsDuringThisRound
    uint256 public investorMinCap = 50 ether; // users should stake more than investorMinCap

    /**********************************************************************************************************/
    /*                                                                                                        */
    /*                                                EVENTS                                                  */
    /*                                                                                                        */
    /**********************************************************************************************************/
    event StakingStarted(uint256 startTime);
    event RoundStarted(uint256 round, address[] roundUsers, uint256 roundStartTime, uint256 remainingReward);
    event RoundEnded(uint256 indexed round, address[] roundUsers, uint256 timestamp, uint256 roundStaked, uint256 remainingReward);
    event Deposit(address indexed user, uint256 indexed round, uint256 amount, uint256 timestamp);
    event Withdraw(address indexed user, uint256 indexed round, uint256 amount, uint256 timestamp);
    event UserAdded(address indexed user);
    event UserRemoved(address indexed user);
    event RoundUserAdded(address indexed user, uint256 roundIndex); // user added at roundIndex
    event RoundUserRemoved(address indexed user, uint256 roundIndex); // user removed at roundIndex

    constructor() payable {
        require(msg.value == roundCharge * totalRounds, "StakeZNX#constructor: Not exact msg.value");
    }


    /**********************************************************************************************************/
    /*                                                                                                        */
    /*                                              MODIFIERS                                                 */
    /*                                                                                                        */
    /**********************************************************************************************************/
    modifier whenStartable {
        require(currentRoundPool.startTime == 0 || block.timestamp - currentRoundPool.startTime > roundDuration, "StakeZNX: Not able to start next round yet.");
        require(currentRoundPool.roundIndex < totalRounds, "StakeZNX: Last round, not able to start.");
        _;
    }

    modifier whenCompletable {
        require(isCompletable(), "StakeZNX: Not completable yet.");
        _;
    }

    /**********************************************************************************************************/
    /*                                                                                                        */
    /*                                           GETTER FUNCTIONS                                             */
    /*                                                                                                        */
    /**********************************************************************************************************/


    function getActiveUsers() public view returns (address[] memory _activeUsers) {
        return activeUsers;
    }

    function getRoundUsers() public view returns (address[] memory _roundUsers) {
        return roundUsers;
    }

    function isCompletable() public view returns (bool) {
        if (block.timestamp - currentRoundPool.startTime > roundDuration && currentRoundPool.roundIndex == totalRounds) {
            return true;
        }
        return false;
    }

    function getRoundStatus() public view returns (uint256 _currentRound, bool _isActive, uint256 _startTime) {
        if (block.timestamp - currentRoundPool.startTime > roundDuration) {
            _isActive = false;
        } else {
            _isActive = true;
        }
        return (currentRoundPool.roundIndex, _isActive, currentRoundPool.startTime);
    }

    function getUserInfo(address _user) public view returns (uint256 _currentStakeAmount, uint256 _currentRewardAmount, uint256 _nextStakeAmount, uint256 _nextRewardAmount, uint256 _roundRewardEstimation){
        if (roundStaking == 0) {
            return (currentRoundPool.users[_user].stakeAmount, currentRoundPool.users[_user].rewardAmount, nextRoundPool.users[_user].stakeAmount, nextRoundPool.users[_user].rewardAmount, 0);
        }
        return (currentRoundPool.users[_user].stakeAmount, currentRoundPool.users[_user].rewardAmount, nextRoundPool.users[_user].stakeAmount, nextRoundPool.users[_user].rewardAmount, currentRoundPool.users[_user].stakeAmount.mul(roundCharge).div(roundStaking));
    }

    function isActiveUser(address _user) public view returns (bool _isActiveUser) {
        for (uint256 i=0; i < activeUsers.length; i++) {
            if (_user == activeUsers[i]) {return true;}
        }
        return false;
    }

    function exist(address[] memory users, address user) public pure returns(bool _isExist) {
        for (uint i=0; i < users.length; i++) {
            if (user == users[i]) {
                return true;
            }
        }
        return false;
    }

    /**********************************************************************************************************/
    /*                                                                                                        */
    /*                                           SETTER FUNCTIONS                                             */
    /*                                                                                                        */
    /**********************************************************************************************************/
    function startStaking() external onlyOwner {
        require(!isStarted, "StakeZNX: Already started");
        isStarted = true;
        emit StakingStarted(block.timestamp);
        _rebaseNextRound();
    }

    function startNextRound() external onlyOwner whenStartable {
        _rebaseNextRound();
    }

    function completeProgram() external onlyOwner whenCompletable {
        _calcNextRoundInfo();
        isCompleted = true;
    }

    function _rebaseNextRound() internal {
        _calcNextRoundInfo();
        _startNewRound();
    }

    function _calcNextRoundInfo() internal {
        roundStaked = 0;
        roundStaking = 0;
        uint256 claimableUsersIndex = 0;
        address[] memory claimableUsers = new address[](activeUsers.length);
        for (uint256 i=0; i < activeUsers.length; i++) {
            address user = activeUsers[i];
            roundStaked += currentRoundPool.users[user].stakeAmount + currentRoundPool.users[user].rewardAmount;
            if (currentRoundPool.users[user].stakeAmount > 0) {
                claimableUsers[claimableUsersIndex] = user;
                claimableUsersIndex++;
            }
        }


        require(roundStaked > 0, "StakeZNX: Nobody staked in this round");
        for (uint256 i=0; i < activeUsers.length; i++) {
            address user = activeUsers[i];

            uint256 userRoundReward;
            userRoundReward = (currentRoundPool.users[user].stakeAmount + currentRoundPool.users[user].rewardAmount).mul(roundCharge).div(roundStaked);
            nextRoundPool.users[user].rewardAmount = currentRoundPool.users[user].rewardAmount + userRoundReward;
            currentRoundPool.users[user].stakeAmount = nextRoundPool.users[user].stakeAmount;
            if (currentRoundPool.roundIndex > 0) {
                currentRoundPool.users[user].rewardAmount = nextRoundPool.users[user].rewardAmount;
            }
            
            // next round staking amount
            roundStaking += currentRoundPool.users[user].stakeAmount;
            require(roundStaking > 0, "StakeZNX: Nobody staking in this round");
            // check if newly added user
            if (!exist(roundUsers, user)) {
                roundUsers.push(user);
                emit RoundUserAdded(user, currentRoundPool.roundIndex);
            }
        }
        emit RoundEnded(currentRoundPool.roundIndex, claimableUsers, block.timestamp, roundStaked, roundCharge * totalRounds - claimedReward);

    }

    function _startNewRound() internal {
        currentRoundPool.startTime = block.timestamp;
        currentRoundPool.roundIndex++;
        emit RoundStarted(currentRoundPool.roundIndex, roundUsers, currentRoundPool.startTime, roundCharge * totalRounds - claimedReward);
    }

    function deposit() public payable {
        require(msg.value >= investorMinCap, "StakeZNX: msg.value should be gt investor min cap");
        if (currentRoundPool.roundIndex == 0) {

            currentRoundPool.users[_msgSender()].stakeAmount += msg.value;
            // next round staking amount
            roundStaking += currentRoundPool.users[_msgSender()].stakeAmount;
        }
        nextRoundPool.users[_msgSender()].stakeAmount += msg.value;
        emit Deposit(_msgSender(), currentRoundPool.roundIndex, msg.value, block.timestamp);
        if (!isActiveUser(_msgSender())) {
            activeUsers.push(_msgSender());
            emit UserAdded(_msgSender());
        }
        totalStaked += msg.value;

    }


    function _deleteUser(address _user) internal returns (bool _successDel){
        for (uint256 i=0; i < activeUsers.length; i++) {
            if (_user == activeUsers[i]) {
                activeUsers[i] = activeUsers[activeUsers.length - 1];
                activeUsers.pop();
                emit UserRemoved(_user);
                return true;
            }
        }
        return false;
    }
    
    function _deleteRoundUser(address _user) internal returns (bool _successDel){
        for (uint256 i=0; i < roundUsers.length; i++) {
            if (_user == roundUsers[i]) {
                roundUsers[i] = roundUsers[roundUsers.length - 1];
                roundUsers.pop();
                emit RoundUserRemoved(_user, currentRoundPool.roundIndex);
                return true;
            }
        }
        return false;
    }

    function withdraw() public nonReentrant {
        require(_deleteUser(_msgSender()), "StakeZNX: Not an active user");
        if(exist(roundUsers, _msgSender())) {
            require(_deleteRoundUser(_msgSender()), "StakeZNX: Failed to remove from roundUsers");
        }
        if (currentRoundPool.roundIndex < totalRounds) {
            if (currentRoundPool.roundIndex == 0) {
                require(activeUsers.length > 0, "StakeZNX: Last user can only withdraw at last round");
            } else {
                require(activeUsers.length > 0 && roundUsers.length > 0, "StakeZNX: Last user can only withdraw at last round");
            }
        }
        uint256 withdrawAmount;
        claimedReward += currentRoundPool.users[_msgSender()].rewardAmount;
        if (nextRoundPool.users[_msgSender()].stakeAmount > 0) {
            totalStaked = totalStaked.sub(nextRoundPool.users[_msgSender()].stakeAmount);
            roundStaking = roundStaking.sub(currentRoundPool.users[_msgSender()].stakeAmount); 

            withdrawAmount = nextRoundPool.users[_msgSender()].stakeAmount + currentRoundPool.users[_msgSender()].rewardAmount;
            nextRoundPool.users[_msgSender()].stakeAmount = 0;
            nextRoundPool.users[_msgSender()].rewardAmount = 0;
            currentRoundPool.users[_msgSender()].stakeAmount = 0;
            currentRoundPool.users[_msgSender()].rewardAmount = 0;
        } else {
            totalStaked = totalStaked.sub(currentRoundPool.users[_msgSender()].stakeAmount);
            roundStaking = roundStaking.sub(currentRoundPool.users[_msgSender()].stakeAmount); 

            withdrawAmount = currentRoundPool.users[_msgSender()].stakeAmount + currentRoundPool.users[_msgSender()].rewardAmount;
            nextRoundPool.users[_msgSender()].rewardAmount = 0;
            currentRoundPool.users[_msgSender()].stakeAmount = 0;
            currentRoundPool.users[_msgSender()].rewardAmount = 0;
        }

        require(withdrawAmount > 0, "StakeZNX: Nothing to withdraw");
        (bool success, ) = payable(_msgSender()).call{value: withdrawAmount}("");
        require(success, "StakeZNX: Withdraw failed");
        emit Withdraw(_msgSender(), currentRoundPool.roundIndex, withdrawAmount, block.timestamp);
    }
}