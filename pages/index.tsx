import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import Footer from "../components/Footer/Footer";
import Spinner from "../components/Base/Spinner";
import Container from "../components/Container/Container";
import Header from "../components/Header/Header";
import Alert from "../components/Base/Alert";
import NetModal from "../components/Base/NetModal";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>ZNX Staking | Zilionixx</title>
        <link rel='icon' href='/logo.png' />
        <link rel='preconnect' href='https://fonts.googleapis.com'></link>
        <link
          rel='preconnect'
          href='https://fonts.gstatic.com'
          crossOrigin=''></link>
        <meta
          name='description'
          content='ZNX staking platform is where you can claim ZNX(Zilionixx native coin) as a reward by staking ZNX. Also you can get bonus ZNX by inviting others using your promoter link. This staking is limited in time and the earlier you participate, the more reward you will be able to claim.'
        />
        <meta
          name='keywords'
          content='ZNX, znx, staking, staking of zilionixx, deposit, withdraw, zilionixx staking, ZNX staking , staking of ZNX, claim, reward, stake, round, contract, smart, staker, promoter, zilionixx, blockchain, web3, staking reward, staking claim'
        />
        <meta name='robots' content='index, follow' />
        <meta name='googlebot' content='index, follow' />
      </Head>
      <Header />
      <Container />
      <Footer />
      <Spinner />
      <Alert />
      <NetModal/>
    </div>
  );
};

export default Home;
