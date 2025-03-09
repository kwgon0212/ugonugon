import React from "react";
import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Notice from "@/types/Notice";
import { useNavigate } from "react-router-dom";

interface Props {
  notices: Notice[];
}

const NewNoticeSlider = ({ notices }: Props) => {
  const navigate = useNavigate();
  const settings: Settings = {
    waitForAnimate: false,
    autoplay: true,
    slidesToScroll: 1,
    arrows: false,
    infinite: true,
    slidesToShow: 2,
    speed: 300,
  };

  return (
    <div className="slider-container">
      <Slider {...settings}>
        {notices.map((notice, idx) => {
          return (
            <div
              onClick={() => navigate(`/notice/${notice._id}`)}
              key={notice._id}
              className="bg-white rounded-[10px] p-[10px] w-full"
            >
              <div className="w-full h-[120px] bg-main-gray rounded-[10px] mb-[10px]" />
              <div className="flex flex-col gap-[5px] text-left w-full max-w-[200px]">
                <div>
                  <p className="text-[12px] text-main-darkGray">
                    {notice.company ? notice.company : "한국경제신문"}
                  </p>
                  <p className="font-bold overflow-hidden truncate whitespace-nowrap w-full">
                    {notice.title}
                  </p>
                </div>
                <div>
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
          );
        })}
      </Slider>
    </div>
  );
};

export default NewNoticeSlider;
