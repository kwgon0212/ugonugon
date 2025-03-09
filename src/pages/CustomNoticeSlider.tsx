import React from "react";
import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Notice from "@/types/Notice";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

interface Props {
  notices: Notice[];
}

const CustomNoticeSlider = ({ notices }: Props) => {
  const settings: Settings = {
    waitForAnimate: false,
    // autoplay: true,
    slidesToScroll: 1,
    arrows: false,
    infinite: true,
    slidesToShow: 1,
    speed: 1000,
    vertical: true,
  };

  const navigate = useNavigate();

  return (
    <div className="slider-container">
      <Slider {...settings}>
        {notices.map((notice) => {
          return (
            <div key={notice._id + "custom"}>
              <button
                onClick={() => navigate(`/notice/${notice._id}`)}
                className="w-full bg-white flex gap-[20px] items-center rounded-[10px] p-[10px]"
              >
                <img
                  src="https://placehold.co/90"
                  alt="img"
                  className="size-[90px] rounded-[10px]"
                />
                <div className="flex-grow w-full flex flex-col gap-[4px] text-left">
                  <div className="flex flex-col w-full">
                    <span className="text-[12px] text-main-darkGray">
                      {notice.company ? notice.company : "한국경제신문"}
                    </span>
                    <p className="font-bold overflow-hidden truncate whitespace-nowrap">
                      {notice.title}
                    </p>
                  </div>
                  <div className="flex flex-col w-fit">
                    <span className="text-[12px] text-main-darkGray w-fit">
                      {notice.address.street}
                    </span>
                    <div className="flex gap-[4px] text-sm w-fit">
                      <span className="font-bold text-main-color">
                        {notice.pay.type}
                      </span>
                      <span className="text-[12px] text-main-darkGray">
                        {notice.pay.value.toLocaleString()}원
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            </div>
          );
        })}
      </Slider>
    </div>
  );
};

const Title = styled.p`
  font-weight: bold;
  display: block;
  max-width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  flex-shrink: 1; /* flex가 적용된 부모 요소 내부에서 크기 조절 */
`;

export default CustomNoticeSlider;
