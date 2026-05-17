import React, { useEffect, useState } from "react";
import BottomNavbar from "../../components/BottomNavbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState(null); // local preview
  const navigate = useNavigate();

  // Fetch user profile from backend
  const fetchUserProfile = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/user/profile`, {
        withCredentials: true,
      });
      setUser(res.data.user);
      console.log("User profile fetched:", user.avatar);
    } catch (err) {
      console.error("Error fetching user profile:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Upload avatar handler
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show local preview immediately
    setPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/user/upload-avatar`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // Merge avatar into user state without overwriting other fields
      setUser((prev) => ({
        ...prev,
        avatar: res.data.avatar,
      }));

      // Remove local preview
      setPreview(null);
    } catch (err) {
      console.error("Upload failed:", err);
      setPreview(null);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/user/logout`, {
        withCredentials: true,
      });
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      // Clear local storage and redirect regardless of backend success
      localStorage.removeItem("userId");
      window.location.href = "/user/login";
    }
  };

  if (loading) return <p className="text-white text-center mt-10">Loading...</p>;
  if (!user) return <p className="text-white text-center mt-10">No user data found</p>;

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white px-5 py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Profile</h1>

      </div>

      {/* Avatar */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative">
          <img
            src={
              preview
                ? preview
                : user.avatar

            }
            className="w-32 h-32 rounded-full object-cover"
            alt="profile"
          />

          {/* Upload Button */}
          <label className="absolute bottom-1 right-1 bg-[#ff8700] w-9 h-9 rounded-full flex items-center justify-center text-white text-xl shadow-md cursor-pointer">
            📷
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"

            />
          </label>
        </div>

        <h2 className="text-2xl font-semibold mt-3">{user.fullName}</h2>
        <p className="text-gray-400 text-sm">{user.email}</p>
      </div>

      {/* PERSONAL INFO */}
      <h2 className="text-lg font-semibold mb-3">Personal Information</h2>
      <div className="bg-[#1a1a1a] p-5 rounded-3xl mb-6 space-y-4">
        <InfoRow label="Full Name" value={user.fullName} />
        <InfoRow label="Email" value={user.email} />
        <InfoRow label="Phone Number" value={user.PhoneNumber || "-"} />
        <InfoRow label="Address" value={user.Address || "-"} />
      </div>

      {/* ACCOUNT SETTINGS */}
      <h2 className="text-lg font-semibold mb-3">Account Settings</h2>
      <div className="bg-[#1a1a1a] p-5 rounded-3xl space-y-5 mb-10">
        <button onClick={() => navigate("/user/change-password")} className="w-full">
          <SettingRow icon="🔒" label="Change Password" />
        </button>

        <button onClick={() => navigate("/user/notifications")} className="w-full">
          <SettingRow icon="🔔" label="Notifications" />
        </button>
      </div>

      {/* LOGOUT BUTTON */}
      <button
        onClick={handleLogout}
        className="w-full py-4 bg-orange-500 text-lg font-semibold rounded-full shadow-xl shadow-orange-900/40"
      >
        ⏎ Logout
      </button>

      <div className="mt-10">
        <BottomNavbar />
      </div>
    </div>
  );
};

/* COMPONENTS */
const InfoRow = ({ label, value }) => (
  <div className="flex justify-between items-center border-b border-gray-700 pb-3">
    <p className="text-gray-400 text-sm">{label}</p>
    <p className="text-gray-200 font-medium">{value}</p>
  </div>
);

const SettingRow = ({ icon, label }) => (
  <div className="flex justify-between items-center">
    <div className="flex items-center gap-3">
      <span className="text-[#ff8700] text-xl">{icon}</span>
      <p className="text-gray-200">{label}</p>
    </div>
    <span className="text-gray-400 text-lg">›</span>
  </div>
);

export default UserProfile;

