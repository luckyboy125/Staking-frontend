import { ethers } from "ethers";
import { getDefaultProvider, getSignerProvider } from "./common";
import { znxstakeAddress, znxstakeAbi } from "../config/znxstake";

var provider: any;
var signer: any;

export const deposit = async (value: any) => {
  try {
    provider = await getSignerProvider();
    signer = provider.getSigner();
    var znxStakeContract = new ethers.Contract(
      znxstakeAddress,
      znxstakeAbi,
      signer
    );
    let depositTx = await znxStakeContract.deposit({
      value: ethers.utils.parseEther(value.toString()),
    });
    return depositTx;
  } catch (error) {
    return null;
  }
};

export const getUserStakingInfo = async (address: any) => {
  try {
    provider = getDefaultProvider();
    var znxstakeContract = new ethers.Contract(
      znxstakeAddress,
      znxstakeAbi,
      provider
    );
    const getuserTx = await znxstakeContract.getUserInfo(address);
    return getuserTx;
  } catch (error) {
    console.log(error);
  }
};

export const withdraw = async () => {
  try {
    provider = await getSignerProvider();
    signer = provider.getSigner();
    var znxStakeContract = new ethers.Contract(
      znxstakeAddress,
      znxstakeAbi,
      signer
    );
    const getWithdrawTx = await znxStakeContract.withdraw();
    return getWithdrawTx;
  } catch (error) {
    return null;
  }
};
