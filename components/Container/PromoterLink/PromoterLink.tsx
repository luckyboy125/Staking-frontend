import React, { useEffect, useState } from "react";
import copy from "clipboard-copy";
import { promoterUrl, walletConnectError } from "../../../common/constant";
import ScrollAnimation from "react-animate-on-scroll";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { getAuthAddress } from "../../../store/auth/selectors";
import { useRouter } from "next/router";
import axios from "axios";
import { setAuth } from "../../../store/auth";
import { showAlert } from "../../../store/alert";
import { web3modalInstance } from "../../../hooks/common";

const PromoterLink = () => {
  const [copyPrometorUrl, setCopyPrometorUrl] = useState(false);
  const loginAddress = useAppSelector(getAuthAddress);
  const location = useRouter();
  const query = location.query.p;
  const dispatch = useAppDispatch();

  const getResData = async () => {
    let response = await axios.post("/api/subscribe", {
      query,
    });
    if (response?.data.Success) {
      dispatch(
        showAlert({
          message: "1 ZNX bonus is sent to your promoter.",
          severity: "success",
        })
      );
    } else {
      if (response?.data.Error.Msg !== undefined) {
        dispatch(
          showAlert({
            message: response?.data.Error.Msg,
            severity: "error",
          })
        );
      }
    }
  };

  const handleUrlCopy = () => {
    copy(promoterUrl + "?p=" + loginAddress);
    setCopyPrometorUrl(true);
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setCopyPrometorUrl(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [copyPrometorUrl]);

  useEffect(() => {
    if (query !== undefined) {
      try {
        getResData();
      } catch (error) {
        console.log(error);
      }
    }
  }, [query]);

  return (
    <ScrollAnimation
      animateIn='zoomIn'
      animateOut='fadeOut'
      duration={2}
      delay={0}
      animateOnce={true}
      className='c-promoterlink-linkroot'>
      <div className='c-promoterlink-linktitle'>
        Share Promoter Link:
        {copyPrometorUrl ? (
          <i className='fa fa-check mr-1 copycheckicon'></i>
        ) : (
          <img
            src='/images/linkcopy.png'
            className={`c-promoterlink-linkcopyicon ${
              (loginAddress === "" ||
                loginAddress === undefined ||
                loginAddress === walletConnectError.installError) &&
              "displayNone"
            }`}
            alt='linkcopy'
            onClick={handleUrlCopy}></img>
        )}
      </div>
      <div className='c-promoterlink-linkdiv'>
        {loginAddress === "" ||
        loginAddress === undefined ||
        loginAddress === walletConnectError.installError ? (
          <div
            className='c-promoterlink-connectwalletbtn'
            onClick={handleSignin}>
            Reveal
            <img
              src='/images/wallet.png'
              className='c-promoterlink-walletconnection'
            />
          </div>
        ) : (
          <a href='#' className='c-promoterlink-link'>
            {promoterUrl + "?p=" + loginAddress}
          </a>
        )}
      </div>
    </ScrollAnimation>
  );
};
export default PromoterLink;
