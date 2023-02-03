import React from "react";
import "../styles/header.css";
import '../styles/globals.css'
import '../styles/base.css'
import '../styles/userstakinginfo.css'
import '../styles/userstakinginput.css'
import '../styles/container.css'
import '../styles/footer.css'
import "../styles/contractinfo.css"
import "../styles/currentround.css"
import "../styles/promoterlink.css"
import "../styles/faq.css"
import "../styles/stakinginfo.css"
import "../styles/topstakers.css"
import "../styles/spinner.css"
import "../styles/alert.css"
import "../styles/buyznx.css"
import "../styles/netmodal.css"
import type { AppProps } from 'next/app'
import { Provider } from "react-redux";
import { store } from "../store/store";

function MyApp({ Component, pageProps }: AppProps) {
  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement!.removeChild(jssStyles);
    }
  }, []);
  return (
    <Provider store={store}>
        <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
