import { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { Link, useNavigate } from "react-router-dom";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Modal from "../../components/Modal";
import { motion } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Logo from "../../components/Logo";

export default function Register() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    fullname: "",
    email: "",
    password: "",
    clgName: "",
  });

  const [modal, setModal] = useState({
    isOpen: false,
    type: "",
    message: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const registerMutation = useMutation({
    mutationFn: (formData) => axiosInstance.post("/auth/signup", formData),
    onSuccess: (data) => {
      setModal({
        isOpen: true,
        type: "success",
        message: "Registration successful! Redirecting...",
      });
      queryClient.setQueryData(["authUser"], data.data.user);
      setTimeout(() => {
        if (data.data.user.role === "student") {
          navigate("/student/events");
        } else if (data.data.user.role === "admin") {
          navigate("/admin/events");
        } else {
          navigate("/login");
        }
      }, 1500);
    },
    onError: (err) => {
      setModal({
        isOpen: true,
        type: "error",
        message: err.response?.data?.error || "Registration failed!",
      });
    },
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    registerMutation.mutate(form);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background py-8 px-4">
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
            Create an Account
          </h2>
          <p className="text-center text-muted-foreground mb-6">Join FestSync AI to manage and attend events.</p>

          <div className="mb-4">
            <label className="block text-foreground/80 mb-2" htmlFor="fullname">Full Name</label>
            <input
              type="text"
              id="fullname"
              name="fullname"
              placeholder="John Doe"
              className="w-full bg-input text-foreground border-border border p-3 rounded-lg focus:ring-2 focus:ring-ring transition"
              value={form.fullname}
              onChange={handleChange}
              required
            />
          </div>

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
              {showPassword ? (
                <EyeOffIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </button>
          </div>

          <div className="mb-6">
            <label className="block text-foreground/80 mb-2" htmlFor="clgName">College Name</label>
            <input
              type="text"
              id="clgName"
              name="clgName"
              placeholder="Your College"
              className="w-full bg-input text-foreground border-border border p-3 rounded-lg focus:ring-2 focus:ring-ring transition"
              value={form.clgName}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            disabled={registerMutation.isPending}
            className={`w-full py-3 rounded-lg text-primary-foreground font-semibold transition-transform transform hover:scale-105 ${
              registerMutation.isPending
                ? "bg-primary/50 cursor-not-allowed"
                : "bg-primary hover:opacity-90"
            }`}
          >
            {registerMutation.isPending ? "Registering..." : "Register"}
          </button>

          <p className="text-sm text-muted-foreground mt-6 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Login
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
