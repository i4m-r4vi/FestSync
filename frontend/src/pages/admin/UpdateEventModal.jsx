import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { Loader2, X } from "lucide-react";
import SubEventsInput from "./SubEventsInput";
import UploadImage from "../../components/UploadImage";
import Modal from "../../components/Modal";
import { AnimatePresence, motion } from "framer-motion";

export default function UpdateEventModal({ isOpen, onClose, event, onEventUpdate }) {
  const [updatedEvent, setUpdatedEvent] = useState({ ...event });
  const [loading, setLoading] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: "warning",
    message: "",
  });

  useEffect(() => {
    const formattedDate = event.EventDate ? new Date(event.EventDate).toISOString().split('T')[0] : '';
    setUpdatedEvent({ ...event, EventDate: formattedDate });
  }, [event]);

  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
        await axiosInstance.put(`/events/updateEvent/${event._id}`, updatedEvent);
        onEventUpdate();
        onClose();
    } catch (err) {
        console.error("Error updating event:", err);
        setModalState({ isOpen: true, type: 'error', message: err.response?.data?.message || 'Failed to update event.' });
    } finally {
        setLoading(false);
    }
  };
  
  const handleChange = (e) => {
    setUpdatedEvent({ ...updatedEvent, [e.target.name]: e.target.value });
  };


  return (
    <AnimatePresence>
        {isOpen && (
             <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[100] p-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-card border border-border rounded-xl shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-bold text-foreground">Edit Event</h3>
                        <button onClick={onClose} className="p-1 rounded-full hover:bg-secondary">
                            <X size={22} className="text-muted-foreground"/>
                        </button>
                    </div>

                    <form
                        onSubmit={handleUpdateEvent}
                        className="grid gap-6 sm:grid-cols-2"
                        >
                        <div className="sm:col-span-2">
                            <label className="block text-foreground/80 mb-2">Event Name</label>
                            <input
                                type="text"
                                name="title"
                                className="border-border bg-input p-3 rounded w-full"
                                value={updatedEvent.title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-foreground/80 mb-2">Description</label>
                            <textarea
                                name="description"
                                className="border-border bg-input p-3 rounded w-full min-h-[120px]"
                                value={updatedEvent.description}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-foreground/80 mb-2">Sub-Events</label>
                            <SubEventsInput
                                subEvents={updatedEvent.SubEvents || []}
                                setSubEvents={(subs) => setUpdatedEvent({ ...updatedEvent, SubEvents: subs })}
                            />
                        </div>
                        
                        <div>
                            <label className="block text-foreground/80 mb-2">Department</label>
                            <input
                                type="text"
                                name="department"
                                className="border-border bg-input p-3 rounded w-full"
                                value={updatedEvent.department}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-foreground/80 mb-2">Event Date</label>
                            <input
                                type="date"
                                name="EventDate"
                                className="border-border bg-input p-3 rounded w-full"
                                value={updatedEvent.EventDate}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-foreground/80 mb-2">Registration Fee</label>
                            <input
                                type="number"
                                name="amount"
                                className="border-border bg-input p-3 rounded w-full"
                                value={updatedEvent.amount}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-foreground/80 mb-2">Event Poster</label>
                            <div className="flex items-start gap-4">
                                <UploadImage
                                    onUpload={(url) => setUpdatedEvent({ ...updatedEvent, postureImg: url })}
                                    image={updatedEvent.postureImg}
                                    setImage={(url) => setUpdatedEvent({ ...updatedEvent, postureImg: url })}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 sm:col-span-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="bg-secondary text-secondary-foreground px-6 py-2 rounded-lg hover:bg-border transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-primary text-primary-foreground px-6 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 disabled:opacity-50 transition-colors"
                            >
                                {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={18}/>
                                    Updating...
                                </>
                                ) : "Update Event"}
                            </button>
                        </div>
                    </form>
                </motion.div>
                <Modal 
                    isOpen={modalState.isOpen}
                    type={modalState.type}
                    message={modalState.message}
                    onClose={() => setModalState({ ...modalState, isOpen: false})}
                />
            </div>
        )}
    </AnimatePresence>
  );
}
