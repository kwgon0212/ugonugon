// import React from "react";
// import Slider, { Settings } from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import Notice from "@/types/Notice";
// import { useNavigate } from "react-router-dom";

// interface Props {
//   notices: Notice[];
// }

// const EmergencyNoticeSlider = ({ notices }: Props) => {
//   const settings: Settings = {
//     waitForAnimate: false,
//     autoplay: true,
//     slidesToScroll: 1,
//     arrows: false,
//     infinite: true,
//     slidesToShow: 2,
//     speed: 400,
//     rows: 2,
//     slidesPerRow: 1,
//   };

//   const navigate = useNavigate();

//   return (
//     <div className="slider-container">
//       <Slider {...settings}>
//         {notices.map((notice) => {
//           return (
//             <div key={notice._id + "emergency"}>
//               <button
//                 onClick={() => navigate(`/notice/${notice._id}`)}
//                 className="w-full mb-[10px] bg-white rounded-[10px] px-[20px] py-[10px]"
//               >
//                 <div className="flex gap-[10px] items-center w-full">
//                   <div className="flex flex-col gap-[4px] text-left w-full">
//                     <div>
//                       <p className="text-[12px] text-main-darkGray overflow-hidden truncate whitespace-nowrap">
//                         {notice.company ? notice.company : "한국경제신문"}
//                       </p>
//                       <p className="font-bold overflow-hidden truncate whitespace-nowrap">
//                         {notice.title}
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-[12px] text-main-darkGray overflow-hidden truncate whitespace-nowrap">
//                         {notice.address.street}
//                       </p>
//                       <p className="flex gap-[4px] text-sm">
//                         <span className="font-bold text-main-color">
//                           {notice.pay.type}
//                         </span>
//                         <span className="text-[12px] text-main-darkGray">
//                           {notice.pay.value.toLocaleString()}원
//                         </span>
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </button>
//             </div>
//           );
//         })}
//       </Slider>
//     </div>
//   );
// };

// export default EmergencyNoticeSlider;

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
    <SliderContainer>
      <StyledSlider {...settings}>
        {notices.map((notice) => (
          <SlideItem key={notice._id + "emergency"}>
            <NoticeButton onClick={() => navigate(`/notice/${notice._id}`)}>
              <NoticeContent>
                <div>
                  <CompanyText>
                    {notice.company ? notice.company : "한국경제신문"}
                  </CompanyText>
                  <Title>{notice.title}</Title>
                </div>
                <div>
                  <AddressText>{notice.address.street}</AddressText>
                  <PayInfo>
                    <PayType>{notice.pay.type}</PayType>
                    <PayAmount>{notice.pay.value.toLocaleString()}원</PayAmount>
                  </PayInfo>
                </div>
              </NoticeContent>
            </NoticeButton>
          </SlideItem>
        ))}
      </StyledSlider>
    </SliderContainer>
  );
};

const SliderContainer = styled.div`
  width: 100%;
`;

const StyledSlider = styled(Slider)`
  .slick-list {
    display: flex !important; /* Slick 기본 스타일 덮어쓰기 */
    gap: 10px; /* 카드 사이 간격 */
  }

  .slick-track {
    display: flex !important;
    /* gap: 10px; */
  }
`;

const SlideItem = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1; /* 슬라이드가 같은 크기를 가지도록 설정 */
`;

const NoticeButton = styled.button`
  width: 100%;
  background: white;
  border: 0.5px solid var(--main-gray);
  padding: 10px 20px;
`;

const NoticeContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: left;
  width: 100%;
`;

const CompanyText = styled.p`
  font-size: 12px;
  color: #7d7d7d;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const Title = styled.p`
  font-weight: bold;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const AddressText = styled.p`
  font-size: 12px;
  color: #7d7d7d;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const PayInfo = styled.div`
  display: flex;
  gap: 4px;
  font-size: 14px;
`;

const PayType = styled.span`
  font-weight: bold;
  color: var(--main-color);
`;

const PayAmount = styled.span`
  font-size: 12px;
  color: #7d7d7d;
`;

export default EmergencyNoticeSlider;
