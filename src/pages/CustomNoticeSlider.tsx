import React from "react";
import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Notice from "@/types/Notice";
import { useNavigate } from "react-router-dom";

interface Props {
  notices: Notice[];
}

const CustomNoticeSlider = ({ notices }: Props) => {
  const settings: Settings = {
    waitForAnimate: false,
    autoplay: true,
    slidesToScroll: 1,
    arrows: false,
    className: "center",
    centerMode: true,
    infinite: true,
    centerPadding: "20px",
    slidesToShow: 1,
    speed: 1000,
    variableWidth: false, // 모든 카드의 너비 동일하게 설정
  };

  const navigate = useNavigate();

  return (
    <div className="slider-container">
      <Slider {...settings}>
        {notices.map((notice) => {
          return (
            <div key={notice._id}>
              <button
                onClick={() => navigate(`/notice/${notice._id}`)}
                className="bg-white rounded-[10px] px-[20px] py-[10px] w-full"
              >
                <div className="flex gap-[20px] items-center w-full">
                  <img
                    src="https://placehold.co/90"
                    alt="img"
                    className="size-[90px] rounded-[10px]"
                  />
                  <div className="flex flex-col gap-[4px] text-left flex-grow">
                    <div className="">
                      <p className="text-[12px] text-main-darkGray overflow-hidden truncate whitespace-nowrap">
                        {notice.company ? notice.company : "한국경제신문"}
                      </p>
                      <p className="font-bold overflow-hidden truncate whitespace-nowrap">
                        {notice.title}
                      </p>
                    </div>
                    <div className="max-w-[180px] flex-shrink-0 overflow-hidden truncate whitespace-nowrap">
                      <p className="text-[12px] text-main-darkGray">
                        {notice.address.street}
                      </p>
                      <p className="flex gap-[4px] text-sm">
                        <span className="font-bold text-main-color">
                          {notice.pay.type}
                        </span>
                        <span className="text-[12px] text-main-darkGray">
                          {notice.pay.value.toLocaleString()}원
                        </span>
                      </p>
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

export default CustomNoticeSlider;
