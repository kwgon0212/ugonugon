enum Bank {
  Toss = 0,
  NhBank,
  kakao,
  Kb,
  Shinhan,
  Woori,
  Ibk,
  Hana,
  Kfcc,
  BnkBusan,
  Im,
  KBank,
  Shin,
  Post,
  Sc,
}

type Users = {
  _id: string;
  memberId: string;
  password: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  addressDetail: string;
  zip: string;
  lisenseNumber?: string;
  socialNumber: string;
  birth: string;
  sex: boolean;
  bank: Bank;
  account: number;
  sign: string; // 이미지
  resume?: [Resume];
  apply?: {
    try: [Post];
    match: [Post];
  };
  post?: {
    try: [Post];
    match: [Post];
  };
};

// Users.createIndex({ "memberId": 1 }, { unique: true });
// Users.createIndex({ "phone": 1 }, { unique: true });
// Users.createIndex({ "email": 1 }, { unique: true });
// Users.createIndex({ "name": 1, "socialNumber": 1 }, { unique: true });

enum PayType {
  Hour = 0,
  Day,
  Week,
  Month,
  Total,
}
enum HiringType {
  Day = 0,
  short,
  long,
}

type Post = {
  _id: string;
  redisted: Date; // datetime
  userId: string; // Users._id
  title: string;
  endDate: Date;
  // 근무조건
  pay: {
    type: PayType;
    amount: number;
  };
  workingLength: {
    start: Date;
    end: Date;
  };
  workDays: number;
  workDay: string;
  workTime: {
    start: Date; // time
    end: Date; // time
  };
  workType: string;
  hiringType: HiringType;
  welfare?: [string]; // 복리후생
  // 모집 조건
  // endDate: Date; // 위에 있음
  hiringNums: number;
  education: string;
  preferences?: [string]; // 우대사항
  location: string;
  locationDetail: string;
  // 상세 요강
  announcementDetatil: string;
  // 채용 담당자 정보
  recruiter: string;
  recruiterPhone: string;
  // 고용주 정보
  employer: string;
  // workType: string; // 위에 있음
  employerLocation: string;
  employerLocationDetail: string;
  employerStars: number;
  reviewNumber: number;
  reviews?: [{ userId: string }]; // Users._id
  applications?: [string]; // Users._id
};

type Chatting = {
  _id: string;
  member: [string, string]; // Users._id, Users._id
  messages: {
    send: string; // Users._id
    to: string; // Users._id
    content: string;
  };
};

type Resume = {
  _id: string;
  name: string;
  title: string;
  sex: boolean;
  birth: Date; // Year
  phone: string;
  email: string;
  location: string;
  education: string;
  educationType: string;
  workLocation?: [string];
  workType?: [string];
  // 희망 근무 기간
  workLength?: {
    start: Date;
    end: Date;
  };
  introduce: string;
  default: boolean; // 기본 이력서
};
