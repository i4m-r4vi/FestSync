// src/components/Modal.js
import { motion } from "framer-motion";

export default function Modal({ isOpen, type, message, onClose }) {
  if (!isOpen) return null;

  const colors = {
    success: "bg-green-100 text-green-700 border-green-400",
    error: "bg-red-100 text-red-700 border-red-400",
    loading: "bg-blue-100 text-blue-700 border-blue-400",
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`rounded-lg shadow-xl p-6 w-96 border ${colors[type]}`}
      >
        <h3 className="text-lg font-bold mb-2 capitalize">{type}</h3>
        <p className="mb-4">{message}</p>

        {type !== "loading" && (
          <button
            onClick={onClose}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition"
          >
            Close
          </button>
        )}
        {type === "loading" && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-t-transparent border-blue-600"></div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
