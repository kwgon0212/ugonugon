import React from "react";
import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./slick.css";

interface Props {
  children: JSX.Element;
}

const NoticeSlider = ({ children }: Props) => {
  const settings: Settings = {
    dots: true,
    fade: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    waitForAnimate: false,
    autoplay: true,
    arrows: false,
    // customPaging: () => (
    //   <div className="w-4 h-4 bg-gray-400 rounded-full shadow-inner hover:bg-gray-500 transition"></div>
    // ),
  };
  return (
    <div className="slider-container">
      <Slider {...settings}>{children}</Slider>
    </div>
  );
};

export default NoticeSlider;
