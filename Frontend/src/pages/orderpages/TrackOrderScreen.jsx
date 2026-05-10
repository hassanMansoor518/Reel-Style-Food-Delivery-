import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import { FiArrowLeft, FiPhone, FiMessageCircle, FiNavigation, FiStar, FiAlertCircle, FiCheck, FiShoppingBag } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import L from "leaflet";
import axios from "axios";
import { io } from "socket.io-client";

// --- CSS IMPORTS (Critical for Map Visibility) ---
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";

// --- Leaflet Configuration ---
const createIcon = (url, size = [40, 40]) => new L.Icon({
  iconUrl: url,
  iconSize: size,
  iconAnchor: [size[0] / 2, size[1]],
  popupAnchor: [0, -size[1]],
});

const icons = {
  restaurant: createIcon("https://cdn-icons-png.flaticon.com/512/535/535239.png", [45, 45]), // Hamburger icon
  user: createIcon("https://cdn-icons-png.flaticon.com/512/9131/9131546.png", [45, 45]),
};

// --- Routing Component ---
const RoutingMachine = ({ start, end, setRouteInfo }) => {
  const map = useMap();
  const routingControlRef = useRef(null);

  useEffect(() => {
    if (!map || !start || !end || !L.Routing) return;

    try {
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
      }

      routingControlRef.current = L.Routing.control({
        waypoints: [L.latLng(start[0], start[1]), L.latLng(end[0], end[1])],
        lineOptions: {
          styles: [{ color: "#f97316", opacity: 0.8, weight: 6, dashArray: "1, 10" }],
          extendToWaypoints: true,
          missingRouteTolerance: 0
        },
        createMarker: () => null,
        addWaypoints: false,
        draggableWaypoints: false,
        fitSelectedRoutes: false,
        show: false,
      }).addTo(map);

      routingControlRef.current.on("routesfound", (e) => {
        const routes = e.routes;
        const summary = routes[0].summary;
        setRouteInfo({
          distance: (summary.totalDistance / 1000).toFixed(1),
          time: Math.round(summary.totalTime / 60),
        });
      });
    } catch (err) {
      console.error("Routing error:", err);
    }

    return () => {
      if (routingControlRef.current) map.removeControl(routingControlRef.current);
    };
  }, [map, start, end]);

  return null;
};

// --- Map Controller ---
const MapController = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center && map) map.flyTo(center, zoom, { duration: 2 });
  }, [center, zoom, map]);
  return null;
};

