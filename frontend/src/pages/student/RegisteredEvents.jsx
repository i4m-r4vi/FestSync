import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../utils/axiosInstance";
import Navbar from "../../components/Navbar";
import { Loader2, Calendar } from "lucide-react";

export default function RegisteredEvents() {
  const {
    data: user,
    isLoading: userLoading,
    isError: userError,
  } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/auth/profile");
      return data.userInfo;
    },
  });

  const {
    data: registrations,
    isLoading: regLoading,
    isError: regError,
  } = useQuery({
    queryKey: ["registeredEvents", user?._id],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `/events/getRegisteredEvents/${user._id}`
      );
      return data.registeredEvents;
    },
    enabled: !!user,
  });

  if (userLoading || regLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-background">
        <Loader2 className="animate-spin w-8 h-8 text-primary" />
      </div>
    );
  }

  if (userError || regError) {
    return (
      <div className="flex justify-center items-center h-screen bg-background">
        <p className="text-red-500">Failed to load registered events.</p>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <main className="container mx-auto pt-28 px-6">
        <h2 className="text-3xl font-bold mb-8 text-foreground">
          My Registered Events
        </h2>

        {(!registrations || registrations.length === 0) ? (
          <div className="text-center py-16 border-2 border-dashed border-border rounded-xl">
            <h3 className="text-xl font-semibold text-foreground">
              No Registered Events
            </h3>
            <p className="text-muted-foreground mt-2">
              You haven't registered for any events yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {registrations.map((reg) => (
              <div
                key={reg._id}
                className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={reg.eventId?.postureImg}
                    alt={reg.eventId?.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {reg.eventId?.title}
                  </h3>

                  {reg.subEvent && (
                    <p className="text-primary font-semibold mb-2">
                      {reg.subEvent}
                    </p>
                  )}

                  <div className="flex items-center text-sm text-muted-foreground mt-auto">
                    <Calendar size={16} className="mr-2" />
                    <span>
                      {new Date(reg.eventId?.EventDate).toLocaleDateString(
                        "en-US",
                        { year: "numeric", month: "long", day: "numeric" }
                      )}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
