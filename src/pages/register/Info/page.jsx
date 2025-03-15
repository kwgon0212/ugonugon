import { useState } from "react";
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
  height: 100%; /* 화면 전체를 차지하도록 설정 */
  overflow: hidden; /* 전체 페이지가 스크롤되지 않도록 설정 */
  padding: 20px;
  background-color: white;
  gap: 20px;
`;
// 전체 폼 컨테이너
const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding-bottom: 20px; /* 하단 여백 추가 (키보드에 가리지 않게) */
  flex-grow: 1; /* 공간을 차지하게 하여 아래로 밀리지 않게 설정 */
  overflow-y: auto; /* 세로 스크롤 가능 */
`;
// 개별 입력 필드 영역(라벨과 텍스트 세로정렬)
const FieldContainer = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
`;
// 라벨 스타일
const Label = styled.p`
  /* font-size: 20px; */
  font-weight: 600;
  letter-spacing: -1px; //글자 간격
`;

// 성별 선택 버튼 그룹(버튼 두개를 묶고있는 박스, 가로정렬함)
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

function RegisterInfoPage() {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [number, setNumber] = useState("");
  const [residentFront, setResidentFront] = useState("");
  const [residentBack, setResidentBack] = useState("");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // 숫자만 입력되도록 처리하는 함수
  const handleNumericInput = (setter) => (e) => {
    const value = e.target.value.replace(/\D/g, ""); // 숫자만 남기고 제거 \D는 숫자가 아닌 문자를 의미
    //g는 전역 검색 플래그. 문자열 전체에서 패턴을 찾는다.
    //replace(pattern,교체할 문자열)
    //즉 문자가 입력되면 그걸 감지하고 ""로 대체한다.
    setter(value);
    //상태를 업데이트해준다.
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
            <FormContainer>
              {/* 이름 입력 */}
              {/* <div className="overflow-hidden "> */}
              <FieldContainer>
                <Label className="text-xl">이름</Label>
                <InputComponent
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
                    onChange={handleNumericInput(setResidentFront)}
                  />
                  <div className="w-[20px] border-main-color border-b" />
                  <InputComponent
                    type="password"
                    maxLength={7}
                    placeholder="뒤 7자리"
                    value={residentBack}
                    onChange={handleNumericInput(setResidentBack)}
                  />
                </div>
              </FieldContainer>
              {/* 휴대폰 번호 입력 */}
              <FieldContainer>
                <Label className="text-xl">휴대폰 번호</Label>
                <InputComponent
                  type="text"
                  placeholder="- 를 제외한 전화번호를 입력해주세요"
                  value={number}
                  maxLength={11}
                  onChange={handleNumericInput(setNumber)}
                />
              </FieldContainer>
              {/* </div> */}
            </FormContainer>
          </MainContainer>
          {/* 제출 버튼 */}
          <div className="absolute bottom-[20px] left-0 w-full px-[20px]">
            <SubmitButton onClick={handleClickNext}>다음</SubmitButton>
          </div>
        </>
      </Main>
    </>
  );
}
export default RegisterInfoPage;
