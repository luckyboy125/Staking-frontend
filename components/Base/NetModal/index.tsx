import { CHAIN_INFO } from "../../../config/provider/provider";
import { switchNetwork } from "../../../hooks/ConnectMetamask";
import { useAppSelector } from "../../../store/hooks";
import { netModalStatus } from "../../../store/netmodal/selectors";
import StatusBtn from "../StatusBtn";

export default function NetModal() {
  const showNetmodal = useAppSelector(netModalStatus);

  const handleSwitch = async () => {
    await switchNetwork();
    window.location.reload();
  };
  const handleGoDes = () => {
    window.open(
      "https://medium.com/@zilionixx_foundation/connecting-metamask-to-zilionixx-network-7ec14b6a36af",
      "_blank"
    );
  };

  return (
    <>
      <div
        className={showNetmodal ? "c-netmodal-loaderWrapper" : "displayNone"}>
        <div className='c-netmodal-bigbugRoot'>
          <div className='c-netmodal-bigbugLabel'>Wrong Network !</div>
          <div className='c-netmodal-bigbugDescription'>
            You need to be connected to &nbsp;
            <span className='c-netmodal-mainnet'>Zilionixx Mainnet</span>
            &nbsp; &nbsp; to use this app, please switch your network to
            continue.
          </div>
          <div className='c-netmodal-bigbugDescription'>
            <i className='fal fa-exclamation-triangle'></i>&nbsp; On mobile, you
            have to switch network manually !
          </div>
          <div className='c-netmodal-viewinformationroot'>
            <div className='c-netmodal-viewtitle' onClick={handleGoDes}>
              Zilionixx Testnet
            </div>
            <div className='c-netmodal-item'>
              <div className='c-netmodal-itemlabel'>NetworkName </div>
              <div className='c-netmodal-itemcontent'>
                {CHAIN_INFO.TESTNET.chainName}
              </div>
            </div>
            <div className='c-netmodal-item'>
              <div className='c-netmodal-itemlabel'>New RPC URL </div>
              <div className='c-netmodal-itemcontent'>
                {CHAIN_INFO.TESTNET.rpcUrls[0]}
              </div>
            </div>
            <div className='c-netmodal-item'>
              <div className='c-netmodal-itemlabel'>ChainID </div>
              <div className='c-netmodal-itemcontent'>
                {parseInt(CHAIN_INFO.TESTNET.chainId, 16)}
              </div>
            </div>
            <div className='c-netmodal-item'>
              <div className='c-netmodal-itemlabel'>Symbol </div>
              <div className='c-netmodal-itemcontent'>
                {CHAIN_INFO.TESTNET.nativeCurrency.symbol}
              </div>
            </div>
            <div className='c-netmodal-item'>
              <div className='c-netmodal-itemlabel'>Block Explorer URL </div>
              <div className='c-netmodal-itemcontent'>
                {CHAIN_INFO.TESTNET.blockExplorerUrls[0]}
              </div>
            </div>
          </div>
          <StatusBtn
            color='blue'
            className='c-netmodal-bidchange'
            statusClick={handleSwitch}>
            SWITCH TO Zilionixx MAINNET
          </StatusBtn>
        </div>
      </div>
    </>
  );
}
