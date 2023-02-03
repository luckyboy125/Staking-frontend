import chai, { expect } from "chai";
import { BigNumber, Contract, Signer } from "ethers";
import { ethers } from "hardhat";
import { solidity } from "ethereum-waffle";
import { Provider } from "@ethersproject/abstract-provider";
import { ether, getTxFee } from "./helpers/utils";
const { time } = require("@openzeppelin/test-helpers");

chai.use(solidity);

describe("StakeZNX", async function () {
  let StakeZNX;
  let stakeZNX: Contract;

  let roundCharge = ether("10");
  let totalRounds = 5;
  let totalRewards = roundCharge.mul(BigNumber.from(totalRounds));
  let roundDuration = 1800;
  let currentRound = 0;
  let roundStaked = 0;
  let investorMinCap = ether("50");
  let isStarted = false;
  let activeUsers = [];
  let owner: Signer,
    stableUser: Signer,
    seldomUser: Signer,
    followUser: Signer,
    hacker: Signer;
  let ownerAddr: string,
    stableUserAddr: string,
    seldomUserAddr: string,
    followUserAddr: string,
    hackerAddr: string;

  beforeEach(async function () {
    [owner, stableUser, seldomUser, followUser, hacker] =
      await ethers.getSigners();
    [ownerAddr, stableUserAddr, seldomUserAddr, followUserAddr, hackerAddr] =
      await Promise.all([
        owner.getAddress(),
        stableUser.getAddress(),
        seldomUser.getAddress(),
        followUser.getAddress(),
        hacker.getAddress(),
      ]);

    StakeZNX = await ethers.getContractFactory("StakeZNX");
    stakeZNX = await StakeZNX.deploy({
      value: totalRewards,
    });
    await stakeZNX.deployed();
  });

  describe("Check default values", function () {
    it("should return right constants", async function () {
      expect(await stakeZNX.roundCharge()).to.eq(roundCharge);
      expect(await stakeZNX.totalRounds()).to.eq(totalRounds);
      expect(await stakeZNX.roundDuration()).to.eq(roundDuration);
      expect(await stakeZNX.roundStaked()).to.eq(roundStaked);
      expect(await stakeZNX.isStarted()).to.eq(isStarted);
      expect((await stakeZNX.getActiveUsers()).length).to.eq(
        activeUsers.length
      );
    });
    it("should contain exact balance while transferred by constructor", async function () {
      expect(await ethers.provider.getBalance(stakeZNX.address)).to.eq(
        totalRewards
      );
    });
  });

  describe("startStaking", function () {
    it("should fail to deposit less than 50 znx", async function () {
      let value = ether("1.0");
      await expect(
        stakeZNX.deposit({
          value: value,
        })
      ).to.be.reverted;
    });
    it("should should only be able to deposit gte 50 znx", async function () {
      let value = investorMinCap;
      await expect(
        stakeZNX.deposit({
          value: value,
        })
      );
      await expect(
        stakeZNX.connect(stableUser).deposit({
          value: value,
        })
      );
    });

    it("should start by owner with deposit before start", async function () {
      let value = investorMinCap;
      await expect(
        stakeZNX.deposit({
          value: value,
        })
      );
      // let block = await ethers.provider.getBlock("latest");
      await expect(stakeZNX.startStaking()).to.emit(stakeZNX, "StakingStarted");
      // .withArgs((block.timestamp).toString());
    });

    it("should not start by owner without deposit before start", async function () {
      // let block = await ethers.provider.getBlock("latest");
      await expect(stakeZNX.startStaking()).to.be.reverted;
      // .withArgs((block.timestamp).toString());
    });

    it("should change round infoes", async function () {
      expect(await stakeZNX.isStarted()).to.eq(false);
      let value = investorMinCap;
      await expect(
        stakeZNX.deposit({
          value: value,
        })
      );
      // let block = await ethers.provider.getBlock("latest");
      await expect(stakeZNX.startStaking()).to.emit(stakeZNX, "StakingStarted");
      // .withArgs((block.timestamp).toString());
      expect(await stakeZNX.isStarted()).to.eq(true);
      expect((await stakeZNX.getRoundStatus())[0]).to.eq(1);
    });

    it("should revert by hacker", async function () {
      await expect(stakeZNX.connect(hacker).startStaking()).to.be.reverted;
    });
  });

  describe("deposit", function () {
    it("should not be able to deposit without ZNX value", async function () {
      await expect(stakeZNX.deposit()).to.be.reverted;
      await expect(stakeZNX.connect(hacker).deposit()).to.be.reverted;
    });

    it("should be able to deposit by anyone with ZNX value", async function () {
      let value = investorMinCap;
      let block = await ethers.provider.getBlock("latest");
      await expect(
        stakeZNX.deposit({
          value: value,
        })
      )
        .to.emit(stakeZNX, "Deposit")
        .withArgs(
          ownerAddr,
          currentRound,
          value.toString(),
          (block.timestamp + 1).toString()
        );
      block = await ethers.provider.getBlock("latest");
      await expect(
        stakeZNX.connect(stableUser).deposit({
          value: value,
        })
      )
        .to.emit(stakeZNX, "Deposit")
        .withArgs(
          stableUserAddr,
          currentRound,
          value.toString(),
          (block.timestamp + 1).toString()
        );
    });

    it("should increase contract balance after deposit", async function () {
      let value = investorMinCap;
      await stakeZNX.connect(stableUser).deposit({
        value: value,
      });

      expect(await ethers.provider.getBalance(stakeZNX.address)).to.eq(
        investorMinCap.add(totalRewards)
      );
    });

    it("should be reflected at nextRoundPool after deposit", async function () {
      let value = investorMinCap;
      await stakeZNX.connect(stableUser).deposit({
        value: value,
      });

      const [curRoundStake, curRoundReward, nextRoundStake, nextRoundReward] =
        await stakeZNX.getUserInfo(stableUserAddr);
      expect(curRoundStake).to.eq(investorMinCap);
      expect(curRoundReward).to.eq(0);
      expect(nextRoundStake).to.eq(investorMinCap);
      expect(nextRoundReward).to.eq(0);
    });

    it("should be added into active users after deposit", async function () {
      let value = investorMinCap;
      await stakeZNX.connect(stableUser).deposit({
        value: value,
      });
      await stakeZNX.connect(seldomUser).deposit({
        value: value,
      });
      expect(await stakeZNX.activeUsers(0)).to.eq(stableUserAddr);
      expect(await stakeZNX.activeUsers(1)).to.eq(seldomUserAddr);
    });
  });

  describe("withdraw", function () {
    let value = investorMinCap;
    let stableUserBal: BigNumber,
      seldomUserBal: BigNumber,
      followUserBal: BigNumber,
      hackerBal: BigNumber;
    let contractBalance = value.mul(BigNumber.from(4)).add(totalRewards);

    beforeEach(async function () {
      await stakeZNX.connect(stableUser).deposit({
        value: value,
      });
      await stakeZNX.connect(seldomUser).deposit({
        value: value,
      });
      await stakeZNX.connect(followUser).deposit({
        value: value,
      });
      await stakeZNX.connect(hacker).deposit({
        value: value,
      });

      stableUserBal = await ethers.provider.getBalance(stableUserAddr);
      seldomUserBal = await ethers.provider.getBalance(seldomUserAddr);
      followUserBal = await ethers.provider.getBalance(followUserAddr);
      hackerBal = await ethers.provider.getBalance(hackerAddr);
    });

    it("should be able to withdraw :: round 0", async function () {
      expect((await stakeZNX.getRoundStatus())[0]).to.eq(currentRound);

      let block = await ethers.provider.getBlock("latest");

      await expect(stakeZNX.connect(stableUser).withdraw())
        .to.emit(stakeZNX, "Withdraw")
        .withArgs(
          stableUserAddr,
          currentRound,
          value,
          (block.timestamp + 1).toString()
        );
    });
    it("contract & users balance checking after withdraw :: round 0", async function () {
      expect(await ethers.provider.getBalance(stakeZNX.address)).to.eq(
        contractBalance
      );
      let tx = await stakeZNX.connect(stableUser).withdraw();
      let txFee = await getTxFee(tx.hash);
      expect(await ethers.provider.getBalance(stakeZNX.address)).to.eq(
        contractBalance.sub(value)
      );
      expect(await ethers.provider.getBalance(stableUserAddr)).to.eq(
        stableUserBal.add(value).sub(txFee)
      );
      tx = await stakeZNX.connect(seldomUser).withdraw();
      txFee = await getTxFee(tx.hash);
      expect(await ethers.provider.getBalance(stakeZNX.address)).to.eq(
        contractBalance.sub(value.mul(BigNumber.from(2)))
      );
      expect(await ethers.provider.getBalance(seldomUserAddr)).to.eq(
        seldomUserBal.add(value).sub(txFee)
      );
      tx = await stakeZNX.connect(followUser).withdraw();
      txFee = await getTxFee(tx.hash);
      expect(await ethers.provider.getBalance(stakeZNX.address)).to.eq(
        contractBalance.sub(value.mul(BigNumber.from(3)))
      );
      expect(await ethers.provider.getBalance(followUserAddr)).to.eq(
        followUserBal.add(value).sub(txFee)
      );
      // tx = await stakeZNX.connect(hacker).withdraw();
      // txFee = await getTxFee(tx.hash);
      // expect(await ethers.provider.getBalance(stakeZNX.address)).to.eq(
      //   totalRewards
      // );
      // expect(await ethers.provider.getBalance(hackerAddr)).to.eq(
      //   hackerBal.add(value).sub(txFee)
      // );
    });

    it("contract & users balance checking after simultaneous withdraw :: round 1", async function () {
      await stakeZNX.startStaking();
      expect(await stakeZNX.roundStaked()).to.eq(value.mul(BigNumber.from(4)));
      expect((await stakeZNX.getRoundStatus())[0]).to.eq(currentRound + 1);
      const [curRoundStake, curRoundReward, nextRoundStake, nextRoundReward] =
        await stakeZNX.getUserInfo(stableUserAddr);
      expect(curRoundStake).to.eq(value);
      expect(curRoundReward).to.eq(0);
      expect(nextRoundStake).to.eq(value);
      expect(nextRoundReward).to.eq(roundCharge.div(BigNumber.from(4)));
      let tx = await stakeZNX.connect(stableUser).withdraw();
      let txFee = await getTxFee(tx.hash);
      expect(await ethers.provider.getBalance(stakeZNX.address)).to.eq(
        contractBalance.sub(value)
      );
      expect(await ethers.provider.getBalance(stableUserAddr)).to.eq(
        stableUserBal.add(value).sub(txFee)
      );
      tx = await stakeZNX.connect(seldomUser).withdraw();
      txFee = await getTxFee(tx.hash);
      expect(await ethers.provider.getBalance(stakeZNX.address)).to.eq(
        contractBalance.sub(value.mul(BigNumber.from(2)))
      );
      expect(await ethers.provider.getBalance(seldomUserAddr)).to.eq(
        seldomUserBal.add(value).sub(txFee)
      );
      tx = await stakeZNX.connect(followUser).withdraw();
      txFee = await getTxFee(tx.hash);
      expect(await ethers.provider.getBalance(stakeZNX.address)).to.eq(
        contractBalance.sub(value.mul(BigNumber.from(3)))
      );
      expect(await ethers.provider.getBalance(followUserAddr)).to.eq(
        followUserBal.add(value).sub(txFee)
      );
      // tx = await stakeZNX.connect(hacker).withdraw();
      // txFee = await getTxFee(tx.hash);
      // expect(await ethers.provider.getBalance(stakeZNX.address)).to.eq(
      //   totalRewards
      // );
      // expect(await ethers.provider.getBalance(hackerAddr)).to.eq(
      //   hackerBal.add(value).sub(txFee)
      // );
    });
  });
  describe("mix of deposit and withdraw", function () {
    let value = investorMinCap;
    let stableUserBal: BigNumber,
      seldomUserBal: BigNumber,
      followUserBal: BigNumber,
      hackerBal: BigNumber;
    let contractBalance = value.mul(BigNumber.from(4)).add(totalRewards);

    beforeEach(async function () {
      await stakeZNX.connect(stableUser).deposit({
        value: value,
      });

      await stakeZNX.connect(hacker).deposit({
        value: value,
      });

      stableUserBal = await ethers.provider.getBalance(stableUserAddr);
      hackerBal = await ethers.provider.getBalance(hackerAddr);
    });

    it("should deposit again and withdraw in round 0", async function () {
      await stakeZNX.connect(hacker).deposit({
        value: value,
      });
      let [curRoundStake, curRoundReward, nextRoundStake, nextRoundReward] =
        await stakeZNX.getUserInfo(hackerAddr);
      expect(await stakeZNX.isActiveUser(hackerAddr)).to.eq(true);
      expect(curRoundStake).to.eq(value.mul(BigNumber.from(2)));
      expect(curRoundReward).to.eq(0);
      expect(nextRoundStake).to.eq(value.mul(BigNumber.from(2)));
      expect(nextRoundReward).to.eq(0);
      await stakeZNX.connect(hacker).withdraw();
      [curRoundStake, curRoundReward, nextRoundStake, nextRoundReward] =
        await stakeZNX.getUserInfo(hackerAddr);
      expect(curRoundStake).to.eq(0);
      expect(curRoundReward).to.eq(0);
      expect(nextRoundStake).to.eq(0);
      expect(nextRoundReward).to.eq(0);
    });
    it("should have no reward when deposit again and withdraw in round 1", async function () {
      await stakeZNX.startStaking();
      expect((await stakeZNX.getRoundStatus())[0]).to.eq(1);
      await stakeZNX.connect(hacker).deposit({
        value: value,
      });
      let [curRoundStake, curRoundReward, nextRoundStake, nextRoundReward] =
        await stakeZNX.getUserInfo(hackerAddr);
      expect(curRoundStake).to.eq(value);
      expect(curRoundReward).to.eq(0);
      expect(nextRoundStake).to.eq(value.mul(BigNumber.from(2)));
      expect(nextRoundReward).to.eq(roundCharge.div(BigNumber.from(2)));
      hackerBal = await ethers.provider.getBalance(hackerAddr);

      let tx = await stakeZNX.connect(hacker).withdraw();
      let txFee = await getTxFee(tx.hash);
      [curRoundStake, curRoundReward, nextRoundStake, nextRoundReward] =
        await stakeZNX.getUserInfo(hackerAddr);
      expect(curRoundStake).to.eq(0);
      expect(curRoundReward).to.eq(0);
      expect(nextRoundStake).to.eq(0);
      expect(nextRoundReward).to.eq(0);
      expect(await ethers.provider.getBalance(stakeZNX.address)).to.eq(
        totalRewards.add(value)
      );
      expect(await ethers.provider.getBalance(hackerAddr)).to.eq(
        hackerBal.add(value.mul(BigNumber.from(2))).sub(txFee)
      );
    });

    it("should have reward deposit in round 0, 1 and withdraw in round 2, 3", async function () {
      await stakeZNX.startStaking();
      expect((await stakeZNX.getRoundStatus())[0]).to.eq(1);
      await stakeZNX.connect(hacker).deposit({
        value: value,
      });
      await time.increase(roundDuration);

      await stakeZNX.startNextRound();
      expect((await stakeZNX.getRoundStatus())[0]).to.eq(2);

      let [curRoundStake, curRoundReward, nextRoundStake, nextRoundReward] =
        await stakeZNX.getUserInfo(hackerAddr);

      expect(curRoundStake).to.eq(value.mul(BigNumber.from(2)));
      expect(curRoundReward).to.eq(roundCharge.div(BigNumber.from(2)));
      expect(nextRoundStake).to.eq(value.mul(BigNumber.from(2)));
      expect(nextRoundReward).to.eq(roundCharge.div(BigNumber.from(2)));
      // hackerBal = await ethers.provider.getBalance(hackerAddr);

      await time.increase(roundDuration);

      await stakeZNX.startNextRound();
      expect((await stakeZNX.getRoundStatus())[0]).to.eq(3);
      [curRoundStake, curRoundReward, nextRoundStake, nextRoundReward] =
        await stakeZNX.getUserInfo(hackerAddr);
      expect(curRoundStake).to.eq(value.mul(BigNumber.from(2)));
      // expect(curRoundReward).to.eq(
      //   roundCharge.mul(BigNumber.from(7)).div(BigNumber.from(6))
      // );
      // expect(nextRoundStake).to.eq(value.mul(BigNumber.from(2)));
      // expect(nextRoundReward).to.eq(
      //   roundCharge.mul(BigNumber.from(7)).div(BigNumber.from(6))
      // );
      await stakeZNX.connect(hacker).withdraw();
      [curRoundStake, curRoundReward, nextRoundStake, nextRoundReward] =
        await stakeZNX.getUserInfo(hackerAddr);
      expect(curRoundStake).to.eq(0);
      expect(curRoundReward).to.eq(0);
      expect(nextRoundStake).to.eq(0);
      expect(nextRoundReward).to.eq(0);

      await time.increase(roundDuration);

      await stakeZNX.startNextRound();
      expect((await stakeZNX.getRoundStatus())[0]).to.eq(4);
      [curRoundStake, curRoundReward, nextRoundStake, nextRoundReward] =
        await stakeZNX.getUserInfo(stableUserAddr);
      expect(curRoundStake).to.eq(value);
      expect(curRoundReward).to.eq(
        roundCharge.mul(BigNumber.from(11)).div(BigNumber.from(6))
      );
      expect(nextRoundStake).to.eq(value.mul(BigNumber.from(2)));
      expect(nextRoundReward).to.eq(
        roundCharge.mul(BigNumber.from(11)).div(BigNumber.from(6))
      );
    });
  });
  describe("start rounds", function () {
    it("should only be able to started by owner after round duration", async function () {
      let value = investorMinCap;
      await expect(
        stakeZNX.deposit({
          value: value,
        })
      );
      await time.increase(roundDuration);
      await stakeZNX.startNextRound();
      expect((await stakeZNX.getRoundStatus())[0]).to.eq(1);
    });
    it("should faile before current round fails", async function () {
      let value = investorMinCap;
      await expect(
        stakeZNX.deposit({
          value: value,
        })
      );
      await time.increase(roundDuration);
      await stakeZNX.startNextRound();
      expect((await stakeZNX.getRoundStatus())[0]).to.eq(1);
      await expect(stakeZNX.startNextRound()).to.be.reverted;
    });
    it("should fail start new round by hacker", async function () {
      let value = investorMinCap;
      await expect(
        stakeZNX.deposit({
          value: value,
        })
      );
      await time.increase(roundDuration);
      await stakeZNX.startNextRound();
      expect((await stakeZNX.getRoundStatus())[0]).to.eq(1);
      await expect(stakeZNX.connect(hacker).startNextRound()).to.be.reverted;
    });
    it("should go up to total rounds", async function () {
      let value = investorMinCap;
      await expect(
        stakeZNX.deposit({
          value: value,
        })
      );
      for (let i = 1; i <= totalRounds; i++) {
        await time.increase(roundDuration);
        await stakeZNX.startNextRound();
        expect((await stakeZNX.getRoundStatus())[0]).to.eq(i);
      }
    });
    it("should fail to go beyond total rounds", async function () {
      let value = investorMinCap;
      await expect(
        stakeZNX.deposit({
          value: value,
        })
      );
      for (let i = 1; i <= totalRounds; i++) {
        await time.increase(roundDuration);
        await stakeZNX.startNextRound();
        expect((await stakeZNX.getRoundStatus())[0]).to.eq(i);
      }
      await time.increase(roundDuration);
      await expect(stakeZNX.startNextRound()).to.be.reverted;
    });
  });
  describe("completeProgram", function () {
    it("Not be able to completeProgram before last round ends", async function () {
      let value = investorMinCap;

      expect(
        stakeZNX.deposit({
          value: value,
        })
      );
      await time.increase(roundDuration);
      await stakeZNX.startNextRound();
      expect((await stakeZNX.getRoundStatus())[0]).to.eq(1);
      await expect(stakeZNX.completeProgram()).to.be.reverted;
      await time.increase(roundDuration);
      await stakeZNX.startNextRound();
      expect((await stakeZNX.getRoundStatus())[0]).to.eq(2);
      await expect(stakeZNX.completeProgram()).to.be.reverted;
      await time.increase(roundDuration);
      await stakeZNX.startNextRound();
      expect((await stakeZNX.getRoundStatus())[0]).to.eq(3);
      await expect(stakeZNX.completeProgram()).to.be.reverted;
      await time.increase(roundDuration);
      await stakeZNX.startNextRound();
      expect((await stakeZNX.getRoundStatus())[0]).to.eq(4);
      await expect(stakeZNX.completeProgram()).to.be.reverted;
      await time.increase(roundDuration);
      await stakeZNX.startNextRound();
      expect((await stakeZNX.getRoundStatus())[0]).to.eq(5);
      await expect(stakeZNX.completeProgram()).to.be.reverted;
    });
    it("should completeProgram after last round ends by owner", async function () {
      let value = investorMinCap;
      expect(await stakeZNX.isCompletable()).to.eq(false);

      expect(
        stakeZNX.deposit({
          value: value,
        })
      );
      await time.increase(roundDuration);
      await stakeZNX.startNextRound();
      expect((await stakeZNX.getRoundStatus())[0]).to.eq(1);
      expect(await stakeZNX.isCompletable()).to.eq(false);

      await expect(stakeZNX.completeProgram()).to.be.reverted;
      await time.increase(roundDuration);
      await stakeZNX.startNextRound();
      expect((await stakeZNX.getRoundStatus())[0]).to.eq(2);
      expect(await stakeZNX.isCompletable()).to.eq(false);

      await expect(stakeZNX.completeProgram()).to.be.reverted;
      await time.increase(roundDuration);
      await stakeZNX.startNextRound();
      expect((await stakeZNX.getRoundStatus())[0]).to.eq(3);
      expect(await stakeZNX.isCompletable()).to.eq(false);

      await expect(stakeZNX.completeProgram()).to.be.reverted;
      await time.increase(roundDuration);
      await stakeZNX.startNextRound();
      expect((await stakeZNX.getRoundStatus())[0]).to.eq(4);
      expect(await stakeZNX.isCompletable()).to.eq(false);

      await expect(stakeZNX.completeProgram()).to.be.reverted;
      await time.increase(roundDuration);
      await stakeZNX.startNextRound();
      expect((await stakeZNX.getRoundStatus())[0]).to.eq(5);
      expect(await stakeZNX.isCompletable()).to.eq(false);
      await expect(stakeZNX.completeProgram()).to.be.reverted;
      await time.increase(roundDuration);
      expect(await stakeZNX.isCompletable()).to.eq(true);
      await stakeZNX.completeProgram();
    });
    it("should fail completeProgram after last round ends by hacker", async function () {
      let value = investorMinCap;

      expect(
        stakeZNX.deposit({
          value: value,
        })
      );
      await time.increase(roundDuration);
      await stakeZNX.startNextRound();
      expect((await stakeZNX.getRoundStatus())[0]).to.eq(1);
      await expect(stakeZNX.completeProgram()).to.be.reverted;
      await time.increase(roundDuration);
      await stakeZNX.startNextRound();
      expect((await stakeZNX.getRoundStatus())[0]).to.eq(2);
      await expect(stakeZNX.completeProgram()).to.be.reverted;
      await time.increase(roundDuration);
      await stakeZNX.startNextRound();
      expect((await stakeZNX.getRoundStatus())[0]).to.eq(3);
      await expect(stakeZNX.completeProgram()).to.be.reverted;
      await time.increase(roundDuration);
      await stakeZNX.startNextRound();
      expect((await stakeZNX.getRoundStatus())[0]).to.eq(4);
      await expect(stakeZNX.completeProgram()).to.be.reverted;
      await time.increase(roundDuration);
      await stakeZNX.startNextRound();
      expect((await stakeZNX.getRoundStatus())[0]).to.eq(5);
      await expect(stakeZNX.completeProgram()).to.be.reverted;
      await time.increase(roundDuration);
      await expect(stakeZNX.connect(hacker).completeProgram()).to.be.reverted;
    });
    it("should all stakers successfully withdraw after complete", async function () {
      let value = investorMinCap;
      await stakeZNX.deposit({
        value: value,
      });
      await stakeZNX.connect(stableUser).deposit({
        value: value,
      });
      await stakeZNX.connect(seldomUser).deposit({
        value: value,
      });
      await stakeZNX.connect(followUser).deposit({
        value: value,
      });
      await stakeZNX.connect(hacker).deposit({
        value: value,
      });

      await time.increase(roundDuration);

      await stakeZNX.startNextRound();

      expect((await stakeZNX.getRoundStatus())[0]).to.eq(1);
      await expect(stakeZNX.completeProgram()).to.be.reverted;
      await time.increase(roundDuration);
      await stakeZNX.startNextRound();
      expect((await stakeZNX.getRoundStatus())[0]).to.eq(2);
      await stakeZNX.connect(seldomUser).withdraw();

      await expect(stakeZNX.completeProgram()).to.be.reverted;
      await time.increase(roundDuration);
      await stakeZNX.startNextRound();
      expect((await stakeZNX.getRoundStatus())[0]).to.eq(3);
      await stakeZNX.connect(followUser).withdraw();

      await expect(stakeZNX.completeProgram()).to.be.reverted;
      await time.increase(roundDuration);
      await stakeZNX.startNextRound();
      expect((await stakeZNX.getRoundStatus())[0]).to.eq(4);
      await stakeZNX.connect(hacker).withdraw();
      await expect(stakeZNX.completeProgram()).to.be.reverted;
      await time.increase(roundDuration);
      await stakeZNX.startNextRound();
      expect((await stakeZNX.getRoundStatus())[0]).to.eq(5);
      await expect(stakeZNX.completeProgram()).to.be.reverted;
      await time.increase(roundDuration);
      await stakeZNX.completeProgram();
      await stakeZNX.connect(stableUser).withdraw();
      await stakeZNX.withdraw();
      console.log(
        "Contract Balance after all withdraw: ",
        await ethers.provider.getBalance(stakeZNX.address)
      );
    });
  });
  describe("security", function () {
    it("reentrance vulnerbility check", async function () {
      let Attacker = await ethers.getContractFactory("Attack");
      let attacker = await Attacker.deploy(stakeZNX.address, {
        value: investorMinCap,
      });
      await attacker.deployed();

      expect(await attacker.getBalance()).to.eq(investorMinCap);
      await expect(attacker.attack({ value: investorMinCap })).to.be.reverted;
    });
  });
});
10;
