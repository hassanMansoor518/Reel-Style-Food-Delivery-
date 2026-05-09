import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock } from "react-icons/fi";
import axios from "axios";

const FoodPartnerLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const res = await axios.post(
        "http://localhost:3001/api/auth/partner/login",
        { email, password },
        { withCredentials: true }
      );

      console.log("Login Response:", res.data);

      const partnerId =
        res.data.partner?._id ||
        res.data.data?._id ||
        res.data.user?._id;

      if (!partnerId) {
        setError("Partner ID not found in response.");
        setLoading(false);
        return;
      }

      localStorage.setItem("userId", partnerId);
      window.location.href = `/food-partner/${partnerId}`;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center sm:py-12 px-0 sm:px-4">
      <div className="w-full sm:w-[450px] min-h-screen sm:min-h-[auto] p-6 pt-12 sm:p-12 sm:rounded-[32px] bg-[#0D0D0D] sm:bg-[#1A1A1A] sm:border sm:border-white/5 shadow-2xl">
        <h1 className="text-3xl font-bold text-center text-white mt-2">
          Partner Login
        </h1>
        <p className="text-center text-[#8E8E93] text-sm mt-2">
          Access your restaurant dashboard
        </p>

        {error && (
          <p className="mt-6 rounded-2xl bg-red-900/40 px-4 py-3 text-sm text-red-200">
            {error}
          </p>
        )}

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="relative">
            <FiMail className="absolute left-4 top-4 text-[#8E8E93]" />
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="Email address"
              className="w-full pl-12 p-4 bg-[#111111] border border-white/5 text-white rounded-2xl outline-none focus:border-[#ff7b00]/50 placeholder:text-white/20 transition"
            />
          </div>

          <div className="relative">
            <FiLock className="absolute left-4 top-4 text-[#8E8E93]" />
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Password"
              className="w-full pl-12 p-4 bg-[#111111] border border-white/5 text-white rounded-2xl outline-none focus:border-[#ff7b00]/50 placeholder:text-white/20 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full h-14 rounded-2xl font-semibold transition text-white shadow-[0_12px_30px_rgba(255,123,0,0.2)] active:scale-[0.99] ${
              loading
                ? "bg-gray-700 cursor-not-allowed"
                : "bg-[#ff7b00] hover:bg-[#e66f00]"
            }`}
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-[#8E8E93] text-sm mt-8">
          Don't have a partner account?{" "}
          <Link
            to="/food-partner/register"
            className="text-[#ff7b00] font-semibold hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default FoodPartnerLogin;

