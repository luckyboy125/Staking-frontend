import React from "react";
import ScrollAnimation from "react-animate-on-scroll";
import { useAppSelector } from "../../../store/hooks";
import { getAuthBalance } from "../../../store/auth/selectors";
import { addCommas } from "../../../common/utils";
import { minCap } from "../../../store/initstakinginfo/selectors";

const BuyZNX = () => {
  const balance = useAppSelector(getAuthBalance);
  const minValue = useAppSelector(minCap);
  const handleGoUrl = () => {
    window.open("https://crowdsale.zilionixx.com", "_blank");
  };

  return (
    <ScrollAnimation
      animateIn='zoomIn'
      animateOut='fadeOut'
      duration={2}
      delay={0}
      animateOnce={true}
      className='c-buyznx-root'>
      <div className='c-buyznx-text'>
        <div className='c-buyznx-title'> Current Balance:</div>
        <div
          className={`c-buyznx-${
            Number(balance) < Number(minValue) ? "err" : "success"
          }content`}>
          {balance !== undefined ? addCommas(balance) : 0} ZNX
        </div>
      </div>
      <div className='c-buyznx-div'>
        <div className='c-buyznx-connectwalletbtn' onClick={handleGoUrl}>
          Buy ZNX
          <img src='/images/buy.png' className='c-buyznx-walletconnection' />
        </div>
      </div>
    </ScrollAnimation>
  );
};
export default BuyZNX;
