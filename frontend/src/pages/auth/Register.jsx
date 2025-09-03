// src/pages/auth/Register.js
import { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Modal from "../../components/Modal";

export default function Register() {
  const navigate = useNavigate();

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setModal({ isOpen: true, type: "loading", message: "Registering..." });

    try {
      const { data } = await axiosInstance.post("/auth/signup", form);

      setModal({
        isOpen: true,
        type: "success",
        message: "Registration successful!",
      });
      setForm({
        fullname: "",
        email: "",
        password: "",
        clgName: "",
      })
      setTimeout(() => {
        if (data.user.role === "student") {
          navigate("/student/events");
        } else if (data.user.role === "admin") {
          navigate("/admin/events");
        } else {
          navigate("/login");
        }
      }, 1500);
    } catch (err) {
      setModal({
        isOpen: true,
        type: "error",
        message: err.response?.data?.error || "Registration failed!",
      });
      setForm({
        fullname: "",
        email: "",
        password: "",
        clgName: "",
      })
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>

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

        {/* Password with toggle */}
        <div className="relative mb-3">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            className="w-full border p-2 rounded"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2 text-gray-600"
          >
            {showPassword ? (
              <EyeOffIcon className="w-5 h-5" />
            ) : (
              <EyeIcon className="w-5 h-5" />
            )}
          </button>
        </div>

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
          className="bg-green-600 text-white w-full py-2 rounded-lg hover:bg-green-700 transition flex items-center justify-center"
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

      {/* Modal Component */}
      <Modal
        isOpen={modal.isOpen}
        type={modal.type}
        message={modal.message}
        onClose={() => setModal({ ...modal, isOpen: false })}
      />
    </div>
  );
}
