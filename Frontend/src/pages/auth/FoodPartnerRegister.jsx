import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiLock, FiPhone, FiMapPin } from "react-icons/fi";
import axios from "axios";

const FoodPartnerRegister = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("partner"); // "user" or "partner"

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { restaurantName, contactName, phone, email, password, address } =
      e.target;

    try {
      const res = await axios.post(
        "http://localhost:3001/api/auth/partner/register",
        {
          restaurantName: restaurantName.value,
          contactName: contactName.value,
          phone: phone.value,
          email: email.value,
          password: password.value,
          address: address.value,
        },
        { withCredentials: true }
      );

      if (res.data.partner && res.data.partner._id) {
        localStorage.setItem("userId", res.data.partner._id);
        window.location.href = `/food-partner/${res.data.partner._id}`;
      }
    } catch (error) {
      console.error(
        "Registration error:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center sm:py-12 px-0 sm:px-4">
      <div className="w-full sm:w-[520px] min-h-screen sm:min-h-[auto] p-6 pt-12 sm:p-12 sm:rounded-[32px] bg-[#0D0D0D] sm:bg-[#1A1A1A] sm:border sm:border-white/5 shadow-2xl">
        {/* Title */}
        <h2 className="text-center text-3xl font-bold text-white mt-2">
          {activeTab === "user" ? "User Sign Up" : "Partner Sign Up"}
        </h2>
        <p className="text-center text-[#8E8E93] text-sm mt-2">
          {activeTab === "user"
            ? "Join us and explore amazing food."
            : "Join us and grow your restaurant business."}
        </p>

        {/* Toggle */}
        <div className="flex justify-between w-full bg-[#111111] border border-white/5 rounded-2xl p-1 mt-8">
          <button
            onClick={() => setActiveTab("user")}
            className={`w-1/2 py-2 rounded-xl font-semibold transition ${
              activeTab === "user"
                ? "bg-[#1A1A1A] text-white border border-white/10 shadow-sm"
                : "text-[#8E8E93] bg-transparent"
            }`}
          >
            User
          </button>

          <button
            onClick={() => setActiveTab("partner")}
            className={`w-1/2 py-2 rounded-xl font-semibold transition ${
              activeTab === "partner"
                ? "bg-[#1A1A1A] text-white border border-white/10 shadow-sm"
                : "text-[#8E8E93] bg-transparent"
            }`}
          >
            Partner
          </button>
        </div>

        {/* Form */}
        {activeTab === "partner" && (
          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            {/* Restaurant Name */}
            <div className="relative">
              <FiUser className="absolute left-4 top-4 text-[#8E8E93]" />
              <input
                type="text"
                name="restaurantName"
                placeholder="Restaurant Name"
                required
                className="w-full pl-12 p-4 bg-[#111111] border border-white/5 text-white rounded-2xl outline-none focus:border-[#ff7b00]/50 placeholder:text-white/20 transition"
              />
            </div>

            {/* Contact + Phone */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative w-full sm:w-1/2">
                <FiUser className="absolute left-4 top-4 text-[#8E8E93]" />
                <input
                  type="text"
                  name="contactName"
                  placeholder="Contact"
                  required
                  className="w-full pl-12 p-4 bg-[#111111] border border-white/5 text-white rounded-2xl outline-none focus:border-[#ff7b00]/50 placeholder:text-white/20 transition"
                />
              </div>

              <div className="relative w-full sm:w-1/2">
                <FiPhone className="absolute left-4 top-4 text-[#8E8E93]" />
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone"
                  required
                  className="w-full pl-12 p-4 bg-[#111111] border border-white/5 text-white rounded-2xl outline-none focus:border-[#ff7b00]/50 placeholder:text-white/20 transition"
                />
              </div>
            </div>

            {/* Email */}
            <div className="relative">
              <FiMail className="absolute left-4 top-4 text-[#8E8E93]" />
              <input
                type="email"
                name="email"
                placeholder="Business Email"
                required
                className="w-full pl-12 p-4 bg-[#111111] border border-white/5 text-white rounded-2xl outline-none focus:border-[#ff7b00]/50 placeholder:text-white/20 transition"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <FiLock className="absolute left-4 top-4 text-[#8E8E93]" />
              <input
                type="password"
                name="password"
                placeholder="Create Password"
                required
                className="w-full pl-12 p-4 bg-[#111111] border border-white/5 text-white rounded-2xl outline-none focus:border-[#ff7b00]/50 placeholder:text-white/20 transition"
              />
            </div>

            {/* Address */}
            <div className="relative">
              <FiMapPin className="absolute left-4 top-4 text-[#8E8E93]" />
              <input
                type="text"
                name="address"
                placeholder="Restaurant Address"
                required
                className="w-full pl-12 p-4 bg-[#111111] border border-white/5 text-white rounded-2xl outline-none focus:border-[#ff7b00]/50 placeholder:text-white/20 transition"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full h-14 bg-[#ff7b00] hover:bg-[#e66f00] text-white rounded-2xl font-semibold shadow-[0_12px_30px_rgba(255,123,0,0.2)] active:scale-[0.99] transition mt-2"
            >
              Create Partner Account
            </button>
          </form>
        )}

        {activeTab === "user" && (
          <p className="text-center mt-10 text-[#8E8E93]">
            Redirect to{" "}
            <Link
              to="/user/register"
              className="text-[#ff7b00] font-semibold hover:underline"
            >
              User Registration
            </Link>
          </p>
        )}

        {/* Footer */}
        {activeTab === "partner" && (
          <p className="text-center text-[#8E8E93] text-sm mt-8">
            Already a partner?{" "}
            <Link
              to="/food-partner/login"
              className="text-[#ff7b00] font-semibold hover:underline"
            >
              Sign in
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default FoodPartnerRegister;


