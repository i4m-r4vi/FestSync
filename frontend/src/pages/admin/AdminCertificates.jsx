import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import Navbar from "../../components/Navbar";
import { Loader2 } from "lucide-react";

export default function AdminCertificates() {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/admin/participants")
      .then((res) => setParticipants(res.data))
      .catch((err) => console.error("Error fetching participants:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleSendCertificate = async (studentId, eventId) => {
    try {
      await axiosInstance.post("/admin/send-certificate", { studentId, eventId });
      alert("✅ Certificate sent successfully!");
    } catch (err) {
      console.error("Error sending certificate:", err);
      alert("❌ Failed to send certificate");
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
      <main className="container mx-auto pt-28 px-6">
        <h2 className="text-3xl font-bold mb-8 text-foreground">Send Certificates</h2>

        {participants.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-border rounded-xl">
            <h3 className="text-xl font-semibold text-foreground">No Participants Found</h3>
            <p className="text-muted-foreground mt-2">There are no participants to send certificates to yet.</p>
          </div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto bg-card border border-border rounded-lg shadow-sm">
              <table className="w-full">
                <thead className="bg-secondary">
                  <tr>
                    <th className="p-4 text-left font-semibold text-secondary-foreground">Student</th>
                    <th className="p-4 text-left font-semibold text-secondary-foreground">Email</th>
                    <th className="p-4 text-left font-semibold text-secondary-foreground">Event</th>
                    <th className="p-4 text-center font-semibold text-secondary-foreground">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {participants.map((p) => (
                    <tr key={p._id} className="border-b border-border last:border-0 hover:bg-secondary/50">
                      <td className="p-4 text-foreground">{p.fullname}</td>
                      <td className="p-4 text-muted-foreground">{p.email}</td>
                      <td className="p-4 text-muted-foreground">{p.eventName}</td>
                      <td className="p-4 text-center">
                        <button
                          className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:opacity-90 transition"
                          onClick={() => handleSendCertificate(p._id, p.eventId)}
                        >
                          Send
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid gap-4 md:hidden">
              {participants.map((p) => (
                <div
                  key={p._id}
                  className="bg-card border border-border p-4 rounded-lg shadow-sm flex flex-col gap-2"
                >
                  <p className="text-lg font-semibold text-foreground">{p.fullname}</p>
                  <p className="text-muted-foreground text-sm">{p.email}</p>
                  <p className="text-muted-foreground text-sm">Event: {p.eventName}</p>
                  <button
                    className="bg-primary text-primary-foreground w-full mt-2 px-4 py-2 rounded-lg hover:opacity-90 transition"
                    onClick={() => handleSendCertificate(p._id, p.eventId)}
                  >
                    Send Certificate
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
