import Navbar from "../../components/Navbar";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../utils/axiosInstance";

export default function Settings() {
  const { data: user, isLoading, isError } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/auth/profile");
      return data.user;
    },
  });

  if (isLoading) {
    return <p className="text-center mt-10">Loading settings...</p>;
  }

  if (isError || !user) {
    return (
      <p className="text-center mt-10 text-red-500">Failed to load settings</p>
    );
  }

  return (
    <>
      <Navbar role="admin" />
      <div className="pt-20 px-6 flex justify-center">
        <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-lg">
          <h2 className="text-2xl font-bold mb-6 text-center">Admin Settings</h2>

          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <span className="font-semibold">Full Name: </span>
              {user.fullname}
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <span className="font-semibold">Email: </span>
              {user.email}
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <span className="font-semibold">College: </span>
              {user.clgName}
            </div>
          </div>

          <div className="mt-8 text-center">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
              Change Password
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
