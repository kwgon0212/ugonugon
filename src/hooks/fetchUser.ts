import React from "react";

export interface User {
  businessNumber?: string[];
  address?: { zipcode: string; street: string; detail: string };
  bankAccount?: { bank: string; account: string };
  name?: string;
  sex?: string;
  residentId?: string;
  phone?: string;
  signature?: string;
  email?: string;
}

const getUser = async (
  userId: string | undefined,
  setState: React.Dispatch<any>
) => {
  try {
    const res = await fetch(`/api/users?userId=${userId}`);
    const data = await res.json();
    setState(data); // data를 반환
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    throw error; // 오류 발생 시 오류를 던짐
  }
};

export const postUser = async (userId: string | undefined, data: any) => {
  try {
    await fetch("/api/users", {
      method: "POST",
      body: JSON.stringify({ userId, data }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err: any) {
    console.log(err, err?.messages);
  }
};

export default getUser;
