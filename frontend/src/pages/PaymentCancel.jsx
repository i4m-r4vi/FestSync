// src/pages/PaymentCancel.js
import { Link } from "react-router-dom";

export default function PaymentCancel() {
  return (
    <div className="flex items-center justify-center h-screen bg-red-50 px-4">
      <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Payment Cancelled ❌</h1>
        <p className="text-gray-700 mb-6">
          Your payment was not completed.  
          You can try again or go back to the events page.
        </p>

        <div className="space-x-4">
          <Link
            to="/student/events"
            className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition"
          >
            Back to Events
          </Link>
          <Link
            to="/"
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
