import React from "react";

export interface Resume {
  userId?: string;
  title?: string;
  phone?: string;
  email?: string;
  address?: string;
  school?: string;
  schoolState?: string;
  careers?: string[];
  introduction?: string;
  apply?: string[];
}

const getResume = async (
  resumeId: string | undefined,
  setState: React.Dispatch<any>
) => {
  try {
    const res = await fetch(`/api/resume?resumeId=${resumeId}`);
    const data = await res.json();
    setState(data); // data를 반환
  } catch (error) {
    console.error("Failed to fetch resume data:", error);
    throw error; // 오류 발생 시 오류를 던짐
  }
};

export const postResume = async (data: any) => {
  try {
    await fetch("/api/resume", {
      method: "POST",
      body: JSON.stringify({ data }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err: any) {
    console.log(err, err?.messages);
  }
};

export default getResume;
