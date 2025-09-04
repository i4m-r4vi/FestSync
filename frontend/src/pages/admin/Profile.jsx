// src/pages/admin/Profile.jsx
import Navbar from "../../components/Navbar";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../utils/axiosInstance";
import { Loader2 } from "lucide-react";

export default function AdminProfile() {
  const { data: user, isLoading, isError } = useQuery({
    queryKey: ["authUser"], // ✅ unified query key
    queryFn: async () => {
      const { data } = await axiosInstance.get("/auth/profile");
      return data.userInfo;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-background">
        <Loader2 className="animate-spin w-8 h-8 text-primary" />
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="flex justify-center items-center h-screen bg-background">
        <p className="text-center mt-10 text-destructive">Failed to load profile</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar/>
      <main className="container mx-auto pt-28 px-6">
        <div className="bg-card border border-border shadow-lg rounded-xl p-6 w-full max-w-lg mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center text-foreground">Admin Profile</h2>

          <div className="space-y-4">
            <div className="bg-secondary p-4 rounded-lg">
              <span className="font-semibold text-secondary-foreground">Full Name: </span>
              <span className="text-foreground">{user.fullname}</span>
            </div>
            <div className="bg-secondary p-4 rounded-lg">
              <span className="font-semibold text-secondary-foreground">Email: </span>
              <span className="text-foreground">{user.email}</span>
            </div>
            <div className="bg-secondary p-4 rounded-lg">
              <span className="font-semibold text-secondary-foreground">College: </span>
              <span className="text-foreground">{user.clgName}</span>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:opacity-90 transition">
              Change Password
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
