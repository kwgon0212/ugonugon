import { Types } from "mongoose";

export default interface Resume {
  _id: Types.ObjectId;
  title: string;
  phone: string;
  email: string;
  address: {
    zipcode: string;
    street: string;
    detail?: string;
  };
  school: string;
  schoolState: string;
  careers: { company: string; dates: string; careerDetail: string }[];
  introduction: string;
  // writtenDay: string;
  createdAt: Date;
  applies: string[];
}
