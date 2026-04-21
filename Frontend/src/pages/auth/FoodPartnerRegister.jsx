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

      console.log(res.data);
      navigate("/food-partner/login");
    } catch (error) {
      console.error(
        "Registration error:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fff7f3] p-4">
      <div className="w-full max-w-md p-6 sm:p-8 rounded-2xl bg-white border border-[#f6d7c8] shadow-lg">
        {/* Title */}
        <h2 className="text-center text-2xl font-bold text-[#3a241e]">
          {activeTab === "user" ? "User Sign Up" : "Partner Sign Up"}
        </h2>
        <p className="text-center text-gray-600 text-sm mt-1">
          {activeTab === "user"
            ? "Join us and explore amazing food."
            : "Join us and grow your restaurant business."}
        </p>

        {/* Toggle */}
        <div className="flex justify-between w-full bg-[#fce8df] rounded-xl p-1 mt-4">
          <button
            onClick={() => setActiveTab("user")}
            className={`w-1/2 py-2 rounded-xl font-semibold transition ${
              activeTab === "user"
                ? "bg-white text-[#3a241e]"
                : "text-[#3a241e] bg-transparent"
            }`}
          >
            User
          </button>

          <button
            onClick={() => setActiveTab("partner")}
            className={`w-1/2 py-2 rounded-xl font-semibold transition ${
              activeTab === "partner"
                ? "bg-white text-[#3a241e]"
                : "text-[#3a241e] bg-transparent"
            }`}
          >
            Partner
          </button>
        </div>

        {/* Form */}
        {activeTab === "partner" && (
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            {/* Restaurant Name */}
            <div className="relative">
              <FiUser className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                name="restaurantName"
                placeholder="Restaurant Name"
                required
                className="w-full pl-10 p-3 bg-[#fff5f0] border border-[#f5d3c4] text-[#3a241e] rounded-lg outline-none focus:border-orange-400"
              />
            </div>

            {/* Contact + Phone */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative w-full sm:w-1/2">
                <FiUser className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  name="contactName"
                  placeholder="Contact Person"
                  required
                  className="w-full pl-10 p-3 bg-[#fff5f0] border border-[#f5d3c4] text-[#3a241e] rounded-lg outline-none focus:border-orange-400"
                />
              </div>

              <div className="relative w-full sm:w-1/2">
                <FiPhone className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone"
                  required
                  className="w-full pl-10 p-3 bg-[#fff5f0] border border-[#f5d3c4] text-[#3a241e] rounded-lg outline-none focus:border-orange-400"
                />
              </div>
            </div>

            {/* Email */}
            <div className="relative">
              <FiMail className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="Business Email"
                required
                className="w-full pl-10 p-3 bg-[#fff5f0] border border-[#f5d3c4] text-[#3a241e] rounded-lg outline-none focus:border-orange-400"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <FiLock className="absolute left-3 top-3 text-gray-400" />
              <input
                type="password"
                name="password"
                placeholder="Create Password"
                required
                className="w-full pl-10 p-3 bg-[#fff5f0] border border-[#f5d3c4] text-[#3a241e] rounded-lg outline-none focus:border-orange-400"
              />
            </div>

            {/* Address */}
            <div className="relative">
              <FiMapPin className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                name="address"
                placeholder="Restaurant Address"
                required
                className="w-full pl-10 p-3 bg-[#fff5f0] border border-[#f5d3c4] text-[#3a241e] rounded-lg outline-none focus:border-orange-400"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#ff6b3d] hover:bg-[#e85d32] text-white py-3 rounded-lg font-semibold transition"
            >
              Create Partner Account
            </button>
          </form>
        )}

        {activeTab === "user" && (
          <p className="text-center mt-6 text-gray-600">
            Redirect to{" "}
            <Link
              to="/user/register"
              className="text-[#ff6b3d] hover:underline"
            >
              User Registration
            </Link>
          </p>
        )}

        {/* Footer */}
        {activeTab === "partner" && (
          <p className="text-center text-gray-600 text-sm mt-4">
            Already a partner?{" "}
            <Link
              to="/food-partner/login"
              className="text-[#ff6b3d] hover:underline"
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


