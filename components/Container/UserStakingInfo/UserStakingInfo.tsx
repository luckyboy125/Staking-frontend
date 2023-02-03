import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import ScrollAnimation from "react-animate-on-scroll";
import { addCommas } from "../../../common/utils";
import { getUserStakingInfo } from "../../../hooks/Interactznxstake";
import { getAuthAddress } from "../../../store/auth/selectors";
import { useAppSelector } from "../../../store/hooks";
import {
  activeUsers,
  roundStaked,
  roundUsers,
  totalStaked,
} from "../../../store/initstakinginfo/selectors";
import { refreshStatus } from "../../../store/refresh/selectors";
import StatusBtn from "../../Base/StatusBtn";

const UserStakingInfo = () => {
  const [userInfo, setUserInfo] = useState<any>();
  const stakedInRound = useAppSelector(roundStaked);
  const stakedInTotal = useAppSelector(totalStaked);
  const totalUsers = useAppSelector(activeUsers);
  const usersInRound = useAppSelector(roundUsers);
  const loginAddress = useAppSelector(getAuthAddress);
  const [userTotalStaking, setUserTotalStaking] = useState("0");
  const [userStaking, setUserStaking] = useState("0");
  const [totalReward, setTotalReward] = useState("0");
  const [currentReward, setCurrentReward] = useState("0");
  const refreshSetting = useAppSelector(refreshStatus);

  const getUserData = async (address: string) => {
    let show = await getUserStakingInfo(address);
    setUserInfo(show);
  };
  
  useEffect(() => {
    if (loginAddress !== "" && loginAddress !== undefined) {
      getUserData(loginAddress);
    }
  }, [loginAddress, refreshSetting]);

  useEffect(() => {
    if (userInfo !== undefined) {
      setUserStaking(userInfo[0].toString());
      setTotalReward(userInfo[1].toString());
      setUserTotalStaking(userInfo[2].toString());
      setCurrentReward(userInfo[4].toString());
    }
  }, [userInfo]);

  return (
    <ScrollAnimation
      animateIn='zoomIn'
      animateOut='fadeOut'
      duration={1.5}
      delay={0}
      animateOnce={true}
      className='c-userstakinginfo-root'>
      <div className="c-userstakinginfo-itemdescription">Current / Total</div>
      <div className='c-userstakinginfo-item'>
        <div className='c-userstakinginfo-firstpart'>
          <StatusBtn color='blue' className='c-userstakinginfo-statubtn'>
            <img
              src='/images/wallet-checkmark.png'
              className='c-userstakinginfo-btnicon'
              alt='wallet-checkmark'></img>
          </StatusBtn>
          <div className='c-userstakinginfo-descript'>
            My Staking
          </div>
        </div>
        <div className='c-userstakinginfo-value'>
          {addCommas(ethers.utils.formatUnits(userStaking, 18))} /{" "}
          {addCommas(ethers.utils.formatUnits(userTotalStaking, 18))} ZNX
        </div>
      </div>
      <div className='c-userstakinginfo-item'>
        <div className='c-userstakinginfo-firstpart'>
          <StatusBtn color='orange' className='c-userstakinginfo-statubtn'>
            <img
              src='/images/light.png'
              className='c-userstakinginfo-btnicon'
              alt='base'></img>
          </StatusBtn>
          <div className='c-userstakinginfo-descript'>My Earnings</div>
        </div>
        <div className='c-userstakinginfo-value'>
          {addCommas(ethers.utils.formatUnits(totalReward, 18))} ZNX
        </div>
      </div>
      <div className='c-userstakinginfo-item'>
        <div className='c-userstakinginfo-firstpart'>
          <StatusBtn color='violet' className='c-userstakinginfo-statubtn'>
            <img
              src='/images/base.png'
              className='c-userstakinginfo-btnicon'
              alt='base'></img>
          </StatusBtn>
          <div className='c-userstakinginfo-descript'>Estimated Earnings</div>
        </div>
        <div className='c-userstakinginfo-value'>
          {addCommas(ethers.utils.formatUnits(currentReward, 18))}ZNX
        </div>
      </div>
      <div className='c-userstakinginfo-item'>
        <div className='c-userstakinginfo-firstpart'>
          <StatusBtn color='lightblue' className='c-userstakinginfo-statubtn'>
            <img
              src='/images/wallet-coins.png'
              className='c-userstakinginfo-btnicon'
              alt='wallet-coins'></img>
          </StatusBtn>
          <div className='c-userstakinginfo-descript'>
            Round Staking
          </div>
        </div>
        <div className='c-userstakinginfo-value'>
          {addCommas(stakedInRound)} / {addCommas(stakedInTotal)} ZNX
        </div>
      </div>
      <div className='c-userstakinginfo-item  removeborderbottom'>
        <div className='c-userstakinginfo-firstpart'>
          <StatusBtn color='purple' className='c-userstakinginfo-statubtn'>
            <img
              src='/images/users.png'
              className='c-userstakinginfo-btnicon'
              alt='users'></img>
          </StatusBtn>
          <div className='c-userstakinginfo-descript'>
            Active Users
          </div>
        </div>
        <div className='c-userstakinginfo-value'>
          {usersInRound?.length} / {totalUsers?.length} users
        </div>
      </div>
    </ScrollAnimation>
  );
};
export default UserStakingInfo;
