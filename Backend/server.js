require("dotenv").config();
const socket = require("./socket");
const express = require("express");
const { createServer } = require("http");
const app = express();
const server = createServer(app);

socket.initializeSocket(server);

const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");

const userRoutes = require("./routes/user.routes");
const captainRoutes = require("./routes/captain.routes");
const mapsRoutes = require("./routes/maps.routes");
const rideRoutes = require("./routes/ride.routes");
const mailRoutes = require("./routes/mail.routes");
const ratingRoutes = require("./routes/rating.routes");
const uploadRoutes = require("./routes/upload.routes");
const adminRoutes = require("./routes/admin.routes");
const keepServerRunning = require("./services/active.service");
const dbStream = require("./services/logging.service");
require("./config/db");
const PORT = process.env.PORT || 4000;

if (process.env.ENVIRONMENT == "production") {
  app.use(
    morgan(":method :url :status :response-time ms - :res[content-length]", {
      stream: dbStream,
    })
  );
} else {
  app.use(morgan("dev"));
}

// Configure CORS based on environment
const corsOptions = {
  origin: process.env.ENVIRONMENT === "production"
    ? (process.env.CLIENT_URL || (() => {
        console.error("CRITICAL: CLIENT_URL not set in production. Refusing to start.");
        process.exit(1);
      })()) // Only allow specific origin in production
    : "*", // Allow all origins in development
  credentials: true, // Allow credentials (cookies, authorization headers)
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security headers with helmet
app.use(helmet());

// Rate limiting for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: { 
    success: false, 
    error: "RATE_LIMIT_EXCEEDED", 
    message: "Demasiados intentos. Por favor espera 15 minutos antes de intentar de nuevo." 
  },
  standardHeaders: true,
  legacyHeaders: false,
});

if (process.env.ENVIRONMENT == "production") {
  keepServerRunning();
}

app.get("/", (req, res) => {
  res.json("Hello, World!");
});

app.get("/reload", (req, res) => {
  res.json("Server Reloaded");
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date(),
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
});

// Apply rate limiting to authentication routes
app.use("/user/login", authLimiter);
app.use("/user/register", authLimiter);
app.use("/captain/login", authLimiter);
app.use("/captain/register", authLimiter);

app.use("/user", userRoutes);
app.use("/captain", captainRoutes);
app.use("/map", mapsRoutes);
app.use("/ride", rideRoutes);
app.use("/mail", mailRoutes);
app.use("/ratings", ratingRoutes);
app.use("/upload", uploadRoutes);
app.use("/admin", adminRoutes);

server.listen(PORT, () => {
  console.log("Server is listening on port", PORT);
});
