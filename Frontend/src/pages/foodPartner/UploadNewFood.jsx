import React, { useEffect, useRef, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const UploadNewFood = ({ editMode }) => {
  const { id } = useParams(); // foodId for edit mode
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

  // Fetch existing food data in edit mode
  useEffect(() => {
    if (editMode && id) {
      setLoading(true);
      axios
        .get(`http://localhost:3001/api/food/${id}`, { withCredentials: true })
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

  // Preview video
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
      if (videoFile) formData.append("video", videoFile);

      if (editMode && id) {
        // UPDATE existing food
        await axios.put(`http://localhost:3001/api/food/${id}`, formData, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Food item updated successfully!");
      } else {
        // CREATE new food
        const response = await axios.post(`http://localhost:3001/api/food`, formData, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Food item created successfully!");
        navigate(`/food-partner/${response.data.food.foodPartner}`);
        return;
      }

      // Go back to food partner profile
      navigate(-1);
    } catch (err) {
      console.error(err);
      alert("Failed to submit food item");
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = useMemo(() => !name.trim() || (!videoFile && !videoURL), [name, videoFile, videoURL]);

  return (
    <div className="min-h-screen bg-[#1a0f0a] flex justify-center p-4 relative">
      {loading && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <div className="w-full max-w-lg bg-[#2a1a14] rounded-3xl p-6 shadow-xl border border-[#3c261f]">
        <header className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="text-white text-2xl">←</button>
          <h1 className="text-xl font-semibold text-white">
            {editMode ? "Edit Food Item" : "Upload New Food"}
          </h1>
        </header>

        {/* Video Upload */}
        <div
          className="border-2 border-dashed border-[#6d4b3f] rounded-xl p-6 text-center cursor-pointer bg-[#3a241e] hover:bg-[#4a2c24] transition"
          onClick={openFileDialog}
        >
          <p className="text-white text-lg font-medium mb-1">Upload Vertical Video</p>
          <p className="text-[#c7a99a] text-sm mb-4">
            Tap to select a video of your food item. This will be shown as a food reel.
          </p>
          <button className="px-5 py-2 rounded-full bg-[#d7a278] text-black font-semibold">
            Select Video
          </button>
          <input ref={fileInputRef} type="file" accept="video/*" className="hidden" onChange={onFileChange} />
        </div>

        {videoFile || videoURL ? (
          <div className="mt-4">
            <video src={videoURL} controls className="rounded-xl w-full border border-[#5b3a2f]" />
          </div>
        ) : null}

        {/* Form */}
        <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-5">
          <input
            type="text"
            placeholder="Food Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-[#3a241e] border border-[#5b3a2f] focus:border-orange-400 transition rounded-xl px-4 py-3 text-white placeholder-[#a6887b]"
            required
          />
          <input
            type="text"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full bg-[#3a241e] border border-[#5b3a2f] focus:border-orange-400 transition rounded-xl px-4 py-3 text-white placeholder-[#a6887b]"
          />
          <input
            type="text"
            placeholder="Rating"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="w-full bg-[#3a241e] border border-[#5b3a2f] focus:border-orange-400 transition rounded-xl px-4 py-3 text-white placeholder-[#a6887b]"
          />
          <textarea
            rows={3}
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-[#3a241e] border border-[#5b3a2f] focus:border-orange-400 transition rounded-xl px-4 py-3 text-white placeholder-[#a6887b]"
          />
          <button
            type="submit"
            disabled={isDisabled || loading}
            className={`w-full py-3 rounded-xl text-white font-semibold text-lg transition flex justify-center
              ${isDisabled || loading ? "bg-gray-600" : "bg-orange-500 hover:bg-orange-600"}
            `}
          >
            {loading ? (
              <span className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : editMode ? "Update Food Item" : "Upload Food"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadNewFood;

