import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";

export default function PublicRoute() {
  const token = Cookies.get("loginToken");

  if (token) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
