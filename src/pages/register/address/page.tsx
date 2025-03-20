import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Main from "@/components/Main";
import { useAppDispatch } from "@/hooks/useRedux";
import { setUserAddress } from "@/util/slices/registerUserInfoSlice";
import SubmitButton from "@/components/SubmitButton";
import RegHeader from "@/components/RegHeader";
import AddressInput from "@/components/AddressInput";

// 우편번호 데이터 타입 정의
interface PostcodeData {
  zonecode: string; // 우편번호
  address: string; // 기본 주소
}

const Head = styled.div`
  display: flex;
  align-self: start;
  font-weight: bold;
`;

export function RegisterAddressPage() {
  const [postcode, setPostcode] = useState(""); // 우편번호 상태
  const [address, setAddress] = useState(""); // 주소 상태
  const [detailAddress, setDetailAddress] = useState(""); // 상세주소 상태

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleClickNext = () => {
    if (!postcode || !address) return;
    dispatch(
      setUserAddress({
        zipcode: postcode,
        street: address,
        detail: detailAddress,
      })
    );
    navigate("/register/email");
  };

  return (
    <>
      <RegHeader percent={25} />
      <Main hasBottomNav={false}>
        <div className="flex flex-col gap-[20px] items-center size-full bg-white p-[20px]">
          <Head className="text-xl">주소지 등록</Head>
          <div className="w-full flex flex-col gap-[10px]">
            <AddressInput
              onAddressSelect={(address) => {
                setPostcode(address.zipcode);
                setAddress(address.street);
                setDetailAddress(address.detail);
              }}
            />
          </div>
          <div className="absolute bottom-[20px] left-0 w-full px-[20px] flex justify-center">
            <SubmitButton onClick={handleClickNext} type="button">
              다음
            </SubmitButton>
          </div>
        </div>
      </Main>
    </>
  );
}

export default RegisterAddressPage;
