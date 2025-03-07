import React, { useEffect, useState } from "react";
import { useAppSelector } from "./useRedux";

interface User {
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

const useFetchUser = (method: "get" | "post") => {
  const userId = useAppSelector((state) => state.auth.user?._id);
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    if (userId) {
      if (method === "get") {
        fetch(`/api/users?userId=${userId}`)
          .then((res) => res.json())
          .then((data) => setUserData(data));
      }

      if (method === "post") {
        postData();
      }
    }
  }, [userId]);

  const postData = async () => {
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        body: JSON.stringify({ userId }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const jsonResponse = await res.json(); // 응답을 JSON으로 파싱
      setUserData(jsonResponse); // data 상태를 업데이트
    } catch (err: any) {
      console.log(err, err?.messages);
    }
  };

  return userData;
};

export default useFetchUser;

// const useFetchUser = (method: "get" | "post") => {
//     const userId = useAppSelector((state) => state.auth.user?._id);
//     const [userData, setUserData] = useState<User | null>(null);
//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//       if (userId) {
//         if (method === "get") {
//           fetch(`/api/users?userId=${userId}`)
//             .then((res) => res.json())
//             .then((data) => setUserData(data));
//         }

//         if (method === "post") {
//           postData();
//         }
//       }
//     }, [userId]);

//     const postData = async () => {
//       try {
//         const res = await fetch("/api/users", {
//           method: "POST",
//           body: JSON.stringify({ userId }),
//           headers: {
//             "Content-Type": "application/json",
//           },
//         });

//         const jsonResponse = await res.json(); // 응답을 JSON으로 파싱
//         setUserData(jsonResponse); // data 상태를 업데이트
//       } catch (err: any) {
//         console.log(err, err?.messages);
//       }
//     };

//     console.log("--------------");
//     console.log(userData);
//     return userData;
//   };
