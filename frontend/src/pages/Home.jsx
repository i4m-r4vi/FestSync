// src/pages/Home.js
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Award, CreditCard, Zap, ArrowDown } from "lucide-react";

const featureVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.5,
    },
  }),
};

export default function Home() {
  const { data: user } = useQuery({
    queryKey: ["authUser"],
  });

  const features = [
    {
      icon: <Zap size={28} className="text-primary" />,
      title: "Easy Event Registration",
      description: "Browse events and register with just a few clicks.",
    },
    {
      icon: <CreditCard size={28} className="text-primary" />,
      title: "Secure Payments",
      description: "Pay for events seamlessly using Stripe’s secure gateway.",
    },
    {
      icon: <Award size={28} className="text-primary" />,
      title: "Instant Certificates",
      description: "Receive auto-generated certificates right after events.",
    },
  ];

  const eventLink =
    user?.role === "admin" ? "/admin/events" : "/student/events";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Hero Section */}
      <header className="flex flex-col items-center justify-center text-center relative h-screen">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight text-foreground">
              The Ultimate Campus Event Platform
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 text-muted-foreground">
              Discover events, register online, and get instant certificates.
            </p>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              {user ? (
                <Link
                  to={eventLink}
                  className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-transform transform hover:scale-105 shadow-lg"
                >
                  Show Events
                </Link>
              ) : (
                <div className="space-x-4">
                   <Link
                    to="/login"
                    className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-transform transform hover:scale-105 shadow-lg"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-secondary text-secondary-foreground px-8 py-3 rounded-full font-semibold hover:bg-border transition-transform transform hover:scale-105 shadow-lg"
                  >
                    Register
                  </Link>
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
        <div className="absolute bottom-10 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce">
            <span className="text-sm text-muted-foreground">Scroll Down</span>
            <ArrowDown size={20} className="text-muted-foreground" />
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 px-6 bg-secondary dark:bg-slate-900">
        <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
              Why Choose FestSync?
            </h2>
            <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  className="bg-card shadow-md p-8 rounded-2xl flex flex-col items-center text-center transition-transform transform hover:-translate-y-2 border border-border"
                  variants={featureVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                >
                  <div className="bg-primary/10 p-4 rounded-full mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border text-center py-6">
        <div className="container mx-auto">
            <p className="text-muted-foreground">
            © {new Date().getFullYear()} FestSync. All rights reserved.
            </p>
        </div>
      </footer>
    </div>
  );
}
