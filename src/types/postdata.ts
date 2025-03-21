import mongoose from "mongoose";

interface PostData {
  _id: string;
  title: string;
  jobType: string;
  pay: {
    type: string;
    value: number;
  };
  hireType: string[];
  period: {
    start: string | Date;
    end: string | Date;
    discussion: boolean;
  };
  hour: {
    start: string | Date;
    end: string | Date;
    discussion: boolean;
  };
  restTime?: {
    start: string | Date;
    end: string | Date;
  };
  day: string[];
  workDetail?: string;
  welfare?: string;
  postDetail?: string;
  deadline?: {
    date: string | Date;
    time: string | Date;
  };
  person?: number;
  preferences?: string;
  education?: {
    school: string;
    state: string;
  };
  address: {
    zipcode: string;
    street: string;
    detail?: string;
    lat?: number;
    lng?: number;
  };
  recruiter?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  author: string;
  images?: [string];
  createdAt?: string | Date;
  applies: [
    {
      userId: mongoose.Types.ObjectId;
      resumeId: mongoose.Types.ObjectId;
      status?: "pending" | "accepted" | "rejected";
      appliedAt?: string | Date;
    }
  ];
}

export default PostData;
