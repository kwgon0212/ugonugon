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
  bank: string;
  account: number;
  sign: string; // 이미지
  resume: [];
  apply: [];
  post: [];
};

type Post = {
  _id: string;
  redisted: Date; // datetime
  userId: string; // Users._id
  title: string;
  endDate: Date; // datetime
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
  hiringType: string;
  hiringNums: number;
  welfare?: [string];
  education: string;
  preferences;
};

type Resume = {
  _id: string;
};

// Users.createIndex({ "memberId": 1 }, { unique: true });
// Users.createIndex({ "phone": 1 }, { unique: true });
// Users.createIndex({ "email": 1 }, { unique: true });
// Users.createIndex({ "name": 1, "socialNumber": 1 }, { unique: true });
