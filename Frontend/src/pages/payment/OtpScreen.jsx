import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function OtpScreen() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [timer, setTimer] = useState(25);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);
  const { orderId } = useParams();
  const navigate = useNavigate();

  // Replace this with dynamic email if needed

  const email = "hassanmansoorsmi@gmail.com";

  // ---------------------------
  // SEND OTP API CALL
  // ---------------------------

  const sendOtp = async () => {
    try {
      setError("");
      setTimer(25);

      const payload = { orderId, email };

      const res = await axios.post(
        "http://localhost:3001/api/order/send-otp",
        payload,
        { withCredentials: true }
      );

      setSuccess(res.data.message || "OTP sent successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    }
  };

  // Auto-send OTP on screen load
  useEffect(() => {
    sendOtp();
    inputRefs.current[0]?.focus();
  }, []);

  // ---------------------------
  // TIMER
  // ---------------------------
  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(interval);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // ---------------------------
  // HANDLE OTP INPUT
  // ---------------------------
  const handleChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // ---------------------------
  // VERIFY OTP API CALL
  // ---------------------------
  const verifyOtp = async () => {
    const code = otp.join("");
    if (code.length < 6) {
      setError("Please enter complete OTP");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const payload = { otp: code, orderId, email };

      const res = await axios.post(
        "http://localhost:3001/api/order/verify-otp",
        payload,
        { withCredentials: true }
      );

      setSuccess(res.data.message || "OTP Verified Successfully!");
      const nextOrderId = res.data.order?._id || res.data.orderId;

      setTimeout(() => {
        navigate(`/processing-order/${nextOrderId}`);
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col px-6 py-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-10">
        <button className="text-xl" onClick={() => navigate(-1)}>
          &larr;
        </button>
        <h1 className="text-lg font-semibold">Verify OTP</h1>
      </div>

      {/* Title */}
      <h2 className="text-xl font-semibold mb-2">Enter Verification Code</h2>
      <p className="text-gray-400 mb-8 text-sm">
        Enter the 6-digit code sent to your registered email/phone.
      </p>

      {/* OTP Inputs */}
      <div className="flex justify-between mb-4">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className="w-12 h-12 text-center rounded-full border border-gray-600 bg-transparent text-xl outline-none focus:border-yellow-400 transition"
          />
        ))}
      </div>

      {/* Error & Success Messages */}
      {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
      {success && <p className="text-green-400 text-sm mb-3">{success}</p>}

      {/* Resend OTP */}
      <div className="flex items-center gap-2 text-gray-400 mb-10">
        <span>Didn't receive the code?</span>
        <button
          disabled={timer !== 0}
          onClick={sendOtp}
          className={`${timer === 0 ? "text-yellow-400" : "text-gray-600"} font-medium`}
        >
          Resend OTP {timer !== 0 && `(${timer})`}
        </button>
      </div>

      {/* Verify Button */}
      <button
        onClick={verifyOtp}
        disabled={loading || otp.join("").length < 6}
        className="w-full bg-orange-400 text-black font-semibold py-3 rounded-xl mt-auto disabled:opacity-50"
      >
        {loading ? "Verifying..." : "Verify"}
      </button>
    </div>
  );
}
