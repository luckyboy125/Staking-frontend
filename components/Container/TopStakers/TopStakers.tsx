import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import ScrollAnimation from "react-animate-on-scroll";
import { getUserStakingInfo } from "../../../hooks/Interactznxstake";
import { useAppSelector } from "../../../store/hooks";
import { activeUsers } from "../../../store/initstakinginfo/selectors";
import StatusBtn from "../../Base/StatusBtn";

const TopStakers = () => {
  const totalUsers = useAppSelector(activeUsers);
  const [stakingArray, setStakingArray] = useState<any>([]);

  const [sortedArray, setSortedArray] = useState<any>([]);

  const getUserData = async (address: any) => {
    let show = await getUserStakingInfo(address);
    if (show !== undefined) {
      let userdata: any = { addr: address, amount: show[2].toString() };
      return userdata;
    }
  };

  const init = async () => {
    let allUserInfo = [];
    for (let i = 0; i < totalUsers.length; i++) {
      if (totalUsers[i] !== "" && totalUsers[i] !== undefined) {
        allUserInfo.push(getUserData(totalUsers[i]));
      }
    }
    let result = await Promise.all(allUserInfo);
    setStakingArray(result);
  };

  useEffect(() => {
    init();
  }, [totalUsers]);

  useEffect(() => {
    let sorted = stakingArray.sort((a: any, b: any) =>
      Number(a.amount) > Number(b.amount) ? -1 : 1
    );
    setSortedArray(sorted);
  }, [stakingArray]);

  const handleIcon = (addr: string) => {
    window.open(`https://testnet.znxscan.com/address/${addr}`);
  };

  return (
    <ScrollAnimation
      animateIn='zoomIn'
      animateOut='fadeOut'
      duration={2.5}
      delay={0}
      animateOnce={true}
      className='c-topstakers-stakersroot'>
      <div className='c-topstakers-stakerstitle'>Top stakers:</div>
      <div className='c-topstakers-stakercontentroot'>
        <div className='c-topstakers-stakercontent'>
          {(sortedArray?.length === 0 || sortedArray[0] === undefined) && (
            <div className='c-topstakers-empty centerAlign'>
              <img
                src='/svg/noResult.svg'
                className='c-topstakers-emptyBackground'
                alt='wallet-checkmark'></img>
              No staking data exists yet.
            </div>
          )}
          {sortedArray?.length >= 1 && sortedArray[0] !== undefined && (
            <div
              className={`c-topstakers-stakeritem ${
                sortedArray?.length === 1
                  ? `removeborderbottom marginbottom`
                  : ``
              }`}>
              <StatusBtn
                color='blue'
                className='c-topstakers-stakeritemstatusbtn'>
                1
              </StatusBtn>
              <div className='c-topstakers-stakerrightpart'>
                <div
                  className='c-topstakers-stakeraddress'
                  onClick={(e) => handleIcon(sortedArray[0]?.addr)}>
                  {sortedArray[0]?.addr.slice(0, 23)}...&nbsp; &nbsp;
                  <i className='fas fa-external-link-alt'></i>
                </div>
                <div className='c-topstakers-amount'>
                  Amount:&nbsp;
                  <span className='c-topstakers-amountvalue'>
                    {Number(
                      ethers.utils.formatUnits(sortedArray[0]?.amount, 18)
                    )}
                  </span>
                </div>
              </div>
            </div>
          )}
          {sortedArray?.length >= 2 && sortedArray[1] !== undefined && (
            <div
              className={`c-topstakers-stakeritem ${
                sortedArray?.length === 2
                  ? `removeborderbottom marginbottom`
                  : ``
              }`}>
              <StatusBtn
                color='lightblue'
                className='c-topstakers-stakeritemstatusbtn'>
                2
              </StatusBtn>
              <div className='c-topstakers-stakerrightpart'>
                <div
                  className='c-topstakers-stakeraddress'
                  onClick={(e) => handleIcon(sortedArray[1]?.addr)}>
                  {sortedArray[1]?.addr.slice(0, 23)}...&nbsp; &nbsp;
                  <i className='fas fa-external-link-alt'></i>
                </div>
                <div className='c-topstakers-amount'>
                  Amount:&nbsp;
                  <span className='c-topstakers-amountvaluelightbluecolor'>
                    {Number(
                      ethers.utils.formatUnits(sortedArray[1]?.amount, 18)
                    )}
                  </span>
                </div>
              </div>
            </div>
          )}
          {sortedArray?.length >= 3 && sortedArray[2] !== undefined && (
            <div className='c-topstakers-stakeritem removeborderbottom marginbottom'>
              <StatusBtn
                color='purple'
                className='c-topstakers-stakeritemstatusbtn'>
                3
              </StatusBtn>
              <div className='c-topstakers-stakerrightpart'>
                <div
                  className='c-topstakers-stakeraddress'
                  onClick={(e) => handleIcon(sortedArray[2]?.addr)}>
                  {sortedArray[2]?.addr.slice(0, 23)}...&nbsp; &nbsp;
                  <i className='fas fa-external-link-alt'></i>
                </div>
                <div className='c-topstakers-amount'>
                  Amount:&nbsp;
                  <span className='c-topstakers-amountvaluepurple'>
                    {Number(
                      ethers.utils.formatUnits(sortedArray[2]?.amount, 18)
                    )}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ScrollAnimation>
  );
};
export default TopStakers;
