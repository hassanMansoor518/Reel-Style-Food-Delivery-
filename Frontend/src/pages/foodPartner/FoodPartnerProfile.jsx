import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Share2,
  Star,
  Clock3,
  Bike,
  MapPin,
  Plus,
  Flame,
  Edit2,
  Trash2,
  LogOut,
  Mail,
  Phone,
  Camera,
  X,
  Check
} from "lucide-react";

const FoodPartnerProfile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Edit Profile States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    contactName: "",
    phone: "",
    address: "",
    banner: "",
    logo: ""
  });
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/food-partner/${id}`, { withCredentials: true });
      setProfile(res.data.foodPartner);
      setEditFormData({
        contactName: res.data.foodPartner.contactName || "",
        phone: res.data.foodPartner.phone || "",
        address: res.data.foodPartner.address || "",
        banner: res.data.foodPartner.banner || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1400&auto=format&fit=crop",
        logo: res.data.foodPartner.logo || "👨‍🍳"
      });
      setError(null);
    } catch (err) {
      console.log(err);
      setError("Failed to load profile details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const handleAddNewItem = () => navigate(`/upload-new-food`);

  const handleEdit = (foodId) => {
    navigate(`/edit-food/${foodId}`);
  };

  const handleDelete = async (foodId) => {
    if (window.confirm("Are you sure you want to delete this food item?")) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/food/${foodId}`, { withCredentials: true });
        fetchProfile(); // Refresh food items
      } catch (err) {
        console.log(err);
        alert("Failed to delete food item.");
      }
    }
  };

  const handleLogout = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/partner/logout`, {
        withCredentials: true,
      });
    } catch (err) {
      console.error("Partner logout failed:", err);
    } finally {
      localStorage.removeItem("userId");
      window.location.href = "/food-partner/login";
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/food-partner/update/${id}`, editFormData, {
        withCredentials: true,
      });
      setIsEditModalOpen(false);
      fetchProfile();
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Update profile error:", err);
      alert("Failed to update profile.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-[#ff7b00] border-t-transparent animate-spin"></div>
        <p className="text-gray-400 font-medium">Loading Dashboard...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center px-6">
        <div className="bg-[#1A1A1A] border border-white/5 rounded-[28px] p-8 text-center max-w-md w-full">
          <h2 className="text-white text-2xl font-bold mb-2">Error Occurred</h2>
          <p className="text-[#8E8E93] mb-6">{error || "Profile not found"}</p>
          <button
            onClick={() => navigate(-1)}
            className="w-full py-3 bg-[#ff7b00] text-black font-bold rounded-2xl hover:bg-[#ff8c20] transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0D0D0D] text-white pb-32 no-scrollbar relative">

      {/* EDIT PROFILE MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm overflow-y-auto pt-20 pb-10 no-scrollbar">
          <div className="bg-[#161616] border border-white/10 rounded-[32px] w-full max-w-lg p-8 relative shadow-2xl animate-in fade-in zoom-in duration-300">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 transition"
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-black mb-6">Edit Profile</h2>

            <form onSubmit={handleUpdateProfile} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-gray-500 ml-1">Restaurant Name</label>
                <input
                  type="text"
                  value={editFormData.contactName}
                  onChange={(e) => setEditFormData({ ...editFormData, contactName: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:border-[#ff7b00] outline-none transition"
                  placeholder="Enter restaurant name"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-gray-500 ml-1">Contact Number</label>
                <input
                  type="text"
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:border-[#ff7b00] outline-none transition"
                  placeholder="Enter phone number"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-gray-500 ml-1">Address / Location</label>
                <input
                  type="text"
                  value={editFormData.address}
                  onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:border-[#ff7b00] outline-none transition"
                  placeholder="Enter full address"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-gray-500 ml-1">Banner Image URL</label>
                <input
                  type="text"
                  value={editFormData.banner}
                  onChange={(e) => setEditFormData({ ...editFormData, banner: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:border-[#ff7b00] outline-none transition"
                  placeholder="Paste image URL here"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-gray-500 ml-1">Logo URL or Emoji</label>
                <input
                  type="text"
                  value={editFormData.logo}
                  onChange={(e) => setEditFormData({ ...editFormData, logo: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:border-[#ff7b00] outline-none transition"
                  placeholder="Paste logo URL or enter emoji"
                />
              </div>

              <button
                type="submit"
                disabled={isUpdating}
                className="w-full bg-[#ff7b00] text-black font-black py-4 rounded-2xl shadow-xl shadow-[#ff7b00]/20 hover:bg-[#ff8c20] transition active:scale-95 flex items-center justify-center gap-2"
              >
                {isUpdating ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent animate-spin rounded-full"></div>
                ) : (
                  <> <Check size={20} strokeWidth={3} /> Save Changes </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* HEADER IMAGE */}
      <section className="relative h-[280px] overflow-hidden">
        <img
          src={profile.banner || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1400&auto=format&fit=crop"}
          alt="Restaurant Cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-black/40 to-transparent"></div>

        {/* TOP ACTIONS */}
        <div className="absolute top-0 left-0 w-full flex items-center justify-between px-5 pt-6 z-30">
          <button

            className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 active:scale-95 transition hover:bg-white/10"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white text-sm font-bold hover:bg-white/20 transition-all active:scale-95"
            >
              <Edit2 size={16} /> Edit Profile
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 backdrop-blur-md border border-red-500/20 text-red-500 text-sm font-bold hover:bg-red-500 hover:text-white transition-all active:scale-95"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </section>

      {/* PARTNER INFO */}
      <section className="px-5 -mt-20 relative z-20">
        <div className="bg-[#111111]/90 backdrop-blur-2xl border border-white/5 rounded-[32px] p-6 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            <div className="w-24 h-24 rounded-[30px] bg-[#ff7b00] flex items-center justify-center shadow-[0_0_50px_rgba(255,123,0,0.3)] shrink-0 overflow-hidden">
              {profile.logo?.startsWith("http") ? (
                <img src={profile.logo} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl">{profile.logo || "👨‍🍳"}</span>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center flex-wrap gap-2 mb-3">
                <span className="px-3 py-1 rounded-full bg-[#ff7b00]/20 text-[#ff7b00] text-[10px] tracking-wider font-black border border-[#ff7b00]/10 uppercase">
                  Verified Partner
                </span>
                <div className="flex items-center gap-1.5 text-[#ffb347] bg-white/5 px-3 py-1 rounded-full border border-white/5">
                  <Star size={14} fill="#ffb347" />
                  <span className="text-xs font-bold">Partner Dashboard</span>
                </div>
              </div>

              <h1 className="text-3xl font-black leading-tight mb-2">
                {profile.contactName}
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                <div className="flex items-center gap-3 text-gray-400 text-sm">
                  <div className="p-2 rounded-xl bg-white/5 text-[#ff7b00]"><Mail size={16} /></div>
                  {profile.email}
                </div>
                <div className="flex items-center gap-3 text-gray-400 text-sm">
                  <div className="p-2 rounded-xl bg-white/5 text-[#ff7b00]"><Phone size={16} /></div>
                  {profile.phone || "No contact provided"}
                </div>
                <div className="flex items-center gap-3 text-gray-400 text-sm md:col-span-2">
                  <div className="p-2 rounded-xl bg-white/5 text-[#ff7b00]"><MapPin size={16} /></div>
                  {profile.address}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/5 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-[#1A1A1A] px-5 py-3 rounded-2xl border border-white/5">
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Total Items</p>
                <p className="text-xl font-black text-white">{profile.foodItems?.length || 0}</p>
              </div>
            </div>

            <button
              onClick={handleAddNewItem}
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[#ff7b00] text-black px-8 py-4 rounded-2xl font-black hover:bg-[#ff8c20] transition-all shadow-xl shadow-[#ff7b00]/20 active:scale-95"
            >
              <Plus size={20} strokeWidth={3} />
              Add New Food
            </button>
          </div>
        </div>
      </section>

      {/* FOOD ITEMS LIST */}
      <section className="px-5 mt-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black">Managed Items</h2>
          <div className="flex items-center gap-2 text-[#ff7b00]">
            <Flame size={18} />
            <span className="text-xs font-bold uppercase tracking-widest">Live Menu</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {profile.foodItems && profile.foodItems.length > 0 ? (
            profile.foodItems.map((item) => (
              <div
                key={item._id}
                className="group bg-[#161616] border border-white/5 rounded-[32px] p-5 flex items-center gap-5 hover:border-[#ff7b00]/40 transition-all duration-500 hover:bg-[#1c1c1c]"
              >
                {/* VIDEO PREVIEW */}
                <div className="relative shrink-0">
                  {item.video ? (
                    <video
                      src={item.video}
                      muted
                      autoPlay
                      loop
                      playsInline
                      className="w-32 h-32 rounded-[28px] object-cover border border-white/5 shadow-2xl"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-[28px] bg-white/5 flex items-center justify-center border border-white/5">
                      <Plus className="text-gray-600" />
                    </div>
                  )}

                  {/* PRICE TAG */}
                  <div className="absolute -top-2 -left-2 bg-[#ff7b00] text-black px-3 py-1 rounded-full text-xs font-black shadow-lg">
                    Rs.{item.price}
                  </div>
                </div>

                {/* INFO & ACTIONS */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold leading-tight mb-1 truncate group-hover:text-[#ff7b00] transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-[#8E8E93] text-xs line-clamp-2 mb-4 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleEdit(item._id)}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs font-bold hover:bg-[#ff7b00] hover:text-black hover:border-transparent transition-all duration-300"
                    >
                      <Edit2 size={14} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="flex items-center justify-center p-2.5 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all duration-300"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-24 text-center bg-[#111111] rounded-[40px] border border-dashed border-white/10">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-600">
                <ShoppingBag size={40} />
              </div>
              <p className="text-gray-500 font-bold tracking-wide">Your kitchen is empty</p>
              <button
                onClick={handleAddNewItem}
                className="mt-4 text-[#ff7b00] font-bold text-sm hover:underline"
              >
                Add your first dish
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default FoodPartnerProfile;
