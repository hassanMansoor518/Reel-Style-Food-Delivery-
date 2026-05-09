import React, { useRef, useState, useEffect } from "react";
import { FiSearch, FiUser } from "react-icons/fi";
import { IoStorefrontOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BottomNavbar from "../../components/BottomNavbar";
import AlertPopup from "../../components/AlertPopup";
import LoginFirstModal from "../../components/LoginFirstModal";
import TopNavbar from "../../components/TopNavbar";

function Home() {
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [alertShow, setAlertShow] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");

  const navigate = useNavigate();
  const videoRefs = useRef([]);


  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.play();
          else entry.target.pause();
        });
      },
      { threshold: 0.6 }
    );

    videoRefs.current.forEach((video) => video && observer.observe(video));

    return () => {
      videoRefs.current.forEach((video) => video && observer.unobserve(video));
    };
  }, [filteredVideos]);

  // Load Food Items
  useEffect(() => {
    axios
      .get("http://localhost:3001/api/food/", { withCredentials: true })
      .then((response) => {
        setVideos(response.data.foodItems);
        setFilteredVideos(response.data.foodItems);
      })
      .catch((err) => {
        if (err.response && err.response.status === 400) {
          navigate("/user/login-first");
          return;
        }
        console.error("Error fetching food items:", err);
      });
  }, []);

  // Search Filtering
  useEffect(() => {
    const filtered = videos.filter((video) =>
      video.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.foodPartner?.contactName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredVideos(filtered);
  }, [searchQuery, videos]);

  // Add To Cart Function (with alert popup)
  const addToCart = async (foodId) => {
    const userId = localStorage.getItem("userId");

    try {
      const res = await axios.post(
        "http://localhost:3001/api/cart/add",
        { userId, foodId },
        { withCredentials: true }
      );

      setAlertType("success");
      setAlertMessage("Item added to cart!");
      setAlertShow(true);

    } catch (err) {
      console.error("Add to cart error:", err);

      setAlertType("error");
      setAlertMessage("Failed to add item to cart!");
      setAlertShow(true);
    }
  };

  return (
    <div className="h-screen w-full bg-black flex flex-col no-scrollbar">
      {/* TOP BAR */}
      <TopNavbar onSearch={setSearchQuery} />

      {/* VIDEO LIST */}
      <div className="flex-1 mt-14 mb-14 snap-y snap-mandatory overflow-scroll no-scrollbar">
        {filteredVideos.length > 0 ? (
          filteredVideos.map((video, index) => (
            <div key={video._id} className="relative h-[calc(100vh-112px)] w-full snap-start">
            <video
              ref={(el) => (videoRefs.current[index] = el)}
              src={video.video}
              className="h-full w-full object-cover"
              loop
              muted
              playsInline
              autoPlay
            />

            <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-black to-transparent"></div>

            <div className="absolute bottom-6 left-0 w-full px-8 text-white z-10">
              <h2 className="text-xl font-bold drop-shadow-lg">
                <div className="w-[80%]">
                  {video.description && (
                    <span className="block text-2xl font-bold mt-1">{video.name}</span>
                  )}
                </div>
                {video.price && (
                  <span className="block text-xl text-orange-400 font-bold mt-1">
                    Price: {video.price}
                  </span>
                )}
                <div className="flex mt-2">
                  <div className="bg-black/50 rounded-full w-max items-center p-3 text-2xl">
                    {video.foodPartner && (
                      <button onClick={() => navigate(`/profile/${video.foodPartner._id}`)}>
                        <IoStorefrontOutline />
                      </button>
                    )}
                  </div>

                  <div className="ml-2">
                    {video.foodPartner && (
                      <span className="block text-sm font-normal mt-1">
                        by {video.foodPartner.contactName}
                      </span>
                    )}
                    {video.rating && (
                      <span className="block text-sm font-normal mt-1">
                        Rating: {video.rating}⭐
                      </span>
                    )}
                  </div>
                </div>
              </h2>
            </div>

            <button
              className="absolute bottom-12 right-4 bg-orange-500 text-white p-4 rounded-full shadow-xl text-xl active:scale-[0.99] z-50 transition shadow-[0_8px_25px_rgba(255,123,0,0.3)]"
              onClick={() => addToCart(video._id)}
            >
              🛒
            </button>
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-[#8E8E93]">
          <FiSearch size={50} className="mb-4 opacity-20" />
          <p className="text-lg font-medium">No results found for &quot;{searchQuery}&quot;</p>
          <p className="text-sm opacity-60">Try searching for something else!</p>
        </div>
      )}
      </div>

      {/* BOTTOM NAVBAR */}
      <BottomNavbar />

      {/* ALERT POPUP */}
      <AlertPopup
        show={alertShow}
        type={alertType}
        message={alertMessage}

        onClose={() => setAlertShow(false)}
      />
    </div>
  );
}

export default Home;
