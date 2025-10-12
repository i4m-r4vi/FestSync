import Navbar from "../../components/Navbar";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../utils/axiosInstance";
import { Loader2 } from "lucide-react";

export default function Profile() {
  const { data: user, isLoading, isError } = useQuery({
    queryKey: ["authUser"],
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
      <Navbar />
      <main className="container mx-auto px-6 pt-28">
        <div className="bg-card border border-border shadow-lg rounded-xl p-6 w-full max-w-md mx-auto text-center">
          <div className="w-24 h-24 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4 border-4 border-card">
            <span className="text-3xl font-bold text-primary">
              {user.fullname ? user.fullname.charAt(0).toUpperCase() : "U"}
            </span>
          </div>

          <h2 className="text-2xl font-bold mb-2 text-foreground">{user.fullname}</h2>
          <p className="text-muted-foreground">{user.email}</p>

          <div className="mt-6 text-left space-y-3">
            <div className="bg-secondary p-4 rounded-lg">
              <span className="font-semibold text-secondary-foreground">College: </span>
              <span className="text-foreground">{user.clgName}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
