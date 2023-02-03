import { ethers } from "ethers";
import { CHAIN_INFO } from "../config/provider/provider";
import Web3Modal, { providers } from "web3modal";
import WalletConnect from "@walletconnect/web3-provider";

export const web3modalInstance = async () => {
  let providerOptions: any = {};
  if (!window.ethereum) {
    // providerOptions["custom-metamask"] = {
    //   display: {
    //     logo: providers.METAMASK.logo,
    //     name: "Install MetaMask",
    //     description: "Connect using browser wallet",
    //   },
    //   package: {},
    //   connector: async () => {
    //     window.open("https://metamask.io");
    //     throw new Error("MetaMask not installed");
    //   },
    // };
    providerOptions = {
      // walletlink: {
      //   package: CoinbaseWalletSDK, // Required
      //   options: {
      //     appName: "Web 3 Modal Demo", // Required
      //     infuraId: process.env.INFURA_KEY, // Required unless you provide a JSON RPC url; see `rpc` below
      //   },
      // },
      walletconnect: {
        package: WalletConnect, // required
        options: {
          infuraId: process.env.INFURA_KEY, // required
        },
      },
    };
  }

  const web3Modal = new Web3Modal({
    // network: "mainnet", // optional
    cacheProvider: true, // optional
    providerOptions, // required,
    // theme: {
    //   background: "rgb(39, 49, 56)",
    //   main: "rgb(199, 199, 199)",
    //   secondary: "rgb(136, 136, 136)",
    //   border: "rgba(195, 195, 195, 0.14)",
    //   hover: "rgb(16, 26, 32)",
    // },
  });

  try {
    const instance = await web3Modal.connect();
    const res = {
      success: true,
      out: instance,
    };
    return res;
  } catch (error: any) {
    const res = {
      success: false,
      out: error.message,
    };
    return res;
  }
};

export const getDefaultProvider = () => {
  let provider: any;
  provider = new ethers.providers.JsonRpcProvider(
    CHAIN_INFO.TESTNET.rpcUrls[0]
  );
  return provider;
};

export const getSignerProvider = async () => {
  let provider: any;
  const providerItem = await web3modalInstance();
  if (providerItem?.success !== false) {
    provider = new ethers.providers.Web3Provider(providerItem?.out);
    return provider;
  }
};
