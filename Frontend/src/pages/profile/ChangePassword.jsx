import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { IoEyeOffOutline,IoEyeOutline } from "react-icons/io5";
const ChangePassword = () => {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleSubmit = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage("Please fill all fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage("New password and confirm password do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setMessage("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:3001/api/auth/user/change-password",
        { oldPassword: currentPassword, newPassword },
        { withCredentials: true }
      );
      setMessage(res.data.message);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setMessage(err.response?.data?.message || "Error updating password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen bg-[#0f0f0f] flex flex-col">
      {/* Top bar with back button */}
      <div className="flex items-center p-5 bg-[#1a1a1a] shadow-md">
        <button
          onClick={() => navigate(-1)}
          className="text-white text-2xl mr-4"
        >
          <FiArrowLeft />
        </button>
        <h2 className="text-xl font-semibold text-white">Change Password</h2>
      </div>

      {/* Inputs container */}
      <div className="flex-1 overflow-y-auto px-4 pt-6">
        <div className="w-full max-w-md mx-auto">
          {/* Current Password */}
          <div className="mb-4 relative">
            <input
              type={showPassword.current ? "text" : "password"}
              placeholder="Enter your current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-4 rounded-xl bg-[#1a1a1a] text-white placeholder-gray-400"
            />
            <button
              onClick={() =>
                setShowPassword((prev) => ({ ...prev, current: !prev.current }))
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
            >
             {showPassword.current ? <IoEyeOutline className="text-2xl" /> : <IoEyeOffOutline className="text-2xl" />}
            </button>
          </div>

          {/* New Password */}
          <div className="mb-2 relative">
            <input
              type={showPassword.new ? "text" : "password"}
              placeholder="Enter your new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-4 rounded-xl bg-[#1a1a1a] text-white placeholder-gray-400"
            />
            <button
              onClick={() =>
                setShowPassword((prev) => ({ ...prev, new: !prev.new }))
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPassword.new ? <IoEyeOutline className="text-2xl" /> : <IoEyeOffOutline className="text-2xl" />}
            </button>
          </div>
          <p className="text-gray-400 text-sm mb-4">
            Must be at least 8 characters.
          </p>

          {/* Confirm New Password */}
          <div className="mb-6 relative">
            <input
              type={showPassword.confirm ? "text" : "password"}
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-4 rounded-xl bg-[#1a1a1a] text-white placeholder-gray-400"
            />
            <button
              onClick={() =>
                setShowPassword((prev) => ({ ...prev, confirm: !prev.confirm }))
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPassword.confirm ?  <IoEyeOutline className="text-2xl" /> : <IoEyeOffOutline className="text-2xl" />}
            </button>
          </div>

          {/* Message */}
          {message && <p className="text-gray-300 mt-2 text-center">{message}</p>}
        </div>
      </div>

      {/* Save Button fixed at bottom */}
      <div className="px-4 pb-6 bg-[#0f0f0f] shadow-inner">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-orange-500 py-4 rounded-full text-white font-semibold shadow-lg"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default ChangePassword;
