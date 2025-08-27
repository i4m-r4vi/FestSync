// src/components/ProtectedRoute.js
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function ProtectedRoute({ role }) {
  const { user, loading } = useAuth();

  if (loading) return <p className="text-center mt-10">Loading...</p>;


  if (!user) return <Navigate to="/login" replace />;


  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }


  return <Outlet />;
}
