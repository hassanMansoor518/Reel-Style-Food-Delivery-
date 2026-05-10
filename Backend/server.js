require('dotenv').config();
const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const connectDB = require("./db/db");

// Connect Database
connectDB();

const Port = process.env.PORT || 3001;

// Create HTTP Server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Replace with your frontend URL
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // User joins a room based on orderId
  socket.on("joinOrder", (orderId) => {
    socket.join(orderId);
    console.log(`User joined order room: ${orderId}`);
  });

  // Listener for driver location updates (e.g., from a driver app)
  socket.on("updateDriverLocation", (data) => {
    // data: { orderId, lat, lng, heading, speed }
    io.to(data.orderId).emit("driverLocationUpdate", data);
  });

  // Listener for order status updates
  socket.on("updateOrderStatus", (data) => {
    // data: { orderId, status, eta }
    io.to(data.orderId).emit("orderStatusUpdate", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.get("/", (req, res) => {
  res.send("FoodItem Backend with Socket.IO");
});

server.listen(Port, () => {
  console.log(`Server running at http://localhost:${Port}`);
});
