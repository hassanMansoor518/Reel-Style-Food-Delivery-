function OrderCard({ order }) {
  const [remainingTime, setRemainingTime] = useState("");

  // ⏱ LIVE TIMER
  useEffect(() => {
    if (!order.expiresAt) return;

    const interval = setInterval(() => {
      const diff = order.expiresAt - Date.now();

      if (diff <= 0) {
        setRemainingTime("0 min 0 sec");
        return;
      }

      const mins = Math.floor(diff / 60000);
      const secs = Math.floor((diff % 60000) / 1000);

      setRemainingTime(`${mins} min ${secs} sec`);
    }, 1000);

    return () => clearInterval(interval);
  }, [order.expiresAt]);

  const statusSteps = ["Placed", "Preparing", "On the Way", "Delivered"];
  const currentIndex = statusSteps.indexOf(order.status);
  const progress = ((currentIndex + 1) / statusSteps.length) * 100;

  return (
    <div className="bg-[#131313] rounded-3xl p-4 border border-[#2B2B2B] shadow-xl">
      {/* Restaurant + Image */}
      <div className="flex items-center space-x-4">
        <img
          src={order.image || "https://via.placeholder.com/80"}
          className="w-20 h-20 rounded-2xl object-cover"
          alt="food"
        />

        <div className="flex-1">
          <h2 className="text-lg font-semibold text-white">{order.restaurant}</h2>
          <p className="text-sm text-gray-400">Order ID: {order._id}</p>

          {order.eta && (
            <p className="text-sm text-orange-400 mt-1">
              ⏱ ETA: {order.eta}
            </p>
          )}

          {/* REAL-TIME COUNTDOWN */}
          {remainingTime && (
            <p className="text-sm text-green-400 font-semibold mt-1">
              🔥 Time Left: {remainingTime}
            </p>
          )}
        </div>
      </div>

      {/* Status Row */}
      <div className="flex justify-between text-xs text-gray-400 mt-4">
        {statusSteps.map((step, index) => (
          <span
            key={index}
            className={currentIndex === index ? "text-white font-semibold" : ""}
          >
            {step}
          </span>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-[#1A1A1A] h-2 rounded-full mt-2">
        <div
          className="bg-orange-500 h-2 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Items */}
      <p className="text-sm text-gray-300 mt-3">
        Items: {order.items?.map((i) => i.name).join(", ")}
      </p>

      <p className="text-sm text-gray-300">Total Items: {order.totalItems}</p>
      <p className="text-sm text-gray-300">
        Total Price: ${order.totalPrice?.toFixed(2)}
      </p>

      {/* Track Order Button */}
      <button className="w-full mt-4 py-2 bg-orange-500 text-black text-sm font-semibold rounded-2xl shadow-md">
        Track Order
      </button>
    </div>
  );
}
export default OrderCard;
