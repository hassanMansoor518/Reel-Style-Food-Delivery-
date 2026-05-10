import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiCoffee } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function ProcessingOrder() {
  const { orderId } = useParams();
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("pending"); // 'pending' | 'success' | 'fail'
  const navigate = useNavigate();

  // Increment progress smoothly
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 95 ? prev : prev + 1));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Poll backend for order status every 2 seconds
  useEffect(() => {
    if (!orderId) {
      console.error("No order ID found!");
      navigate("/cart");
      return;
    }

    const interval = setInterval(async () => {
      try {
        const res = await axios.get(
          `http://localhost:3001/api/payment/status/${orderId}`,
          { withCredentials: true }
        );

        const backendStatus = res.data.status; // 'pending' | 'confirmed' | 'failed'
        console.log("Backend status:", backendStatus);

        if (backendStatus === "Confirmed") setStatus("success");
        else if (backendStatus === "failed") setStatus("fail");

      } catch (err) {
        console.error("Order status error:", err.response?.data || err.message);
        setStatus("fail");
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [orderId, navigate]);

  // Navigate when progress is almost done
  useEffect(() => {
    if (progress < 90) return;

    if (status === "success") navigate(`/order-confirmation/${orderId}`);
    else if (status === "fail") navigate("/order-failed");
  }, [status, progress, navigate]);

  return (
    <div className="h-screen bg-[#1a100c] flex flex-col justify-center items-center text-white px-6">
      <motion.div
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="w-40 h-40 rounded-full flex justify-center items-center border-2 border-orange-500 relative"
      >
        <motion.div
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          className="w-20 h-20 bg-orange-600 rounded-full flex justify-center items-center"
        >
          <FiCoffee size={38} className="text-white" />
        </motion.div>
      </motion.div>

      <h2 className="mt-8 text-xl font-semibold text-center">
        {status === "pending"
          ? "Processing your order…"
          : status === "success"
            ? "Order Confirmed!"
            : "Order Failed!"}
      </h2>
      <p className="text-gray-300 text-sm mt-1 text-center">
        {status === "pending"
          ? "Please wait while we confirm your payment."
          : status === "success"
            ? "Your order has been confirmed with the restaurant."
            : "Something went wrong. Please try again."}
      </p>

      <div className="w-64 h-2 bg-[#3a2b25] rounded-full overflow-hidden mt-6">
        <motion.div
          className={`h-full ${status === "fail" ? "bg-red-500" : "bg-orange-500"}`}
          animate={{ width: `${progress}%` }}
          transition={{ ease: "linear" }}
        />
      </div>

      <div className="absolute bottom-6 flex items-center gap-2">
        <div className="w-4 h-4 bg-orange-500 rounded"></div>
        <p className="font-medium text-sm">QuickBite</p>
      </div>
    </div>
  );
}
