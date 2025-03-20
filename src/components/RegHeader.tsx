import Header from "./Header";
import { Link, useNavigate } from "react-router-dom";
import ArrowLeftIcon from "./icons/ArrowLeft";
import CancelIcon from "./icons/Cancel";

// const RegHeader = ({ percent }: { percent: number }) => {
const RegHeader = ({ percent }: { percent: number }) => {
  const navigate = useNavigate();
  return (
    <Header>
      <div className="relative flex flex-col justify-center size-full">
        <div className="flex flex-row justify-between px-[20px]">
          <button onClick={() => navigate(-1)}>
            <ArrowLeftIcon />
          </button>
          <Link to="/login">
            <CancelIcon />
          </Link>
        </div>
        <div className="w-full absolute bottom-0 left-0">
          <div
            className="bg-main-color h-[3px]"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </Header>
  );
};

export default RegHeader;
