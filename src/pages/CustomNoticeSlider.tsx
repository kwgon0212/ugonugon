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
    centerPadding: "40px",
    slidesToShow: 1,
    speed: 1000,
  };

  const navigate = useNavigate();

  return (
    <div className="slider-container">
      <Slider {...settings}>
        {notices.map((notice, idx) => {
          return (
            <button
              onClick={() => navigate(`/notice/${notice._id}`)}
              key={notice._id}
              className="max-h-[250px] bg-white rounded-[10px] px-[20px] py-[10px] truncate"
            >
              <div className=" flex gap-[20px] items-center">
                <img
                  src="https://placehold.co/90"
                  alt="img"
                  className="size-[90px] rounded-[10px]"
                />
                <div className="flex flex-col gap-[4px] text-left">
                  <div>
                    <p className="text-[12px] text-main-darkGray">
                      {notice.company ? notice.company : "한국경제신문"}
                    </p>
                    <p className="font-bold">{notice.title}</p>
                  </div>
                  <div>
                    <p className="text-[12px] text-main-darkGray">
                      {notice.address.street}
                    </p>
                    <p className="flex gap-[4px] text-sm">
                      <p className="font-bold text-main-color">
                        {notice.pay.type}
                      </p>
                      <p className="text-[12px] text-main-darkGray">
                        {notice.pay.value.toLocaleString()}원
                      </p>
                    </p>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </Slider>
    </div>
  );
};

export default CustomNoticeSlider;
