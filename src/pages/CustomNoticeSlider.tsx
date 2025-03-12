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
    autoplay: true,
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
                {notice.images.length > 0 ? (
                  <img
                    src={notice.images[0]}
                    alt="img"
                    className="size-[90px] rounded-[10px] object-cover"
                  />
                ) : (
                  <p className="size-[90px] min-w-[90px] rounded-[10px] bg-main-gray text-main-darkGray text-[12px] flex justify-center items-center">
                    이미지 없음
                  </p>
                )}

                <div className="flex-grow w-full flex flex-col gap-[4px] text-left">
                  <div className="flex flex-col">
                    <div className="flex justify-between items-center w-full">
                      <p className="font-bold overflow-hidden truncate whitespace-nowrap">
                        {notice.title}
                      </p>
                    </div>
                    <span className="text-[12px]">
                      현재 {notice.applies ? notice.applies.length : 0}명 지원중
                    </span>
                  </div>

                  <div className="flex flex-col w-full">
                    <span className="text-[12px] text-main-darkGray w-full">
                      {notice.address.street}
                    </span>
                    <div className="w-full flex gap-[4px] justify-between text-sm">
                      <div className="flex gap-[4px]">
                        <span className="font-bold text-main-color">
                          {notice.pay.type}
                        </span>
                        <span className="text-[12px] text-main-darkGray">
                          {notice.pay.value.toLocaleString()}원
                        </span>
                      </div>
                      <span className="text-main-darkGray text-[12px]">
                        ~ {notice.deadline.date.toLocaleDateString()}
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

export default CustomNoticeSlider;
