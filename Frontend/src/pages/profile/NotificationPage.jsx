import React, { useState, useEffect } from "react";
import { FiBell, FiXCircle, FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Helper function to format time
const formatTimeAgo = (dateString) => {
  const now = new Date();
  const past = new Date(dateString);
  const diffInMs = now - past;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays === 1) return "Yesterday";
  return `${diffInDays} days ago`;
};

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get("${import.meta.env.VITE_API_URL}/api/notifications", {
        withCredentials: true,
      });
      if (res.data.success) {
        setNotifications(res.data.notifications);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/notifications/${id}`, {
        withCredentials: true,
      });
      setNotifications(notifications.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  return (
    <div className="w-screen h-screen bg-[#0f0f0f] flex flex-col">
      {/* Top bar */}
      <div className="flex items-center p-5 bg-[#1a1a1a] shadow-md">
        <button
          onClick={() => navigate(-1)}
          className="text-white text-2xl mr-4"
        >
          <FiArrowLeft />
        </button>
        <h2 className="text-xl font-semibold text-white">Notifications</h2>
      </div>

      {/* Notification List */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {loading ? (
          <p className="text-gray-400 text-center mt-10">Loading...</p>
        ) : notifications.length > 0 ? (
          notifications.map((notif) => (
            <div
              key={notif._id}
              className="bg-[#1a1a1a] p-4 mb-4 rounded-xl shadow-sm flex justify-between items-start border border-white/5"
            >
              <div>
                <h3 className="text-white font-semibold">{notif.title}</h3>
                <p className="text-gray-400 text-sm mt-1">{notif.description}</p>
                <span className="text-gray-500 text-xs mt-2 block">
                  {formatTimeAgo(notif.createdAt)}
                </span>
              </div>
              <button onClick={() => deleteNotification(notif._id)}>
                <FiXCircle className="text-gray-500 text-xl cursor-pointer hover:text-red-500 transition-colors" />
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center mt-10">No notifications</p>
        )}
      </div>
    </div>
  );
}
