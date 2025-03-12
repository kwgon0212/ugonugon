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

const NewNoticeSlider = ({ notices }: Props) => {
  const navigate = useNavigate();
  const settings: Settings = {
    waitForAnimate: false,
    autoplay: true,
    slidesToScroll: 1,
    arrows: false,
    infinite: notices.length > 1,
    slidesToShow: 1,
    speed: 1000,
    centerMode: true,
    centerPadding: "100px",
  };

  if (notices.length <= 0) {
    return (
      <p className="px-[20px] text-main-darkGray text-[14px] h-[110px] flex justify-center items-center">
        긴급 공고가 없습니다.
      </p>
    );
  }

  return (
    <div className="slider-container">
      <StyledSlider {...settings}>
        {notices.map((notice, idx) => {
          return (
            <div key={notice._id.toString()}>
              <button
                onClick={() => navigate(`/notice/${notice._id}`)}
                className="bg-white rounded-[10px] p-[10px] w-full"
              >
                {/* <div className="w-full h-[120px] bg-main-gray rounded-[10px] mb-[10px]" /> */}
                {notice.images.length > 0 ? (
                  <img
                    src={notice.images[0]}
                    alt="img"
                    className="w-full h-[120px] rounded-[10px] object-cover mb-[10px]"
                  />
                ) : (
                  <p className="w-full h-[120px] rounded-[10px] mb-[10px] bg-main-gray text-main-darkGray text-[12px] flex justify-center items-center">
                    이미지 없음
                  </p>
                )}
                <div className="flex flex-col gap-[5px] text-left w-full">
                  <div>
                    <p className="text-[12px] text-main-darkGray">
                      {new Date(notice.createdAt).toLocaleDateString()}에 등록
                    </p>
                    <p className="font-bold overflow-hidden truncate whitespace-nowrap w-full">
                      {notice.title}
                    </p>
                    <p className="text-[12px]">
                      현재 {notice.applies ? notice.applies.length : 0}명 지원중
                    </p>
                  </div>
                  <div>
                    <p className="text-[12px] text-main-darkGray overflow-hidden truncate whitespace-nowrap w-full">
                      {notice.address.street}
                    </p>
                    <div className="flex justify-between items-center gap-[4px] text-sm">
                      <div className="flex gap-[4px]">
                        <span className="font-bold text-main-color">
                          {notice.pay.type}
                        </span>
                        <span className="text-[12px] text-main-darkGray">
                          {notice.pay.value.toLocaleString()}원
                        </span>
                      </div>
                      <span className="text-main-darkGray text-[12px]">
                        ~ {new Date(notice.deadline.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            </div>
          );
        })}
      </StyledSlider>
    </div>
  );
};

const StyledSlider = styled(Slider)`
  .slick-list {
    display: flex !important; /* Slick 기본 스타일 덮어쓰기 */
    gap: 10px; /* 카드 사이 간격 */
  }

  .slick-track {
    display: flex;
    gap: 10px;
    row-gap: 20px;
  }
`;

export default NewNoticeSlider;
