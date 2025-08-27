// src/pages/student/Events.jsx
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import Navbar from "../../components/Navbar";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

export default function StudentEvents() {
  const stripe = useStripe();       // Stripe instance
  const elements = useElements();   // Stripe Elements instance

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [subEvent, setSubEvent] = useState("");

  useEffect(() => {
    axiosInstance
      .get("/events/getEvents")
      .then((res) => setEvents(res.data.getEvents))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleRegister = async () => {
    if (!selectedEvent) return alert("No event selected!");

    try {
      // Call backend to create a Checkout Session
      const { data } = await axiosInstance.post(
        `/payment/payment-intent/${selectedEvent._id}`, // your backend endpoint
        { subEvent }
      );

      const { url } = data; // Backend returns the session URL
      if (!url) {
        alert("Failed to create checkout session.");
        return;
      }

      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Something went wrong!");
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
                  src={event.postureImg}
                  alt={event.title}
                  className="w-full h-40 rounded-lg object-cover"
                />
                <h3 className="text-lg font-semibold mt-2">{event.title}</h3>
                <p className="text-gray-600">{event.description}</p>
                <p className="text-sm text-gray-500 mt-1">
                  📅 {new Date(event.EventDate).toDateString()}
                </p>
                <button
                  className="bg-blue-600 text-white w-full py-2 mt-3 rounded hover:bg-blue-700"
                  onClick={() => setSelectedEvent(event)}
                >
                  View Event
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-2">{selectedEvent.title}</h2>
            <p className="text-gray-700">{selectedEvent.description}</p>
            <p className="text-sm text-gray-500 mb-4">
              📅 {new Date(selectedEvent.EventDate).toDateString()}
            </p>

            {/* SubEvent Select */}
            <label className="block mb-2 font-semibold">Choose Sub Event:</label>
            <select
              className="w-full border rounded p-2"
              value={subEvent}
              onChange={(e) => setSubEvent(e.target.value)}
            >
              <option value="">-- Select Sub Event --</option>
              {selectedEvent.SubEvents?.map((s, i) => (
                <option key={i} value={s}>
                  {s}
                </option>
              ))}
            </select>

            {/* Card Input for Paid Events */}
            {selectedEvent.amount > 0 && (
              <div className="mt-4">
                <label className="block mb-2 font-semibold">Card Details:</label>
                <div className="border p-2 rounded">
                  <CardElement options={{ style: { base: { fontSize: "16px" } } }} />
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setSelectedEvent(null)}
              >
                Close
              </button>
              <button
                className={`px-4 py-2 rounded text-white ${selectedEvent.amount > 0
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-green-600 hover:bg-green-700"
                  }`}
                onClick={handleRegister}
              >
                {selectedEvent.amount > 0
                  ? `Register & Pay ₹${selectedEvent.amount}`
                  : "Register Free"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
