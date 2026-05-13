import React, { useEffect, useState } from "react";
import { FiSearch, FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function TopNavbar({ onSearch }) {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get("${import.meta.env.VITE_API_URL}/api/auth/user/profile", { withCredentials: true });
                setUser(res.data.user);
            } catch (err) {
                console.error("Error fetching user profile:", err);
            }
        };
        fetchProfile();
    }, []);

    return (
        <div className="h-14 flex items-center gap-3 px-5 bg-black/50 backdrop-blur-lg text-white fixed top-0 left-0 w-full z-30">
            <h1 className="font-bold text-lg cursor-pointer" onClick={() => navigate("/")}>DeliverNow</h1>
            <div className="flex-1">
                <div className="bg-white/10 rounded-full px-3 py-1.5 flex items-center gap-2">
                    <FiSearch className="text-white/60" />
                    <input
                        className="bg-transparent outline-none text-sm text-white placeholder-white/50 w-full"
                        placeholder="Search food..."
                        onChange={(e) => onSearch && onSearch(e.target.value)}
                    />
                </div>
            </div>
            <button
                onClick={() => navigate("/user/profile")}
                className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center"
            >
                {user?.avatar ? (
                    <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                    <FiUser className="text-2xl" />
                )}
            </button>
        </div>
    );
}

export default TopNavbar;
