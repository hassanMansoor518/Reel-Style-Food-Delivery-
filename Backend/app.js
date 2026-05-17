const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./db/db");

const authRoutes = require("./routes/auth.routes");
const foodRoutes = require("./routes/food.routes");
const foodPartnerRoutes = require("./routes/food-partner.routes");
const paymentRoute = require("./routes/payment.routes");
const cartRoutes = require("./routes/cart.routes");
const otpRoutes = require("./routes/otp.routes");
const notificationRoutes = require("./routes/notification.routes");

const app = express();

const corsOptions = {
  origin: function (origin, callback) {
    const allowed = [
      "http://localhost:5173",
      "https://reel-style-food-delivery-cmeg.vercel.app",
    ];
    const isVercelPreview = origin && /https:\/\/reel-style-food-delivery[\w-]*\.vercel\.app/.test(origin);

    if (!origin || allowed.includes(origin) || isVercelPreview) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

app.use(cookieParser());
app.use(express.json());

app.use(async (req, res, next) => {
  await connectDB();
  next();
})

app.use("/api/auth", authRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/food-partner", foodPartnerRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payment", paymentRoute);
app.use("/api/order", otpRoutes);
app.use("/api/notifications", notificationRoutes);

module.exports = app;