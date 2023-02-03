import { createAsyncThunk } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import { web3modalInstance } from "../../hooks/common";
import { useConnectWallet } from "../../hooks/ConnectMetamask";

const setAuth = createAsyncThunk("auth/set", async (instance: any) => {
  const res = await useConnectWallet(instance);
  const payload = {
    loginAddress: res?.loginAddress,
    balance: res?.balance,
  };
  return payload;
});

const setAuthWith = createAsyncThunk(
  "authAddress/set",
  async (address: string) => {
    const instance = await web3modalInstance();
    if (instance.success) {
      const provider = new ethers.providers.Web3Provider(instance?.out);
      let balance_bignum = await provider.getBalance(address);
      const payload = {
        loginAddress: address,
        balance: Number(ethers.utils.formatUnits(balance_bignum, 18)),
      };
      return payload;
    }
  }
);

const removeAuth = createAsyncThunk("auth/remove", async () => {
  return true;
});

const setAuthMore = createAsyncThunk("auth/more", async (des: string) => {
  const payload = {
    loginAddress: des,
    balance: 0,
  };
  return payload;
});

export { setAuth, removeAuth, setAuthWith, setAuthMore };
