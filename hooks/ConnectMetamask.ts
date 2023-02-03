import { CHAIN_INFO } from "../config/provider/provider";
import { ethers } from "ethers";
import { web3modalInstance } from "./common";

var provider: any;
var signer: any;
var loginAddress: string = "";
var balance: string = "";
let data_res = {
  loginAddress: "",
  balance: "0",
};

export const useConnectWallet = async (instance: any) => {
  provider = new ethers.providers.Web3Provider(instance);
  const chainId = (await provider.getNetwork()).chainId;
  let znxChainId: number = parseInt(CHAIN_INFO.TESTNET.chainId, 16);

  signer = provider.getSigner();
  loginAddress = await signer.getAddress();
  let balance_bignum = await provider.getBalance(loginAddress);
  balance = ethers.utils.formatUnits(balance_bignum, 18);
  if (window.ethereum) {
    if (chainId !== znxChainId) {
      await switchNetwork();
    }
    data_res = {
      loginAddress: loginAddress,
      balance: balance.toString(),
    };
    return data_res;
  } else {
    window.alert("Provider error");
  }
};

export const switchNetwork = async () => {
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: CHAIN_INFO.TESTNET.chainId }],
    });
    // switch provider and signer to zilionixx network
    await getSignerAndAddress();
  } catch (switchError: any) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902 || switchError.code === 32603) {
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: CHAIN_INFO.TESTNET.chainId,
              chainName: CHAIN_INFO.TESTNET.chainName,
              rpcUrls: CHAIN_INFO.TESTNET.rpcUrls /* ... */,
            },
          ],
        });

        // switch provider and signer to zilionixx network
        await getSignerAndAddress();
      } catch (addError) {
        // handle "add" error
        window.alert(
          "Can not add Zilionixx network. Please add Zilionixx network manually."
        );
      }
    }
    // handle other "switch" errors
  }
};

const getSignerAndAddress = async () => {
  const instance = await web3modalInstance();
  if (instance?.success) {
    provider = new ethers.providers.Web3Provider(instance?.out);
    signer = provider.getSigner();
    loginAddress = await signer.getAddress();
    let balance_bignum = await provider.getBalance(loginAddress);
    balance = ethers.utils.formatUnits(balance_bignum, 18);
  }
};
