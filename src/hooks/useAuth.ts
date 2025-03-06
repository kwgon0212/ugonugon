import { loginSuccess, logout } from "@/util/slices/authSlice";
import { useEffect, useState } from "react";
import { useAppDispatch } from "./useRedux";

const useAuth = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // 🔹 쿠키가 없으면 API 요청을 하지 않고 로그아웃 처리
      if (!document.cookie.includes("token")) {
        dispatch(logout());
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
        });
        const data = await res.json();
        dispatch(loginSuccess(data));
      } catch {
        dispatch(logout());
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [dispatch]);

  return loading;
};

export default useAuth;
