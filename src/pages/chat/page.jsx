import Main from "@/components/Main";
import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";

function Chat(props) {
  return (
    <>
      <div className="bg-white w-[100%] p-4 rounded-[10px] mb-4">
        <div className="flex justify-between mb-2">
          <span className="font-bold">
            회사명 <span className="text-main-color">{props.list}</span>님
          </span>
          <span className="text-[14px] text-main-darkGray">13:00</span>
        </div>
        <p className="text-[14px] text-main-darkGray">마지막으로 한 대화...</p>
      </div>
    </>
  );
}
function ChatPage() {
  const list = ["고용주", "근로자"];
  return (
    <>
      {" "}
      <Header>
        <p className="flex h-full justify-center items-center font-bold">
          채팅
        </p>
      </Header>
      <Main hasBottomNav={true}>
        <div className="p-5">
          <Chat list={list[0]}></Chat>
          <Chat list={list[1]}></Chat>
        </div>
      </Main>
      <BottomNav>
        <></>
      </BottomNav>
    </>
  );
}
export default ChatPage;
