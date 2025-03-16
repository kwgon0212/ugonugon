import { useState, useRef, useEffect } from "react";
import Header from "../../../components/Header";
import Main from "../../../components/Main";
import styled from "styled-components";
import ArrowLeftIcon from "../../../components/icons/ArrowLeft";
import { Link, useNavigate } from "react-router-dom";
import CancelIcon from "../../../components/icons/Cancel";
import CheckIcon from "../../../components/icons/Check";
import { useAppDispatch } from "@/hooks/useRedux";
import {
  setUserName,
  setUserPhone,
  setUserResidentId,
  setUserSex,
} from "@/util/slices/registerUserInfoSlice";
import StatusBar from "@/components/StatusBar";
import InputComponent from "@/components/Input";
import SubmitButton from "@/components/SubmitButton";

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  padding: 20px;
  background-color: white;
  gap: 20px;
`;

// 전체 폼 컨테이너 - 개선된 스크롤 처리
const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding-bottom: 80px; /* 하단 여백 증가 - 버튼 높이 + 여유 공간 */
  flex-grow: 1;
  overflow-y: auto;
`;

// 개별 입력 필드 영역
const FieldContainer = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
`;

// 라벨 스타일
const Label = styled.p`
  font-weight: 600;
  letter-spacing: -1px;
`;

// 성별 선택 버튼 그룹
const GenderContainer = styled.div`
  display: flex;
  gap: 20px;
`;

// 성별 선택 버튼
const GenderButton = styled.button`
  width: 100%;
  height: 50px;
  background: ${(props) =>
    props.selected ? "var(--selected-box)" : "var(--main-bg)"};
  color: ${(props) =>
    props.selected ? "var(--main-color)" : "var(--main-darkGray)"};
  border-radius: 10px;
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
`;

// 버튼 컨테이너 - 포지션 개선
const ButtonContainer = styled.div`
  position: absolute;
  bottom: 20px;
  left: 0;
  width: 100%;
  padding: 0 20px;
  background-color: white;
  z-index: 10;
`;

function RegisterInfoPage() {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [number, setNumber] = useState("");
  const [residentFront, setResidentFront] = useState("");
  const [residentBack, setResidentBack] = useState("");
  const phoneInputRef = useRef(null);
  const formContainerRef = useRef(null);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // 숫자만 입력되도록 처리하는 함수
  const handleNumericInput = (setter) => (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setter(value);
  };

  // 입력 필드에 포커스가 들어올 때 스크롤 위치 조정
  const handleFocus = (ref) => {
    // 약간의 지연을 두고 스크롤 조정 (키보드가 완전히 올라온 후)
    setTimeout(() => {
      if (ref.current && formContainerRef.current) {
        const fieldBottom = ref.current.getBoundingClientRect().bottom;
        const containerBottom =
          formContainerRef.current.getBoundingClientRect().bottom;
        const scrollOffset = fieldBottom - containerBottom + 150; // 여유 공간 추가

        if (scrollOffset > 0) {
          formContainerRef.current.scrollTop += scrollOffset;
        }
      }
    }, 300);
  };

  const handleClickNext = () => {
    if (!name || !gender || !number || !residentFront || !residentBack) return;
    dispatch(setUserName(name));
    dispatch(setUserSex(gender));
    dispatch(setUserResidentId(residentFront + residentBack));
    dispatch(setUserPhone(number));

    navigate("/register/address");
  };

  return (
    <>
      <Header>
        <div className="relative flex flex-col justify-center size-full">
          <div className="flex flex-row justify-between px-[20px]">
            <button onClick={() => navigate(-1)}>
              <ArrowLeftIcon />
            </button>
            <Link to="/login">
              <CancelIcon />
            </Link>
          </div>
          <StatusBar percent={12.5} />
        </div>
      </Header>
      <Main hasBottomNav={false}>
        <>
          <MainContainer>
            <FormContainer ref={formContainerRef}>
              {/* 이름 입력 */}
              <FieldContainer>
                <Label className="text-xl">이름</Label>
                <InputComponent
                  width="100%"
                  padding="0 10px"
                  type="text"
                  placeholder="이름을 입력해주세요"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </FieldContainer>

              {/* 성별 선택 */}
              <FieldContainer>
                <Label className="text-xl">성별</Label>
                <GenderContainer>
                  <GenderButton
                    selected={gender === "male"}
                    onClick={() => setGender("male")}
                  >
                    <CheckIcon
                      className={`${
                        gender === "male"
                          ? "text-main-color"
                          : "text-main-darkGray"
                      }`}
                    />
                    <span
                      className={`${
                        gender === "male"
                          ? "text-main-color"
                          : "text-main-darkGray"
                      }`}
                    >
                      남성
                    </span>
                  </GenderButton>
                  <GenderButton
                    selected={gender === "female"}
                    onClick={() => setGender("female")}
                  >
                    <div style={{ marginRight: "5px" }}>
                      <CheckIcon
                        color={gender === "female" ? "#0B798B" : "#A5A5A5"}
                      />
                    </div>
                    여성
                  </GenderButton>
                </GenderContainer>
              </FieldContainer>

              {/* 주민번호 입력 */}
              <FieldContainer>
                <Label className="text-xl">주민번호</Label>
                <div className="flex gap-[10px] items-center">
                  <InputComponent
                    type="text"
                    maxLength={6}
                    placeholder="앞 6자리"
                    value={residentFront}
                    width="100%"
                    padding="0 10px"
                    onChange={handleNumericInput(setResidentFront)}
                  />
                  <div className="w-[20px] border-main-color border-b" />
                  <InputComponent
                    type="password"
                    maxLength={7}
                    placeholder="뒤 7자리"
                    width="100%"
                    padding="0 10px"
                    value={residentBack}
                    onChange={handleNumericInput(setResidentBack)}
                  />
                </div>
              </FieldContainer>

              {/* 휴대폰 번호 입력 */}
              <FieldContainer>
                <Label className="text-xl">휴대폰 번호</Label>
                <InputComponent
                  ref={phoneInputRef}
                  type="text"
                  placeholder="- 를 제외한 전화번호를 입력해주세요"
                  value={number}
                  maxLength={11}
                  width="100%"
                  padding="0 10px"
                  onChange={handleNumericInput(setNumber)}
                  onFocus={() => handleFocus(phoneInputRef)}
                />
              </FieldContainer>
            </FormContainer>
          </MainContainer>

          {/* 제출 버튼 */}
          <ButtonContainer>
            <SubmitButton onClick={handleClickNext}>다음</SubmitButton>
          </ButtonContainer>
        </>
      </Main>
    </>
  );
}

export default RegisterInfoPage;
