import React from "react";
import { Document } from "mongoose";

export interface Bank extends Document {
  request: { [key: string]: string | Object };
  response: { [key: string]: string | Object };
}

export const postBank = async (
  ApiNm: string,
  data: object,
  account: string = "3020000012682"
) => {
  try {
    const today = new Date();
    const toRequest = {
      Header: {
        ApiNm,
        Tsymd:
          today.getFullYear().toString().padStart(2, "0") +
          (today.getMonth() + 1).toString().padStart(2, "0") +
          today.getDate().toString().padStart(2, "0"),
        Trtm:
          today.getHours().toString().padStart(2, "0") +
          today.getMinutes().toString().padStart(2, "0") +
          today.getSeconds().toString().padStart(2, "0"),
        Iscd: "",
        FintechApsno: "",
        ApiSvcCd: "",
        IsTuno: "",
        AccessToken: "",
      },
      ...data,
      account,
    };
    const res = await fetch("/api/bank", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(toRequest),
    });
    return res.json();
  } catch (err: any) {
    console.log(err, err?.messages);
  }
};

export default postBank;
