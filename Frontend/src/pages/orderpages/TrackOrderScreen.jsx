// TrackOrderScreen.jsx
import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import { FiArrowLeft, FiPhone, FiHelpCircle, FiPlus, FiMinus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix leaflet default icons
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Custom driver icon
const driverIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/61/61168.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

export default function TrackOrderScreen() {
  const navigate = useNavigate();

  const [order, setOrder] = useState({
    eta: 12,
    driver: "Alex",
    orderId: "#123-ABC-456",
    currentStatus: "On the way",
    timeline: [
      { label: "Order Confirmed", time: "8:30 PM", icon: "✓" },
      { label: "Food is being prepared", time: "8:32 PM", icon: "🍴" },
      { label: "On the way", time: "8:45 PM", icon: "🏍️" },
      { label: "Arriving soon", time: "8:57 PM", icon: "📍" },
    ],
  });

  const deliveryRoute = [
    [37.773972, -122.431297],
    [37.7745, -122.426],
    [37.7749, -122.4194],
  ];

  const [driverPos, setDriverPos] = useState(deliveryRoute[0]);
  const driverIndexRef = useRef(0);

  // Animate driver along route
  useEffect(() => {
    const interval = setInterval(() => {
      driverIndexRef.current += 1;
      if (driverIndexRef.current < deliveryRoute.length) {
        setDriverPos(deliveryRoute[driverIndexRef.current]);
      } else clearInterval(interval);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Countdown ETA
  useEffect(() => {
    const timer = setInterval(() => {
      setOrder(prev => ({ ...prev, eta: prev.eta > 0 ? prev.eta - 1 : 0 }));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#F0F0F0] flex flex-col relative">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-[#3C2A21] text-white z-10 sticky top-0">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-[#533F36] hover:bg-[#6b5249] transition">
          <FiArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-semibold">Track Order</h1>
        <button className="p-2 rounded-full bg-[#533F36] hover:bg-[#6b5249] transition">
          <FiHelpCircle size={24} />
        </button>
      </div>

      {/* Map */}
      <div className="h-[55vh] w-full relative">
        <MapContainer
          center={deliveryRoute[0]}
          zoom={14}
          scrollWheelZoom={true}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={deliveryRoute[0]}>
            <Popup className="text-black font-semibold">Restaurant</Popup>
          </Marker>
          <Marker position={driverPos} icon={driverIcon}>
            <Popup className="text-black font-semibold">{order.driver}</Popup>
          </Marker>
          <Marker position={deliveryRoute[deliveryRoute.length - 1]}>
            <Popup className="text-black font-semibold">Your Location</Popup>
          </Marker>
          <Polyline positions={deliveryRoute} color="#F97316" weight={5} />
        </MapContainer>

        {/* Zoom Buttons */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2 bg-white rounded-lg shadow-md">
          <button className="p-2 hover:bg-gray-200 transition"><FiPlus /></button>
          <button className="p-2 hover:bg-gray-200 transition"><FiMinus /></button>
        </div>
      </div>

      {/* Bottom Floating Card */}
      <div className="bg-[#3C2A21] rounded-t-3xl p-6 shadow-2xl -mt-12 space-y-6">
        {/* ETA and driver */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-300 text-sm">Arriving in</p>
            <h2 className="text-2xl font-bold text-white">{order.eta} min</h2>
            <p className="text-gray-300 mt-1">Your driver, <span className="text-white font-semibold">{order.driver}</span></p>
            <p className="text-gray-400 text-xs mt-1">Order ID: {order.orderId}</p>
          </div>
          <div className="flex items-center gap-3">
            <img
              src="https://cdn-icons-png.flaticon.com/512/2922/2922506.png"
              alt="Driver Avatar"
              className="w-12 h-12 rounded-full"
            />
            <button className="flex items-center gap-2 bg-orange-500 px-5 py-2 rounded-2xl font-semibold shadow-lg hover:scale-105 transform transition">
              <FiPhone size={18}/> Contact Driver
            </button>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative space-y-6 max-h-64 overflow-y-auto">
          {order.timeline.map((step, idx) => {
            const currentIndex = order.timeline.findIndex(s => s.label === order.currentStatus);
            const isActive = idx <= currentIndex;
            return (
              <div key={idx} className="flex items-start space-x-4">
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 flex items-center justify-center rounded-full text-lg ${
                    isActive ? "bg-orange-500 text-black" : "bg-gray-700 text-gray-300"
                  }`}>
                    {step.icon}
                  </div>
                  {idx !== order.timeline.length - 1 && (
                    <div className={`w-1 flex-1 mt-1 ${isActive ? "bg-orange-500" : "bg-gray-700"}`}></div>
                  )}
                </div>
                <div className="flex-1 pt-1">
                  <p className={`text-sm ${isActive ? "text-white font-semibold" : "text-gray-300"}`}>
                    {step.label}
                  </p>
                  <p className="text-xs text-gray-400">{step.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
