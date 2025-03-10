import React from "react";
import { Document } from "mongoose";

export interface User extends Document {
  name: string;
  businessNumber: string[];
  sex: string;
  residentId: string;
  phone: string;
  address: { zipcode: string; street: string; detail: string };
  signature: string;
  profile: string;
  bankAccount: { bank: string; account: string };
  email: string;
  resumeIds: (null | undefined | string)[];
  scraps: (null | undefined | string)[];
  applyIds: (null | undefined | string)[];
}

const getUser = async (userId: string | undefined) => {
  try {
    const res = await fetch(`/api/users?userId=${userId}`);
    return res.json();
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    throw error; // 오류 발생 시 오류를 던짐
  }
};

export const putUser = async (userId: string | undefined, data: object) => {
  try {
    await fetch("/api/users", {
      method: "PUT",
      body: JSON.stringify({ userId, data }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err: any) {
    console.log(err, err?.messages);
  }
};

export const deleteUser = async (userId: string | undefined) => {
  try {
    await fetch("/api/users", {
      method: "DELETE",
      body: JSON.stringify({ userId }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err: any) {
    console.log(err, err?.messages);
  }
};

export default getUser;
