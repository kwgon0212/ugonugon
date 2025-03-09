import React, { useState } from "react";
import axios from "axios";

const PostDataTest = () => {
  const [responseData, setResponseData] = useState<any>(null);

  const testPostData = async () => {
    const testData = {
      title: "테스트 공고",
      summary: "테스트 공고 내용",
      firstImage: "imageUrl",
      agentInfo: {
        name: "홍길동",
        email: "hong@example.com",
        phone: "010-1234-0000",
      },
      images: ["image1.jpg", "image2.jpg"],
      companyAddress: {
        zcode: "12345",
        address: "서울시 강남구",
        detailAddress: "역삼동 123-45",
      },
      exposedArea: {
        sido: "서울",
        si: "강남구",
        goo: "역삼동",
      },
      recruitmentEndDate: new Date(),
      numberOfPeople: 5,
      academicAbility: "대졸 이상",
      treatment: "경력자 우대",
      payType: "월급",
      pay: 3000000,
      payAdditional: "식대 별도",
      workNegotiationPeriod: {
        startDate: new Date(),
        endDate: new Date(),
      },
      workingPeriod: "1년이상",
      workingDetail: "주 5일",
      workDays: ["월", "화", "수", "목", "금"],
      dayNagotiable: false,
      dayAdditional: "근무 시간 협의 가능",
      dayNago: false,
      customTime: {
        startTime: new Date(),
        endTime: new Date(),
      },
      timeNago: false,
      timeAdd: ["휴게시간 있음"],
      timeAdditional: "점심시간 1시간",
      jobType: "초보 가능",
      jobTypeAdditional: "성실한 분",
      employmentType: "단기 근로",
      benefits: "4대보험, 퇴직금",
    };

    try {
      const response = await axios.post("/api/post/notice", testData);

      setResponseData(response.data); // 받은 데이터
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  return (
    <div>
      <button onClick={testPostData}>테스트 데이터 전송</button>
      {responseData && <div>응답 데이터: {JSON.stringify(responseData)}</div>}
    </div>
  );
};

export default PostDataTest;
