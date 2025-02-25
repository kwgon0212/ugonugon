import { Route, Routes } from "react-router-dom";
import "./App.css";
import Aside from "./components/Aside";
import RootPage from "./pages/page";

function App() {
  return (
    <div className="h-screen flex justify-center bg-gray-50">
      <div className="flex w-full max-w-[1200px] justify-center h-screen">
        <Aside />
        {/* 모바일 레이아웃 */}
        <div className="relative max-w-[560px] w-full h-screen shadow-lg mx-auto lg:mx-0">
          <Routes>
            <Route path="/" element={<RootPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
