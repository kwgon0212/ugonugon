import React from "react";
import { Document } from "mongoose";

export interface Career {
  company: string;
  dates: string;
  careerDetail: string;
}

export interface Resume extends Document {
  userId?: string;
  title?: string;
  phone?: string;
  email?: string;
  address?: string;
  school?: string;
  schoolState?: string;
  careers?: Career[];
  introduction?: string;
  writtenDay?: string;
  applyIds?: (null | undefined | string)[];
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

export default getResume;
