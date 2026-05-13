import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiArrowLeft, FiPlus, FiMinus, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import BottomNavbar from "../../components/BottomNavbar";

const API = "${import.meta.env.VITE_API_URL}/api";
axios.defaults.withCredentials = true;

export default function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [cartImages, setCartImages] = useState([]);

  const fetchCart = async () => {
    try {
      const res = await axios.get(`${API}/cart/get`);
      setCartItems(res.data.cart || []);

      console.log(res.data.cart[0].image);
      setCartImages(res.data.cart.map(item => item.image));
    } catch (error) {
      console.log("Cart fetch error:", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const increaseQty = async (id) => {
    try {
      await axios.put(`${API}/cart/increase/${id}`);
      fetchCart();
    } catch (error) {
      console.log(error);
    }
  };

  const decreaseQty = async (id, qty) => {
    if (qty === 1) return;
    try {
      await axios.put(`${API}/cart/decrease/${id}`);
      fetchCart();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(`${API}/cart/delete/${id}`);
      fetchCart();
    } catch (error) {
      console.log(error);
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const deliveryFee = subtotal > 0 ? 5 : 0;
  const total = subtotal + deliveryFee;

  return (
    <div className="min-h-screen bg-[#0C0C0C] text-white flex flex-col">

      {/* Header */}
      <div className="flex items-center gap-3 p-4 text-lg font-semibold bg-[#1A1A1A] sticky top-0 z-10">
        <FiArrowLeft
          className="text-xl cursor-pointer text-neutral-300"
          onClick={() => navigate(-1)}
        />
        Your Cart
      </div>

      {/* Scrollable Cart Items */}
      <div className="px-4 pt-4 space-y-4 overflow-y-auto pb-40 scrollbar-thin scrollbar-thumb-[#FFC700] scrollbar-track-[#1A1A1A]">
        {cartItems.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">Your cart is empty.</p>
        ) : (
          cartItems.map((item) => (
            <div
              key={item._id}
              className="bg-[#131313] rounded-3xl p-4 flex items-center gap-4 border border-[#2B2B2B]"
            >
              <video
                src={cartImages[cartItems.indexOf(item)]}

                className="w-16 h-16 rounded-xl object-cover"
              />
              <div className="flex-1">
                <h2 className="font-semibold text-white">{item.name}</h2>
                <p className="text-sm text-gray-400">Rs {item.price}</p>

                <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={() => decreaseQty(item._id, item.qty)}
                    className="w-7 h-7 rounded-full bg-[#1A1A1A] flex items-center justify-center"
                  >
                    <FiMinus className="text-orange-400 text-sm" />
                  </button>
                  <span className="text-orange-400 font-semibold">{item.qty}</span>
                  <button
                    onClick={() => increaseQty(item._id)}
                    className="w-7 h-7 rounded-full bg-[#1A1A1A] flex items-center justify-center"
                  >
                    <FiPlus className="text-orange-400 text-sm" />
                  </button>
                </div>
              </div>
              <div className="flex flex-col items-end justify-between h-full">
                <p className="text-orange-400 font-semibold text-lg">
                  Rs {item.price * item.qty}
                </p>
                <FiTrash2
                  onClick={() => deleteItem(item._id)}
                  className="text-gray-400 text-xl cursor-pointer"
                />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pricing + Checkout Section */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-16 left-0 w-full px-4 z-20">
          <div className="bg-[#131313] p-4 rounded-3xl space-y-2 shadow-[0_8px_25px_rgba(255,199,0,0.15)] border border-[#2B2B2B] mb-2">
            <div className="flex justify-between text-gray-400">
              <span>Subtotal</span>
              <span>Rs {subtotal}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Delivery Fee</span>
              <span>Rs {deliveryFee}</span>
            </div>
            <div className="border-t border-[#2B2B2B] my-2"></div>
            <div className="flex justify-between text-lg font-semibold text-white">
              <span>Total</span>
              <span>Rs {total}</span>
            </div>
          </div>

          <button
            disabled={cartItems.length === 0}
            onClick={() => navigate("/payment-order", { state: { cartItems } })}
            className="w-full bg-orange-400 p-4 rounded-2xl text-center font-semibold text-black disabled:bg-gray-700 transition"
          >
            Proceed to Checkout
          </button>
        </div>
      )}

      {/* Bottom Navbar */}
      <div className="fixed bottom-0 left-0 w-full z-10">
        <BottomNavbar theme="dark" />
      </div>
    </div>
  );
}
