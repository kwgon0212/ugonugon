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
import RegisterInfoPage from "./pages/register/Info/page";
import RegisterBusinessPage from "./pages/register/business-num/page";
import ReCruitPage from "./pages/recruit/page";
import MapPage from "./pages/map/page";
import LoginPage from "./pages/login/page";
import NoticeListPage from "./pages/notice/list/page";
import WorkPage from "./pages/work/page";

function App() {
  return (
    <div className="h-screen flex justify-center bg-gray-200">
      <div className="flex w-full max-w-[1200px] justify-center h-screen">
        <Aside />
        {/* 모바일 레이아웃 */}
        <div className="relative max-w-[560px] w-full h-screen mx-auto lg:mx-0">
          <Routes>
            <Route path="/" element={<RootPage />} />
            <Route path="/register">
              <Route path="sign" element={<RegisterSign />} />
              <Route path="address" element={<RegisterAddress />} />
              <Route path="email" element={<RegisterEmailPage />} />
              <Route path="email/cert" element={<RegisterEmailCertPage />} />
              <Route path="bank-account" element={<RegisterBankAccount />} />
              <Route path="user-account" element={<RegisterUserAccount />} />
              <Route path="info" element={<RegisterInfoPage />} />
              <Route path="business-num" element={<RegisterBusinessPage />} />
            </Route>
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
