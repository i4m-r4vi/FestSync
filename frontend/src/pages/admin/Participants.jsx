// src/pages/admin/Participants.jsx
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import Navbar from "../../components/Navbar";

export default function Participants() {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/admin/participants") // ✅ backend route should return all event registrations
      .then((res) => setParticipants(res.data))
      .catch((err) => console.error("Error fetching participants:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center mt-10">Loading participants...</p>;

  return (
    <>
      <Navbar role="admin" />
      <div className="pt-20 px-4 md:px-6">
        <h2 className="text-2xl font-bold mb-6">Event Participants</h2>

        {participants.length === 0 ? (
          <p className="text-gray-600">No participants registered yet.</p>
        ) : (
          <>
            {/* ✅ Table for larger screens */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full bg-white shadow-md rounded-lg">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="p-3 text-left">Student</th>
                    <th className="p-3 text-left">Email</th>
                    <th className="p-3 text-left">College</th>
                    <th className="p-3 text-left">Event</th>
                  </tr>
                </thead>
                <tbody>
                  {participants.map((p) => (
                    <tr key={p._id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{p.fullname}</td>
                      <td className="p-3">{p.email}</td>
                      <td className="p-3">{p.clgName}</td>
                      <td className="p-3">{p.eventName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ✅ Card layout for small screens */}
            <div className="grid gap-4 md:hidden">
              {participants.map((p) => (
                <div
                  key={p._id}
                  className="bg-white p-4 rounded-lg shadow-md flex flex-col gap-2"
                >
                  <p className="text-lg font-semibold">{p.fullname}</p>
                  <p className="text-gray-600 text-sm">{p.email}</p>
                  <p className="text-gray-500 text-sm">🏫 {p.clgName}</p>
                  <p className="text-gray-500 text-sm">📌 {p.eventName}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
