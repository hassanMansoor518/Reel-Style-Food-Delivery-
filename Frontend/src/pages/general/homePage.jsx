import React, { useRef, useState, useEffect } from "react";
import { FiSearch, FiUser } from "react-icons/fi";
import { IoStorefrontOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BottomNavbar from "../../components/BottomNavbar";
import AlertPopup from "../../components/AlertPopup";
import LoginFirstModal from "../../components/LoginFirstModal";

function Home() {
  const [videos, setVideos] = useState([]);
  const [alertShow, setAlertShow] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");

  const navigate = useNavigate();
  const videoRefs = useRef([]);

   

  // 🚫 Not logged in → Show Login modal instead of Home screen
  

 

  // Auto-play video scroll effect
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
  }, [videos]);

  // Load Food Items
  useEffect(() => {
    axios
      .get("http://localhost:3001/api/food/", { withCredentials: true })
      .then((response) => {
        setVideos(response.data.foodItems);
      })
      .catch((err) => {
        if(err.response.status === 400){
          navigate('/user/login-first');
          return;

        }
        console.error("Error fetching food items:", err);
      });
  }, []);

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
    <div className="h-screen w-full bg-black flex flex-col">
      {/* TOP BAR */}
      <div className="h-14 flex items-center gap-3 px-5 bg-black/50 backdrop-blur-md text-white fixed top-0 left-0 w-full z-30">
        <h1 className="font-bold text-lg">DeliverNow</h1>
        <div className="flex-1">
          <div className="bg-white/20 rounded-full px-3 py-1 flex items-center gap-2">
            <FiSearch />
            <input
              className="bg-transparent outline-none text-sm text-white placeholder-white w-full"
              placeholder="Search food..."
            />
          </div>
        </div>
        <button onClick={() => navigate("/user/profile")}>
          <FiUser className="text-2xl" />
        </button>
      </div>

      {/* VIDEO LIST */}
      <div className="flex-1 mt-14 mb-14 snap-y snap-mandatory overflow-scroll">
        {videos.map((video, index) => (
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
              className="absolute bottom-12 right-4 bg-orange-500 text-white p-4 rounded-full shadow-xl text-xl active:scale-95 z-50"
              onClick={() => addToCart(video._id)}
            >
              🛒
            </button>
          </div>
        ))}
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
