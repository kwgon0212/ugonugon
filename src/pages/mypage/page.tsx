import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
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
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { deleteUser } from "@/hooks/fetchUser";
import ProfileIcon from "@/components/icons/Profile";
import Loading from "@/components/loading/page";
import FlagIcon from "@/components/icons/Flag";

const LogoutModal = Modal;
const WithdrawModal = Modal;

const MyPage = () => {
  const userId = useAppSelector((state) => state.auth.user?._id);
  const [userData, setUserData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가

  const [isOpenLogoutModal, setIsOpenLogoutModal] = useState(false);
  const [isOpenWithdrawModal, setIsOpenWithdrawModal] = useState(false);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (userId) {
      const fetchData = async () => {
        setIsLoading(true); // 로딩 시작

        try {
          const user = await getUser(userId);
          setUserData(user);
        } catch (error) {
          console.error("사용자 데이터 로딩 오류:", error);
        } finally {
          setIsLoading(false); // 로딩 완료
        }
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
        <div className="size-full flex justify-center items-center font-bold bg-main-color text-white">
          <span>마이페이지</span>
        </div>
      </Header>
      <Main hasBottomNav={true}>
        {/* 항상 div를 반환하고 그 안에서 조건부 렌더링 */}
        <div className="size-full">
          {isLoading ? (
            <Loading />
          ) : (
            userData && (
              <div className="size-full flex flex-col gap-[20px] bg-white">
                <div className="w-full flex flex-col gap-[20px] p-[20px] pt-0 bg-main-color rounded-b-[20px]">
                  <div className="w-full flex flex-col gap-[20px] bg-white rounded-[10px] p-[20px]">
                    <div className="w-full flex gap-[20px]">
                      <div className="size-[80px] rounded-full border border-main-gray flex items-center justify-center cursor-pointer overflow-hidden">
                        {userData.profile ? (
                          <img
                            src={userData.profile}
                            alt="Profile"
                            className="size-full object-cover"
                          />
                        ) : (
                          <ProfileIcon />
                        )}
                      </div>
                      <div className="flex flex-col justify-around max-w-[calc(100%_-_120px)]">
                        <div className="flex gap-[4px]">
                          <span>안녕하세요!</span>
                          <span>
                            <b className="text-main-color">{userData?.name}</b>
                            님
                          </span>
                          <img
                            src="https://em-content.zobj.net/source/microsoft-teams/363/waving-hand_light-skin-tone_1f44b-1f3fb_1f3fb.png"
                            loading="lazy"
                            alt="15.0"
                            className="size-[24px]"
                          />
                        </div>
                        <div>
                          <p className="text-main-darkGray text-sm">
                            {userData?.email}
                          </p>
                          <p className="text-main-darkGray text-sm truncate">
                            {userData?.address?.street}
                          </p>
                        </div>
                      </div>
                    </div>
                    <Link
                      to="/mypage/edit/info"
                      className="w-full h-[50px] rounded-[10px] flex gap-[10px] justify-center items-center border-main-gray border bg-white"
                    >
                      <EditIcon color="#717171" width={18} height={18} />
                      <span className="text-main-darkGray">내 정보 수정</span>
                    </Link>
                  </div>
                </div>

                <div className="size-full flex flex-col justify-between p-[20px]">
                  <div className="size-full flex flex-col gap-[10px]">
                    <Link
                      to="/mypage/resume/add"
                      className="flex gap-[10px] items-center border-b border-b-main-gray p-[10px] text-main-darkGray"
                    >
                      <ResumeEditIcon className="text-main-darkGray" />
                      <span>이력서 등록</span>
                    </Link>
                    <Link
                      to="/mypage/resume/list"
                      className="flex gap-[10px] items-center border-b border-b-main-gray p-[10px] text-main-darkGray"
                    >
                      <ResumeIcon className="text-main-darkGray" />
                      <span>이력서 관리</span>
                    </Link>
                    <Link
                      to="/mypage/bank-account"
                      className="flex gap-[10px] items-center border-b border-b-main-gray p-[10px] text-main-darkGray"
                    >
                      <WalletIcon className="text-main-darkGray" />
                      <span>
                        {userData?.bankAccount?.bank}{" "}
                        {userData?.bankAccount?.account}
                      </span>
                    </Link>
                    <Link
                      to="/mypage/scrab"
                      className="flex gap-[10px] items-center border-b border-b-main-gray p-[10px] text-main-darkGray"
                    >
                      <StarIcon className="text-main-darkGray" />
                      <span>내가 스크랩한 공고</span>
                    </Link>
                    <p className="flex gap-[10px] items-center border-b border-b-main-gray p-[10px] text-main-gray">
                      <FlagIcon className="text-main-gray" />
                      <span>v1.0.0</span>
                    </p>
                  </div>
                  <div className="w-full flex justify-center gap-[10px] mt-[30px] text-sm">
                    <button
                      onClick={handleLogout}
                      className="bg-main-gray border border-main-gray px-[20px] py-[5px] rounded-[10px] text-main-darkGray"
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
            )
          )}
        </div>
      </Main>

      <LogoutModal isOpen={isOpenLogoutModal} setIsOpen={setIsOpenLogoutModal}>
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
      <BottomNav />
    </>
  );
};

export default MyPage;
