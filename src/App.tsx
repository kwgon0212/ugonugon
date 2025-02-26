import { Route, Routes } from "react-router-dom";
import "./App.css";
import Aside from "./components/Aside";
import RootPage from "./pages/page";
import RegisterBankAccount from "./pages/bank-account/page";
import RegisterUserAccount from "./pages/user-account/page";

function App() {
  return (
    <div className="h-screen flex justify-center bg-gray-200">
      <div className="flex w-full max-w-[1200px] justify-center h-screen">
        <Aside />
        {/* 모바일 레이아웃 */}
        <div className="relative max-w-[560px] w-full h-screen mx-auto lg:mx-0">
          <Routes>
            <Route path="/" element={<RootPage />} />
            <Route
              path="/register/bank-account"
              element={<RegisterBankAccount />}
            />
            <Route
              path="/register/user-account"
              element={<RegisterUserAccount />}
            />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
