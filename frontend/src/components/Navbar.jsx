// src/components/Navbar.js
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../utils/axiosInstance";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // ✅ Get logged in user
  const { data: user } = useQuery({
    queryKey: ["authUser"]
  });





  // ✅ Logout handler
  const handleLogout = async () => {
    try {
      await axiosInstance.post("/auth/logout"); // backend clears cookie
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      queryClient.setQueryData(["authUser"], null); // clear user cache
      navigate("/login");
    }
  };

  const studentLinks = [
    { name: "Events", path: "/student/events" }
  ];

  const adminLinks = [
    { name: "Manage Events", path: "/admin/events" },
    { name: "Participants", path: "/admin/participants" },
  ];

  const links = user?.role === "admin" ? adminLinks : studentLinks;

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-wide">
          Fest<span className="text-yellow-300">Sync</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          {user &&
            links.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="hover:text-yellow-300 font-medium transition"
              >
                {link.name}
              </Link>
            ))}

          {user ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="w-10 h-10 rounded-full bg-yellow-400 text-blue-900 flex items-center justify-center font-bold"
              >
                <User size={20} />
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-gray-700 rounded-lg shadow-lg overflow-hidden">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setProfileOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setProfileOpen(false)}
                  >
                    Settings
                  </Link>
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                    onClick={() => {
                      handleLogout();
                      setProfileOpen(false);
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-white text-blue-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-yellow-400 text-blue-900 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-blue-700 px-6 pb-4 space-y-3">
          {user &&
            links.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="block py-2 border-b border-blue-500 hover:text-yellow-300 transition"
                onClick={() => setOpen(false)}
              >
                {link.name}
              </Link>
            ))}

          {user ? (
            <button
              className="bg-red-500 w-full py-2 rounded-lg hover:bg-red-600 transition"
              onClick={() => {
                handleLogout();
                setOpen(false);
              }}
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="block bg-white text-blue-700 px-4 py-2 rounded-lg font-semibold text-center hover:bg-gray-100 transition"
                onClick={() => setOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block bg-yellow-400 text-blue-900 px-4 py-2 rounded-lg font-semibold text-center hover:bg-yellow-300 transition"
                onClick={() => setOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
