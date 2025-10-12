import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertTriangle, Loader } from 'lucide-react';

export default function Modal({ isOpen, type, message, onClose }) {

  const icons = {
    success: <CheckCircle className="text-green-500" size={24}/>,
    error: <XCircle className="text-red-500" size={24}/>,
    loading: <Loader className="animate-spin text-primary" size={24}/>,
    warning: <AlertTriangle className="text-yellow-500" size={24}/>
  };

  return (
    <AnimatePresence>
        {isOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-card border border-border rounded-lg shadow-xl p-6 w-full max-w-sm"
              >
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-secondary">
                        {icons[type]}
                    </div>
                    <div className="flex-grow">
                        <h3 className="text-lg font-bold mb-1 capitalize text-foreground">{type}</h3>
                        <p className="text-muted-foreground">{message}</p>
                    </div>
                </div>

                {type !== "loading" && (
                  <div className="flex justify-end mt-6">
                    <button
                        onClick={onClose}
                        className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:opacity-90 transition"
                    >
                        Close
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
        )}
    </AnimatePresence>
  );
}
