// src/pages/About.jsx
import Navbar from "../components/Navbar";
import { Github } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-grow container mx-auto px-6 py-28 md:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-foreground">
            About FestSync
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            FestSync is a modern, all-in-one platform designed to streamline event management for colleges and universities. Our mission is to simplify the process of discovering, registering for, and managing campus events for students, while providing powerful tools for administrators to organize and track participation.
          </p>
          <p className="text-lg text-muted-foreground mb-12">
            From secure payment processing with Stripe to automated certificate generation, FestSync provides a seamless experience for everyone involved. This project is open-source, and we welcome contributions from the community.
          </p>

          <a
            href="https://github.com/i4m-r4vi/FestSync" // Replace with your actual repo link
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-transform transform hover:scale-105 shadow-lg"
          >
            <Github size={20} />
            <span>View on GitHub</span>
          </a>
        </div>
      </main>

      <footer className="bg-background border-t border-border text-center py-6">
        <p className="text-muted-foreground">© {new Date().getFullYear()} FestSync. All rights reserved.</p>
      </footer>
    </div>
  );
}
