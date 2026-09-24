const path = require("path");
// Load environment variables from project root .env
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const driverRoutes = require("./routes/driverRoutes");
const adminRoutes = require("./modules/admin/admin.routes");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middlewares
app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware in development
app.use((req, res, next) => {
  console.log(`[API ${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/admin", adminRoutes);

// Health Check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "Moventra Backend API",
    time: new Date().toISOString(),
  });
});

// Root welcome route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to Moventra Mobility Backend Server",
    endpoints: {
      auth: "/api/auth",
      health: "/api/health",
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error("[Unhandled Server Error]:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// Start Express server
const server = app.listen(PORT, () => {
  console.log(`=============================================`);
  console.log(`  Moventra Backend API Running on Port ${PORT}`);
  console.log(`  Health Check: http://localhost:${PORT}/api/health`);
  console.log(`  Auth Routes:  http://localhost:${PORT}/api/auth`);
  console.log(`=============================================`);
});

module.exports = { app, server };
