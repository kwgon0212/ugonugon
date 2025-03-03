import { Route, Routes } from "react-router-dom";
import "./App.css";
import Aside from "./components/Aside";
import RootPage from "./pages/page";
import NoticeSearch from "./pages/notice/search/page";
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
import NoticeApplyPage from "./pages/notice/[noticeId]/apply/page";
import NoticeApplyResumePage from "./pages/notice/[noticeId]/apply/[resumeId]/page";
import EditBankAccountPage from "./pages/mypage/edit/bank-account/page";
import ChattingPage from "./pages/chat/chatting/page";

function App() {
  return (
    <div className="min-h-screen flex justify-center bg-gray-200">
      <div className="flex w-full max-w-[1200px] justify-center min-h-screen">
        <Aside />
        {/* 모바일 레이아웃 */}
        <div className="relative max-w-[560px] w-full min-h-screen mx-auto lg:mx-0 overflow-hidden">
          <Routes>
            <Route path="/" element={<RootPage />} />
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
              <Route path="business-num" element={<RegisterSuccess />} />
            </Route>
            <Route path="/recruit" element={<ReCruitPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/notice">
              <Route index element={<NotFound />} />
              <Route path="search" element={<NoticeSearch />} />
              <Route path=":noticeId">
                <Route index element={<NoticeDetailPage />} />
                <Route path="apply">
                  <Route index element={<NoticeApplyPage />} />
                  <Route path=":resumeId" element={<NoticeApplyResumePage />} />
                </Route>
              </Route>
              <Route path="list" element={<NoticeListPage />} />
            </Route>
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/work" element={<WorkPage />} />
            <Route path="*" element={<NotFound />} />
            <Route
              path="/mypage/edit/bank-account"
              element={<EditBankAccountPage />}
            />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/chat/:chatroomId" element={<ChattingPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
