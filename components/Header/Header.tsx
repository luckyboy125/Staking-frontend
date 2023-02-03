import { Box, Button } from "@material-ui/core";
import { setAuth } from "../../store/auth";
import { getAuthAddress } from "../../store/auth/selectors";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import HeaderMobileMenu from "./HeaderMobilMenu";
import copy from "clipboard-copy";
import { useEffect, useState } from "react";
import { web3modalInstance } from "../../hooks/common";
import { walletConnectError } from "../../common/constant";
import { showAlert } from "../../store/alert";

const Header = () => {
  const dispatch = useAppDispatch();
  const loginAddress = useAppSelector(getAuthAddress);
  const [copyAddress, setCopyAddress] = useState(false);

  const handleUrl = (url: string) => {
    window.open(url);
  };

  const handleSignin = async () => {
    const instance = await web3modalInstance();
    if (instance?.success) {
      dispatch(setAuth(instance?.out));
    } else {
      dispatch(
        showAlert({
          message: "You have to confirm your wallet address.",
          severity: "error",
        })
      );
    }
  };

  // const handleTotestnet = () => {
  //   window.open(
  //     `https://testnet.znxscan.com/address/${loginAddress}`,
  //     "_blank"
  //   );
  // };
  // const handleInstallMetamask = async () => {
  //   window.open(
  //     "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn",
  //     "_blank"
  //   );
  // };

  const handleAddressCopy = () => {
    copy(loginAddress);
    setCopyAddress(true);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setCopyAddress(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [copyAddress]);

  return (
    <>
      <Box className={"c-header-root"}>
        <div className='c-header-container'>
          <div className='c-header-menu'>
            <div className='c-header-logo'>
              <img
                src='/logo.png'
                className='c-header-logo-img'
                alt='logo'></img>
              <span className='c-header-logo-name'>ZILIONIXX</span>
            </div>
            <Button
              className='c-header-nav c-header-nav-active'
              disableRipple
              onClick={() => window.location.reload()}>
              <span></span>
              <span>Staking</span>
              <span className='active-border'></span>
            </Button>
            <Button
              className='c-header-nav'
              disableRipple
              onClick={() => handleUrl("https://znxscan.com")}>
              <span></span>
              <span>Block Explorer</span>
              <span className='none-border'></span>
            </Button>
            <Button
              className='c-header-nav'
              disableRipple
              onClick={() => handleUrl("https://dongletrade.com")}>
              <span></span>
              <span>DongleTrade</span>
              <span className='none-border'></span>
            </Button>
            <Button
              className='c-header-nav'
              disableRipple
              onClick={() => handleUrl("https://matchaswap.zilionixx.com")}>
              <span></span>
              <span>DEX/NFT</span>
              <span className='none-border'></span>
            </Button>
            <Button
              className='c-header-nav'
              disableRipple
              onClick={() => handleUrl("https://unicial.org/")}>
              <span></span>
              <span>Unicial</span>
              <span className='none-border'></span>
            </Button>
          </div>
          <HeaderMobileMenu />
          {loginAddress === "" ||
          loginAddress === undefined ||
          loginAddress === walletConnectError.installError ? (
            <div className='c-header-connectwalletbtn' onClick={handleSignin}>
              {loginAddress === "" || undefined
                ? "Connect Wallet"
                : loginAddress === walletConnectError.installError
                ? "Install"
                : loginAddress}
              <img
                src='/images/wallet.png'
                className='c-header-walletconnection'
              />
            </div>
          ) : (
            <div className='c-header-connectaddress'>
              {loginAddress?.slice(0, 7)}...
              {copyAddress ? (
                <i className='fa fa-check mr-1 marginLeft5'></i>
              ) : (
                <i
                  className={`far fa-copy marginLeft5 ${
                    (loginAddress === "" || loginAddress === undefined) &&
                    "displayNone"
                  }`}
                  onClick={handleAddressCopy}></i>
              )}
            </div>
          )}
        </div>
      </Box>
    </>
  );
};

export default Header;
