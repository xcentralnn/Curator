import { useState } from "react";
import { Shield, Terminal } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";
import { useAdvisor } from "../contexts/AdvisorContext";

export function PanicButton() {
  const [isConfirming, setIsConfirming] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const { addMessage } = useAdvisor();

  const handlePanic = async () => {
    setStatus("loading");
    addMessage("INITIATING EMERGENCY MANUAL OVERRIDE... All scalers are being paused.", "warning");
    try {
      const response = await fetch("/api/panic", { method: "POST" });
      if (response.ok) {
        setStatus("success");
        addMessage("OVERRIDE COMPLETE: All scalers successfully paused.", "error"); // using error style because it's a critical stop
        setTimeout(() => {
          setStatus("idle");
          setIsConfirming(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Panic failed", error);
      setStatus("idle");
      addMessage("CRITICAL FAILURE: Could not connect to ML Engine to pause scalers.", "error");
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsConfirming(true)}
        className="flex items-center gap-2 px-4 py-2 bg-curator-panic hover:bg-red-600 text-white rounded-lg font-bold text-sm transition-all shadow-lg shadow-red-900/20 uppercase tracking-widest"
      >
        <Shield className="w-4 h-4" />
        Panic Stop
      </button>

      <AnimatePresence>
        {isConfirming && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="absolute top-full right-0 mt-4 w-72 dark:bg-curator-card bg-white border dark:border-curator-panic/50 border-curator-panic/30 p-6 rounded-xl shadow-2xl z-50 text-center"
          >
            <div className="w-12 h-12 bg-curator-panic/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Terminal className="text-curator-panic w-6 h-6 border-curator-panic" />
            </div>
            <h3 className="dark:text-white text-gray-900 font-bold mb-2">Emergency Override?</h3>
            <p className="text-xs dark:text-gray-400 text-gray-500 mb-6 italic font-serif">
              "This will instantly freeze all autoscaling operations across all namespaces and lock current replica counts."
            </p>
            
            <div className="grid grid-cols-2 gap-3 font-mono">
              <button 
                onClick={() => setIsConfirming(false)}
                className="px-4 py-2 dark:bg-white/5 bg-gray-100 dark:hover:bg-white/10 hover:bg-gray-200 dark:text-gray-400 text-gray-700 rounded-lg text-xs"
              >
                CANCEL
              </button>
              <button 
                onClick={handlePanic}
                disabled={status !== "idle"}
                className={cn(
                  "px-4 py-2 rounded-lg text-xs font-bold transition-all",
                  status === "success" ? "bg-green-500 text-white" : "bg-curator-panic hover:bg-red-600 text-white"
                )}
              >
                {status === "loading" ? "EXECUTING..." : status === "success" ? "LOCKED" : "CONFIRM"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
