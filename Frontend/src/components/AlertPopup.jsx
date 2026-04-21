import React from "react";
import { FiX } from "react-icons/fi";

export default function AlertPopup({ show, type = "success", message, desc, onClose }) {
  if (!show) return null;

  return (
    // Backdrop - NOT closing on backdrop click to avoid accidental actions
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      {/* Card - stopPropagation ensures clicks inside modal do NOT bubble to underlying page */}
      <div
        className="relative bg-[#2a1f19] w-[85%] max-w-sm rounded-3xl shadow-2xl p-6 pb-7 animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* X CLOSE BUTTON */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation(); // extra safety
            onClose && onClose();
            
          }}
          className="absolute top-3 right-3 p-2 rounded-full hover:bg-white/10 transition"
          aria-label="Close"
        >
          <FiX className="text-gray-200" size={18} />
        </button>

        {/* ICON CIRCLE */}
        <div className="flex justify-center mt-2">
          <div className="bg-orange-500/20 w-16 h-16 rounded-full flex items-center justify-center">
            <div className="bg-orange-500 text-white w-10 h-10 rounded-full flex items-center justify-center text-2xl">
              ✔
            </div>
          </div>
        </div>

        {/* TITLE */}
        <p className="text-center text-white text-xl font-semibold mt-4">
          {message || "Item Added!"}
        </p>

        {/* DESCRIPTION */}
        <p className="text-center text-gray-300 text-sm mt-1 px-2">
          {desc || "The item has been successfully added to your cart."}
        </p>

        {/* OK BUTTON */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose && onClose();
          }}
          className="mt-6 w-full py-3 rounded-2xl bg-orange-500 text-white text-lg font-medium hover:bg-orange-600 active:scale-95 transition"
        >
          OK
        </button>
      </div>
    </div>
  );
}
