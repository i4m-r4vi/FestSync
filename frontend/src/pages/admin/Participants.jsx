import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import Navbar from "../../components/Navbar";
import { format, parseISO } from "date-fns";
import { Loader2 } from "lucide-react";
import Modal from "../../components/Modal";

export default function Participants() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openEvent, setOpenEvent] = useState(null);
  const [sending, setSending] = useState(null);
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: "success",
    message: "",
  });

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
      setModalState({
        isOpen: true,
        type: "success",
        message: "Certificates sent successfully!",
      });
    } catch (err) {
      console.error("Error sending certificates:", err);
      setModalState({
        isOpen: true,
        type: "error",
        message: err.response?.data?.message || "Failed to send certificates.",
      });
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-background">
        <Loader2 className="animate-spin w-8 h-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-6 pt-28">
        <h2 className="text-3xl font-bold mb-8 text-foreground">Registered Event Participants</h2>

        {events.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-border rounded-xl">
            <h3 className="text-xl font-semibold text-foreground">No Participants Found</h3>
            <p className="text-muted-foreground mt-2">No users have registered for any event yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event._id} className="border border-border rounded-lg shadow-sm bg-card">
                <button
                  onClick={() =>
                    setOpenEvent(openEvent === event._id ? null : event._id)
                  }
                  className="w-full flex justify-between items-center px-4 py-3 bg-secondary text-secondary-foreground font-semibold rounded-t-lg"
                >
                  <span>
                    {event.title} ({event.registeredUsers.length} participants)
                  </span>
                  <span>{openEvent === event._id ? "▲" : "▼"}</span>
                </button>

                {openEvent === event._id && (
                  <div className="p-4">
                    {event.registeredUsers.length === 0 ? (
                      <p className="text-muted-foreground">No users registered.</p>
                    ) : (
                      <>
                        <div className="flex justify-end mb-4">
                          <button
                            onClick={() => handleSendCertificates(event._id)}
                            disabled={sending === event._id}
                            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-md disabled:opacity-50 flex items-center gap-2"
                          >
                            {sending === event._id
                              ? <><Loader2 size={16} className="animate-spin"/> Sending...</>
                              : "Send Certificates"}
                          </button>
                        </div>

                        <div className="hidden md:block overflow-x-auto">
                          <table className="w-full bg-card rounded-lg">
                            <thead className="bg-secondary">
                              <tr>
                                <th className="p-3 text-left font-semibold text-secondary-foreground">Name</th>
                                <th className="p-3 text-left font-semibold text-secondary-foreground">Email</th>
                                <th className="p-3 text-left font-semibold text-secondary-foreground">College</th>
                                <th className="p-3 text-left font-semibold text-secondary-foreground">Sub Event</th>
                                <th className="p-3 text-left font-semibold text-secondary-foreground">Event Date</th>
                              </tr>
                            </thead>
                            <tbody>
                              {event.registeredUsers.map((u) => (
                                <tr key={u._id} className="border-b border-border last:border-0 hover:bg-secondary/50">
                                  <td className="p-3 text-foreground">{u.userId?.fullname}</td>
                                  <td className="p-3 text-muted-foreground">{u.userId?.email}</td>
                                  <td className="p-3 text-muted-foreground">{u.userId?.clgName}</td>
                                  <td className="p-3 text-muted-foreground">{u.subEvent}</td>
                                  <td className="p-3 text-muted-foreground">
                                    {formatDate(event.EventDate)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        <div className="grid gap-4 md:hidden mt-4">
                          {event.registeredUsers.map((u) => (
                            <div
                              key={u._id}
                              className="bg-secondary p-4 rounded-lg shadow-sm flex flex-col gap-1"
                            >
                              <p className="text-lg font-semibold text-foreground">{u.userId?.fullname}</p>
                              <p className="text-muted-foreground text-sm">
                                {u.userId?.email}
                              </p>
                              <p className="text-muted-foreground text-sm">
                                {u.userId?.clgName}
                              </p>
                              <p className="text-muted-foreground text-sm">
                                Sub-Event: {u.subEvent}
                              </p>
                              <p className="text-muted-foreground text-xs mt-2">
                                Event Date: {formatDate(event.EventDate)}
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
      </main>
      <Modal
        isOpen={modalState.isOpen}
        type={modalState.type}
        message={modalState.message}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
      />
    </div>
  );
}
