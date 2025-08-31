// src/pages/auth/Login.js
import { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function Login() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const loginMutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post("/auth/signin", form,);
      return res.data;
    },
    onSuccess:async()=>{
      await queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (err) => {
      setError(err.response?.data?.message || "Login failed");
    },
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    loginMutation.mutate(form)
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        {error && <p className="text-red-500 mb-3">{error}</p>}

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

        {/* Password with eye toggle */}
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
    </div>
  );
}
