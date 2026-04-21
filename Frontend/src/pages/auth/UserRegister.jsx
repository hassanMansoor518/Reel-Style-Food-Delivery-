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

    console.log(res.data);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fff7f3] px-4">
      <div className="w-full max-w-md p-6 rounded-2xl bg-white border border-[#f6d7c8] shadow-lg">

        {/* ---------------- ANIMATED SWITCH ---------------- */}
        <div className="relative bg-[#fce8df] p-1 rounded-xl flex w-full mb-3">

          {/* Sliding ball */}
          <div
            className={`absolute top-[4px] h-[40px] w-[50%] rounded-xl bg-white shadow transition-all duration-300 ${
              window.location.pathname.includes("food-partner")
                ? "left-[50%]"
                : "left-[4px]"
            }`}
          ></div>

          {/* User button */}
          <Link
            to="/user/register"
            className={`z-10 w-1/2 text-center py-2 rounded-xl font-semibold transition ${
              window.location.pathname.includes("food-partner")
                ? "text-[#3a241e]/60"
                : "text-[#3a241e]"
            }`}
          >
            User
          </Link>

          {/* Partner button */}
          <Link
            to="/food-partner/register"
            className={`z-10 w-1/2 text-center py-2 rounded-xl font-semibold transition ${
              window.location.pathname.includes("food-partner")
                ? "text-[#3a241e]"
                : "text-[#3a241e]/60"
            }`}
          >
            Partner
          </Link>

        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-center text-[#3a241e] mt-4">
          Create an Account
        </h1>
        <p className="text-center text-gray-600 text-sm">
          Let’s get you started!
        </p>

        {/* Form */}
        <form className="mt-6 space-y-4" onSubmit={handelSubmit}>
          
          <div className="relative">
            <FiUser className="absolute left-3 top-3 text-gray-400 text-lg" />
            <input
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              required
              className="w-full pl-10 p-3 rounded-xl bg-[#fff5f0] border border-[#f5d3c4] focus:border-orange-400 outline-none text-[#3a241e]"
            />
          </div>

          <div className="relative">
            <FiMail className="absolute left-3 top-3 text-gray-400 text-lg" />
            <input
              type="email"
              name="email"
              placeholder="Enter your email address"
              required
              className="w-full pl-10 p-3 rounded-xl bg-[#fff5f0] border border-[#f5d3c4] focus:border-orange-400 outline-none text-[#3a241e]"
            />
          </div>
        <div className="relative">
            <FiUser className="absolute left-3 top-3 text-gray-400 text-lg" />
            <input
              type="text"
              name="PhoneNumber"
              placeholder="Enter your phone number"
              required
              className="w-full pl-10 p-3 rounded-xl bg-[#fff5f0] border border-[#f5d3c4] focus:border-orange-400 outline-none text-[#3a241e]"
            />
          </div>

          <div className="relative">
            <FiUser className="absolute left-3 top-3 text-gray-400 text-lg" />
            <input
              type="text"
              name="Address"
              placeholder="Enter your address"
              required
              className="w-full pl-10 p-3 rounded-xl bg-[#fff5f0] border border-[#f5d3c4] focus:border-orange-400 outline-none text-[#3a241e]"
            />
          </div>
          <div className="relative">
            <FiLock className="absolute left-3 top-3 text-gray-400 text-lg" />
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              required
              className="w-full pl-10 p-3 rounded-xl bg-[#fff5f0] border border-[#f5d3c4] focus:border-orange-400 outline-none text-[#3a241e]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#ff6b3d] hover:bg-[#e85d32] transition text-white py-3 rounded-xl font-semibold"
          >
            Create Account
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="flex-1 h-px bg-[#f1c9bc]"></div>
          <span className="px-3 text-gray-500 text-sm">Or sign up with</span>
          <div className="flex-1 h-px bg-[#f1c9bc]"></div>
        </div>

    
        {/* Footer */}
        <p className="text-center text-gray-600 text-sm mt-5">
          Already have an account?{" "}
          <Link to="/user/login" className="text-[#ff6b3d] font-medium hover:underline">
            Log in
          </Link>
        </p>

      </div>
    </div>
  );
};

export default UserRegister;


