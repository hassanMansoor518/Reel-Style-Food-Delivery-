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

      navigate(`/food-partner/${partnerId}`);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fff7f3] p-4">
      <div className="w-full max-w-md p-6 sm:p-8 rounded-2xl bg-white border border-[#f6d7c8] shadow-lg">
        <h1 className="text-xl sm:text-2xl font-semibold text-center text-[#3a241e]">
          Food Partner Login
        </h1>

        {error && <p className="text-red-500 text-center mt-2">{error}</p>}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="relative">
            <FiMail className="absolute left-3 top-3 text-gray-400" />
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="Email address"
              className="w-full pl-10 p-3 bg-[#fff5f0] border border-[#f5d3c4] text-[#3a241e] rounded-lg outline-none focus:border-orange-400"
            />
          </div>

          <div className="relative">
            <FiLock className="absolute left-3 top-3 text-gray-400" />
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Password"
              className="w-full pl-10 p-3 bg-[#fff5f0] border border-[#f5d3c4] text-[#3a241e] rounded-lg outline-none focus:border-orange-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold transition text-white ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#ff6b3d] hover:bg-[#e85d32]"
            }`}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-4">
          Don't have a partner account?{" "}
          <Link
            to="/food-partner/register"
            className="text-[#ff6b3d] hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default FoodPartnerLogin;

