import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FiUser, FiMail, FiLock } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { FaApple, FaFacebookF } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const UserRegister = () => {
  const navigate = useNavigate();

  const handelSubmit = async (e) => {
    e.preventDefault();

    const fullName = e.target.fullName.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const PhoneNumber = e.target.PhoneNumber.value;
    const Address = e.target.Address.value;

    const res = await axios.post(
      "http://localhost:3001/api/auth/user/register",
      { fullName, email, password, PhoneNumber, Address },
      { withCredentials: true }
    );

    if (res.data.user && res.data.user._id) {
      localStorage.setItem("userId", res.data.user._id);
      window.location.href = "/";
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center sm:py-12 px-0 sm:px-4">
      <div className="w-full sm:w-[480px] min-h-screen sm:min-h-[auto] p-6 pt-12 sm:p-12 sm:rounded-[32px] bg-[#0D0D0D] sm:bg-[#1A1A1A] sm:border sm:border-white/5 shadow-2xl">

        {/* ---------------- ANIMATED SWITCH ---------------- */}
        <div className="relative bg-[#111111] p-1 rounded-2xl flex w-full mb-8 border border-white/5">

          {/* Sliding ball */}
          <div
            className={`absolute top-[4px] h-[40px] w-[50%] rounded-xl bg-[#1A1A1A] border border-white/10 shadow transition-all duration-300 ${window.location.pathname.includes("food-partner")
                ? "left-[50%]"
                : "left-[4px]"
              }`}
          ></div>

          {/* User button */}
          <Link
            to="/user/register"
            className={`z-10 w-1/2 text-center py-2 rounded-xl font-semibold transition ${window.location.pathname.includes("food-partner")
                ? "text-[#8E8E93]"
                : "text-white"
              }`}
          >
            User
          </Link>

          {/* Partner button */}
          <Link
            to="/food-partner/register"
            className={`z-10 w-1/2 text-center py-2 rounded-xl font-semibold transition ${window.location.pathname.includes("food-partner")
                ? "text-white"
                : "text-[#8E8E93]"
              }`}
          >
            Partner
          </Link>

        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-white mt-4">
          Create Account
        </h1>
        <p className="text-center text-[#8E8E93] text-sm mt-2">
          Join us and start ordering today!
        </p>

        {/* Form */}
        <form className="mt-8 space-y-5" onSubmit={handelSubmit}>

          <div className="relative">
            <FiUser className="absolute left-4 top-4 text-[#8E8E93] text-lg" />
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              required
              className="w-full pl-12 p-4 rounded-2xl bg-[#111111] border border-white/5 focus:border-[#ff7b00]/50 outline-none text-white placeholder:text-white/20 transition"
            />
          </div>

          <div className="relative">
            <FiMail className="absolute left-4 top-4 text-[#8E8E93] text-lg" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              required
              className="w-full pl-12 p-4 rounded-2xl bg-[#111111] border border-white/5 focus:border-[#ff7b00]/50 outline-none text-white placeholder:text-white/20 transition"
            />
          </div>
          
          <div className="relative">
            <FiUser className="absolute left-4 top-4 text-[#8E8E93] text-lg" />
            <input
              type="text"
              name="PhoneNumber"
              placeholder="Phone Number"
              required
              className="w-full pl-12 p-4 rounded-2xl bg-[#111111] border border-white/5 focus:border-[#ff7b00]/50 outline-none text-white placeholder:text-white/20 transition"
            />
          </div>

          <div className="relative">
            <FiUser className="absolute left-4 top-4 text-[#8E8E93] text-lg" />
            <input
              type="text"
              name="Address"
              placeholder="Delivery Address"
              required
              className="w-full pl-12 p-4 rounded-2xl bg-[#111111] border border-white/5 focus:border-[#ff7b00]/50 outline-none text-white placeholder:text-white/20 transition"
            />
          </div>
          
          <div className="relative">
            <FiLock className="absolute left-4 top-4 text-[#8E8E93] text-lg" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              className="w-full pl-12 p-4 rounded-2xl bg-[#111111] border border-white/5 focus:border-[#ff7b00]/50 outline-none text-white placeholder:text-white/20 transition"
            />
          </div>

          <button
            type="submit"
            className="w-full h-14 bg-[#ff7b00] hover:bg-[#e66f00] transition text-white rounded-2xl font-semibold shadow-[0_12px_30px_rgba(255,123,0,0.2)] active:scale-[0.99]"
          >
            Create Account
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-8">
          <div className="flex-1 h-px bg-white/5"></div>
          <span className="px-4 text-[#8E8E93] text-sm whitespace-nowrap">Or sign up with</span>
          <div className="flex-1 h-px bg-white/5"></div>
        </div>


        {/* Footer */}
        <p className="text-center text-[#8E8E93] text-sm mt-6">
          Already have an account?{" "}
          <Link to="/user/login" className="text-[#ff7b00] font-semibold hover:underline">
            Log in
          </Link>
        </p>

      </div>
    </div>
  );
};

export default UserRegister;


