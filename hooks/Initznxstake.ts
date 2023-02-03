import { ethers } from "ethers";
import { znxstakeAddress, znxstakeAbi } from "../config/znxstake";
import { getDefaultProvider } from "./common";

const provider = getDefaultProvider();

const znxstakeContract = new ethers.Contract(
  znxstakeAddress,
  znxstakeAbi,
  provider
);

export const useInitZnxStake = async () => {
  var promises = [];
  promises.push(znxstakeContract.getActiveUsers());
  promises.push(znxstakeContract.getRoundStatus());
  promises.push(znxstakeContract.roundStaking());
  promises.push(znxstakeContract.roundDuration());
  promises.push(znxstakeContract.totalRounds());
  promises.push(znxstakeContract.totalStaked());
  promises.push(znxstakeContract.getRoundUsers());
  promises.push(znxstakeContract.investorMinCap());
  let filterPurchased = znxstakeContract.filters.StakingStarted();
  let logsFrom = await znxstakeContract.queryFilter(
    filterPurchased,
    -10000,
    "latest"
  );
  if (logsFrom.length >0 ) {
    promises.push(logsFrom[0]?.args);
  }
  const txPromises = await Promise.all(promises);

  const StakeInfo = {
    activeUsers: txPromises[0],
    currentRound: txPromises[1][0].toString(),
    roundStart: txPromises[1][2].toString(),
    roundStaked: txPromises[2].toString(),
    roundDuration: txPromises[3].toString(),
    totalRounds: txPromises[4].toString(),
    totalStaked: txPromises[5].toString(),
    roundUsers: txPromises[6],
    minCap: txPromises[7].toString(),
    stakingStart: txPromises[8]?.startTime.toString() || "0",
  };
  return StakeInfo;
};
