import React from "react";
import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "@/css/slick.css";
import styled from "styled-components";

interface Props {
  imageArr: string[];
}

interface ImageBoxProps {
  src: string;
}

const ImageSlider = ({ imageArr }: Props) => {
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
  imageArr = imageArr.filter((v) => !v.startsWith("https://file.albamon.com"));
  return (
    <div className="slider-container">
      <Slider {...settings}>
        {imageArr.length > 0 ? (
          imageArr.map((src, idx) => {
            return (
              <div key={idx} className="max-h-[250px]">
                <ImageBox src={src} />
              </div>
            );
          })
        ) : (
          <div className="max-h-[250px]">
            <div className="w-full h-[250px] bg-main-gray text-main-darkGray flex justify-center items-center">
              이미지 없음
            </div>
          </div>
        )}
      </Slider>
    </div>
  );
};

const ImageBox = styled.div<ImageBoxProps>`
  width: 100%;
  height: 250px;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url(${({ src }) => src});
  background-size: cover;
`;

export default ImageSlider;
