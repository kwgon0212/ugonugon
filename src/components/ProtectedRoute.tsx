import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "@/hooks/useRedux";

const ProtectedRoute = () => {
  const pathname = useLocation().pathname;
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const auth = useAppSelector((state) => state.auth);
  console.log(auth.user);

  return isAuthenticated ? <Outlet key={pathname} /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
