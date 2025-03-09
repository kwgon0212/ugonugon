import React from "react";
import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Notice from "@/types/Notice";
import { useNavigate } from "react-router-dom";

interface Props {
  notices: Notice[];
}

const EmergencyNoticeSlider = ({ notices }: Props) => {
  const settings: Settings = {
    waitForAnimate: false,
    autoplay: true,
    slidesToScroll: 1,
    arrows: false,
    infinite: true,
    slidesToShow: 2,
    speed: 400,
    rows: 2,
    slidesPerRow: 1,
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
                className="w-full mb-[10px] bg-white rounded-[10px] px-[20px] py-[10px]"
              >
                <div className="flex gap-[10px] items-center w-full">
                  <div className="flex flex-col gap-[4px] text-left w-full">
                    <div className="h-[40px]">
                      <p className="text-[12px] text-main-darkGray overflow-hidden truncate whitespace-nowrap">
                        {notice.company ? notice.company : "한국경제신문"}
                      </p>
                      <p className="font-bold overflow-hidden truncate whitespace-nowrap">
                        {notice.title}
                      </p>
                    </div>
                    <div>
                      <p className="text-[12px] text-main-darkGray overflow-hidden truncate whitespace-nowrap">
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

export default EmergencyNoticeSlider;
