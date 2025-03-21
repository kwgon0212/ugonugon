import React, { useState, useEffect } from "react";
import DaumPostcode from "react-daum-postcode";
import InputComponent from "@/components/Input";
import Modal from "@/components/Modal";
import styled from "styled-components";

// 우편번호 데이터 타입 정의
interface PostcodeData {
  zonecode: string;
  address: string;
}

interface AddressInputProps {
  initialAddress?: {
    zipcode: string;
    street: string;
    detail: string;
  };
  onAddressSelect: (address: {
    zipcode: string;
    street: string;
    detail: string;
  }) => void;
}

const FindBtn = styled.button`
  display: flex;
  width: 150px;
  justify-content: center;
  align-items: center;
  height: 50px;
  border-radius: 10px;
  color: white;
`;

const AddressInput: React.FC<AddressInputProps> = ({
  initialAddress,
  onAddressSelect,
}) => {
  const [postcode, setPostcode] = useState(initialAddress?.zipcode || "");
  const [address, setAddress] = useState(initialAddress?.street || "");
  const [detailAddress, setDetailAddress] = useState(
    initialAddress?.detail || ""
  );
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);

  useEffect(() => {
    if (initialAddress) {
      setPostcode(initialAddress.zipcode);
      setAddress(initialAddress.street);
      setDetailAddress(initialAddress.detail);
    }
  }, [initialAddress]);

  const handleOpenPostcodePopup = () => {
    setIsPostcodeOpen(true);
  };

  const handlePostcodeComplete = (data: PostcodeData) => {
    setPostcode(data.zonecode);
    setAddress(data.address);
    setIsPostcodeOpen(false);
    onAddressSelect({
      zipcode: data.zonecode,
      street: data.address,
      detail: detailAddress,
    });
  };

  const handleDetailAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDetailAddress(e.target.value);
    onAddressSelect({
      zipcode: postcode,
      street: address,
      detail: e.target.value,
    });
  };

  return (
    <div className="w-full flex flex-col gap-[10px]">
      <div className="flex flex-row gap-[20px] w-full">
        <InputComponent
          type="text"
          placeholder="우편번호"
          value={postcode}
          readOnly
          disabled
          width="100%"
          padding="0 10px"
          className="flex-5"
        />
        <FindBtn
          type="button"
          onClick={handleOpenPostcodePopup}
          className="bg-main-color"
        >
          <span className="text-center">주소검색</span>
        </FindBtn>
      </div>
      <InputComponent
        type="text"
        placeholder="주소"
        value={address}
        readOnly
        width="100%"
        padding="0 10px"
        disabled
      />
      <InputComponent
        type="text"
        placeholder="상세주소"
        width="100%"
        padding="0 10px"
        value={detailAddress}
        onChange={handleDetailAddressChange}
      />

      <Modal isOpen={isPostcodeOpen} setIsOpen={setIsPostcodeOpen}>
        {isPostcodeOpen && (
          <DaumPostcode onComplete={handlePostcodeComplete} autoClose />
        )}
      </Modal>
    </div>
  );
};

export default AddressInput;
