import { ethers } from "hardhat";
const { time } = require("@openzeppelin/test-helpers");

export const ether = (value: string) => {
  return ethers.utils.parseEther(value);
};

export const getTxFee = async (txHash: string) => {
  let receipt = await ethers.provider.getTransactionReceipt(txHash);
  let txFee = receipt.cumulativeGasUsed.mul(receipt.effectiveGasPrice);
  return txFee;
};

// Returns the time of the last mined block in seconds
export const latestTime = async () => {
  let block = await ethers.provider.getBlock("latest");
  return block.timestamp;
};

/**
 * Beware that due to the need of calling two separate ganache methods and rpc calls overhead
 * it's hard to increase time precisely to a target point so design your test to tolerate
 * small fluctuations from time to time.
 *
 * @param target time in seconds
 */
async function increaseTimeTo(target: number) {
  let now = await latestTime();
  if (target < now)
    throw Error(
      `Cannot increase current time(${now}) to a moment in the past(${target})`
    );
  let diff = target - now;
  await time.increase(diff);
}
