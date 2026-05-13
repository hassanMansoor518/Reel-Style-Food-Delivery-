import React, { useEffect, useState } from "react";
import { X, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function RealisticOrderScreen() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/payment/details/${orderId}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setOrder(res.data.order);
      }
    } catch (err) {
      console.error("Error fetching order details:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0C0C0C] flex items-center justify-center text-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
    </div>
  );

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
        <button className="p-2 rounded-full bg-[#1A1A1A] border border-[#2B2B2B]"
          onClick={() => { navigate("/"); }}
        >
          <X className="w-5 h-5 text-neutral-300" />
        </button>
        <h1 className="text-lg font-semibold tracking-wide">Confirmation</h1>
      </motion.div>

      {/* CENTER CONTENT */}
      <div className="flex flex-col items-center mt-6">
        {/* SUCCESS ICON */}
        <motion.div
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 10 }}
          className="w-32 h-32 flex items-center justify-center rounded-full bg-[#0F2618] shadow-[0_0_40px_rgba(0,255,100,0.15)] mb-4"
        >
          <CheckCircle className="w-20 h-20 text-[#3DFF7C]" />
        </motion.div>

        {/* HEADING */}
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-2xl font-bold text-center leading-tight"
        >
          Your Order is on its Way!
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-neutral-400 text-sm text-center mt-2 mb-8 px-4 leading-relaxed"
        >
          Thank you for your order. You can track its progress below.
        </motion.p>

        {/* ORDER CARD */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="bg-[#131313] w-full max-w-sm rounded-3xl p-5 shadow-[0_8px_25px_rgba(0,0,0,0.45)] border border-[#1F1F1F] backdrop-blur-xl"
        >
          <div className="flex justify-between py-2 border-b border-white/5">
            <span className="text-neutral-500 text-sm">Order Number</span>
            <span className="font-medium text-white text-sm">#{order?.id?.slice(-8)}</span>
          </div>

          <div className="flex justify-between py-2 border-b border-white/5">
            <span className="text-neutral-500 text-sm">Est. Delivery</span>
            <span className="font-medium text-white text-sm">{order?.eta || "35-45 minutes"}</span>
          </div>

          <div className="flex justify-between py-2">
            <span className="text-neutral-500 text-sm">Amount Paid</span>
            <span className="font-bold text-orange-400 text-sm">Rs {order?.totalPrice}</span>
          </div>
        </motion.div>

        {/* BUTTONS */}
        <div className="w-full max-w-sm mt-7 space-y-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            onClick={() => navigate(`/track-order/${orderId}`)}
            className="w-full py-3 bg-orange-400 text-black font-semibold text-base rounded-2xl transition shadow-lg shadow-orange-500/20 active:scale-95"
          >
            Track Order
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            onClick={() => { navigate("/"); }}
            className="w-full py-3 bg-[#1A1A1A] border border-[#2B2B2B] text-white font-semibold text-base rounded-2xl transition active:scale-95"
          >
            Back to Home
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
