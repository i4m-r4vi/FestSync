// src/components/PublicRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";

export default function PublicRoute() {
  const token = Cookies.get("loginToken"); // 👈 your cookie name (adjust if different)

  if (token) {
    return <Navigate to="/" replace />; // ✅ Redirect to Home if logged in
  }

  return <Outlet />; // ✅ Allow access to child routes if not logged in
}
