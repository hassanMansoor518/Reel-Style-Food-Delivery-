import React from "react";
import { FiBell, FiXCircle,FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const notifications = [
  {
    id: 1,
    title: "Order Delivered",
    description: "Your order #1234 has been delivered successfully.",
    time: "2 hours ago",
  },
  {
    id: 2,
    title: "New Offer!",
    description: "Get 20% off on your next order. Limited time offer.",
    time: "5 hours ago",
  },
  {
    id: 3,
    title: "Order Confirmed",
    description: "Your order #1235 has been confirmed.",
    time: "Yesterday",
  },
  {
    id: 4,
    title: "New Message",
    description: "Support replied to your query.",
    time: "2 days ago",
  },
];

export default function Notifications() {
    const navigate = useNavigate();
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
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className="bg-[#1a1a1a] p-4 mb-4 rounded-xl shadow-sm flex justify-between items-start"
          >
            <div>
              <h3 className="text-white font-semibold">{notif.title}</h3>
              <p className="text-gray-400 text-sm mt-1">{notif.description}</p>
              <span className="text-gray-500 text-xs mt-2 block">{notif.time}</span>
            </div>
            <FiXCircle className="text-gray-500 text-xl cursor-pointer" />
          </div>
        ))}

        {notifications.length === 0 && (
          <p className="text-gray-400 text-center mt-10">No notifications</p>
        )}
      </div>
    </div>
  );
}
