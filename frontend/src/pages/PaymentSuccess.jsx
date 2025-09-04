// src/pages/student/PaymentSuccess.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import Navbar from "../components/Navbar";

export default function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  // Read query params from Stripe redirect
  const query = new URLSearchParams(location.search);
  const sessionId = query.get("session_id");
  const eventId = query.get("eventId");
  const subEvent = query.get("subEvent");

  useEffect(() => {
    const confirmPayment = async () => {
      try {
        if (!sessionId) {
          setStatus("Invalid session.");
          setLoading(false);
          return;
        }

        // ✅ Call the correct backend endpoint
        const res = await axiosInstance.post("/payment/confirm-registration", {
          sessionId,
        });

        console.log(res)

        if (res.status === 200) {
          setStatus("Registration confirmed! 🎉 Please Wait few Second");
          // Optional redirect to "My Registrations" after a delay
          setTimeout(() => navigate("/student/registered-events"), 2000);
        } else {
          setStatus(res.data.error || "Payment not verified.");
        }
      } catch (err) {
        console.error("Confirm payment error:", err);
        setStatus("Error confirming payment.");
      } finally {
        setLoading(false);
      }
    };

    confirmPayment();
  }, [sessionId, eventId, subEvent, navigate]);

  return (
    <>
      <Navbar role="student" />
      <div className="flex items-center justify-center min-h-screen">
        {loading ? (
          <h2 className="text-xl font-bold">Verifying payment...</h2>
        ) : (
          <h2 className="text-xl font-bold">{status}</h2>
        )}
      </div>
    </>
  );
}
