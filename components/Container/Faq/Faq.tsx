import React from "react";
import ScrollAnimation from "react-animate-on-scroll";

const Faq = () => {
  const handleItem1Click = () => {
    window.open(
      "https://medium.com/@zilionixx_foundation/a-guide-on-zilionixx-staking-program-part-1-97d9a2a1af3f",
      "_blank"
    );
  };
  const handleItem2Click = () => {
    window.open(
      "https://medium.com/@zilionixx_foundation/connecting-metamask-to-zilionixx-network-7ec14b6a36af",
      "_blank"
    );
  };
  const handleItem3Click = () => {
    window.open(
      "https://medium.com/@zilionixx_foundation/a-guide-on-zilionixx-staking-program-part-2-19f6c946ec9a",
      "_blank"
    );
  };

  return (
    <ScrollAnimation
      animateIn='zoomIn'
      animateOut='fadeOut'
      duration={2.5}
      delay={0}
      animateOnce={true}
      className='c-faq-root'>
      <div className='c-faq-title'>FAQ:</div>
      <div className='c-faq-container'>
        <div className='c-faq-item' onClick={(e) => handleItem1Click()}>
          <div className='c-faq-question'>
            What is ZNX Staking?
            <i className='fas fa-external-link-alt marginLeft5'></i>
          </div>
        </div>
        <div className='c-faq-item' onClick={(e) => handleItem2Click()}>
          <div className='c-faq-question'>
            How can we connect wallet?
            <i className='fas fa-external-link-alt marginLeft5'></i>
          </div>
        </div>
        <div className='c-faq-item' onClick={(e) => handleItem3Click()}>
          <div className='c-faq-question'>
            How can we make earnings from promotion?
            <i className='fas fa-external-link-alt marginLeft5'></i>
          </div>
        </div>
      </div>
    </ScrollAnimation>
  );
};
export default Faq;
