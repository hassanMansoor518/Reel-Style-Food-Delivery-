import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
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

  const [profile, setProfile] = useState(null)
  const [foods, setFoods] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)

    axios
      .get(`http://localhost:3001/api/food-partner/profile/${id}`, {
        withCredentials: true
      })
      .then((response) => {
        setProfile(response.data.foodPartner)
        setFoods(response.data.foodPartner.foodItems || [])
      })
      .catch(() => setError('Failed to load restaurant'))
      .finally(() => setLoading(false))
  }, [id])

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
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[#0D0D0D] text-white pb-32">
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
          <button className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10">
            <ArrowLeft size={20} />
          </button>

          <button className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10">
            <Share2 size={20} />
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
                {profile?.contactName}
              </h1>

              <p className="text-[#8E8E93] mt-1 text-sm">
                Premium restaurant & fast delivery
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
                $4.99
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
              Popular
            </button>

            <button className="px-5 py-2 rounded-full bg-[#1A1A1A] text-[#8E8E93] text-sm font-medium whitespace-nowrap border border-white/5">
              Main Course
            </button>

            <button className="px-5 py-2 rounded-full bg-[#1A1A1A] text-[#8E8E93] text-sm font-medium whitespace-nowrap border border-white/5">
              Sides
            </button>

            <button className="px-5 py-2 rounded-full bg-[#1A1A1A] text-[#8E8E93] text-sm font-medium whitespace-nowrap border border-white/5">
              Drinks
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
          {foods.map((food, index) => (
            <div
              key={food._id || index}
              className="bg-[#161616] border border-white/5 rounded-[28px] p-4 flex items-center gap-4 hover:border-[#ff7b00]/30 transition-all duration-300"
            >
              {/* FOOD INFO */}
              <div className="flex-1">
                <h3 className="text-lg font-bold leading-tight">
                  {food.title || `Food Item ${index + 1}`}
                </h3>

                <p className="text-[#8E8E93] text-sm mt-2 line-clamp-2">
                  Delicious premium quality food made with
                  fresh ingredients and rich flavors.
                </p>

                <p className="text-[#ff7b00] text-xl font-bold mt-4">
                  ${food.price || '24.00'}
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

                <button className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-[#222222] border border-white/10 flex items-center justify-center hover:bg-[#ff7b00] hover:text-black transition-all duration-300">
                  <Plus size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>


    </main>
  )
}

export default ShopProfile