// --- Main Component ---
export default function TrackOrderScreen() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const socketRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [routeInfo, setRouteInfo] = useState({ distance: 0, time: 0 });
  const [driverPos, setDriverPos] = useState(null);
  const [status, setStatus] = useState("preparing");
  const [socketConnected, setSocketConnected] = useState(false);

  // Default Locations
  const [locations, setLocations] = useState({
    restaurant: [24.9372, 67.0423],
    user: [24.9107, 67.0311],
  });

  // --- Socket.IO Lifecycle ---
  useEffect(() => {
    socketRef.current = io("http://localhost:3001", {
      withCredentials: true,
      transports: ["websocket"]
    });

    socketRef.current.on("connect", () => {
      setSocketConnected(true);
      socketRef.current.emit("joinOrder", orderId);
    });

    socketRef.current.on("disconnect", () => setSocketConnected(false));

    socketRef.current.on("driverLocationUpdate", (data) => {
      if (data.orderId === orderId) {
        setDriverPos([data.lat, data.lng]);
      }
    });

    socketRef.current.on("orderStatusUpdate", (data) => {
      if (data.orderId === orderId) setStatus(data.status);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [orderId]);

  // --- Initial Data Fetch ---
  useEffect(() => {
    const fetchDetails = async () => {
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
          setStatus(fetchedOrder.status.toLowerCase() === "confirmed" ? "preparing" : "picked_up");
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [orderId]);

  // --- Mock Simulation ---
  useEffect(() => {
    if (!socketConnected && !loading && status !== "delivered" && order) {
      const interval = setInterval(() => {
        setDriverPos(prev => {
          if (!prev) return locations.restaurant;
          const latStep = (locations.user[0] - prev[0]) * 0.05;
          const lngStep = (locations.user[1] - prev[1]) * 0.05;
          const next = [prev[0] + latStep, prev[1] + lngStep];

          const dist = Math.sqrt(Math.pow(next[0] - locations.user[0], 2) + Math.pow(next[1] - locations.user[1], 2));
          if (dist < 0.001) {
            setStatus("delivered");
            clearInterval(interval);
          } else if (dist < 0.01) {
            setStatus("arriving");
          } else {
            setStatus("picked_up");
          }
          return next;
        });
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [socketConnected, loading, status, locations, order]);

  const timelineSteps = [
    { id: "confirmed", label: "Confirmed", icon: <FiCheck />, state: "confirmed" },
    { id: "preparing", label: "Preparing", icon: "🍳", state: "preparing" },
    { id: "picked_up", label: "Picked Up", icon: "🏍️", state: "picked_up" },
    { id: "arriving", label: "Arriving", icon: "🍕", state: "arriving" },
    { id: "delivered", label: "Delivered", icon: "🍔", state: "delivered" },
  ];

  const getCurrentStepIndex = () => {
    if (status === "delivered") return 4;
    if (status === "arriving") return 3;
    if (status === "picked_up") return 2;
    if (status === "preparing") return 1;
    return 0;
  };

  if (loading) return (
    <div className="h-screen bg-[#080808] flex flex-col items-center justify-center space-y-4">
      <div className="w-16 h-16 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
      <p className="text-gray-400 font-medium animate-pulse">Establishing secure connection...</p>
    </div>
  );

  return (
    <div className="h-screen bg-[#080808] flex flex-col relative overflow-hidden font-sans">

      {/* Cinematic Header */}
      <motion.header
        initial={{ y: -100 }} animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-[2000] px-6 py-5 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent backdrop-blur-[2px]"
      >
        <button onClick={() => navigate(-1)} className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-white backdrop-blur-xl hover:bg-white/10 transition-all active:scale-90">
          <FiArrowLeft size={20} />
        </button>
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${socketConnected ? "bg-green-500 shadow-[0_0_8px_#22c55e]" : "bg-red-500 animate-pulse"}`}></div>
            <span className="text-[10px] uppercase tracking-[3px] text-gray-400 font-bold">
              {socketConnected ? "Live Tracking" : "Simulated"}
            </span>
          </div>
          <h1 className="text-white font-bold text-lg mt-0.5">#{orderId?.slice(-6).toUpperCase()}</h1>
        </div>
        <button className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-white backdrop-blur-xl hover:bg-white/10 transition-all">
          <FiAlertCircle size={20} />
        </button>
      </motion.header>

      {/* Map Engine */}
      <div className="h-[60vh] w-full relative z-1 bg-[#1a1a1a]">
        <MapContainer center={locations.restaurant} zoom={15} zoomControl={false} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
          <MapController center={locations.restaurant} zoom={15} />
          <RoutingMachine start={locations.restaurant} end={locations.user} setRouteInfo={setRouteInfo} />
          <Marker position={locations.restaurant} icon={icons.restaurant} />
          <Marker position={locations.user} icon={icons.user} />
        </MapContainer>

        {/* Float Glass Overlay Info */}
        <div className="absolute top-28 left-6 right-6 z-[1500] pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-black/40 backdrop-blur-2xl border border-white/10 p-5 rounded-[32px] flex items-center justify-between shadow-2xl"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center text-black shadow-lg shadow-orange-500/20">
                <FiShoppingBag size={28} className="animate-pulse" />
              </div>
              <div>
                <p className="text-gray-400 text-[10px] uppercase tracking-widest font-bold">ETA</p>
                <h2 className="text-2xl font-black text-white leading-tight">
                  {status === "delivered" ? "Delivered" : `${routeInfo.time + 5} min`}
                </h2>
              </div>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-[10px] uppercase tracking-widest font-bold">Distance</p>
              <p className="text-lg font-bold text-white">{routeInfo.distance} km</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Sheet */}
      <motion.div
        initial={{ y: 400 }} animate={{ y: 0 }}
        className="bg-[#0f0f0f] border-t border-white/5 rounded-t-[48px] px-8 pt-6 pb-10 relative z-[2001] shadow-[0_-30px_60px_rgba(0,0,0,0.8)] overflow-y-auto flex-1"
      >
        <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-8"></div>
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-5">
            <img
              src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=100&h=100&auto=format&fit=crop"
              className="w-16 h-16 rounded-3xl object-cover border-2 border-white/10"
              alt="Driver"
            />
            <div>
              <h3 className="text-white font-bold text-xl">Hassan Mansoor</h3>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-orange-500 text-xs font-bold">★ 4.9</span>
                <span className="text-gray-500 text-xs font-medium">• Honda CG125</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white"><FiMessageCircle size={20} /></button>
            <button className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center text-black"><FiPhone size={20} /></button>
          </div>
        </div>

        <div className="space-y-8 relative">
          {timelineSteps.map((step, idx) => {
            const activeIndex = getCurrentStepIndex();
            const isCompleted = idx < activeIndex;
            const isCurrent = idx === activeIndex;

            return (
              <div key={step.id} className={`flex items-start gap-6 ${isCompleted || isCurrent ? "opacity-100" : "opacity-30"}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${isCompleted ? "bg-green-500 text-black" :
                  isCurrent ? "bg-orange-500 text-black shadow-lg" :
                    "bg-[#1a1a1a] text-gray-600"
                  }`}>
                  {isCompleted ? <FiCheck /> : step.icon}
                </div>
                <div className="flex-1">
                  <p className={`font-bold ${isCurrent ? "text-white" : "text-gray-400"}`}>{step.label}</p>
                  <p className="text-[10px] text-gray-500">{isCurrent ? "Live" : ""}</p>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .leaflet-container { z-index: 1 !important; }
        .leaflet-routing-container { display: none !important; }
        .leaflet-control-attribution { display: none !important; }
      `}} />
    </div>
  );
}
