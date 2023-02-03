import React from "react";

const Footer = () => {
  return (
    <div className='c-footer-root'>
      <div className='c-footer-title'>Copyright @ 2022 Zilionixx team</div>
      <div className='c-footer-icons'>
        <a
          target='_blank'
          href='mailto:tsimafei@zilionixx.com'
          rel='noreferrer'>
          <i className='fas fa-envelope c-social-icon'></i>
        </a>
        <a
          target='_blank'
          href='mailto:tsimafei@zilionixx.com'
          rel='noreferrer'>
          <i className='fab fa-slack c-social-icon'></i>
        </a>
        <a target='_blank' href='https://t.me/zilionixx' rel='noreferrer'>
          <i className='fab fa-telegram-plane c-social-icon'></i>
        </a>
        <a
          target='_blank'
          rel='noreferrer'
          href='https://www.facebook.com/groups/4354141514692375/'>
          <i className='fab fa-facebook-f  c-social-icon'></i>
        </a>
        <a
          target='_blank'
          rel='noreferrer'
          href='https://twitter.com/zilionixx'>
          <i className='fab fa-twitter c-social-icon'></i>
        </a>
        <a
          target='_blank'
          rel='noreferrer'
          href='https://www.linkedin.com/company/zilionixx '>
          <i className='fab fa-linkedin-in c-social-icon'></i>
        </a>
        <a target='_blank' rel='noreferrer' href='https://discord.gg/JEPcm4YD '>
          <i className='fab fa-discord c-social-icon'></i>
        </a>
      </div>
    </div>
  );
};
export default Footer;
