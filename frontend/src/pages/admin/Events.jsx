// src/pages/admin/Events.js
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import Navbar from "../../components/Navbar";
import UploadImage from "../../components/UploadImage";

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    name: "",
    description: "",
    date: "",
    location: "",
    price: 0,
    image: "",
  });

  const fetchEvents = () => {
    axiosInstance.get("/events").then((res) => setEvents(res.data));
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/admin/events", newEvent);
      setNewEvent({ name: "", description: "", date: "", location: "", price: 0, image: "" });
      fetchEvents();
    } catch (err) {
      console.error(err);
      alert("Failed to add event");
    }
  };

  return (
    <>
      <Navbar role="admin" />
      <div className="pt-20 px-6">
        <h2 className="text-2xl font-bold mb-4">Manage Events</h2>

        {/* Add Event Form */}
        <form
          onSubmit={handleAddEvent}
          className="bg-white p-6 rounded-xl shadow-md mb-8 grid gap-3 md:grid-cols-2"
        >
          <input
            type="text"
            placeholder="Event Name"
            className="border p-2 rounded"
            value={newEvent.name}
            onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Location"
            className="border p-2 rounded"
            value={newEvent.location}
            onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
            required
          />
          <input
            type="date"
            className="border p-2 rounded"
            value={newEvent.date}
            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Price (0 for free)"
            className="border p-2 rounded"
            value={newEvent.price}
            onChange={(e) => setNewEvent({ ...newEvent, price: e.target.value })}
          />
          <textarea
            placeholder="Description"
            className="border p-2 rounded md:col-span-2"
            value={newEvent.description}
            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
            required
          />
          <div className="md:col-span-2">
            <UploadImage onUpload={(url) => setNewEvent({ ...newEvent, image: url })} />
          </div>
          <button
            type="submit"
            className="bg-green-600 text-white py-2 rounded col-span-2 hover:bg-green-700"
          >
            + Add Event
          </button>
        </form>

        {/* Event List */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
              <p className="text-sm text-blue-600 font-semibold">₹{event.price}</p>
              <button className="bg-red-500 text-white w-full py-2 mt-3 rounded hover:bg-red-600">
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
