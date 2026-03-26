const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config({ path: "../.env" });

const authRoutes = require("./routes/auth.route");
const chatRoutes = require("./routes/chat.route");

const app = express();
const server = http.createServer(app);

/*MIDDLEWARE*/

app.use(cors({
  origin:process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

/*ROUTES*/

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("🚀 MERN Chat Backend Running...");
});

/*DATABASE CONNECTION*/

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

/*SOCKET.IO */

const io = require("socket.io")(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true
  },
  transports: ["websocket", "polling"] // VERY IMPORTANT
});



require("./socket")(io);

/* SERVER START*/

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
