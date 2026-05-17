import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  ArrowLeft,
  Share2,
  Star,
  Clock3,
  Bike,
  MapPin,
  Plus,
  Flame,
  ShoppingBag
} from 'lucide-react'

const ShopProfile = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [profile, setProfile] = useState(null)
  const [foods, setFoods] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Alert State
  const [alertShow, setAlertShow] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")

  useEffect(() => {
    setLoading(true)

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/food-partner/profile/${id}`, {
        withCredentials: true
      })
      .then((response) => {
        setProfile(response.data.foodPartner)
        setFoods(response.data.foodPartner.foodItems || [])
      })
      .catch(() => setError('Failed to load restaurant'))
      .finally(() => setLoading(false))
  }, [id])

  // Add To Cart Function
  const addToCart = async (foodId) => {
    const userId = localStorage.getItem("userId")
    if (!userId) {
      navigate("/user/login")
      return
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/cart/add`,
        { userId, foodId },
        { withCredentials: true }
      );
      setAlertMessage("Added to cart!")
      setAlertShow(true)
      setTimeout(() => setAlertShow(false), 2000)
    } catch (err) {
      console.error("Add to cart error:", err)
      setAlertMessage("Failed to add to cart")
      setAlertShow(true)
      setTimeout(() => setAlertShow(false), 2000)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-[#ff7b00] border-t-transparent animate-spin"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center px-6">
        <div className="bg-[#1A1A1A] border border-white/5 rounded-[28px] p-8 text-center">
          <h2 className="text-white text-2xl font-bold mb-2">
            Something went wrong
          </h2>
          <p className="text-[#8E8E93]">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 text-[#ff7b00] font-semibold"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[#0D0D0D] text-white pb-32 no-scrollbar">
      {/* ALERT POPUP */}
      {alertShow && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-[#ff7b00] text-white px-6 py-3 rounded-full shadow-2xl font-bold animate-bounce">
          {alertMessage}
        </div>
      )}

      {/* HEADER IMAGE */}
      <section className="relative h-[260px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1400&auto=format&fit=crop"
          alt=""
          className="w-full h-full object-cover"
        />

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-black/50 to-black/20"></div>

        {/* TOP ACTIONS */}
        <div className="absolute top-0 left-0 w-full flex items-center justify-between px-5 pt-6">
          <button
            onClick={() => navigate(-1)}
            className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 active:scale-95 transition"
          >
            <ArrowLeft size={20} />
          </button>


        </div>
      </section>

      {/* RESTAURANT INFO */}
      <section className="px-5 -mt-16 relative z-20">
        <div className="bg-[#111111]/90 backdrop-blur-xl border border-white/5 rounded-[32px] p-5 shadow-2xl">
          {/* LOGO + INFO */}
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-[24px] bg-[#ff7b00] flex items-center justify-center shadow-[0_0_40px_rgba(255,123,0,0.35)]">
              <span className="text-3xl">🍴</span>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full bg-[#ff7b00]/20 text-[#ff7b00] text-xs font-semibold border border-[#ff7b00]/20">
                  PREMIUM
                </span>

                <div className="flex items-center gap-1 text-[#ffb347]">
                  <Star size={14} fill="#ffb347" />
                  <span className="text-sm font-semibold">4.9</span>
                </div>
              </div>

              <h1 className="text-[28px] font-bold leading-tight">
                {profile?.fullName || profile?.contactName}
              </h1>

              <p className="text-[#8E8E93] mt-1 text-sm">
                {profile?.address}
              </p>
            </div>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="bg-[#1A1A1A] rounded-[22px] py-4 text-center border border-white/5">
              <Clock3
                size={18}
                className="mx-auto mb-2 text-[#ff7b00]"
              />
              <p className="text-white font-semibold text-sm">
                25-35 min
              </p>
              <p className="text-[#8E8E93] text-xs mt-1">
                Delivery
              </p>
            </div>

            <div className="bg-[#1A1A1A] rounded-[22px] py-4 text-center border border-white/5">
              <Bike
                size={18}
                className="mx-auto mb-2 text-[#ff7b00]"
              />
              <p className="text-white font-semibold text-sm">
                Free
              </p>
              <p className="text-[#8E8E93] text-xs mt-1">
                Fee
              </p>
            </div>

            <div className="bg-[#1A1A1A] rounded-[22px] py-4 text-center border border-white/5">
              <MapPin
                size={18}
                className="mx-auto mb-2 text-[#ff7b00]"
              />
              <p className="text-white font-semibold text-sm">
                1.2 km
              </p>
              <p className="text-[#8E8E93] text-xs mt-1">
                Distance
              </p>
            </div>
          </div>

          {/* TABS */}
          <div className="flex gap-3 mt-6 overflow-x-auto no-scrollbar">
            <button className="px-5 py-2 rounded-full bg-[#ff7b00] text-black text-sm font-semibold whitespace-nowrap shadow-[0_0_20px_rgba(255,123,0,0.35)]">
              Menu Items ({foods.length})
            </button>
          </div>
        </div>
      </section>

      {/* POPULAR ITEMS */}
      <section className="px-5 mt-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-bold">
            Popular Items
          </h2>

          <div className="flex items-center gap-2 text-[#ff7b00]">
            <Flame size={18} />
            <span className="text-sm font-medium">
              Trending
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {foods.length > 0 ? (
            foods.map((food, index) => (
              <div
                key={food._id || index}
                className="bg-[#161616] border border-white/5 rounded-[28px] p-4 flex items-center gap-4 hover:border-[#ff7b00]/30 transition-all duration-300"
              >
                {/* FOOD INFO */}
                <div className="flex-1">
                  <h3 className="text-lg font-bold leading-tight">
                    {food.name}
                  </h3>

                  <p className="text-[#8E8E93] text-sm mt-2 line-clamp-2">
                    {food.description}
                  </p>

                  <p className="text-[#ff7b00] text-xl font-bold mt-4">
                    Rs. {food.price}
                  </p>
                </div>

                {/* IMAGE / VIDEO */}
                <div className="relative">
                  <video
                    src={food.video}
                    muted
                    autoPlay
                    loop
                    playsInline
                    className="w-28 h-28 rounded-[24px] object-cover"
                  />

                  <button
                    onClick={() => addToCart(food._id)}
                    className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-[#222222] border border-white/10 flex items-center justify-center hover:bg-[#ff7b00] hover:text-black transition-all duration-300 active:scale-90"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center text-[#8E8E93]">
              No items available at this restaurant.
            </div>
          )}
        </div>
      </section>

    </main>
  )
}

export default ShopProfile