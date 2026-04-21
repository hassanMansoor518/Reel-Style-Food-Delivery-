import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FiMail, FiMapPin, FiPhone, FiPlus } from "react-icons/fi";

const FoodPartnerProfile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/api/food-partner/${id}`, { withCredentials: true });
      setProfile(res.data.foodPartner);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [id]);

  if (!profile)
    return (
      <p className="text-center mt-10 text-orange-400 font-semibold">Loading...</p>
    );

  const handleAddNewItem = () => navigate(`/upload-new-food`);

  const handleEdit = (foodId) => {
    navigate(`/edit-food/${foodId}`);
  };

  const handleDelete = async (foodId) => {
    if (window.confirm("Are you sure you want to delete this food item?")) {
      try {
        await axios.delete(`http://localhost:3001/api/food/${foodId}`, { withCredentials: true });
        fetchProfile(); // Refresh food items
      } catch (err) {
        console.log(err);
        alert("Failed to delete food item.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#2a1a14] p-4">
      {/* ❖ Food Partner Header */}
      <div className="bg-[#3a241e] rounded-2xl shadow-md p-6 mb-6 border border-[#5b3a2f] text-white">
        <h1 className="text-3xl font-bold">{profile.contactName}</h1>
        <p className="text-[#d3b8a1] mb-4">Food Partner Dashboard</p>
        <div className="flex flex-col gap-2 text-[#d3b8a1]">
          <p className="flex items-center gap-2"><FiMail /> {profile.email}</p>
          <p className="flex items-center gap-2"><FiPhone /> {profile.phone || "N/A"}</p>
          <p className="flex items-center gap-2"><FiMapPin /> {profile.address}</p>
        </div>
      </div>

      {/* ❖ Uploaded Food Items Header + Add Button */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Uploaded Food Items</h2>
        <button
          onClick={handleAddNewItem}
          className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 shadow-md transition focus:outline-none focus:border-orange-400"
        >
          <FiPlus /> Add New Item
        </button>
      </div>

      {/* ❖ Food Items Grid */}
      {profile.foodItems && profile.foodItems.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {profile.foodItems.map((item) => (
            <div
              key={item._id}
              className="bg-[#3a241e] rounded-2xl shadow-lg overflow-hidden hover:scale-105 transition-transform duration-300 relative border border-[#5b3a2f]"
            >
              {/* Overlay Buttons */}
              <div className="absolute top-2 right-2 flex gap-1 z-10">
                <button
                  onClick={() => handleEdit(item._id)}
                  className="bg-orange-500 text-white text-xs px-2 py-1 rounded hover:bg-orange-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>

              {/* Video */}
              {item.video && (
                <video
                  src={item.video}
                  className="w-full h-48 object-cover rounded-t-2xl"
                  controls
                  poster={item.thumbnail}
                />
              )}

              {/* Food Info */}
              <div className="p-3 bg-[#3a241e]">
                <h3 className="text-sm font-semibold text-white truncate">{item.name}</h3>
                <p className="text-xs text-[#d3b8a1] truncate">{item.description}</p>
                <span className="text-orange-400 font-bold text-sm mt-1 block">
                  Rs {item.price}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-[#d3b8a1]">No food items uploaded yet.</p>
      )}
    </div>
  );
};

export default FoodPartnerProfile;

