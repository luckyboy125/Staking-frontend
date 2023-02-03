import React, { useEffect, useState } from "react";
import { TextField, Tooltip } from "@material-ui/core";
import StatusBtn from "../../Base/StatusBtn";
import ScrollAnimation from "react-animate-on-scroll";
import {
  deposit,
  getUserStakingInfo,
  withdraw,
} from "../../../hooks/Interactznxstake";
import { showAlert } from "../../../store/alert";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { setStakinginfo } from "../../../store/initstakinginfo";
import { getAuthAddress, getAuthBalance } from "../../../store/auth/selectors";
import { currentRound, minCap } from "../../../store/initstakinginfo/selectors";
import CircularProgress from "@material-ui/core/CircularProgress";
import { setAuth } from "../../../store/auth";
import { refreshStatus } from "../../../store/refresh/selectors";
import { setRefreshStatus } from "../../../store/refresh";
import { web3modalInstance } from "../../../hooks/common";

const UserStakingInput = () => {
  const [stakeValue, setStakeValue] = useState<Number>();
  const dispatch = useAppDispatch();
  const balance = useAppSelector(getAuthBalance);
  const roundNum = useAppSelector(currentRound);
  const minValue = useAppSelector(minCap);
  const refreshSetting = useAppSelector(refreshStatus);
  const [depositStatus, setDepositStatus] = useState(false);
  const [withdrawStatus, setWithdrawStatu] = useState(false);
  const [depositSpinner, setDepositSpinner] = useState(false);
  const [withdrawSpinner, setWithdrawSpinner] = useState(false);
  const [depositTooltip, setDepositTooltip] = useState("");
  const [withdrawTooltip, setWithdrawTooltip] = useState("");
  const loginAddress = useAppSelector(getAuthAddress);
  const [userInfo, setUserInfo] = useState<any>();

  const getUserData = async (address: string) => {
    let show = await getUserStakingInfo(address);
    setUserInfo(show);
  };

  useEffect(() => {
    if (loginAddress !== "" && loginAddress !== undefined) {
      getUserData(loginAddress);
    }
  }, [loginAddress]);

  useEffect(() => {
    if (stakeValue === undefined) {
      setDepositStatus(true);
      setDepositTooltip("You haven't entered any values yet !");
    } else if (Number(stakeValue) < Number(minValue)) {
      setDepositStatus(true);
      setDepositTooltip(
        `A value less than ${Number(minValue)} ZNX was entered !`
      );
    } else if (Number(balance) <= Number(stakeValue)) {
      setDepositStatus(true);
      setDepositTooltip(
        "A value greater than the wallet account balance was entered !"
      );
    } else if (Number(balance) <= Number(minValue)) {
      setDepositStatus(true);
      setDepositTooltip(
        `Unfortunately your wallet account balance is less than ${Number(
          minValue
        )} ZNX !`
      );
    } else {
      setDepositTooltip("");
      setDepositStatus(false);
    }
    if (
      userInfo !== undefined &&
      userInfo[0].toString() === "0" &&
      userInfo[1].toString() === "0" &&
      userInfo[2].toString() === "0" &&
      userInfo[4].toString() === "0"
    ) {
      setWithdrawStatu(true);
      setWithdrawTooltip("You haven't done anything yet to get your reward !");
    } else if (userInfo === undefined) {
      setWithdrawStatu(true);
      setWithdrawTooltip("You are not logged in yet !");
    } else {
      setWithdrawStatu(false);
      setWithdrawTooltip("");
    }
  }, [stakeValue, balance, userInfo]);

  const handleStake = (e: any) => {
    setStakeValue(e.target.value);
  };

  const handleStakeBtn = async () => {
    if (!stakeValue) {
      dispatch(
        showAlert({
          message: "Please enter correct amount value.",
          severity: "error",
        })
      );
      return;
    }
    if (stakeValue && Number(stakeValue) <= Number(balance)) {
      let flag = await deposit(stakeValue);
      if (flag !== null) {
        setDepositSpinner(true);
        await flag.wait();
        setDepositSpinner(false);
        dispatch(
          showAlert({
            message: `You can claim your reward in Round ${roundNum + 2}.`,
            severity: "success",
          })
        );
        setStakeValue(0);
        dispatch(setStakinginfo());
        const instance = await web3modalInstance();
        if (instance.success) {
          dispatch(setAuth(instance.out));
        }
        dispatch(setRefreshStatus(!refreshSetting));
        if (loginAddress !== "" && loginAddress !== undefined) {
          getUserData(loginAddress);
        }
        return;
      }
    } else {
      dispatch(
        showAlert({
          message: "Deposit failed.",
          severity: "error",
        })
      );
    }
  };

  const handleHarvestBtn = async () => {
    const flag = await withdraw();
    if (flag !== null) {
      setWithdrawSpinner(true);
      await flag.wait();
      setWithdrawSpinner(false);
      dispatch(
        showAlert({
          message: "Successfully withdrawn",
          severity: "success",
        })
      );
      dispatch(setStakinginfo());
      dispatch(setRefreshStatus(!refreshSetting));
      const instance = await web3modalInstance();
      if (instance.success) {
        dispatch(setAuth(instance.out));
      }
      if (loginAddress !== "" && loginAddress !== undefined) {
        getUserData(loginAddress);
      }
      return;
    } else {
      dispatch(
        showAlert({
          message: "Withdraw failed.",
          severity: "error",
        })
      );
    }
  };

  return (
    <ScrollAnimation
      animateIn='zoomIn'
      animateOut='fadeOut'
      duration={3}
      delay={0}
      animateOnce={true}
      className='c-userstakinginput-root'>
      <div className='c-userstakinginput-item'>
        <TextField
          placeholder={`Min cap = ${
            minValue !== undefined ? Number(minValue) : 0
          } ZNX`}
          className='c-userstakinginput-input'
          type='number'
          onChange={(e) => handleStake(e)}
          value={stakeValue}
        />
        <div className='c-userstakinginput-btns'>
          <Tooltip title={depositTooltip} interactive arrow placement='top'>
            <div>
              <StatusBtn
                color='blue'
                className={
                  depositStatus
                    ? "c-userstakinginput-statusbtn1disable"
                    : "c-userstakinginput-statusbtn1"
                }
                statusClick={handleStakeBtn}
                disable={depositStatus}>
                <div className='c-userstakinginput-btnletter'>Stake</div>
                <img
                  src='/images/stake.png'
                  className={
                    !depositSpinner
                      ? "c-userstakinginput-btnicon"
                      : "displayNone"
                  }
                  alt='stake'></img>
                <CircularProgress
                  size={20}
                  className={
                    !depositSpinner
                      ? "displayNone"
                      : "c-userstakinginput-btnspinner"
                  }
                />
              </StatusBtn>
            </div>
          </Tooltip>
          <div className='c-userstakinginput-borderline'>
            <Tooltip title={withdrawTooltip} interactive arrow placement='top'>
              <div>
                <StatusBtn
                  color='purple'
                  className={
                    withdrawStatus
                      ? "c-userstakinginput-statusbtn3disable"
                      : "c-userstakinginput-statusbtn3"
                  }
                  disable={withdrawStatus}
                  statusClick={handleHarvestBtn}>
                  <div className='c-userstakinginput-btnletter'>Harvest</div>
                  <img
                    src='/images/amount.png'
                    className={
                      !withdrawSpinner
                        ? "c-userstakinginput-btnicon"
                        : "displayNone"
                    }
                    alt='amount'></img>
                  <CircularProgress
                    size={20}
                    className={
                      !withdrawSpinner
                        ? "displayNone"
                        : "c-userstakinginput-btnspinner"
                    }
                  />
                </StatusBtn>
              </div>
            </Tooltip>
          </div>
        </div>
      </div>
    </ScrollAnimation>
  );
};
export default UserStakingInput;
