import React, { useState, useEffect } from "react";
import { FiUser, FiHome, FiList, FiShoppingCart } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";

export default function BottomNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState("/");

  useEffect(() => {
    // Update active tab based on current path
    setActive(location.pathname);
  }, [location]);

  const tabs = [
    { name: "Home", icon: <FiHome />, path: "/" },
     { name: "Cart", icon: <FiShoppingCart />, path: "/cart" },
    { name: "Orders", icon: <FiList />, path: "/orders" },
    { name: "Profile", icon: <FiUser />, path: "/user/profile" },
  ];

  return (
    <div className=" h-14 fixed bottom-0 left-0 w-full bg-black/70 backdrop-blur-md text-white flex justify-around items-center z-30">
      {tabs.map((tab, index) => (
        <div
          key={index}
          className="flex flex-col items-center relative cursor-pointer"
          onClick={() => {
            navigate(tab.path);
            setActive(tab.path);
          }}
        >
          <div
            className={`text-xl transition-colors duration-300 ${
              active === tab.path ? "text-orange-500" : "text-white"
            }`}
          >
            {tab.icon}
          </div>
          <span
            className={`text-xs transition-colors duration-300 ${
              active === tab.path ? "text-orange-500" : "text-white"
            }`}
          >
            {tab.name}
          </span>

          {/* Animated indicator */}
          {active === tab.path && (
            <div className="absolute  bg-orange-500 rounded-full transition-all duration-300"></div>
          )}
        </div>
      ))}
    </div>
  );
}
