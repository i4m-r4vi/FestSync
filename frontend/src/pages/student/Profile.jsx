// src/pages/student/Profile.jsx
import Navbar from "../../components/Navbar";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../utils/axiosInstance";

export default function Profile() {
  const { data: user, isLoading, isError } = useQuery({
    queryKey: ["authUser"], // ✅ unified query key
    queryFn: async () => {
      const { data } = await axiosInstance.get("/auth/profile");
      return data.user;
    },
  });

  if (isLoading) {
    return <p className="text-center mt-10">Loading profile...</p>;
  }

  if (isError || !user) {
    return (
      <p className="text-center mt-10 text-red-500">Failed to load profile</p>
    );
  }

  return (
    <>
      <Navbar role="student" />
      <div className="pt-20 px-6 flex justify-center">
        <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md text-center">
          {/* Default Avatar */}
          <div className="w-24 h-24 mx-auto rounded-full bg-blue-100 flex items-center justify-center mb-4">
            <span className="text-3xl font-bold text-blue-600">
              {user.fullname ? user.fullname.charAt(0).toUpperCase() : "U"}
            </span>
          </div>

          <h2 className="text-2xl font-bold mb-2">{user.fullname}</h2>
          <p className="text-gray-600">{user.email}</p>

          <div className="mt-6 text-left space-y-3">
            <div className="bg-gray-50 p-3 rounded-lg">
              <span className="font-semibold">College: </span>
              {user.clgName}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
