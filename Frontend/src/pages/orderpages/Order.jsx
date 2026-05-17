// OrdersScreen.jsx
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import BottomNavbar from "../../components/BottomNavbar";

export default function OrdersScreen() {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("ongoing");
  const intervalRef = useRef(null);
  const navigate = useNavigate();

  // Helper: parse eta strings like "15 min", "15m", "15"
  const parseEtaToMinutes = (eta) => {
    if (eta == null) return null;
    if (typeof eta === "number") return eta;
    if (typeof eta === "string") {
      const digits = eta.match(/\d+/);
      if (digits) return parseInt(digits[0], 10);
    }
    return null;
  };

  // Enrich orders with expiresAt and determine initial type
  const enrichOrders = (rawOrders = []) => {
    return rawOrders.map((o) => {
      let expiresAt = o.expiresAt;
      const etaFromField = parseEtaToMinutes(o.eta) ?? parseEtaToMinutes(o.etaMinutes);

      if (!expiresAt) {
        if (o.createdAt && etaFromField != null && !isNaN(new Date(o.createdAt).getTime())) {
          const createdMs = new Date(o.createdAt).getTime();
          expiresAt = createdMs + etaFromField * 60_000;
        } else if (etaFromField != null) {
          expiresAt = Date.now() + etaFromField * 60_000;
        }
      }

      if (expiresAt) {
        const remainingMs = expiresAt - Date.now();
        if (remainingMs <= 0) {
          return { ...o, expiresAt, remainingMs: 0, status: "Delivered", type: "past" };
        }
        return { ...o, expiresAt, remainingMs, type: "ongoing" };
      }

      return { ...o };
    });
  };

  // Fetch orders once
  useEffect(() => {
    let mounted = true;
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/payment/orders`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!res.ok) {
          console.error("Orders fetch failed:", res.status);
          return;
        }

        const data = await res.json();
        const enriched = enrichOrders(data.data || []);
        if (mounted) setOrders(enriched);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    fetchOrders();

    return () => (mounted = false);
  }, []);

  // Centralized interval
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setOrders((prevOrders) =>
        prevOrders.map((order) => {
          if (order.type === "past" || !order.expiresAt) return { ...order, remainingMs: null };

          const remainingMs = order.expiresAt - Date.now();
          if (remainingMs <= 0)
            return { ...order, remainingMs: 0, status: "Delivered", type: "past" };

          let status = order.status ?? "Placed";
          try {
            if (order.createdAt && order.expiresAt) {
              const totalDuration = order.expiresAt - new Date(order.createdAt).getTime();
              if (totalDuration > 0) {
                const fraction = remainingMs / totalDuration;
                if (fraction > 0.6) status = "Preparing";
                else if (fraction > 0.15) status = "On the Way";
                else status = "On the Way";
              }
            }
          } catch (e) { }

          return { ...order, remainingMs, status };
        })
      );
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const filteredOrders = orders.filter((o) => o.type === activeTab);

  // ---------- Reorder function ----------
  const handleReorder = async (order) => {
    try {
      // Example API call to add items to cart
      await fetch(`${import.meta.env.VITE_API_URL}/api/cart/add-multiple`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ items: order.items }),
      });

      // Navigate to cart/checkout page
      navigate("/cart");
    } catch (err) {
      console.error("Failed to reorder:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0C0C0C] text-white flex flex-col">
      {/* Header */}
      <div className="px-4 pt-6 pb-4">
        <h1 className="text-2xl font-bold">Your Orders</h1>

        <div className="flex mt-6 bg-[#1A1A1A] p-1 rounded-full">
          <button
            onClick={() => setActiveTab("ongoing")}
            className={`flex-1 py-2 rounded-full text-sm font-semibold transition ${activeTab === "ongoing"
              ? "bg-orange-500 text-black shadow-lg"
              : "text-gray-400"
              }`}
          >
            Ongoing
          </button>

          <button
            onClick={() => setActiveTab("past")}
            className={`flex-1 py-2 rounded-full text-sm font-semibold transition ${activeTab === "past"
              ? "bg-orange-500 text-black shadow-lg"
              : "text-gray-400"
              }`}
          >
            Past Orders
          </button>
        </div>
      </div>

      {/* Orders List */}
      <div className="flex-1 px-4 pb-4 space-y-4 overflow-y-auto">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              isPast={activeTab === "past"}
              onReorder={() => handleReorder(order)}
            />
          ))
        ) : (
          <p className="text-gray-400 text-center mt-10">No orders found</p>
        )}
      </div>

      <BottomNavbar theme="dark" />
    </div>
  );
}

/* ---------- OrderCard (presentational) ---------- */
function OrderCard({ order, isPast, onReorder }) {
  const navigate = useNavigate();
  const remainingMs = typeof order.remainingMs === "number" ? order.remainingMs : null;

  const formatMsToMMSS = (ms) => {
    if (ms == null) return null;
    if (ms <= 0) return "00:00";
    const totalSec = Math.floor(ms / 1000);
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const displayedTimer = formatMsToMMSS(remainingMs);

  const statusSteps = ["Placed", "Preparing", "On the Way", "Delivered"];
  const currentIndex = statusSteps.indexOf(order.status);
  const progress = ((Math.max(0, currentIndex) + 1) / statusSteps.length) * 100;

  return (
    <div className="bg-[#131313] rounded-3xl p-4 border border-[#2B2B2B] shadow-xl">
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-white">{order.restaurant}</h2>
          <p className="text-sm text-gray-400">Order ID: {order._id}</p>

          {displayedTimer ? (
            <p className="text-sm text-green-400 font-semibold mt-1">⏱ {displayedTimer}</p>
          ) : (
            order.eta && <p className="text-sm text-orange-400 mt-1">⏱ ETA: {order.eta}</p>
          )}
        </div>
      </div>

      <div className="flex justify-between text-xs text-gray-400 mt-4">
        {statusSteps.map((step, index) => (
          <span key={index} className={currentIndex === index ? "text-white font-semibold" : ""}>
            {step}
          </span>
        ))}
      </div>

      <div className="w-full bg-[#1A1A1A] h-2 rounded-full mt-2">
        <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${progress}%` }} />
      </div>

      <p className="text-sm text-gray-300 mt-3">Items: {order.items?.map(i => i.name).join(", ")}</p>
      <p className="text-sm text-gray-300">Total Items: {order.totalItems}</p>
      <p className="text-sm text-gray-300">Total Price: Rs {order.totalPrice}</p>

      <button
        onClick={isPast ? onReorder : () => navigate(`/track-order/${order._id}`)}
        className="w-full mt-4 py-2 bg-orange-500 text-black text-sm font-semibold rounded-2xl shadow-md"
      >
        {isPast ? "Reorder" : "Track Order"}
      </button>
    </div>
  );
}
