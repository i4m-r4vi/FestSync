// src/pages/admin/Participants.jsx
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import Navbar from "../../components/Navbar";
import { format, parseISO } from "date-fns";

export default function Participants() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openEvent, setOpenEvent] = useState(null);
  const [sending, setSending] = useState(null); // track sending eventId

  useEffect(() => {
    axiosInstance
      .get("/events/getRegisteredUsers")
      .then((res) => setEvents(res.data.events || []))
      .catch((err) => console.error("Error fetching registered users:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleSendCertificates = async (eventId) => {
    try {
      setSending(eventId);
      await axiosInstance.post(`/certificate/generateCertificate/${eventId}`);
      alert("Certificates sent successfully ✅");
    } catch (err) {
      console.error("Error sending certificates:", err);
      alert("Failed to send certificates ❌");
    } finally {
      setSending(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "TBD";
    try {
      return format(parseISO(dateString), "dd MMM yyyy");
    } catch {
      return "TBD";
    }
  };

  if (loading) return <p className="text-center mt-10">Loading participants...</p>;

  return (
    <>
      <Navbar role="admin" />
      <div className="pt-20 px-4 md:px-6">
        <h2 className="text-2xl font-bold mb-6">Registered Event Participants</h2>

        {events.length === 0 ? (
          <p className="text-gray-600">No participants registered yet.</p>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event._id} className="border rounded-lg shadow-sm">
                {/* Accordion Header */}
                <button
                  onClick={() =>
                    setOpenEvent(openEvent === event._id ? null : event._id)
                  }
                  className="w-full flex justify-between items-center px-4 py-3 bg-blue-600 text-white font-semibold rounded-t-lg"
                >
                  <span>
                    {event.title} ({event.registeredUsers.length} participants)
                  </span>
                  <span>{openEvent === event._id ? "▲" : "▼"}</span>
                </button>

                {/* Accordion Content */}
                {openEvent === event._id && (
                  <div className="p-4">
                    {event.registeredUsers.length === 0 ? (
                      <p className="text-gray-500">No users registered.</p>
                    ) : (
                      <>
                        {/* ✅ Send Certificates Button */}
                        <div className="flex justify-end mb-3">
                          <button
                            onClick={() => handleSendCertificates(event._id)}
                            disabled={sending === event._id}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md disabled:opacity-50"
                          >
                            {sending === event._id
                              ? "Sending..."
                              : "Send Certificates"}
                          </button>
                        </div>

                        {/* ✅ Table for desktop */}
                        <div className="hidden md:block overflow-x-auto">
                          <table className="w-full bg-white shadow-md rounded-lg">
                            <thead className="bg-gray-100">
                              <tr>
                                <th className="p-3 text-left">Name</th>
                                <th className="p-3 text-left">Email</th>
                                <th className="p-3 text-left">College</th>
                                <th className="p-3 text-left">Sub Event</th>
                                <th className="p-3 text-left">Event Date</th>
                              </tr>
                            </thead>
                            <tbody>
                              {event.registeredUsers.map((u) => (
                                <tr key={u._id} className="border-b hover:bg-gray-50">
                                  <td className="p-3">{u.userId?.fullname}</td>
                                  <td className="p-3">{u.userId?.email}</td>
                                  <td className="p-3">{u.userId?.clgName}</td>
                                  <td className="p-3">{u.subEvent}</td>
                                  <td className="p-3">
                                    {formatDate(event.EventDate)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* ✅ Cards for mobile */}
                        <div className="grid gap-4 md:hidden mt-4">
                          {event.registeredUsers.map((u) => (
                            <div
                              key={u._id}
                              className="bg-white p-4 rounded-lg shadow-md flex flex-col gap-1"
                            >
                              <p className="text-lg font-semibold">{u.userId?.fullname}</p>
                              <p className="text-gray-600 text-sm">
                                📧 {u.userId?.email}
                              </p>
                              <p className="text-gray-500 text-sm">
                                🏫 {u.userId?.clgName}
                              </p>
                              <p className="text-gray-500 text-sm">
                                📌 {u.subEvent}
                              </p>
                              <p className="text-gray-400 text-xs">
                                📅 {formatDate(event.EventDate)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
