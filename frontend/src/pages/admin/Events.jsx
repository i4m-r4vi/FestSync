import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import Navbar from "../../components/Navbar";
import UploadImage from "../../components/UploadImage";
import SubEventsInput from "./SubEventsInput";
import { Loader2, Trash2, X } from "lucide-react";
import Modal from "../../components/Modal";

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
  
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: "warning",
    message: "",
  });
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
      setModalState({ isOpen: true, message: "Please upload an image for the event." });
      setLoading(false);
      return;
    }

    try {
      await axiosInstance.post("/events/uploadEvents", newEvent);
      setAddBtn(prev => !prev);
      setNewEvent({
        title: "",
        description: "",
        EventDate: "",
        department: "",
        amount: "",
        postureImg: "",
        SubEvents: [],
      });
      fetchEvents();
    } catch (err) {
      console.error(err);
      setModalState({ isOpen: true, type: 'error', message: 'Failed to add event.'});
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setDeleteLoading(id);
    try {
      await axiosInstance.delete(`/events/deleteEvent/${id}`);
      setEvents(events.filter((e) => e._id !== id));
    } catch (err) {
      console.error(err);
      setModalState({ isOpen: true, type: 'error', message: 'Failed to delete event.'});
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-28 px-6 container m-auto">
        <h2 className="text-3xl font-bold mb-8 text-foreground">Manage Events</h2>

        {/* Add Event Form */}
        <form
          onSubmit={handleAddEvent}
          className="bg-card border border-border p-6 rounded-xl shadow-sm mb-10 grid gap-6 sm:grid-cols-2"
        >
          <div className="sm:col-span-2">
            <label className="block text-foreground/80 mb-2">Event Name</label>
            <input
              type="text"
              placeholder="e.g. Tech Conference 2024"
              className="border-border bg-input p-3 rounded w-full"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-foreground/80 mb-2">Description</label>
            <textarea
              placeholder="Describe the event"
              className="border-border bg-input p-3 rounded w-full min-h-[120px]"
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-foreground/80 mb-2">Sub-Events (Optional)</label>
            <SubEventsInput
              subEvents={newEvent.SubEvents}
              setSubEvents={(subs) => setNewEvent({ ...newEvent, SubEvents: subs })}
            />
          </div>

          <div>
            <label className="block text-foreground/80 mb-2">Department</label>
            <input
              type="text"
              placeholder="e.g. Computer Science"
              className="border-border bg-input p-3 rounded w-full"
              value={newEvent.department}
              onChange={(e) => setNewEvent({ ...newEvent, department: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-foreground/80 mb-2">Event Date</label>
            <input
              type="date"
              className="border-border bg-input p-3 rounded w-full"
              value={newEvent.EventDate}
              onChange={(e) => setNewEvent({ ...newEvent, EventDate: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-foreground/80 mb-2">Registration Fee</label>
            <input
              type="number"
              placeholder="Amount in INR (e.g. 100)"
              className="border-border bg-input p-3 rounded w-full"
              value={newEvent.amount}
              onChange={(e) => setNewEvent({ ...newEvent, amount: e.target.value })}
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-foreground/80 mb-2">Event Poster</label>
            <UploadImage
              onUpload={(url) => setNewEvent({ ...newEvent, postureImg: url })}
              addBtn={addBtn}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="py-3 rounded-lg sm:col-span-2 flex items-center justify-center gap-2 text-primary-foreground bg-primary hover:opacity-90 disabled:bg-primary/50"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Adding Event...
              </>
            ) : (
              "+ Add Event"
            )}
          </button>
        </form>

        {/* Event List */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <div key={event._id} className="bg-card border border-border rounded-xl shadow-sm p-4 flex flex-col">
              <img
                src={event.postureImg}
                alt={event.title}
                className="w-full h-40 rounded-lg object-cover"
              />
              <div className="flex-grow mt-4">
                <h3 className="text-lg font-semibold text-foreground">{event.title}</h3>
                <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{event.description}</p>
                <p className="text-muted-foreground text-sm mt-2">
                  {(event.SubEvents || []).join(", ")}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  📅 {new Date(event.EventDate).toLocaleDateString()}
                </p>
                <p className="text-sm text-primary font-semibold">
                  ₹{event.amount}
                </p>
              </div>
              <button
                className="w-full py-2 mt-4 rounded-md flex items-center justify-center gap-2 bg-destructive text-destructive-foreground hover:opacity-90 disabled:opacity-50"
                onClick={() => handleDelete(event._id)}
                disabled={deleteLoading === event._id}
              >
                {deleteLoading === event._id ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Delete
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
      <Modal 
        isOpen={modalState.isOpen}
        type={modalState.type}
        message={modalState.message}
        onClose={() => setModalState({ ...modalState, isOpen: false})}
      />
    </div>
  );
}
