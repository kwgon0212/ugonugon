import { Route, Routes } from "react-router-dom";
import "./App.css";
import Aside from "./components/Aside";
import RootPage from "./pages/page";
import RegisterEmailPage from "./pages/register/email/page";
import RegisterEmailCertPage from "./pages/register/email/cert/page";
import RegisterSign from "./pages/register/sign/page";
import RegisterAddress from "./pages/register/address/page";
import RegisterBankAccount from "./pages/register/bank-account/page";
import RegisterUserAccount from "./pages/register/user-account/page";
import RegisterBusinessPage from "./pages/register/business-num/page";
import LoginPage from "./pages/login/page";
import NoticeListPage from "./pages/notice/list/page";
import WorkPage from "./pages/work/page";
import NoticeDetailPage from "./pages/notice/[noticeId]/page";
import MyPage from "./pages/mypage/page";
import ReCruitPage from "./pages/recruit/page";
import MapPage from "./pages/map/page";
import RegisterInfoPage from "./pages/register/Info/page.jsx";
import ChatPage from "./pages/chat/page";
import RegisterSuccess from "./pages/register/success/page";
import NotFound from "./NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import ReCruitManagePage from "./pages/recruit/manage/page";
import NoticeSearchPage from "./pages/notice/search/page";
import NoticeApplyPage from "./pages/notice/[noticeId]/apply/page";
import NoticeApplyResumePage from "./pages/notice/[noticeId]/apply/[resumeId]/page";
import MypageResumeAdd from "./pages/mypage/resume/add/page";
import MypageResumeListId from "./pages/mypage/resume/list/[resumeId]/page";
import MypageScrabPage from "./pages/mypage/scrab/page";
import MyPageEditInfoPage from "./pages/mypage/edit/info/page";
import MypageResumeList from "./pages/mypage/resume/list/page";
import EditBankAccountPage from "./pages/mypage/edit/bank-account/page";
import ChattingPage from "./pages/chat/chatting/page";
import PostDataTest from "./pages/notice/post/page";
import NoticeAddPage from "./pages/notice/add/page";
import NoticeEditPage from "./pages/notice/edit/[noticeId]/page";
import WorkApplyPage from "./pages/work/apply/page";

function App() {
  return (
    <div className="min-h-screen flex justify-center bg-gray-200">
      <div className="flex w-full max-w-[1200px] justify-center min-h-screen">
        <Aside />
        {/* 모바일 레이아웃 */}
        <div className="relative max-w-[560px] w-full min-h-screen mx-auto lg:mx-0 overflow-hidden">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register">
              <Route index element={<NotFound />} />
              <Route path="sign" element={<RegisterSign />} />
              <Route path="address" element={<RegisterAddress />} />
              <Route path="email" element={<RegisterEmailPage />} />
              <Route path="email/cert" element={<RegisterEmailCertPage />} />
              <Route path="bank-account" element={<RegisterBankAccount />} />
              <Route path="user-account" element={<RegisterUserAccount />} />
              <Route path="info" element={<RegisterInfoPage />} />
              <Route path="business-num" element={<RegisterBusinessPage />} />
              <Route path="success" element={<RegisterSuccess />} />
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<RootPage />} />

              <Route path="/recruit">
                <Route index element={<ReCruitPage />} />
                <Route path="manage" element={<ReCruitManagePage />} />
              </Route>

              <Route path="/map" element={<MapPage />} />

              <Route path="/notice">
                <Route index element={<NotFound />} />
                <Route path="post" element={<PostDataTest />} />
                <Route path="search" element={<NoticeSearchPage />} />
                <Route path="add" element={<NoticeAddPage />} />
                <Route path="edit/:noticeId" element={<NoticeEditPage />} />
                <Route path=":noticeId">
                  <Route index element={<NoticeDetailPage />} />
                  <Route path="apply">
                    <Route index element={<NoticeApplyPage />} />
                    <Route
                      path=":resumeId"
                      element={<NoticeApplyResumePage />}
                    />
                  </Route>
                </Route>
                <Route path="list" element={<NoticeListPage />} />
              </Route>

              <Route path="/mypage">
                <Route index element={<MyPage />} />
                <Route path="*" element={<NotFound />} />
                <Route path="resume/add" element={<MypageResumeAdd />} />
                <Route path="resume/list">
                  <Route index element={<MypageResumeList />} />
                  <Route path=":resumeID" element={<MypageResumeListId />} />
                </Route>
                <Route path="scrab" element={<MypageScrabPage />} />
                <Route path="edit">
                  <Route index element={<NotFound />} />
                  <Route path="info" element={<MyPageEditInfoPage />} />
                  <Route
                    path="bank-account"
                    element={<EditBankAccountPage />}
                  />
                </Route>
              </Route>

              <Route path="/chat">
                <Route index element={<ChatPage />} />
                <Route path=":chatroomId" element={<ChattingPage />} />
              </Route>

              <Route path="/work" element={<WorkPage />} />
              <Route path="/work/apply" element={<WorkApplyPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
