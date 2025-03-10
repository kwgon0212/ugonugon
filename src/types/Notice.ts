import { Types } from "mongoose";

export default interface Notice {
  _id: string;
  title: string;
  jobType: string;
  pay: {
    type: string;
    value: number;
  };
  hireType: string[];
  period: {
    start: string;
    end: string;
    discussion: boolean;
  };
  hour: {
    start: string;
    end: string;
    discussion: boolean;
  };
  restTime: {
    start: string;
    end: string;
  };
  day: string[];
  workDetail?: string;
  welfare?: string;
  postDetail?: string;
  deadline: {
    date: string;
    time: string;
  };
  person: number;
  preferences?: string;
  education: {
    school: string;
    state: string;
  };
  address: {
    zipcode: string;
    street: string;
    detail?: string;
  };
  recruiter?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  createdAt?: string;
  author: string;
  img?: string[];
  company?: string;
  applies?: {
    userId: Types.ObjectId;
    resumeId: Types.ObjectId;
    appliedAt: Date;
  }[];
}
