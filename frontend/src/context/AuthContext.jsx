// src/context/AuthContext.js
import { createContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance"; // ✅ use your instance

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { fullname, email, role, clgName }
  const [loading, setLoading] = useState(true);

  // Load user from backend session on app start
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get("/auth/profile"); 
        setUser(res.data); // backend returns safe user info
      } catch (err) {
        setUser(null); // not logged in
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  

  // Logout
  const logout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
