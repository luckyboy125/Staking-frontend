import React, { useEffect } from "react";
import UserStakingInfo from "./UserStakingInfo/UserStakingInfo";
import UserStakingInput from "./UserStakingInput/UserStakingInput";
import CurrentRound from "./CurrentRound/CurrentRound";
import StakingInfo from "./StakingInfo/StakingInfo";
import PromoterLink from "./PromoterLink/PromoterLink";
import Faq from "./Faq/Faq";
import TopStakers from "./TopStakers/TopStakers";
import ContractInfo from "./ContractInfo/ContractInfo";
import { useAppDispatch } from "../../store/hooks";
import { showSpinner } from "../../store/spinner";
import {
  removeAuth,
  setAuth,
  setAuthMore,
  setAuthWith,
} from "../../store/auth";
import { setStakinginfo } from "../../store/initstakinginfo";
import { Grid } from "@material-ui/core";
import BuyZNX from "./BuyZNX/BuyZNX";
import { CHAIN_INFO } from "../../config/provider/provider";
import { showNetModal } from "../../store/netmodal";
import { ethers } from "ethers";
import { web3modalInstance } from "../../hooks/common";
import { showAlert } from "../../store/alert";
import { walletConnectError } from "../../common/constant";

const Container = () => {
  const dispatch = useAppDispatch();

  const initSet = async () => {
    await dispatch(showSpinner(true));
    await dispatch(setStakinginfo());
    await dispatch(showSpinner(false));
    const instance = await web3modalInstance();
    if (instance?.success) {
      await dispatch(setAuth(instance?.out));
      const provider = new ethers.providers.Web3Provider(instance?.out);
      const chainId = (await provider.getNetwork()).chainId;
      let znxChainId: number = parseInt(CHAIN_INFO.TESTNET.chainId, 16);
      if (chainId === znxChainId) {
        dispatch(showNetModal(false));
      } else {
        dispatch(showNetModal(true));
      }
      instance?.out.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          dispatch(setAuthWith(accounts[0]));
        } else {
          dispatch(removeAuth());
        }
      });

      // Subscribe to chainId change
      instance?.out.on("chainChanged", (chainId: number) => {
        console.log("chain change");
        if (
          parseInt(chainId.toString(), 16) !==
          parseInt(CHAIN_INFO.TESTNET.chainId, 16)
        ) {
          dispatch(showNetModal(true));
        } else {
          dispatch(showNetModal(false));
        }
      });

      // Subscribe to instance connection
      instance?.out.on("connect", (info: { chainId: number }) => {
        console.log("connect");
      });

      // Subscribe to provider disconnection
      instance?.out.on(
        "disconnect",
        (error: { code: number; message: string }) => {
          console.log("disconnect");
          console.log(error);
        }
      );
    } else {
      if (instance?.out === "MetaMask not installed") {
        dispatch(
          showAlert({
            message: instance?.out,
            severity: "error",
            link: "https://medium.com/@zilionixx_foundation/connecting-metamask-to-zilionixx-network-7ec14b6a36af",
          })
        );
        dispatch(setAuthMore(walletConnectError.installError));
      }
    }
  };

  useEffect(() => {
    initSet();
  }, []);

  return (
    <div className='c-container-root'>
      <div className='c-container-firstpart'>
        <CurrentRound />
        <StakingInfo />
      </div>
      <div className='c-container-secondpart'>
        <div className='c-container-secondpart1'>
          <UserStakingInfo />
          <Faq />
        </div>
        <div className='c-container-secondpart2'>
          <UserStakingInput />
          <Grid container className='c-container-secondpart21'>
            <Grid item xs={12} sm={12} md={6}>
              <BuyZNX />
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              className='c-container-promoterlink'>
              <PromoterLink />
            </Grid>
          </Grid>
          <Grid container className='c-container-secondpart21'>
            <Grid item xs={12} sm={12} md={6}>
              <TopStakers />
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              className='c-container-contractinfo'>
              <ContractInfo />
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
};
export default Container;
