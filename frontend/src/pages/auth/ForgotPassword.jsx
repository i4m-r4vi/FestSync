import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import Modal from "../../components/Modal";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [modal, setModal] = useState({
    open: false,
    type: "loading",
    message: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setModal({
      open: true,
      type: "loading",
      message: "Sending reset link...",
    });

    try {
      const res = await axiosInstance.post("/auth/forgotPassword", { email });

      setModal({
        open: true,
        type: "success",
        message:
          res.data.message || "Password reset link sent to your email!",
      });
    } catch (err) {
      setModal({
        open: true,
        type: "error",
        message:
          err.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          Forgot Password 🔑
        </h2>

        <input
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border p-2 rounded-lg mb-4"
        />

        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded-lg  hover:opacity-90 transition mb-3"
        >
          Send Reset Link
        </button>

        <button
          type="button"
          onClick={() => navigate("/")}
          className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
        >
          Back to Home
        </button>
      </form>

      <Modal
        isOpen={modal.open}
        type={modal.type}
        message={modal.message}
        onClose={() => setModal({ ...modal, open: false })}
      />
    </div>
  );
}
