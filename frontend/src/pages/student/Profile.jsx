// src/pages/student/Profile.jsx
import Navbar from "../../components/Navbar";
import useAuth from "../../hooks/useAuth";

export default function Profile() {
  const { user } = useAuth();

  if (!user) {
    return <p className="text-center mt-10">Loading profile...</p>;
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
              <span className="font-semibold">Role: </span>
              {user.role}
            </div>
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
