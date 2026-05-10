import React, { useEffect, useRef, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, UploadCloud, Star } from "lucide-react";

const UploadNewFood = ({ editMode }) => {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [rating, setRating] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [videoURL, setVideoURL] = useState("");
  const [fileError, setFileError] = useState("");
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // FETCH EXISTING DATA
  useEffect(() => {
    if (editMode && id) {
      setLoading(true);

      axios
        .get(`http://localhost:3001/api/food/${id}`, {
          withCredentials: true,
        })
        .then((res) => {
          const food = res.data.food;

          setName(food.name);
          setDescription(food.description);
          setPrice(food.price);
          setRating(food.rating);
          setVideoURL(food.video || "");
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [editMode, id]);

  // VIDEO PREVIEW
  useEffect(() => {
    if (!videoFile) return;

    const url = URL.createObjectURL(videoFile);
    setVideoURL(url);

    return () => URL.revokeObjectURL(url);
  }, [videoFile]);

  const onFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("video/")) {
      setFileError("Please select a valid video file.");
      return;
    }

    setFileError("");
    setVideoFile(file);
  };

  const openFileDialog = () => fileInputRef.current?.click();

  const onSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("rating", rating);

      if (videoFile) {
        formData.append("video", videoFile);
      }

      if (editMode && id) {
        await axios.put(
          `http://localhost:3001/api/food/${id}`,
          formData,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        alert("Food item updated successfully!");
      } else {
        const response = await axios.post(
          `http://localhost:3001/api/food`,
          formData,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        alert("Food item created successfully!");

        navigate(`/food-partner/${response.data.food.foodPartner}`);
        return;
      }

      navigate(-1);
    } catch (err) {
      console.error(err);
      alert("Failed to submit food item");
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = useMemo(
    () => !name.trim() || (!videoFile && !videoURL),
    [name, videoFile, videoURL]
  );

  return (
    <div className="min-h-screen bg-[#050505] flex justify-center px-4 py-8">
      {/* LOADER */}
      {loading && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center">
          <div className="w-14 h-14 rounded-full border-4 border-[#ff7a00] border-t-transparent animate-spin"></div>
        </div>
      )}

      {/* MAIN CARD */}
      <div className="w-full max-w-lg bg-[#111111] border border-white/5 rounded-[34px] p-6 shadow-[0_0_50px_rgba(255,122,0,0.08)]">
        {/* HEADER */}
        <header className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="w-11 h-11 rounded-full bg-[#1A1A1A] border border-white/10 flex items-center justify-center text-white hover:bg-[#222222] transition"
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <h1 className="text-2xl font-bold text-white">
              {editMode ? "Edit Food Item" : "Upload New Food"}
            </h1>

            <p className="text-[#8E8E93] text-sm mt-1">
              Create premium food reels for customers
            </p>
          </div>
        </header>

        {/* VIDEO UPLOAD */}
        <div
          onClick={openFileDialog}
          className="relative overflow-hidden rounded-[28px] border border-dashed border-[#ff7a00]/30 bg-[#0D0D0D] p-8 text-center cursor-pointer hover:border-[#ff7a00] hover:bg-[#121212] transition-all duration-300"
        >
          <div className="w-20 h-20 rounded-full bg-[#ff7a00]/10 border border-[#ff7a00]/20 flex items-center justify-center mx-auto mb-5">
            <UploadCloud size={34} className="text-[#ff7a00]" />
          </div>

          <h2 className="text-white text-lg font-semibold">
            Upload Vertical Food Video
          </h2>

          <p className="text-[#8E8E93] text-sm mt-2 max-w-xs mx-auto leading-relaxed">
            Showcase your food with premium reels experience for users.
          </p>

          <button className="mt-6 px-6 py-3 rounded-full bg-[#ff7a00] hover:bg-[#ff8800] text-black font-bold transition-all duration-300 shadow-[0_0_30px_rgba(255,122,0,0.35)]">
            Select Video
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={onFileChange}
          />
        </div>

        {/* ERROR */}
        {fileError && (
          <p className="text-red-400 text-sm mt-3">{fileError}</p>
        )}

        {/* VIDEO PREVIEW */}
        {(videoFile || videoURL) && (
          <div className="mt-5 overflow-hidden rounded-[28px] border border-white/10">
            <video
              src={videoURL}
              controls
              className="w-full h-[400px] object-cover bg-black"
            />
          </div>
        )}

        {/* FORM */}
        <form onSubmit={onSubmit} className="mt-7 space-y-5">
          {/* FOOD NAME */}
          <div>
            <label className="text-sm text-[#b0b0b0] mb-2 block">
              Food Name
            </label>

            <input
              type="text"
              placeholder="e.g. Zinger Burger"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#1A1A1A] border border-white/10 focus:border-[#ff7a00] focus:ring-2 focus:ring-[#ff7a00]/20 rounded-2xl px-5 py-4 text-white placeholder:text-[#666] outline-none transition"
              required
            />
          </div>

          {/* PRICE */}
          <div>
            <label className="text-sm text-[#b0b0b0] mb-2 block">
              Price
            </label>

            <input
              type="text"
              placeholder="Rs. 899"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full bg-[#1A1A1A] border border-white/10 focus:border-[#ff7a00] focus:ring-2 focus:ring-[#ff7a00]/20 rounded-2xl px-5 py-4 text-white placeholder:text-[#666] outline-none transition"
            />
          </div>

          {/* RATING */}
          <div>
            <label className="text-sm text-[#b0b0b0] mb-2 block">
              Rating
            </label>

            <div className="relative">
              <Star
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ffb347]"
              />

              <input
                type="text"
                placeholder="4.9"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="w-full pl-11 bg-[#1A1A1A] border border-white/10 focus:border-[#ff7a00] focus:ring-2 focus:ring-[#ff7a00]/20 rounded-2xl px-5 py-4 text-white placeholder:text-[#666] outline-none transition"
              />
            </div>
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="text-sm text-[#b0b0b0] mb-2 block">
              Description
            </label>

            <textarea
              rows={4}
              placeholder="Describe your food item..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#1A1A1A] border border-white/10 focus:border-[#ff7a00] focus:ring-2 focus:ring-[#ff7a00]/20 rounded-2xl px-5 py-4 text-white placeholder:text-[#666] outline-none transition resize-none"
            />
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={isDisabled || loading}
            className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex justify-center items-center
              ${isDisabled || loading
                ? "bg-[#2a2a2a] text-[#777]"
                : "bg-[#ff7a00] hover:bg-[#ff8800] text-black shadow-[0_0_35px_rgba(255,122,0,0.35)] active:scale-[0.98]"
              }
            `}
          >
            {loading ? (
              <span className="w-6 h-6 rounded-full border-4 border-black border-t-transparent animate-spin"></span>
            ) : editMode ? (
              "Update Food Item"
            ) : (
              "Upload Food"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadNewFood;