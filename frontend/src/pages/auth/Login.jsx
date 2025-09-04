// src/pages/auth/Login.js
import { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Modal from "../../components/Modal";
import { motion } from "framer-motion";
import Logo from "../../components/Logo";

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
    mutationFn: (loginData) => axiosInstance.post("/auth/signin", loginData),
    onSuccess: async (data) => {
      setModal({
        isOpen: true,
        type: "success",
        message: "Login successful! Redirecting...",
      });

      await queryClient.invalidateQueries({ queryKey: ["authUser"] });

      setTimeout(() => {
        setModal({ isOpen: false, type: "", message: "" });
        if (data.data.user.role === "student") {
          navigate("/student/events");
        } else if (data.data.user.role === "admin") {
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
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
            <Link to="/" className="inline-block">
                <Logo />
            </Link>
        </div>
        <form
          onSubmit={handleSubmit}
          className="bg-card border border-border p-8 rounded-2xl shadow-lg w-full"
        >
          <h2 className="text-3xl font-bold mb-2 text-center text-foreground">
            Welcome Back!
          </h2>
          <p className="text-center text-muted-foreground mb-6">Login to continue to FestSync.</p>

          <div className="mb-4">
            <label className="block text-foreground/80 mb-2" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="you@example.com"
              className="w-full bg-input text-foreground border-border border p-3 rounded-lg focus:ring-2 focus:ring-ring transition"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="relative mb-4">
            <label className="block text-foreground/80 mb-2" htmlFor="password">Password</label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="••••••••"
              className="w-full bg-input text-foreground border-border border p-3 rounded-lg pr-10 focus:ring-2 focus:ring-ring transition"
              value={form.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-10 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="flex justify-end mb-6">
            <Link
              to="/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className={`w-full py-3 rounded-lg text-primary-foreground font-semibold transition-transform transform hover:scale-105 ${
              loginMutation.isPending
                ? "bg-primary/50 cursor-not-allowed"
                : "bg-primary hover:opacity-90"
            }`}
          >
            {loginMutation.isPending ? "Logging in..." : "Login"}
          </button>

          <p className="text-sm text-muted-foreground mt-6 text-center">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary font-semibold hover:underline">
              Register here
            </Link>
          </p>
        </form>
      </motion.div>

      <Modal
        isOpen={modal.isOpen}
        type={modal.type}
        message={modal.message}
        onClose={() => setModal({ ...modal, isOpen: false })}
      />
    </div>
  );
}
