import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";

const UserLogin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState("");

  const handelSubmit = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/user/login`,
        { email, password },
        { withCredentials: true }
      );

      if (response.data.user && response.data.user._id) {
        localStorage.setItem("userId", response.data.user._id);
        // Using window.location to force a full app state refresh for the Auth flow
        window.location.href = "/";
      }
    } catch (err) {
      setErrors(
        err.response?.data?.message ||
        "Something went wrong. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center sm:py-12 px-0 sm:px-4">
      <div className="w-full sm:w-[450px] min-h-screen sm:min-h-[auto] sm:rounded-[32px] bg-[#0D0D0D] sm:bg-[#1A1A1A] sm:border sm:border-white/5 shadow-2xl">
        <form
          onSubmit={handelSubmit}
          className="flex flex-col p-6 pt-12 sm:p-12"
        >

          {/* Logo */}
          <div className="flex items-center justify-center">
            <div className="w-14 h-14 rounded-2xl bg-[#ff7b00] flex items-center justify-center shadow-[0_10px_25px_rgba(255,123,0,0.2)]">
              <FiLock className="text-white text-2xl" />
            </div>
          </div>

          {/* Heading */}
          <div className="text-center">
            <h1 className="mt-8 text-white text-[38px] leading-[42px] font-bold tracking-[-0.5px] sm:text-[48px] sm:leading-[50px]">
              Welcome Back!
            </h1>

            <p className="mt-3 mb-9 text-[#8E8E93] text-[15px] leading-6">
              Please sign in to continue ordering.
            </p>
          </div>
          {/* Error */}
          {errors && (
            <p className="mb-5 rounded-2xl bg-red-900/40 px-4 py-3 text-sm text-red-200">
              {errors}
            </p>
          )}

          {/* Email */}
          <div className="mb-5">
            <label className="mb-2 block text-sm text-[#8E8E93]">
              Email or Username
            </label>

            <div className="h-14 rounded-2xl bg-[#111111] border border-white/5 px-5 flex items-center">
              <FiMail className="text-[#8E8E93] text-lg shrink-0" />

              <input
                type="email"
                name="email"
                required
                placeholder="Type your email..."
                className="ml-3 w-full bg-transparent text-white text-[15px] outline-none placeholder:text-white/20"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="mb-2 block text-sm text-[#8E8E93]">
              Password
            </label>

            <div className="h-14 rounded-2xl bg-[#111111] border border-white/5 px-5 flex items-center">
              <FiLock className="text-[#8E8E93] text-lg shrink-0" />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                placeholder="Type your password..."
                className="ml-3 w-full bg-transparent text-white text-[15px] outline-none placeholder:text-white/20"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[#8E8E93] shrink-0"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Forgot */}
          <div className="mt-4 mb-7 flex justify-end">
            <button
              type="button"
              className="text-sm font-medium text-[#ff7b00]"
            >
              Forgot Password?
            </button>
          </div>

          {/* Login */}
          <button
            type="submit"
            className="h-14 w-full rounded-2xl bg-[#ff7b00] text-white text-base font-semibold shadow-[0_12px_30px_rgba(255,123,0,0.2)] active:scale-[0.99] transition"
          >
            Login
          </button>

          {/* Divider */}
          <div className="my-8 flex items-center">
            <div className="h-px flex-1 bg-white/5" />
            <span className="px-4 text-sm text-[#8E8E93] whitespace-nowrap">
              Or continue with
            </span>
            <div className="h-px flex-1 bg-white/5" />
          </div>

          {/* Social */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="h-14 rounded-2xl bg-[#111111] border border-white/5 flex items-center justify-center gap-2 text-white text-sm font-medium"
            >
              <FcGoogle size={20} />
              Google
            </button>

            <button
              type="button"
              className="h-14 rounded-2xl bg-[#111111] border border-white/5 flex items-center justify-center gap-2 text-white text-sm font-medium"
            >
              <FaApple size={18} />
              Apple
            </button>
          </div>

          {/* Footer */}
          <div className="mt-auto pt-10 text-center text-sm text-[#8E8E93]">
            Don&apos;t have an account?{" "}
            <Link
              to="/user/register"
              className="font-semibold text-[#ff7b00]"
            >
              Sign Up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserLogin;