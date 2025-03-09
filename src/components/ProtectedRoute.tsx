import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { useEffect } from "react";
import { loginSuccess } from "@/util/slices/authSlice";
import axios from "axios";

const ProtectedRoute = () => {
  const pathname = useLocation().pathname;
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      axios
        .get("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          dispatch(loginSuccess({ user: res.data, token }));
        })
        .catch(() => localStorage.removeItem("token"));
    }
  }, [dispatch]);

  return isAuthenticated ? <Outlet key={pathname} /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
