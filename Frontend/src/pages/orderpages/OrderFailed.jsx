import { X, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";



export default function OrderFailedScreen() {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-[#0C0C0C] text-white relative px-5 py-6"
    >

      {/* TOP HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-3 mb-6"
      >
        <button className="p-2 rounded-full bg-[#1A1A1A] border border-[#2B2B2B]">
          <X className="w-5 h-5 text-neutral-300" />
        </button>
        <h1 className="text-lg font-semibold tracking-wide">Order Failed</h1>
      </motion.div>

      {/* CENTER CONTENT */}
      <div className="flex flex-col items-center mt-6">

        {/* FAILED ICON */}
        <motion.div
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 10 }}
          className="w-32 h-32 flex items-center justify-center rounded-full 
          bg-[#2A0F0F] shadow-[0_0_40px_rgba(255,0,0,0.18)] mb-4"
        >
          <AlertTriangle className="w-20 h-20 text-[#FF4D4D]" />
        </motion.div>

        {/* HEADING */}
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-2xl font-bold text-center leading-tight text-red-500"
        >
          Payment Failed!
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-neutral-400 text-sm text-center mt-2 mb-8 px-4 leading-relaxed"
        >
          Your order could not be processed due to a payment issue.
          Please try again.
        </motion.p>

        {/* ORDER CARD */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="bg-[#131313] w-full max-w-sm rounded-3xl p-5 
          shadow-[0_8px_25px_rgba(0,0,0,0.45)] border border-[#1F1F1F] backdrop-blur-xl"
        >

          <div className="flex justify-between py-2">
            <span className="text-neutral-500 text-sm">Order Number</span>
            <span className="font-medium text-white text-sm">#123-ABC-456</span>
          </div>

          <div className="flex justify-between py-2">
            <span className="text-neutral-500 text-sm">Reason</span>
            <span className="font-medium text-red-400 text-sm">Payment Error</span>
          </div>

          <div className="flex justify-between py-2">
            <span className="text-neutral-500 text-sm">Status</span>
            <span className="font-medium text-red-500 text-sm">Failed</span>
          </div>
        </motion.div>

        {/* BUTTONS */}
        <div className="w-full max-w-sm mt-7 space-y-3">

          {/* Retry Payment */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="w-full py-3 bg-red-500 text-white font-semibold text-base 
            rounded-2xl shadow-[0_6px_18px_rgba(255,0,0,0.45)] transition"
            onClick={()=> { navigate("/payment-order"); }}
          >
            Retry Payment
          </motion.button>

          {/* Back to Home */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="w-full py-3 bg-[#1A1A1A] border border-[#2B2B2B] text-white 
            font-semibold text-base rounded-2xl transition"
            onClick={()=> { navigate("/"); }}
          >
            Back to Home
          </motion.button>

        </div>
      </div>
    </motion.div>
  );
}
