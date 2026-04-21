import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

const Profile = () => {
  const { id } = useParams()
  const [profile, setProfile] = useState(null)
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    axios
      .get(`http://localhost:3001/api/food-partner/profile/${id}`, { withCredentials: true })
      .then((response) => {
        setProfile(response.data.foodPartner)
        setVideos(response.data.foodPartner.foodItems)
        console.log(response.data.foodPartner);
      })
      .catch(() => setError("Failed to load profile"))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <p className="text-center mt-20 text-lg">Loading profile...</p>
  if (error) return <p className="text-center mt-20 text-red-500">{error}</p>

  return (
    <main className="max-w-6xl mx-auto p-6 flex flex-col gap-6">
      {/* Profile Header */}
      <section className="bg-white border border-gray-200 rounded-lg shadow-md p-6 flex flex-col gap-6">
        <div className="grid grid-cols-[120px_1fr] items-center gap-6 sm:grid-cols-[96px_1fr] xs:grid-cols-[72px_1fr]">
          <img
            className="w-28 h-28 sm:w-24 sm:h-24 xs:w-18 xs:h-18 rounded-full object-cover border-2 border-gray-300"
            src="https://images.unsplash.com/photo-1754653099086-3bddb9346d37?w=500&auto=format&fit=crop&q=60"
            alt="Avatar"
          />
          <div className="flex flex-col gap-2">
            <h1 className="inline-block px-4 py-2 rounded-xl border border-gray-300 bg-gray-100 font-bold text-xl">
              {profile.contactName}
            </h1>
            <p className="inline-block px-4 py-2 rounded-xl border border-gray-300 bg-gray-100 text-gray-600">
              {profile?.address}
              
            </p>
             <p className="inline-block px-4 py-2 rounded-xl border border-gray-300 bg-gray-100 text-gray-600">
              {profile?.phone}
              
            </p>
          </div>
        </div>

       

        {/* Add New Food Button */}
      
      </section>

      <hr className="border-gray-300" />

      {/* Videos Grid */}
<section className="grid grid-cols-2 gap-4">
  {videos.map((v) => (
    <div key={v.id} className="aspect-[3/4] overflow-hidden rounded-xl">
      <video
        src={v.video}
        muted
        autoPlay
        loop
        playsInline
        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
      />
    </div>
  ))}
</section>

    </main>
  )
}

export default Profile
