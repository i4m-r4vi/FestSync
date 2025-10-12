import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import Navbar from "../../components/Navbar";
import { useStripe } from "@stripe/react-stripe-js";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, Loader2 } from "lucide-react";

export default function StudentEvents() {
  const stripe = useStripe();

  const [events, setEvents] = useState([]);
  const [registeredEventIds, setRegisteredEventIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [subEvent, setSubEvent] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventsRes = await axiosInstance.get("/events/getEvents");
        setEvents(eventsRes.data.getEvents);

        const regRes = await axiosInstance.get("/payment/my-registrations");
        const ids = regRes.data.registrations.map((r) => r.eventId?._id);
        setRegisteredEventIds(ids);
      } catch (err) {
        console.error("Failed to load events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRegister = async () => {
    setError("");
    if (!selectedEvent || !stripe) {
      setError("Stripe.js has not loaded yet. Please try again in a moment.");
      return;
    }
    if (selectedEvent.SubEvents?.length > 0 && !subEvent) {
      setError("Please select a sub-event to continue.");
      return;
    }

    setIsRegistering(true);

    try {
      const { data } = await axiosInstance.post(
        `/payment/payment-intent/${selectedEvent._id}`,
        { subEvent }
      );

      if (!data.url) {
        throw new Error("Failed to create checkout session.");
      }

      window.location.href = data.url;
    } catch (err) {
      console.error("Checkout error:", err);
      setError(err.response?.data?.error || "Something went wrong! Please try again.");
    } finally {
      setIsRegistering(false);
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
    <div className="bg-background min-h-screen">
      <Navbar />
      <div className="pt-28 px-6 container mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-foreground">Available Events</h2>
        {events.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-border rounded-xl">
            <h3 className="text-xl font-semibold text-foreground">No Events Found</h3>
            <p className="text-muted-foreground mt-2">Please check back later for new events.</p>
          </div>
        ) : (
          <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {events.map((event, i) => {
              const alreadyRegistered = registeredEventIds.includes(event._id);

              return (
                <motion.div
                  key={event._id}
                  className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={event.postureImg}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-foreground mb-2">{event.title}</h3>
                    <p className="text-muted-foreground flex-1 mb-4 line-clamp-2">{event.description}</p>
                    <div className="flex items-center text-sm text-muted-foreground mb-4">
                      <Calendar size={16} className="mr-2" />
                      <span>
                        {new Date(event.EventDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <button
                      className={`w-full py-2.5 rounded-lg font-semibold transition-all transform hover:scale-105 ${
                        alreadyRegistered
                          ? "bg-secondary text-secondary-foreground cursor-not-allowed"
                          : "bg-primary text-primary-foreground hover:opacity-90"
                      }`}
                      onClick={() => !alreadyRegistered && setSelectedEvent(event)}
                      disabled={alreadyRegistered}
                    >
                      {alreadyRegistered ? "Already Registered" : "View Details"}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card rounded-xl p-6 w-full max-w-lg shadow-2xl border border-border"
            >
              <h2 className="text-2xl font-bold mb-3 text-foreground">{selectedEvent.title}</h2>
              <p className="text-muted-foreground mb-4">{selectedEvent.description}</p>
              <div className="flex items-center text-muted-foreground mb-6">
                <Calendar size={18} className="mr-2" />
                <span>{new Date(selectedEvent.EventDate).toDateString()}</span>
              </div>

              {selectedEvent.SubEvents && selectedEvent.SubEvents.length > 0 && (
                <div className="mb-6">
                  <label className="block mb-2 font-semibold text-foreground">
                    Choose a Sub-Event:
                  </label>
                  <select
                    className="w-full bg-input text-foreground border-border border rounded-lg p-3 focus:ring-2 focus:ring-ring"
                    value={subEvent}
                    onChange={(e) => {
                      setSubEvent(e.target.value);
                      setError("");
                    }}
                  >
                    <option value="">-- Select --</option>
                    {selectedEvent.SubEvents.map((s, i) => (
                      <option key={i} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {error && <p className="text-destructive text-sm text-center mb-4">{error}</p>}

              <div className="flex justify-end gap-4 mt-6">
                <button
                  className="px-6 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-border transition"
                  onClick={() => {
                    setSelectedEvent(null);
                    setSubEvent("");
                    setError("");
                  }}
                >
                  Close
                </button>
                <button
                  className={`px-6 py-2 rounded-lg text-primary-foreground font-semibold flex items-center justify-center transition-transform transform hover:scale-105 ${
                    isRegistering ? "bg-primary/50" : "bg-primary hover:opacity-90"
                  }`}
                  onClick={handleRegister}
                  disabled={isRegistering}
                >
                  {isRegistering ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={20} />
                      Processing...
                    </>
                  ) : selectedEvent.amount > 0 ? (
                    `Register & Pay ₹${selectedEvent.amount}`
                  ) : (
                    "Register for Free"
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
