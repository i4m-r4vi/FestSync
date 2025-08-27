import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import Navbar from "../../components/Navbar";
import UploadImage from "../../components/UploadImage";
import SubEventsInput from "./SubEventsInput";

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    SubEvents: [],
    EventDate: "",
    department: "",
    amount: "",
    postureImg: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [addBtn, setAddBtn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null); // store eventId instead of boolean

  const fetchEvents = async () => {
    try {
      const res = await axiosInstance.get("/events/getEvents");
      setEvents(res.data.getEvents || []);
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleAddEvent = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!newEvent.postureImg) {
      setShowModal(true);
      setLoading(false); // FIX: reset loading
      return;
    }

    try {
      await axiosInstance.post("/events/uploadEvents", newEvent);
      setAddBtn(true);
      setNewEvent({
        title: "",
        description: "",
        EventDate: "",
        department: "",
        amount: "",
        postureImg: "",
        SubEvents: [], // FIX: consistent key
      });
      fetchEvents();
    } catch (err) {
      console.error(err);
      alert("Failed to add event");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setDeleteLoading(id);
    try {
      await axiosInstance.delete(`/events/deleteEvent/${id}`);
      setEvents(events.filter((e) => e._id !== id));
      alert("Event deleted!");
    } catch (err) {
      console.error(err);
      alert("Failed to delete event");
    } finally {
      setDeleteLoading(null);
    }
  };


  return (
    <>
      <Navbar role="admin" />
      <div className="pt-20 px-6 container m-auto">
        <h2 className="text-2xl font-bold mb-4">Manage Events</h2>

        {/* Add Event Form */}
        <form
          onSubmit={handleAddEvent}
          className="bg-white p-6 container m-auto rounded-xl shadow-md mb-8 grid gap-4 sm:gap-6 sm:grid-cols-2"
        >
          {/* Event Name */}
          <input
            type="text"
            placeholder="Event Name"
            className="border p-2 rounded w-full sm:col-span-2"
            value={newEvent.title}
            onChange={(e) =>
              setNewEvent({ ...newEvent, title: e.target.value })
            }
            required
          />

          {/* Description */}
          <textarea
            placeholder="Description"
            className="border p-2 rounded w-full sm:col-span-2 min-h-[100px]"
            value={newEvent.description}
            onChange={(e) =>
              setNewEvent({ ...newEvent, description: e.target.value })
            }
            required
          />

          {/* SubEvents Input */}
          <div className="sm:col-span-2">
            <SubEventsInput
              subEvents={newEvent.SubEvents}
              setSubEvents={(subs) =>
                setNewEvent({ ...newEvent, SubEvents: subs })
              }
            />
          </div>

          {/* Department */}
          <input
            type="text"
            placeholder="Department"
            className="border p-2 rounded w-full"
            value={newEvent.department}
            onChange={(e) =>
              setNewEvent({ ...newEvent, department: e.target.value })
            }
            required
          />

          {/* Event Date */}
          <input
            type="date"
            placeholder="Event Date"
            className="border p-2 rounded w-full"
            value={newEvent.EventDate}
            onChange={(e) =>
              setNewEvent({ ...newEvent, EventDate: e.target.value })
            }
            required
          />

          {/* Amount */}
          <input
            type="text"
            placeholder="Amount"
            className="border p-2 rounded w-full"
            value={newEvent.amount}
            onChange={(e) =>
              setNewEvent({ ...newEvent, amount: e.target.value })
            }
            required
          />

          {/* Upload Image */}
          <div className="sm:col-span-2">
            <UploadImage
              onUpload={(url) => setNewEvent({ ...newEvent, postureImg: url })}
              addBtn={addBtn}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`py-2 rounded sm:col-span-2 flex items-center justify-center gap-2 text-white
      ${
        loading
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-green-600 hover:bg-green-700"
      }`}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                Adding...
              </>
            ) : (
              "+ Add Event"
            )}
          </button>
        </form>

        {/* Event List */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <div key={event._id} className="bg-white rounded-xl shadow-md p-4">
              <img
                src={event.postureImg}
                alt={event.title}
                className="w-full h-40 rounded-lg object-cover"
              />
              <h3 className="text-lg font-semibold mt-2">{event.title}</h3>
              <p className="text-gray-600">{event.description}</p>
              <p className="text-gray-600">
                {(event.SubEvents || []).join(", ")}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                📅 {new Date(event.EventDate).toLocaleDateString()}
              </p>
              <p className="text-sm text-blue-600 font-semibold">
                ₹{event.amount}
              </p>
              <button
                className={`w-full py-2 mt-3 rounded flex items-center justify-center gap-2
        ${
          deleteLoading === event._id
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-red-500 hover:bg-red-600 text-white"
        }`}
                onClick={() => handleDelete(event._id)}
                disabled={deleteLoading === event._id}
              >
                {deleteLoading === event._id ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full text-center">
              <h3 className="text-lg font-semibold mb-4">Image Required</h3>
              <p className="mb-4">
                Please upload an image before submitting the event.
              </p>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
