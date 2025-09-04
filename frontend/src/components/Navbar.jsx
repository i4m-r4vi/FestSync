// src/components/Navbar.js
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut, Settings, LayoutDashboard, Sun, Moon, CalendarCheck } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../utils/axiosInstance";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import Logo from "./Logo";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const { data: user } = useQuery({
    queryKey: ["authUser"]
  });

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      queryClient.setQueryData(["authUser"], null);
      navigate("/login");
    }
  };

  const publicLinks = [
    { name: "About", path: "/about" },
  ];

  const studentLinks = [
    { name: "Events", path: "/student/events", icon: <LayoutDashboard size={18} /> },
    { name: "About", path: "/about" },
  ];

  const adminLinks = [
    { name: "Manage Events", path: "/admin/events", icon: <LayoutDashboard size={18} /> },
    { name: "Participants", path: "/admin/participants", icon: <User size={18} /> },
    { name: "About", path: "/about" },
  ];

  const studentProfileLinks = [
      { name: "Profile", path: "/student/profile", icon: <User size={18} /> },
      { name: "Registered Events", path: "/student/registered-events", icon: <CalendarCheck size={18} /> }
  ];

  const adminProfileLinks = [
      { name: "Profile", path: "/admin/profile", icon: <User size={18} /> }
  ]

  const commonProfileLinks = user?.role === 'student' ? studentProfileLinks : adminProfileLinks

  const userLinks = user?.role === "admin" ? adminLinks : (user?.role === "student" ? studentLinks : []);
  const allLinks = user ? userLinks : publicLinks;


  return (
    <nav className="bg-card border-b border-border fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto flex justify-between items-center px-6 h-20">
        <Link to={user ? (user.role === 'admin' ? '/admin/events' : '/student/events') : '/'}>
            <Logo />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          {allLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="font-medium text-foreground hover:text-primary transition-colors duration-300"
              >
                {link.name}
              </Link>
            ))}
            
          <motion.button
            onClick={toggleTheme}
            className="p-2 rounded-full text-foreground/70 hover:text-foreground hover:bg-secondary"
            whileTap={{ scale: 0.9, rotate: 15 }}
            transition={{ duration: 0.1 }}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </motion.button>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring focus:ring-offset-background"
              >
                {user.fullname ? user.fullname.charAt(0).toUpperCase() : <User size={20} />}
              </button>
              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-56 bg-card text-card-foreground rounded-lg shadow-xl overflow-hidden border border-border"
                  >
                    <div className="p-4 border-b border-border">
                      <p className="font-semibold truncate">{user.fullname}</p>
                      <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                    </div>
                    {commonProfileLinks.map(link => (
                      <Link
                        key={link.path}
                        to={link.path}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-secondary text-card-foreground"
                        onClick={() => setProfileOpen(false)}
                      >
                        {link.icon}
                        <span>{link.name}</span>
                      </Link>
                    ))}
                    <button
                      className="flex items-center gap-3 w-full text-left px-4 py-3 hover:bg-secondary text-destructive border-t border-border"
                      onClick={() => {
                        handleLogout();
                        setProfileOpen(false);
                      }}
                    >
                      <LogOut size={18} />
                      <span>Logout</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="space-x-2">
              <Link
                to="/login"
                className="border border-primary text-primary px-5 py-2 rounded-full font-semibold hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-primary text-primary-foreground px-5 py-2 rounded-full font-semibold hover:opacity-90 transition-colors duration-300"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Nav Button */}
        <div className="md:hidden flex items-center">
            <motion.button
              onClick={toggleTheme}
              className="p-2 rounded-full text-foreground/70 hover:text-foreground hover:bg-secondary mr-2"
              whileTap={{ scale: 0.9, rotate: 15 }}
              transition={{ duration: 0.1 }}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </motion.button>
            <motion.button
              onClick={() => setOpen(!open)}
              className="text-foreground"
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.1 }}
            >
                {open ? <X size={28} /> : <Menu size={28} />}
            </motion.button>
        </div>
      </div>

      {/* Mobile Nav Menu */}
      <AnimatePresence>
        {open && (
            <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed top-20 right-0 h-[calc(100vh-5rem)] w-full bg-card z-40 p-6 flex flex-col"
            >
            <div className="flex-grow flex flex-col items-start gap-4 text-foreground">
                {user ? (
                  <>
                    {allLinks.map((link) => (
                      <Link
                        key={link.name}
                        to={link.path}
                        className="block py-3 px-3 rounded-lg text-foreground text-xl font-medium hover:bg-secondary w-full text-left"
                        onClick={() => setOpen(false)}
                      >
                        {link.name}
                      </Link>
                    ))}
                     <div className="w-full border-t border-border my-4"></div>
                     {commonProfileLinks.map(link => (
                        <Link
                          key={link.path}
                          to={link.path}
                          className="block py-3 px-3 rounded-lg text-foreground text-xl font-medium hover:bg-secondary w-full text-left"
                          onClick={() => setOpen(false)}
                        >
                          {link.name}
                        </Link>
                      ))}
                    <button
                      className="bg-destructive text-destructive-foreground w-full py-3 rounded-lg hover:opacity-90 transition text-xl font-medium mt-auto"
                      onClick={() => {
                        handleLogout();
                        setOpen(false);
                      }}
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="w-full flex flex-col h-full">
                    <Link
                      to="/about"
                      className="block py-3 px-3 rounded-lg text-foreground text-xl font-medium hover:bg-secondary w-full text-left"
                      onClick={() => setOpen(false)}
                    >
                      About
                    </Link>
                    <div className="mt-auto w-full space-y-2">
                        <Link
                        to="/login"
                        className="block text-center border border-primary text-primary px-4 py-3 rounded-lg font-semibold hover:bg-primary hover:text-primary-foreground transition w-full text-lg"
                        onClick={() => setOpen(false)}
                        >
                        Login
                        </Link>
                        <Link
                        to="/register"
                        className="block bg-primary text-primary-foreground px-4 py-3 rounded-lg font-semibold text-center hover:opacity-90 transition w-full text-lg"
                        onClick={() => setOpen(false)}
                        >
                        Register
                        </Link>
                    </div>
                  </div>
                )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
