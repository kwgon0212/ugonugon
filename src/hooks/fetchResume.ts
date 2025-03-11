import React from "react";
import { Document } from "mongoose";
import getUser, { putUser } from "./fetchUser";

export interface Career {
  company: string;
  dates: string;
  careerDetail: string;
}

export interface Resume extends Document {
  userId: string;
  title: string;
  profile: string;
  name: string;
  sex: string;
  residentId: string;
  phone: string;
  email: string;
  address: string;
  school: string;
  schoolState: string;
  careers: Career[];
  introduction: string;
  writtenDay: string;
  applyIds: (null | undefined | string)[];
}

const getResume = async (resumeId: string | undefined) => {
  try {
    const res = await fetch(`/api/resume?resumeId=${resumeId}`);
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch resume data:", error);
    throw error;
  }
};

export const postResume = async (data: object) => {
  try {
    const res = await fetch("/api/resume", {
      method: "POST",
      body: JSON.stringify({ data }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.json();
  } catch (err: any) {
    console.log(err, err?.messages);
  }
};

export const putResume = async (resumeId: string | undefined, data: object) => {
  try {
    await fetch("/api/resume", {
      method: "PUT",
      body: JSON.stringify({ resumeId, data }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err: any) {
    console.log(err, err?.messages);
  }
};

export const deleteResume = async (
  resumeId: string | undefined,
  userId: string,
  applyIds: string[]
) => {
  try {
    const userData = await getUser(userId);
    const resumeIds = userData.resumeIds.filter((v: string) => v !== resumeId);
    await putUser(userId, { resumeIds });
    if (applyIds.length === 0)
      await fetch("/api/resume", {
        method: "DELETE",
        body: JSON.stringify({ resumeId }),
        headers: {
          "Content-Type": "application/json",
        },
      });
  } catch (err: any) {
    console.log(err, err?.messages);
  }
};

export default getResume;
