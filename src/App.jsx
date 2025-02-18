import { Route, Routes } from "react-router-dom";
import RootPage from "./pages/page";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<RootPage />} />
      </Routes>
    </div>
  );
}

export default App;
