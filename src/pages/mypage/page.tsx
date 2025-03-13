import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import ArrowRightIcon from "@/components/icons/ArrowRight";
import EditIcon from "@/components/icons/Edit";
import ResumeIcon from "@/components/icons/Resume";
import ResumeEditIcon from "@/components/icons/ResumeEdit";
import StarIcon from "@/components/icons/Star";
import WalletIcon from "@/components/icons/Wallet";
import Main from "@/components/Main";
import Modal from "@/components/Modal";
import getUser, { type User } from "@/hooks/fetchUser";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { logout } from "@/util/slices/authSlice";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { deleteUser } from "@/hooks/fetchUser";
import ProfileIcon from "@/components/icons/Profile";
import postBank from "@/hooks/fetchBank";

const LogoutModal = Modal;
const WithdrawModal = Modal;

const MyPage = () => {
  const userId = useAppSelector((state) => state.auth.user?._id);
  const [userData, setUserData] = useState<User | null>(null);
  const [balance, setBalance] = useState();

  const [isOpenLogoutModal, setIsOpenLogoutModal] = useState(false);
  const [isOpenWithdrawModal, setIsOpenWithdrawModal] = useState(false);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (userId) {
      const fetchData = async () => {
        setUserData(await getUser(userId));
        let Ldbl = await postBank("InquireBalance", { FinAcno: true });
        setBalance(Ldbl.Ldbl);
      };
      fetchData();
    }
  }, [userId]);

  const handleLogout = () => {
    setIsOpenLogoutModal(true);
  };

  const handleWithdraw = () => {
    setIsOpenWithdrawModal(true);
  };

  return (
    <>
      <Header>
        <div className="size-full flex justify-center items-center font-bold">
          <span>마이페이지</span>
        </div>
      </Header>
      {userData !== null && (
        <Main hasBottomNav={true}>
          <>
            <div className="size-full flex flex-col gap-[20px] pt-[20px]">
              <div className="w-full flex gap-[10px] px-[20px]">
                <div className="w-[80px] h-[80px] rounded-full border border-main-darkGray flex items-center justify-center cursor-pointer overflow-hidden">
                  {userData.profile ? (
                    <img
                      src={userData.profile}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ProfileIcon />
                  )}
                </div>
                <div className="flex flex-col max-w-[calc(100%_-_120px)]">
                  <div className="flex text-[18px] gap-[4px] items-center">
                    <span>안녕하세요!</span>
                    <span>
                      <b className="text-main-color">{userData?.name}</b>님
                    </span>
                    <img
                      src="https://em-content.zobj.net/source/microsoft-teams/363/waving-hand_light-skin-tone_1f44b-1f3fb_1f3fb.png"
                      loading="lazy"
                      alt="15.0"
                      className="size-[24px]"
                    />
                  </div>
                  <span className="text-main-gray">{userData?.email}</span>
                  <span className="text-main-gray truncate">
                    {userData?.address?.street}
                  </span>
                </div>
              </div>

              <div className="px-[20px]">
                <Link
                  to="/mypage/edit/info"
                  className="w-full h-[50px] rounded-[10px] flex gap-[10px] justify-center items-center border-main-gray border bg-white"
                >
                  <EditIcon color="#717171" width={18} height={18} />
                  <span className="text-main-darkGray">내 정보 수정</span>
                </Link>
              </div>

              <div className="size-full flex flex-col gap-[20px] rounded-t-[30px] bg-white p-[20px]">
                <div className="w-full rounded-[10px] bg-selected-box p-[20px] flex flex-col gap-[10px]">
                  <p className="text-[18px] font-bold text-main-color mb-[10px]">
                    나의 이력서
                  </p>
                  <Link
                    to="/mypage/resume/add"
                    className="flex gap-[10px] items-center"
                  >
                    <ResumeEditIcon />
                    <span className="text-selected-text">이력서 등록</span>
                  </Link>
                  <Link
                    to="/mypage/resume/list"
                    className="flex gap-[10px] items-center"
                  >
                    <ResumeIcon />
                    <span className="text-selected-text">이력서 관리</span>
                  </Link>
                </div>

                <div className="w-full p-[20px] flex flex-col gap-[10px]">
                  <Link
                    to="/mypage/bank-account"
                    className="flex justify-between items-center"
                  >
                    <div className="flex gap-[10px] items-center">
                      <WalletIcon color="#717171" />
                      <span className="text-main-darkGray">
                        {userData?.bankAccount?.bank}&nbsp;
                        {userData?.bankAccount?.account}
                        <br />
                        잔액: {Number(balance).toLocaleString()} 원
                      </span>
                    </div>
                    <ArrowRightIcon color="#717171" />
                  </Link>
                  <Link
                    to="/mypage/scrab"
                    className="flex justify-between items-center"
                  >
                    <div className="flex gap-[10px] items-center">
                      <StarIcon color="#717171" />
                      <span className="text-main-darkGray">
                        내가 스크랩한 공고
                      </span>
                    </div>
                    <ArrowRightIcon color="#717171" />
                  </Link>
                </div>

                <div className="w-full flex justify-center gap-[10px] mt-[30px]">
                  <button
                    onClick={handleLogout}
                    className="bg-white border border-main-darkGray px-[20px] py-[5px] rounded-[10px] text-main-darkGray"
                  >
                    로그아웃
                  </button>
                  <button
                    onClick={handleWithdraw}
                    className="bg-white border border-main-gray px-[20px] py-[5px] rounded-[10px] text-main-gray"
                  >
                    탈퇴하기
                  </button>
                </div>
              </div>
            </div>

            <LogoutModal
              isOpen={isOpenLogoutModal}
              setIsOpen={setIsOpenLogoutModal}
            >
              <div className="size-full flex flex-col items-center gap-[20px]">
                <p>정말 로그아웃 하시겠어요?</p>
                <div className="w-full flex gap-[10px]">
                  <button
                    onClick={() => setIsOpenLogoutModal(false)}
                    className="flex w-full h-[50px] bg-white justify-center border border-main-color items-center text-main-color rounded-[10px]"
                  >
                    취소
                  </button>
                  <button
                    onClick={() => {
                      dispatch(logout());
                      navigate("/login");
                    }}
                    className="flex w-full h-[50px] bg-main-color justify-center items-center text-white rounded-[10px]"
                  >
                    로그아웃
                  </button>
                </div>
              </div>
            </LogoutModal>

            <WithdrawModal
              isOpen={isOpenWithdrawModal}
              setIsOpen={setIsOpenWithdrawModal}
            >
              <div className="size-full flex flex-col items-center gap-[20px]">
                <div className="flex flex-col items-center gap-[10px]">
                  <img
                    src="https://em-content.zobj.net/source/microsoft-teams/363/crying-face_1f622.png"
                    loading="lazy"
                    alt="15.0"
                    className="size-[120px]"
                  />
                  <p className="text-[18px]">
                    정말 <b className="text-main-color">탈퇴</b> 하시겠어요?
                  </p>
                  <div className="text-sm flex flex-col items-center">
                    <span>
                      탈퇴 시 모든 회원 정보는 <b className="text-warn">삭제</b>
                      됩니다
                    </span>
                    <span className="text-sm text-main-darkGray">
                      ※ 지원 및 근무 이력 관련 정보는 보관됩니다
                    </span>
                  </div>
                </div>
                <div className="w-full flex gap-[10px]">
                  <button
                    onClick={() => setIsOpenWithdrawModal(false)}
                    className="flex w-full h-[50px] bg-white justify-center border border-main-color items-center text-main-color rounded-[10px]"
                  >
                    취소
                  </button>
                  <button
                    onClick={() => {
                      deleteUser(userId);
                      navigate("/login");
                    }}
                    className="flex w-full h-[50px] bg-main-color justify-center items-center text-white rounded-[10px]"
                  >
                    탈퇴
                  </button>
                </div>
              </div>
            </WithdrawModal>
          </>
        </Main>
      )}
      <BottomNav />
    </>
  );
};

export default MyPage;
