const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const foodRoutes = require("./routes/food.routes");
const foodPartnerRoutes = require("./routes/food-partner.routes");
const paymentRoute = require("./routes/payment.routes");
const cartRoutes = require("./routes/cart.routes");
const otpRoutes = require("./routes/otp.routes");
const notificationRoutes = require("./routes/notification.routes");

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://reel-style-food-delivery-cmeg.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.options("*", cors());
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/food-partner", foodPartnerRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payment", paymentRoute);
app.use("/api/order", otpRoutes);
app.use("/api/notifications", notificationRoutes);

module.exports = app;