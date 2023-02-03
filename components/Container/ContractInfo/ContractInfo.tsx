import React from "react";
import ScrollAnimation from "react-animate-on-scroll";
import { znxstakeAddress } from "../../../config/znxstake";

const ContractInfo = () => {
  const handleIcon = () => {
    window.open(`https://testnet.znxscan.com/address/${znxstakeAddress}`);
  };

  return (
    <ScrollAnimation
      animateIn='zoomIn'
      animateOut='fadeOut'
      duration={3}
      delay={0}
      animateOnce={true}
      className='c-contractinfo-contractroot'>
      <div className='c-contractinfo-contracttitle'>
        Smart contract address:{" "}
        <p className='c-contractinfo-contractaddress' onClick={handleIcon}>
          {znxstakeAddress.slice(0, 23)}... &nbsp;
          <i className='fas fa-external-link-alt'></i>
        </p>
      </div>
      <div className="c-contractinfo-content">

      <div className='c-contractinfo-contractimgroot'>
        <img
          src='/images/contract.png'
          className='c-contractinfo-contractimg'
          alt='contract'></img>
      </div>
      <div className='c-contractinfo-contractquestion'>
        How to stake ZNX and how it works?
      </div>
      <div className='c-contractinfo-watchbtn'>
        Watch Video &nbsp;{" "}
        <img
          src='/images/video.png'
          className='c-contractinfo-videoicon'
          alt='contract'></img>
      </div>
      </div>
    </ScrollAnimation>
  );
};
export default ContractInfo;
