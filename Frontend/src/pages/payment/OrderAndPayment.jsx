import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

axios.defaults.withCredentials = true;

export default function OrderAndPayment() {
  const location = useLocation();
  const navigate = useNavigate();
  const cartItems = location.state?.cartItems || [];
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card"); // default card
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    name: "",
    expiry: "",
    cvv: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Optional: basic masking for card number and CVV
    if (name === "cardNumber") {
      if (!/^\d*$/.test(value)) return; // allow digits only
      if (value.length > 16) return;
    }
    if (name === "cvv") {
      if (!/^\d*$/.test(value)) return;
      if (value.length > 4) return;
    }

    setCardDetails({ ...cardDetails, [name]: value });
  };

  const handlePayment = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    // Card validation
    if (paymentMethod === "card") {
      const { cardNumber, name, expiry, cvv } = cardDetails;
      const cardNumberRegex = /^\d{16}$/;
      const cvvRegex = /^\d{3,4}$/;
      const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;

      if (!cardNumber || !name || !expiry || !cvv) {
        alert("Please fill all card details!");
        return;
      }
      if (!cardNumberRegex.test(cardNumber)) {
        alert("Invalid card number!");
        return;
      }
      if (!cvvRegex.test(cvv)) {
        alert("Invalid CVV!");
        return;
      }
      if (!expiryRegex.test(expiry)) {
        alert("Invalid expiry date!");
        return;
      }
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:3001/api/payment/save-payment",
        {
          items: cartItems.map((item) => ({
            name: item.name,
            price: item.price,
            quantity: item.qty,
          })),
          totalPrice,
          paymentMethod,
          cardDetails: paymentMethod === "card" ? cardDetails : null,
        },
        { withCredentials: true }
      );
       
   
      navigate(`/otp/${res.data.orderId}`);

      //navigate(`/processing-order/${res.data.orderId}`);
    } catch (err) {
      console.error("PAYMENT ERROR:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Payment failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col justify-center items-center px-4">
      <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>

      {cartItems.length === 0 ? (
        <p className="text-gray-400">Your cart is empty.</p>
      ) : (
        <div className="w-full max-w-md space-y-2 mb-6">
          {cartItems.map((item, index) => (
            <div
              key={item._id || index}
              className="flex justify-between bg-[#1a1a1a] p-3 rounded-xl"
            >
              <span>
                {item.name} x {item.qty}
              </span>
              <span>Rs {item.price * item.qty}</span>
            </div>
          ))}
          <div className="flex justify-between border-t border-gray-700 pt-2 font-semibold">
            <span>Total</span>
            <span>Rs {totalPrice}</span>
          </div>
        </div>
      )}

      {/* Payment Method Selection */}
      <div className="w-full max-w-md bg-[#1a1a1a] p-4 rounded-xl mb-4">
        <h3 className="font-semibold mb-2">Choose Payment Method</h3>
        <div className="flex flex-col gap-2 mb-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="payment"
              value="card"
              checked={paymentMethod === "card"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            Card
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="payment"
              value="cod"
              checked={paymentMethod === "cod"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            Cash on Delivery
          </label>
        </div>

        {/* Card Input Fields */}
        {paymentMethod === "card" && (
          <div className="flex flex-col gap-3">
            <input
              type="text"
              name="cardNumber"
              placeholder="Card Number"
              className="p-2 rounded bg-[#2a2a2a] text-white"
              value={cardDetails.cardNumber}
              onChange={handleInputChange}
              maxLength={16}
            />
            <input
              type="text"
              name="name"
              placeholder="Name on Card"
              className="p-2 rounded bg-[#2a2a2a] text-white"
              value={cardDetails.name}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="expiry"
              placeholder="Expiry (MM/YY)"
              className="p-2 rounded bg-[#2a2a2a] text-white"
              value={cardDetails.expiry}
              onChange={handleInputChange}
              maxLength={5}
            />
            <input
              type="text"
              name="cvv"
              placeholder="CVV"
              className="p-2 rounded bg-[#2a2a2a] text-white"
              value={cardDetails.cvv}
              onChange={handleInputChange}
              maxLength={4}
            />
          </div>
        )}
      </div>

      <button
        onClick={handlePayment}
        disabled={loading || cartItems.length === 0}
        className="w-full max-w-md bg-orange-400 p-4 rounded-xl text-black font-semibold disabled:bg-gray-700"
      >
        {loading ? <span className="animate-pulse">Processing...</span> : "Pay & Place Order"}
      </button>
    </div>
  );
}
