import { Types } from "mongoose";
import Notice from "@/types/Notice";

const dummyNotice: Notice[] = [
  {
    _id: new Types.ObjectId("65f1b2c3d4e5f6789a0b1c2d"),
    title: "카페 바리스타 구인",
    jobType: "서비스직",
    pay: {
      type: "시급",
      value: 12000,
    },
    hireType: ["파트타임", "정규직"],
    period: {
      start: new Date("2025-03-10"),
      end: new Date("2025-06-10"),
      discussion: true,
    },
    hour: {
      start: new Date("2025-03-10T09:00:00"),
      end: new Date("2025-03-10T18:00:00"),
      discussion: false,
    },
    restTime: {
      start: new Date("2025-03-10T12:30:00"),
      end: new Date("2025-03-10T13:30:00"),
    },
    day: ["월", "화", "목", "금"],
    workDetail: "고객 응대, 음료 제조, 매장 청소",
    welfare: "식사 제공, 직원 할인, 유니폼 지급",
    postDetail: "책임감 있고 성실한 분을 찾습니다. 초보자도 환영합니다.",
    deadline: {
      date: new Date("2025-03-15"),
      time: new Date("2025-03-15T23:59:00"),
    },
    person: 2,
    preferences: "경력자 우대, 바리스타 자격증 소지자 우대",
    education: {
      school: "무관",
      state: "무관",
    },
    address: {
      zipcode: "04511",
      street: "서울특별시 중구 을지로 12",
      detail: "2층 스타벅스 매장",
    },
    recruiter: {
      name: "김매니저",
      email: "manager@coffee.com",
      phone: "010-1234-5678",
    },
    createdAt: new Date(),
    author: "기업ID_123456",
    images: ["https://placehold.co/600x400", "https://placehold.co/600x400"],
    company: "스타벅스 코리아",
    applies: [
      {
        userId: new Types.ObjectId(),
        resumeId: new Types.ObjectId(),
        appliedAt: new Date(),
        status: "pending",
      },
      {
        userId: new Types.ObjectId(),
        resumeId: new Types.ObjectId(),
        appliedAt: new Date(),
        status: "rejected",
      },
    ],
  },
  {
    _id: new Types.ObjectId("65f1b2c3d4e5fd789a0b1c2d"),
    title: "야간 편의점 알바 모집",
    jobType: "매장 관리",
    pay: {
      type: "시급",
      value: 11000,
    },
    hireType: ["아르바이트"],
    period: {
      start: new Date("2025-04-01"),
      end: new Date("2025-09-30"),
      discussion: false,
    },
    hour: {
      start: new Date("2025-04-01T22:00:00"),
      end: new Date("2025-04-02T06:00:00"),
      discussion: false,
    },
    restTime: {
      start: new Date("2025-04-02T02:00:00"),
      end: new Date("2025-04-02T03:00:00"),
    },
    day: ["월", "화", "수", "목", "금", "토"],
    workDetail: "편의점 계산, 재고 관리, 매장 청소",
    welfare: "야간 수당 지급, 유니폼 지급",
    postDetail: "야간 근무 가능자 지원 바랍니다.",
    deadline: {
      date: new Date("2025-04-10"),
      time: new Date("2025-04-10T18:00:00"),
    },
    person: 1,
    preferences: "경험자 우대",
    education: {
      school: "무관",
      state: "무관",
    },
    address: {
      zipcode: "06236",
      street: "서울특별시 강남구 테헤란로 87",
      detail: "GS25 테헤란점",
    },
    recruiter: {
      name: "박점장",
      email: "manager@gs25.com",
      phone: "010-2222-3333",
    },
    createdAt: new Date(),
    author: "기업ID_789101",
    images: ["https://placehold.co/600x400"],
    company: "GS25 테헤란점",
    applies: [
      {
        userId: new Types.ObjectId(),
        resumeId: new Types.ObjectId(),
        appliedAt: new Date(),
        status: "accepted",
      },
    ],
  },
  {
    _id: new Types.ObjectId("65f1b2d3d4e5f6789a0b1c2d"),
    title: "쿠팡 플렉스 단기 알바 모집",
    jobType: "배송",
    pay: {
      type: "건당",
      value: 3000,
    },
    hireType: ["프리랜서"],
    period: {
      start: new Date("2025-03-15"),
      end: new Date("2025-04-15"),
      discussion: false,
    },
    hour: {
      start: new Date("2025-03-15T07:00:00"),
      end: new Date("2025-03-15T12:00:00"),
      discussion: true,
    },
    restTime: {
      start: new Date("2025-03-15T12:00:00"),
      end: new Date("2025-03-15T12:00:00"),
    },
    day: ["월", "화", "수", "목", "금"],
    workDetail: "쿠팡 물류센터에서 상품 픽업 후 배송",
    welfare: "",
    postDetail: "차량 소지자 필수, 운전면허 1종 보통 필수",
    deadline: {
      date: new Date("2025-03-20"),
      time: new Date("2025-03-20T17:00:00"),
    },
    person: 10,
    preferences: "운전 경력 1년 이상",
    education: {
      school: "무관",
      state: "무관",
    },
    address: {
      zipcode: "18471",
      street: "경기도 화성시 동탄물류로 23",
      detail: "쿠팡 동탄 물류센터",
    },
    recruiter: {
      name: "이현우",
      email: "recruit@coupang.com",
      phone: "010-9876-5432",
    },
    createdAt: new Date(),
    author: "기업ID_555666",
    images: [],
    company: "쿠팡",
    applies: [],
  },
];

export default dummyNotice;
