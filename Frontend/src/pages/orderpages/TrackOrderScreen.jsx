import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import { FiArrowLeft, FiPhone, FiHelpCircle, FiNavigation, FiInfo } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import L from "leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";

// Custom Marker Icons for a Premium Look
const restaurantIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/4320/4320337.png", // Restaurant building icon
  iconSize: [45, 45],
  iconAnchor: [22, 45],
});

const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/9131/9131546.png", // Home/User icon
  iconSize: [45, 45],
  iconAnchor: [22, 45],
});

const driverIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/4662/4662914.png", // Delivery bike icon
  iconSize: [50, 50],
  iconAnchor: [25, 50],
});

export default function TrackOrderScreen() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [driverPos, setDriverPos] = useState(null);
  const driverIndexRef = useRef(0);

  const [locations, setLocations] = useState({
    restaurant: [24.9372, 67.0423],
    user: [24.9107, 67.0311],
  });

  useEffect(() => {
    if (orderId && orderId !== "undefined") {
      fetchOrderDetails();
    } else {
      setLoading(false);
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/api/payment/details/${orderId}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        const fetchedOrder = res.data.order;
        setOrder(fetchedOrder);
        
        const newLocs = {
          restaurant: [fetchedOrder.partnerLocation.lat, fetchedOrder.partnerLocation.lng],
          user: [fetchedOrder.userLocation.lat, fetchedOrder.userLocation.lng],
        };
        setLocations(newLocs);
        setDriverPos(newLocs.restaurant);
      }
    } catch (err) {
      console.error("Error fetching order details:", err);
    } finally {
      setLoading(false);
    }
  };

  const getSimulatedRoute = () => {
    const start = locations.restaurant;
    const end = locations.user;
    const mid = [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2 + 0.005];
    return [start, mid, end];
  };

  const deliveryRoute = getSimulatedRoute();

  useEffect(() => {
    if (!order || !driverPos) return;
    const route = getSimulatedRoute();
    const interval = setInterval(() => {
      driverIndexRef.current += 1;
      if (driverIndexRef.current < route.length) {
        setDriverPos(route[driverIndexRef.current]);
      } else {
        driverIndexRef.current = 0;
        setDriverPos(route[0]);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [order, locations]);

  if (loading) return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center text-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
    </div>
  );
  
  if (!order) return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center text-white">
      <p className="text-xl font-semibold">Order not found</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex flex-col relative overflow-hidden">
      {/* Premium Header */}
      <div className="flex items-center justify-between p-5 bg-[#0f0f0f]/80 backdrop-blur-md text-white z-50 fixed top-0 w-full border-b border-white/5">
        <button 
          onClick={() => navigate(-1)} 
          className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all active:scale-95"
        >
          <FiArrowLeft size={22} />
        </button>
        <div className="text-center">
          <h1 className="text-lg font-bold">Track Your Order</h1>
          <p className="text-xs text-gray-400">Order ID: #{order.id.slice(-6)}</p>
        </div>
        <button className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
          <FiHelpCircle size={22} />
        </button>
      </div>

      {/* Map Section with Dark Styling */}
      <div className="h-[60vh] w-full relative">
        <MapContainer
          center={locations.restaurant}
          zoom={14}
          zoomControl={false}
          className="w-full h-full"
        >
          {/* Dark Tile Layer (CartoDB Dark Matter) */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          
          <Marker position={locations.restaurant} icon={restaurantIcon}>
            <Popup className="custom-popup">Restaurant</Popup>
          </Marker>
          
          {driverPos && (
            <Marker position={driverPos} icon={driverIcon}>
              <Popup className="custom-popup">Alex is on the way!</Popup>
            </Marker>
          )}
          
          <Marker position={locations.user} icon={userIcon}>
            <Popup className="custom-popup">Your Home</Popup>
          </Marker>
          
          <Polyline 
            positions={deliveryRoute} 
            color="#f97316" 
            weight={4} 
            dashArray="10, 10" 
            opacity={0.6}
          />
        </MapContainer>

        {/* Floating Info Overlay */}
        <div className="absolute bottom-16 left-5 right-5 z-40 bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-3xl flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-500/20 rounded-2xl flex items-center justify-center text-orange-500">
                  <FiNavigation size={24} />
              </div>
              <div>
                 <p className="text-xs text-gray-400">Estimated Arrival</p>
                 <p className="text-lg font-bold text-white">{order.eta}</p>
              </div>
           </div>
           <button className="bg-orange-500 text-black px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-orange-500/20">
              Details
           </button>
        </div>
      </div>

      {/* Bottom Control Sheet */}
      <div className="bg-[#131313] rounded-t-[45px] p-8 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] relative z-50 -mt-10 flex-1 border-t border-white/5">
        <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-8"></div>
        
        {/* Driver Profile */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100&h=100"
                alt="Driver"
                className="w-16 h-16 rounded-2xl object-cover border-2 border-orange-500"
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-[#131313] rounded-full"></div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Alex Johnson</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-orange-500 text-sm font-bold">★ 4.9</span>
                <span className="text-gray-500 text-xs">• Delivery Partner</span>
              </div>
            </div>
          </div>
          <button className="p-4 bg-orange-500 text-black rounded-2xl shadow-xl shadow-orange-500/20 active:scale-90 transition-all">
            <FiPhone size={24}/>
          </button>
        </div>

        {/* Dynamic Timeline */}
        <div className="space-y-7 overflow-y-auto max-h-[30vh] pr-2 custom-scrollbar">
          {order.timeline.map((step, idx) => {
            const isActive = step.completed;
            return (
              <div key={idx} className="flex items-start gap-5">
                <div className="flex flex-col items-center">
                  <div className={`w-11 h-11 flex items-center justify-center rounded-2xl text-xl transition-all duration-500 ${
                    isActive 
                      ? "bg-orange-500 text-black shadow-lg shadow-orange-500/30 rotate-0" 
                      : "bg-white/5 text-gray-500 border border-white/5"
                  }`}>
                    {step.icon}
                  </div>
                  {idx !== order.timeline.length - 1 && (
                    <div className={`w-0.5 h-10 mt-1 rounded-full ${isActive ? "bg-orange-500" : "bg-white/5"}`}></div>
                  )}
                </div>
                <div className="flex-1 pt-1">
                  <div className="flex justify-between items-start">
                    <p className={`text-base font-bold transition-all ${isActive ? "text-white" : "text-gray-500"}`}>
                      {step.label}
                    </p>
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest">{step.time}</span>
                  </div>
                  <p className={`text-xs mt-1 ${isActive ? "text-gray-400" : "text-gray-600"}`}>
                    {isActive ? "Completed" : "Waiting..."}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .custom-popup .leaflet-popup-content-wrapper {
          background: #1a1a1a;
          color: white;
          border-radius: 12px;
          border: 1px border white/10;
        }
        .custom-popup .leaflet-popup-tip {
          background: #1a1a1a;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 0px;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
