// src/pages/student/Events.js
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import Navbar from "../../components/Navbar";

export default function StudentEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/events")
      .then((res) => setEvents(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleRegister = async (eventId) => {
    try {
      const { data } = await axiosInstance.post("/payment/create-checkout-session", { eventId });
      window.location.href = data.url; // Stripe Checkout redirect
    } catch (err) {
      console.error("Payment error:", err);
      alert("Payment failed!");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading events...</p>;

  return (
    <>
      <Navbar role="student" />
      <div className="pt-20 px-6">
        <h2 className="text-2xl font-bold mb-4">Available Events</h2>
        {events.length === 0 ? (
          <p className="text-gray-600">No events available.</p>
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <div key={event._id} className="bg-white rounded-xl shadow-md p-4">
                <img
                  src={event.image}
                  alt={event.name}
                  className="w-full h-40 rounded-lg object-cover"
                />
                <h3 className="text-lg font-semibold mt-2">{event.name}</h3>
                <p className="text-gray-600">{event.description}</p>
                <p className="text-sm text-gray-500 mt-1">
                  📍 {event.location} | 📅 {new Date(event.date).toDateString()}
                </p>
                {event.price > 0 ? (
                  <button
                    className="bg-blue-600 text-white w-full py-2 mt-3 rounded hover:bg-blue-700"
                    onClick={() => handleRegister(event._id)}
                  >
                    Register & Pay ₹{event.price}
                  </button>
                ) : (
                  <button
                    className="bg-green-600 text-white w-full py-2 mt-3 rounded hover:bg-green-700"
                    onClick={() => handleRegister(event._id)}
                  >
                    Register Free
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
