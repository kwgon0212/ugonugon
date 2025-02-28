import { useState } from "react";
import BottomNav from "../../../components/BottomNav";
import Header from "../../../components/Header";
import Main from "../../../components/Main";
import styled from "styled-components";
import ArrowLeftIcon from "../../../components/icons/ArrowLeft";
import { Link } from "react-router-dom";
import CancelIcon from "../../../components/icons/Cancel";
import CheckIcon from "../../../components/icons/Check";
const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh; /* 화면 전체를 차지하도록 설정 */
  overflow: hidden; /* 전체 페이지가 스크롤되지 않도록 설정 */
  padding-bottom: 20px; /* 키보드가 올라오는 공간을 위해 하단 여백 추가 */
`;
// 전체 폼 컨테이너
const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding-left: 13px;
  padding-right: 13px; /* 오른쪽 여백 추가 */
  padding-bottom: 20px; /* 하단 여백 추가 (키보드에 가리지 않게) */
  flex-grow: 1; /* 공간을 차지하게 하여 아래로 밀리지 않게 설정 */
  overflow-y: auto; /* 세로 스크롤 가능 */
`;
// 개별 입력 필드 영역(라벨과 텍스트 세로정렬)
const FieldContainer = styled.div`
  display: flex;
  gap: 15px;
  flex-direction: column;
`;
// 라벨 스타일
const Label = styled.p`
  font-size: 20px;
  font-weight: 600;
  letter-spacing: -1px; //글자 간격
  margin-top: 15px;
`;
// 입력 필드 스타일
const StyledInput = styled.input`
  width: 100%;
  height: 50px;
  padding: 12px;
  border-radius: 10px;
  font-size: 16px;
  outline: none;
  &:focus {
    border: 2px solid #0b798b;
  }
`;
// 성별 선택 버튼 그룹(버튼 두개를 묶고있는 박스, 가로정렬함)
const GenderContainer = styled.div`
  display: flex;
  gap: 20px;
`;
// 성별 선택 버튼
const GenderButton = styled.button`
  flex: 1;
  height: 50px;
  padding: 10px;
  font-size: 16px;
  background: ${(props) => (props.selected ? "#D7F6F6" : "white")};
  color: ${(props) => (props.selected ? "#0B798B" : "black")};
  border-radius: 10px;
  display: flex; // 플렉스 박스 사용
  align-items: center; // 세로 가운데 정렬
  justify-content: center; // 가로 가운데 정렬
  &:hover {
    background: ${(props) => (props.selected ? "#D7F6F6" : "#F1F1F1")};
  }
`;
// 주민번호 입력 필드 그룹
const ResidentNumberContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;
const ResidentInput = styled(StyledInput)`
  flex-grow: 1;
  width: 100px;
`;
// 제출 버튼 스타일
const SubmitButton = styled.button`
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: none;
  border-radius: 10px;
  background-color: #0b798b;
  color: white;
  cursor: pointer;
  margin-top: 10px;
  &:hover {
    background-color: #0e6977;
  }
`;
function RegisterInfoPage() {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [number, setNumber] = useState("");
  const [residentFront, setResidentFront] = useState("");
  const [residentBack, setResidentBack] = useState("");
  // 숫자만 입력되도록 처리하는 함수
  const handleNumericInput = (setter) => (e) => {
    const value = e.target.value.replace(/\D/g, ""); // 숫자만 남기고 제거 \D는 숫자가 아닌 문자를 의미
    //g는 전역 검색 플래그. 문자열 전체에서 패턴을 찾는다.
    //replace(pattern,교체할 문자열)
    //즉 문자가 입력되면 그걸 감지하고 ""로 대체한다.
    setter(value);
    //상태를 업데이트해준다.
  };
  return (
    <>
      <Header>
        <div className="relative flex flex-col justify-center w-full h-full">
          <div className="flex flex-row justify-between pl-5 pr-5">
            <Link to="/register/business-num">
              <ArrowLeftIcon />
            </Link>
            <Link to="/login">
              <CancelIcon />
            </Link>
          </div>
          <div className="absolute bottom-0 bg-main-color h-[3px] w-[72.4px]" />
          {/* 위 코드는 헤더에 색깔 바를 나타내는 코드이다. */}
        </div>
      </Header>
      <Main hasBottomNav={false}>
        <>
          <MainContainer>
            <FormContainer>
              {/* 이름 입력 */}
              <div className="overflow-hidden ">
                <FieldContainer>
                  <Label>이름</Label>
                  <StyledInput
                    type="text"
                    placeholder="이름을 입력해주세요"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </FieldContainer>
                {/* 성별 선택 */}
                <FieldContainer>
                  <Label>성별</Label>
                  <GenderContainer>
                    <GenderButton
                      selected={gender === "남성"}
                      onClick={() => setGender("남성")}
                    >
                      {" "}
                      <div style={{ marginRight: "5px" }}>
                        <CheckIcon
                          color={gender === "남성" ? "#0B798B" : "#A5A5A5"}
                        />
                      </div>
                      남성
                    </GenderButton>
                    <GenderButton
                      selected={gender === "여성"}
                      onClick={() => setGender("여성")}
                    >
                      <div style={{ marginRight: "5px" }}>
                        <CheckIcon
                          color={gender === "여성" ? "#0B798B" : "#A5A5A5"}
                        />
                      </div>
                      여성
                    </GenderButton>
                  </GenderContainer>
                </FieldContainer>
                {/* 주민번호 입력 */}
                <FieldContainer>
                  <Label>주민번호</Label>
                  <ResidentNumberContainer>
                    <ResidentInput
                      type="text"
                      maxLength={6}
                      placeholder="앞 6자리"
                      value={residentFront}
                      onChange={handleNumericInput(setResidentFront)}
                    />
                    <span>-</span>
                    <ResidentInput
                      type="password"
                      maxLength={7}
                      placeholder="뒤 7자리"
                      value={residentBack}
                      onChange={handleNumericInput(setResidentBack)}
                    />
                  </ResidentNumberContainer>
                </FieldContainer>
                {/* 휴대폰 번호 입력 */}
                <FieldContainer className="mb-[30%]">
                  <Label>휴대폰 번호</Label>
                  <StyledInput
                    type="text"
                    placeholder="- 를 제외한 전화번호를 입력해주세요"
                    value={number}
                    maxLength={11}
                    onChange={handleNumericInput(setNumber)}
                  />
                </FieldContainer>
              </div>
            </FormContainer>
          </MainContainer>
          {/* 제출 버튼 */}
          <div className="absolute bottom-[20px] left-0 w-full px-[20px]">
            <Link to="/register/address">
              <SubmitButton className="sticky bottom-[10px] ">
                다음
              </SubmitButton>
            </Link>
          </div>
        </>
      </Main>
    </>
  );
}
export default RegisterInfoPage;
