import axios from "axios";
import mongoose from "mongoose";
import React from "react";

const PDFButton = ({
  children,
  PDFUrl,
  setPDFUrl,
  onClick,
  postId,
  userId,
}: {
  children: React.ReactNode;
  PDFUrl: string | null;
  setPDFUrl: React.Dispatch<React.SetStateAction<string | null>>;
  onClick?: () => void;
  postId: mongoose.Types.ObjectId;
  userId: string | undefined;
}) => {
  const downloadPDF = async () => {
    if (!postId || !userId) return;
    try {
      const userResponse = await axios.get(`/api/users?userId=${userId}`);
      const user = {
        _id: userResponse.data._id,
        name: userResponse.data.name,
        address: userResponse.data.address,
        phone: userResponse.data.phone,
        signature: userResponse.data.signature,
      };

      const postResponse = await axios.get(`/api/post?postId=${postId}`);
      const post = {
        title: postResponse.data.title,
        period: postResponse.data.period,
        address: postResponse.data.address,
        workDetail: postResponse.data.workDetail,
        hour: postResponse.data.hour,
        restTime: postResponse.data.restTime,
        pay: postResponse.data.pay,
      };
      const employerId = postResponse.data.author.toString();
      const employerResponse = await axios.get(
        `/api/users?userId=${employerId}`
      );
      const employer = {
        _id: employerResponse.data._id,
        name: employerResponse.data.name,
        address: employerResponse.data.address,
        phone: employerResponse.data.phone,
        signature: employerResponse.data.signature,
      };

      const contractResponse = await axios.post(
        "/api/contract",
        {
          user,
          employer,
          post,
        },
        { responseType: "blob" }
      );
      const blob = await contractResponse.data;
      const url = window.URL.createObjectURL(blob);
      setPDFUrl(url);
      // console.log(url);
      // const a = document.createElement("a");
      // a.href = url;
      // a.download = "contract.pdf";
      // document.body.appendChild(a);
      // a.click();
      // document.body.removeChild(a);
    } catch (error) {
      console.error("PDF 다운로드 오류:", error);
    }
  };

  return (
    <>
      <button
        onClick={() => {
          onClick && onClick();
          downloadPDF();
        }}
      >
        <>{children}</>
      </button>
    </>
  );
};

export default PDFButton;
