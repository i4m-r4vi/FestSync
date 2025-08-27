// src/pages/auth/Register.js
import { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullname: "",
    email: "",
    password: "",
    role: "student",   
    clgName: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axiosInstance.post("/auth/signup", form);

      login({ ...data.user, token: data.token });

      // Redirect based on role
      if (data.user.role === "student") {
        navigate("/student/events");
      } else if (data.user.role === "admin") {
        navigate("/admin/events");
      } else {
        navigate("/login");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
        {error && <p className="text-red-500 mb-3">{error}</p>}

        <input
          type="text"
          name="fullname"
          placeholder="Full Name"
          className="w-full border p-2 rounded mb-3"
          value={form.fullname}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full border p-2 rounded mb-3"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border p-2 rounded mb-3"
          value={form.password}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="clgName"
          placeholder="College Name"
          className="w-full border p-2 rounded mb-3"
          value={form.clgName}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          className="bg-green-600 text-white w-full py-2 rounded-lg hover:bg-green-700 transition"
        >
          Register
        </button>

        <p className="text-sm text-gray-600 mt-3 text-center">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 font-semibold">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
