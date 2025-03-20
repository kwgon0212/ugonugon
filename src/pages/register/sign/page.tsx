import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Main from "@/components/Main";
// 전자 서명판
import SignatureCanvas from "react-signature-canvas";
import { useAppDispatch } from "@/hooks/useRedux";
import { setUserSignature } from "@/util/slices/registerUserInfoSlice";
import SubmitButton from "@/components/SubmitButton";
import RegHeader from "@/components/RegHeader";

const Head = styled.span`
  font-weight: bold;
`;

const ClearButton = styled.button`
  display: flex;
  justify-content: center;
  text-align: center;
  padding: 10px 20px;
  background-color: var(--selected-box);
  color: var(--main-color);
  border-radius: 10px;
  /* font-weight: bold; */
  cursor: pointer;
  width: 200px;

  /* &:hover {
    background-color: #357abd;
  } */
`;

export const RegisterSignPage = () => {
  const [isSigned, setIsSigned] = useState(false);
  const signaturePadRef = useRef<SignatureCanvas | null>(null);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // 서명 초기화
  const handleClearSignature = () => {
    if (!signaturePadRef.current) return;
    signaturePadRef.current.clear();
    setIsSigned(false);
  };

  // 서명 여부 확인
  const handleEnd = () => {
    if (!signaturePadRef.current) return;
    setIsSigned(!signaturePadRef.current.isEmpty());
  };

  // 서명 저장 후 다운로드
  const handleSaveSignature = () => {
    if (!signaturePadRef.current) return;
    if (!isSigned) return;
    const dataURL = signaturePadRef.current.toDataURL("image/png");
    dispatch(setUserSignature(dataURL));
    navigate("/register/bank-account");
  };

  return (
    <>
      <RegHeader percent={50} />
      <Main hasBottomNav={false}>
        <div className="size-full bg-white p-layout flex flex-col gap-layout items-center">
          <Head className="text-xl text-left w-full">서명 등록</Head>
          <SignatureCanvas
            ref={signaturePadRef}
            penColor="black"
            backgroundColor="white"
            onEnd={handleEnd}
            canvasProps={{
              className:
                "signature-canvas flex rounded-[10px] border border-main-gray",
              style: { width: "100%", height: "250px" },
            }}
          />
          <ClearButton onClick={handleClearSignature}>서명 지우기</ClearButton>

          <div className="absolute bottom-[20px] left-0 w-full px-[20px] flex justify-center">
            <SubmitButton onClick={handleSaveSignature}>다음</SubmitButton>
          </div>
        </div>
      </Main>
    </>
  );
};

export default RegisterSignPage;
