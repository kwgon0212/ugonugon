import React, { useEffect, useRef, useState } from "react";
import DaumPostcode from "react-daum-postcode";
import Main from "@/components/Main";
import Header from "@/components/Header";
import ArrowLeftIcon from "@/components/icons/ArrowLeft";
import CameraIcon from "@/components/icons/Camera";
import ProfileIcon from "@/components/icons/Profile";
import { Link } from "react-router-dom";
import { useAppSelector } from "@/hooks/useRedux";
import getUser, { putUser } from "@/hooks/fetchUser";

// 사용자 데이터에 대한 인터페이스 정의
interface Address {
  zipcode: string;
  street: string;
  detail: string;
}

interface User {
  _id: string;
  name: string;
  sex: "male" | "female";
  residentId: string;
  phone: string;
  address: Address;
  profile: string | null;
}

// DaumPostcode 완료 이벤트에 대한 인터페이스
interface DaumAddressData {
  zonecode: string;
  address: string;
}

function MyPageEditInfoPage(): JSX.Element {
  const userId = useAppSelector((state: any) => state.auth.user?._id);
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    if (userId) {
      const fetchData = async () => {
        setUserData(await getUser(userId));
      };
      fetchData();
    }
  }, [userId]);

  const [phone, setPhone] = useState<string>("");
  const [zipcode, setZipcode] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [detailAddress, setDetailAddress] = useState<string>("");

  const [zipcodeOpen, setZipcodeOpen] = useState<boolean>(false);
  const [exitModalOpen, setExitModalOpen] = useState<boolean>(false); // 나가기 모달 상태
  const [saveModalOpen, setSaveModalOpen] = useState<boolean>(false);

  const handleOpenzipcodePopup = () => setZipcodeOpen(true);

  const handlezipcodeComplete = (data: DaumAddressData) => {
    setZipcode(data.zonecode);
    setAddress(data.address);
    setZipcodeOpen(false);
  };

  const handleExitModal = () => setExitModalOpen(!exitModalOpen); // 저장 버튼 클릭 시 모달 열기

  const [profile, setProfile] = useState<string | null>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);

  const handleProfileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file); // Base64 변환
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          const img = new Image();
          img.src = reader.result;
          img.onload = () => {
            const { width, height } = img;
            const scale = 80 / Math.min(width, height); // 짧은 쪽을 80px로 변환
            const newWidth = Math.round(width * scale);
            const newHeight = Math.round(height * scale);

            const canvas = document.createElement("canvas");
            canvas.width = newWidth;
            canvas.height = newHeight;
            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.drawImage(img, 0, 0, newWidth, newHeight);
              const compressedImage = canvas.toDataURL("image/webp", 0.7);
              setProfile(compressedImage);
            }
          };
        }
      };
    }
  };

  useEffect(() => {
    if (userData !== null) {
      setZipcode(userData.address.zipcode);
      setAddress(userData.address.street);
      setDetailAddress(userData.address.detail);
      setPhone(userData.phone);
      setProfile(userData.profile);
    }
  }, [userData]);

  return (
    <>
      <Header>
        <div className="flex items-center h-full ml-2">
          <div onClick={handleExitModal}>
            <ArrowLeftIcon />
          </div>
          <span className="font-bold flex justify-center w-full mr-3">
            내 정보 수정
          </span>
        </div>
      </Header>
      {userData !== null && (
        <Main hasBottomNav={false}>
          <div>
            <form className="w-full px-5 flex flex-col gap-layout">
              <div>
                <div className="flex h-20 mt-5">
                  <div className="mr-5 relative">
                    <div
                      className="w-20 h-20 rounded-full border border-main-darkGray flex items-center justify-center cursor-pointer overflow-hidden"
                      onClick={() => profileInputRef.current?.click()}
                    >
                      {profile ? (
                        <img
                          src={profile}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ProfileIcon>
                          <span className="text-gray-500">Upload</span>
                        </ProfileIcon>
                      )}
                      <input
                        type="file"
                        ref={profileInputRef}
                        accept="image/*"
                        className="hidden"
                        onChange={handleProfileChange}
                      />
                    </div>
                    <p className="w-6 h-6 bg-main-color rounded-full flex justify-center items-center absolute right-0 bottom-0">
                      <CameraIcon color="white" width={14} height={14} />
                    </p>
                  </div>
                  <ul className="flex flex-col gap-[10px] text-[12px] text-main-darkGray">
                    {["이름", "성별", "주민번호"].map((value, index) => (
                      <li key={index}>{value}</li>
                    ))}
                  </ul>
                  <ul className="flex flex-col gap-[10px] text-[12px] ml-[10px]">
                    {[
                      userData.name,
                      userData.sex === "male" ? "남성" : "여성",
                      userData.residentId.slice(0, 6) +
                        "-" +
                        userData.residentId[6] +
                        "******",
                    ].map((value, index) => (
                      <li key={index}>{value}</li>
                    ))}
                  </ul>
                </div>
                <div className="flex w-full mt-5 flex-col">
                  <p className="font-semibold">휴대폰 번호</p>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-white border p-2 h-[50px] border-main-gray rounded-[10px] mt-1"
                  />
                  <p className="font-semibold mt-2">거주지</p>
                  <div className="flex gap-3 mb-2 items-end">
                    <input
                      type="text"
                      value={zipcode}
                      placeholder="우편번호"
                      readOnly
                      className="bg-white border h-[50px] w-[202px] px-2 border-main-gray rounded-[10px] mt-1"
                    />
                    <button
                      type="button"
                      onClick={handleOpenzipcodePopup}
                      className="bg-main-color h-[50px] flex justify-center items-center text-white rounded-[10px] flex-grow"
                    >
                      주소검색
                    </button>
                  </div>
                  <input
                    type="text"
                    value={address}
                    placeholder="주소"
                    readOnly
                    className="bg-white border h-[50px] mb-2 p-2 border-main-gray rounded-[10px] mt-1"
                  />
                  <input
                    type="text"
                    value={detailAddress}
                    onChange={(e) => setDetailAddress(e.target.value)}
                    placeholder="상세 주소 입력"
                    className="bg-white border h-[50px] p-2 border-main-gray rounded-[10px] mt-1"
                  />
                </div>
                <button
                  type="button"
                  className="w-full h-[50px] mt-28 bg-main-color rounded-[10px] font-semibold text-white"
                  onClick={() => {
                    putUser(userId, {
                      phone,
                      address: {
                        zipcode,
                        street: address,
                        detail: detailAddress,
                      },
                      profile,
                    });
                    setSaveModalOpen(!saveModalOpen);
                  }}
                >
                  저장하기
                </button>
              </div>
              {saveModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
                  <div className="bg-white flex flex-col gap-[20px] p-5 rounded-[10px] w-[362px] items-center">
                    <p className="font-bold text-lg">
                      정보가 성공적으로 수정되었습니다.
                    </p>
                    <Link
                      to="/mypage"
                      className="w-1/2 p-2 rounded-[10px] text-center bg-main-color text-white"
                    >
                      <button
                        type="button"
                        className="text-center"
                        onClick={() => setSaveModalOpen(!saveModalOpen)}
                      >
                        확인
                      </button>
                    </Link>
                  </div>
                </div>
              )}
            </form>
            {zipcodeOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-5 rounded-[10px]">
                  <DaumPostcode onComplete={handlezipcodeComplete} />
                  <button
                    className="mt-2 bg-gray-500 text-white p-2 rounded-[5px]"
                    onClick={() => setZipcodeOpen(!zipcodeOpen)}
                  >
                    닫기
                  </button>
                </div>
              </div>
            )}
          </div>
        </Main>
      )}
      {exitModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white p-5 rounded-[10px] w-[362px] text-center">
            <p className="font-bold text-lg">정말로 나가시겠습니까?</p>
            <p className="text-[14px]  mt-2">
              나가시면 변경사항이 저장되지 않습니다.
            </p>
            <div className="flex gap-3 justify-between mt-5">
              <button
                className="flex-1 border border-main-color rounded-[10px] text-main-color font-semibold p-2"
                onClick={handleExitModal}
              >
                취소
              </button>
              <Link to="/mypage" className="flex-1">
                <button
                  className="w-[151px] p-2 rounded-[10px] bg-main-color text-white"
                  onClick={() => {
                    setExitModalOpen(false);
                  }}
                >
                  나가기
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MyPageEditInfoPage;
