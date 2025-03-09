import Main from "@/components/Main";
import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import ArrowLeftIcon from "@/components/icons/ArrowLeft";
import { Link } from "react-router-dom";
import AddIcon from "@/components/icons/Plus";
import ArrowRightIcon from "@/components/icons/ArrowRight";
function ReCruitManage(props) {
  const spanStyle = {
    text: "font-bold text-main-color",
  };
  return (
    <div className="bg-white h-[160px] rounded-[10px] flex-col p-3 ">
      <div className="flex justify-between">
        <p className="font-bold text-[12px] mb-2">{props.list[0]}</p>
        <ArrowRightIcon />{" "}
      </div>
      <div className="flex justify-between">
        <div className="flex flex-col gap-0.5 text-main-darkGray text-[10px]">
          <p className="text-[12px] font-bold text-black">근무조건</p>
          <p>
            <span className={spanStyle.text}>시급</span> {props.list[1]}
          </p>
          <p>
            <span className={spanStyle.text}>기간</span> {props.list[2]}
          </p>
          <p>
            <span className={spanStyle.text}>시간</span> {props.list[3]}
          </p>
        </div>
        <div className="flex flex-col gap-0.5 text-[10px] text-main-darkGray">
          <p className="text-[12px] font-bold text-black">모집조건</p>
          <p>
            <span className={spanStyle.text}>마감</span> {props.list[4]}
          </p>
          <p>
            <span className={spanStyle.text}>인원</span> {props.list[5]}
          </p>
        </div>
        <div className="flex flex-col gap-2 text-[10px] text-main-color">
          <div className="bg-selected-box rounded-[10px] text-center p-1">
            모집중
          </div>
          <div className="bg-selected-box rounded-[10px] text-center p-1">
            122명 지원
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-0.5 text-[10px] mt-2 text-main-darkGray">
        <p className="text-[12px] font-bold text-black">근무지역</p>
        <p>{props.list[6]}</p>
      </div>
    </div>
  );
}
function ReCruitManagePage() {
  const list = [
    "풀스택 프로젝트 보조 구인/ 중식 제공",
    "10,030",
    "25,02,10",
    "25.02.12~25.02.12",
    "0",
    "06:00~18:00",
    "서울 중구 청파로 463 한국경제신문사 3층, WISDOM강의실",
  ];
  const list2 = [
    "바퀴벌레 잡아주실분",
    "10,030",
    "25,02,10",
    "25.02.12~25.02.12",
    "0",
    "06:00~18:00",
    "서울 중구 청파로 463 한국경제신문사 3층, WISDOM강의실",
  ];
  return (
    <>
      <Header>
        {" "}
        <div className="flex items-center h-full ml-2">
          <ArrowLeftIcon />{" "}
          <span className="font-bold flex justify-center w-full mr-3">
            고용 현황
          </span>
        </div>
      </Header>
      <Main hasBottomNav={true}>
        <div className="size-full bg-white">
          <div className="p-4 space-y-4 rounded-t-[30px] bg-main-bg pb-28">
            {/* 상단 제목 */}
            <h2 className="text-[18px] font-bold">나의 공고 관리</h2>
            <div className="flex flex-col gap-5">
              <div className="bg-white h-[160px] rounded-[10px] flex justify-center items-center">
                <Link
                  to="#"
                  className="bg-selected-box rounded-[10px] flex-1 m-4 h-[80%] border-2 border-main-color border-dashed "
                >
                  <div className="flex flex-col justify-center h-full items-center">
                    <AddIcon />
                    <p className="text-main-color text-[12px]">
                      새 공고 등록하기{" "}
                    </p>{" "}
                  </div>
                </Link>
              </div>
              <ReCruitManage list={list} />
              <ReCruitManage list={list2} />
            </div>
          </div>
        </div>
      </Main>
      <BottomNav></BottomNav>
    </>
  );
}
export default ReCruitManagePage;
