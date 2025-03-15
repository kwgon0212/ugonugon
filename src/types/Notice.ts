import { Types } from "mongoose";

export default interface Notice {
  _id: Types.ObjectId;
  title: string;
  jobType: string;
  pay: {
    type: string;
    value: number;
  };
  hireType: string[];
  period: {
    start: Date;
    end: Date;
    discussion: boolean;
  };
  hour: {
    start: Date;
    end: Date;
    discussion: boolean;
  };
  restTime: {
    start: Date;
    end: Date;
  };
  day: string[];
  workDetail?: string;
  welfare?: string;
  postDetail?: string;
  deadline: {
    date: Date;
    time: Date;
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
    lat: number;
    lng: number;
  };
  recruiter?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  createdAt: Date;
  author: string;
  images: string[];
  company?: string;
  applies?: {
    userId: Types.ObjectId;
    resumeId: Types.ObjectId;
    status: "pending" | "accepted" | "rejected";
    appliedAt: Date;
  }[];
}
