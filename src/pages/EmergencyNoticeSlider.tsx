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
    infinite: notices.length > 4,
    slidesToShow: Math.min(2, notices.length),
    speed: 400,
    rows: 2,
    slidesPerRow: 1,
  };

  const navigate = useNavigate();

  if (notices.length <= 0) {
    return (
      <p className="px-[20px] text-main-darkGray text-sm h-[110px] flex justify-center items-center">
        긴급 공고가 없습니다
      </p>
    );
  }

  return (
    <SliderContainer>
      <StyledSlider {...settings}>
        {notices.map((notice) => (
          <SlideItem key={notice._id + "emergency"}>
            <NoticeButton onClick={() => navigate(`/notice/${notice._id}`)}>
              <NoticeContent>
                <div>
                  <span className="text-main-darkGray text-sm">
                    ~ {new Date(notice.deadline.date).toLocaleDateString()}
                  </span>
                  <p className="font-bold overflow-hidden truncate whitespace-nowrap">
                    {notice.title}
                  </p>
                </div>
                <p className="text-sm">
                  현재 {notice.applies ? notice.applies.length : 0}명 지원중
                </p>
                <div>
                  <p className="text-xs text-main-darkGray overflow-hidden truncate whitespace-nowrap w-full">
                    {notice.address.street}
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-[4px] items-center text-sm">
                      <span className="font-bold text-main-color">
                        {notice.pay.type}
                      </span>
                      <span className="text-main-darkGray">
                        {notice.pay.value.toLocaleString()}원
                      </span>
                    </div>
                  </div>
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

const AddressText = styled.p`
  font-size: 12px;
  color: #7d7d7d;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export default EmergencyNoticeSlider;
