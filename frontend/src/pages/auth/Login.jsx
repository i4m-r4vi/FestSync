// src/pages/auth/Login.js
import { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Modal from "../../components/Modal";

export default function Login() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [modal, setModal] = useState({
    isOpen: false,
    type: "",
    message: "",
  });

  const loginMutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post("/auth/signin", form);
      return res.data;
    },
    onMutate: () => {
      setModal({ isOpen: true, type: "loading", message: "Logging in..." });
    },
    onSuccess: async (data) => {
      setModal({
        isOpen: true,
        type: "success",
        message: "Login successful!",
      });

      await queryClient.invalidateQueries({ queryKey: ["authUser"] });

      setTimeout(() => {
        setModal({ isOpen: false, type: "", message: "" });
        if (data.user.role === "student") {
          navigate("/student/events");
        } else if (data.user.role === "admin") {
          navigate("/admin/events");
        } else {
          navigate("/");
        }
      }, 1500);
    },
    onError: (err) => {
      setModal({
        isOpen: true,
        type: "error",
        message: err.response?.data?.message || "Login failed",
      });
    },
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate(form);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full border p-2 rounded mb-3"
          value={form.email}
          onChange={handleChange}
          required
        />

        {/* Password with toggle */}
        <div className="relative mb-3">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            className="w-full border p-2 rounded pr-10"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Forgot password */}
        <div className="flex justify-end mb-3">
          <a
            href="/forgot-password"
            className="text-sm text-blue-600 hover:underline"
          >
            Forgot Password?
          </a>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loginMutation.isLoading}
          className={`${loginMutation.isLoading
              ? "bg-gray-400"
              : "bg-blue-600 hover:bg-blue-700"
            } text-white w-full py-2 rounded-lg transition`}
        >
          {loginMutation.isLoading ? "Logging in..." : "Login"}
        </button>

        <p className="text-sm text-gray-600 mt-3 text-center">
          Don't have an account?{" "}
          <a href="/register" className="text-green-600 font-semibold">
            Register
          </a>
        </p>
      </form>

      {/* Reusable Modal */}
      <Modal
        isOpen={modal.isOpen}
        type={modal.type}
        message={modal.message}
        onClose={() => setModal({ ...modal, isOpen: false })}
      />
    </div>
  );
}
