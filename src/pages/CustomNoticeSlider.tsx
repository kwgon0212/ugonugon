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
    // infinite: notices.length > 1,
    infinite: true,
    slidesToShow: 1,
    speed: 1000,
    vertical: true,
  };

  const navigate = useNavigate();

  if (notices.length <= 0) {
    return (
      <p className="px-[20px] text-main-darkGray text-sm h-[110px] flex justify-center items-center">
        추천 공고가 없습니다
      </p>
    );
  }

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
                {/* {notice.images.length > 0 ? (
                  <img
                    src={notice.images[0]}
                    alt="img"
                    className="size-[90px] rounded-[10px] object-cover border border-main-gray"
                  />
                ) : (
                  <p className="size-[90px] min-w-[90px] rounded-[10px] bg-main-gray text-main-darkGray text-sm flex justify-center items-center">
                    이미지 없음
                  </p>
                )} */}

                <img
                  src={notice.images?.length ? notice.images[0] : "/logo.png"}
                  alt="img"
                  className={`size-[90px] rounded-[10px] border border-main-gray ${
                    notice.images?.length ? "object-contain" : " object-cover"
                  }`}
                />

                <div className="flex-grow w-full flex flex-col gap-[4px] text-left">
                  <div className="flex flex-col">
                    <div className="flex justify-between items-center w-full">
                      <p className="font-bold overflow-hidden truncate whitespace-nowrap">
                        {notice.title}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm">
                    현재 {notice.applies ? notice.applies.length : 0}명 지원중
                  </span>

                  <div className="flex flex-col w-full">
                    <span className="text-sm text-main-darkGray w-full">
                      {notice.address.street}
                    </span>
                    <div className="w-full flex gap-[4px] justify-between items-center text-sm">
                      <div className="flex gap-[4px]">
                        <span className="font-bold text-main-color">
                          {notice.pay.type}
                        </span>
                        <span className="text-sm text-main-darkGray">
                          {notice.pay.value.toLocaleString()}원
                        </span>
                      </div>
                      <span className="text-main-darkGray text-sm">
                        ~ {new Date(notice.deadline.date).toLocaleDateString()}
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
