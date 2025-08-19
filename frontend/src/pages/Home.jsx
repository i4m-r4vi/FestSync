// src/pages/Home.js
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Welcome to <span className="text-yellow-300">FestSync</span>
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-6">
          The ultimate campus event management platform.  
          Discover events, register online, and get instant certificates.
        </p>
        <div className="space-x-4">
          <Link
            to="/login"
            className="bg-yellow-400 text-blue-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Register
          </Link>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 px-6 bg-gray-50 flex-1">
        <h2 className="text-3xl font-bold text-center mb-10">
          Why Choose FestSync?
        </h2>
        <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
          <div className="bg-white shadow-md p-6 rounded-xl hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">🎉 Easy Event Registration</h3>
            <p className="text-gray-600">
              Students can browse events and register with just a few clicks.
            </p>
          </div>
          <div className="bg-white shadow-md p-6 rounded-xl hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">💳 Secure Payments</h3>
            <p className="text-gray-600">
              Pay for events seamlessly using Stripe’s secure payment gateway.
            </p>
          </div>
          <div className="bg-white shadow-md p-6 rounded-xl hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">📜 Instant Certificates</h3>
            <p className="text-gray-600">
              Receive auto-generated certificates right after attending events.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-700 text-white text-center py-4">
        <p>© {new Date().getFullYear()} FestSync. All rights reserved.</p>
      </footer>
    </div>
  );
}
