import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import NotFound from "./pages/NotFound";
import Profile from "./pages/student/Profile";
import Participants from "./pages/admin/Participants";
import AdminProfile from "./pages/admin/Profile";
import AdminCertificates from "./pages/admin/AdminCertificates";
import Events from "./pages/admin/Events";
import { Elements } from "@stripe/react-stripe-js";
import StudentEvents from "./pages/student/Events";
import { loadStripe } from "@stripe/stripe-js";
import "./App.css";
import PaymentSuccess from "./pages/PaymentSuccess";
import { useQuery } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import axiosInstance from "./utils/axiosInstance";
import PaymentCancel from "./pages/PaymentCancel";
import ForgotPassword from "./pages/auth/ForgotPassword";
import About from "./pages/About";
import RegisteredEvents from "./pages/student/RegisteredEvents";

const stripePromise = loadStripe(import.meta.env.VITE_Stripe_Publishable_key);

function App() {
  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/auth/profile");
        return res.data.userInfo;
      } catch (error) {
        return null;
      }
    },
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2Icon className="animate-spin w-6 h-6" />
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />

        <Route
          path="/login"
          element={
            !authUser ? (
              <Login />
            ) : authUser.role === "student" ? (
              <Navigate to="/student/events" replace />
            ) : authUser.role === "admin" ? (
              <Navigate to="/admin/events" replace />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/register"
          element={
            !authUser ? (
              <Register />
            ) : authUser.role === "student" ? (
              <Navigate to="/student/events" replace />
            ) : authUser.role === "admin" ? (
              <Navigate to="/admin/events" replace />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/forgot-password"
          element={<ForgotPassword/>}
        />

        <Route
          path="/student/profile"
          element={
            authUser?.role === "student" ? (
              <Profile />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/student/events"
          element={
            authUser?.role === "student" ? (
              <StudentEvents />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
         <Route
          path="/student/registered-events"
          element={
            authUser?.role === "student" ? (
              <RegisteredEvents />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/payment-success"
          element={
            authUser?.role === "student" ? (
              <PaymentSuccess />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/payment-cancel"
          element={
            authUser?.role === "student" ? (
              <PaymentCancel />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/admin/participants"
          element={
            authUser?.role === "admin" ? (
              <Participants />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/admin/events"
          element={
            authUser?.role === "admin" ? (
              <Events />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/admin/profile"
          element={
            authUser?.role === "admin" ? (
              <AdminProfile />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/admin/certificates"
          element={
            authUser?.role === "admin" ? (
              <AdminCertificates />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Elements>
  );
}

export default App;
