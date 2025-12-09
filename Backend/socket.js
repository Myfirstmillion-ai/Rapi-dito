const moment = require("moment-timezone");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const userModel = require("./models/user.model");
const rideModel = require("./models/ride.model");
const captainModel = require("./models/captain.model");
const frontendLogModel = require("./models/frontend-log.model");
const blacklistTokenModel = require("./models/blacklistToken.model");

let io;
// Map to track connected drivers for better management
const connectedDrivers = new Map();

// Helper function to verify JWT token for socket connections
async function verifySocketToken(token) {
  if (!token) return null;
  
  try {
    // Check if token is blacklisted
    const isBlacklisted = await blacklistTokenModel.findOne({ token });
    if (isBlacklisted) return null;
    
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch {
    return null;
  }
}

// Helper function to calculate distance between two points (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in km
}

function initializeSocket(server) {
  // Configure CORS based on environment
  const allowedOrigins = process.env.ENVIRONMENT === "production"
    ? (process.env.CLIENT_URL || (() => {
        console.error("CRITICAL: CLIENT_URL not set in production. Refusing to start.");
        process.exit(1);
      })()) // Only allow the specific client URL in production
    : "*"; // Allow all in development for easier testing

  io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
      credentials: true, // Allow credentials (cookies, authorization headers)
    },
    // Enable reconnection
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  });

  // Socket authentication middleware
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.headers.token;
    
    if (!token) {
      // Allow connection but mark as unauthenticated for public events (like logs)
      socket.authenticated = false;
      socket.userId = null;
      socket.userType = null;
      return next();
    }
    
    const decoded = await verifySocketToken(token);
    if (decoded) {
      socket.authenticated = true;
      socket.userId = decoded.id;
      socket.userType = decoded.userType;
      return next();
    }
    
    // Token invalid but allow connection for graceful handling
    socket.authenticated = false;
    socket.userId = null;
    socket.userType = null;
    next();
  });

  io.on("connection", (socket) => {
    console.log(`Cliente conectado: ${socket.id} (authenticated: ${socket.authenticated})`);

    if (process.env.ENVIRONMENT === "production") {
      socket.on("log", async (log) => {
        log.formattedTimestamp = moment().tz("America/Bogota").format("MMM DD hh:mm:ss A");
        try {
          await frontendLogModel.create(log);
        } catch (error) {
          console.log("Error enviando logs...");
        }
      });
    }

    socket.on("join", async (data) => {
      const { userId, userType, token } = data;
      
      // Verify token matches the userId being joined
      if (!socket.authenticated) {
        // Try to verify with token provided in event
        if (token) {
          const decoded = await verifySocketToken(token);
          if (!decoded || decoded.id !== userId) {
            return socket.emit("error", { message: "Autenticación requerida" });
          }
          socket.authenticated = true;
          socket.userId = decoded.id;
          socket.userType = decoded.userType;
        } else {
          return socket.emit("error", { message: "Autenticación requerida" });
        }
      }
      
      // Verify userId matches authenticated user
      if (socket.userId !== userId) {
        return socket.emit("error", { message: "Usuario no autorizado" });
      }
      
      console.log(userType + " conectado: " + userId);
      
      if (userType === "user") {
        await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
        socket.join(`user-${userId}`);
      } else if (userType === "captain") {
        await captainModel.findByIdAndUpdate(userId, { socketId: socket.id });
        // Join driver-specific room for targeted messages
        socket.join(`driver-${userId}`);
        // Track connected driver
        connectedDrivers.set(userId, {
          socketId: socket.id,
          connectedAt: new Date(),
        });
        // Confirm registration to the driver
        socket.emit("driver:registered", {
          driverId: userId,
          socketId: socket.id,
          timestamp: new Date(),
        });
        console.log(`Driver ${userId} registered and joined room driver-${userId}`);
      }
    });

    // Handle driver going online/offline
    socket.on("driver:toggleOnline", async (data) => {
      const { driverId, isOnline } = data;
      
      try {
        // Update captain status in database
        const captain = await captainModel.findByIdAndUpdate(
          driverId,
          { status: isOnline ? 'active' : 'inactive' },
          { new: true }
        );

        if (!captain) {
          socket.emit("error", { message: "Conductor no encontrado" });
          return;
        }

        console.log(`Driver ${driverId} status changed to: ${isOnline ? 'active' : 'inactive'}`);

        // If driver is going ONLINE, send them pending rides
        if (isOnline && captain.location && captain.location.coordinates) {
          const mapService = require("./services/map.service");
          const [lng, lat] = captain.location.coordinates;

          // Query for pending rides in radius
          const pendingRides = await rideModel
            .find({ status: 'pending' })
            .populate({
              path: "user",
              select: "fullname email phone profileImage rating"
            });

          // Filter rides by proximity and vehicle type
          for (const ride of pendingRides) {
            try {
              const pickupCoordinates = await mapService.getAddressCoordinate(ride.pickup);
              const distance = calculateDistance(
                lat, lng,
                pickupCoordinates.lat, pickupCoordinates.lng
              );

              // Send ride if within 4km and matching vehicle type
              if (distance <= 4 && ride.vehicle === captain.vehicle.type) {
                ride.otp = ""; // Hide OTP
                socket.emit("new-ride", ride);
                console.log(`Sent pending ride ${ride._id} to newly online driver ${driverId}`);
              }
            } catch (err) {
              console.error(`Error checking ride ${ride._id}:`, err.message);
            }
          }
        }

        // Confirm status change
        socket.emit("driver:onlineStatusChanged", {
          isOnline,
          timestamp: new Date()
        });
      } catch (error) {
        console.error("Error toggling driver online status:", error);
        socket.emit("error", { message: "Error al cambiar estado" });
      }
    });

    socket.on("update-location-captain", async (data) => {
      const { userId, location } = data;

      // Verify authentication and userId match
      if (!socket.authenticated || socket.userId !== userId) {
        return socket.emit("error", { message: "Usuario no autorizado" });
      }

      if (!location || !location.lat || !location.lng) {
        return socket.emit("error", { message: "Datos de ubicación inválidos" });
      }
      
      await captainModel.findByIdAndUpdate(userId, {
        location: {
          type: "Point",
          coordinates: [location.lng, location.lat],
        },
      });

      // Update the tracking map
      if (connectedDrivers.has(userId)) {
        const driverData = connectedDrivers.get(userId);
        connectedDrivers.set(userId, {
          ...driverData,
          lastLocation: location,
          lastLocationUpdate: new Date(),
        });
      }
    });

    // Enhanced driver location update with ride tracking
    socket.on("driver:locationUpdate", async (data) => {
      const { driverId, location, rideId } = data;
      
      // Verify authentication and driverId match
      if (!socket.authenticated || socket.userId !== driverId) {
        return socket.emit("error", { message: "Usuario no autorizado" });
      }
      
      if (!location || typeof location.lat !== 'number' || typeof location.lng !== 'number') {
        return socket.emit("error", { message: "Datos de ubicación inválidos" });
      }

      try {
        // Update driver location in database
        await captainModel.findByIdAndUpdate(driverId, {
          location: {
            type: "Point",
            coordinates: [location.lng, location.lat],
          },
        });

        // If driver has an active ride, notify the passenger
        if (rideId) {
          const ride = await rideModel.findById(rideId).populate('user');
          if (ride && ride.user) {
            // Send location update to the passenger
            io.to(`user-${ride.user._id}`).emit('driver:locationUpdated', {
              location,
              rideId,
              driverId,
              timestamp: new Date(),
            });
          }
        }

        // Update tracking map
        if (connectedDrivers.has(driverId)) {
          const driverData = connectedDrivers.get(driverId);
          connectedDrivers.set(driverId, {
            ...driverData,
            lastLocation: location,
            lastLocationUpdate: new Date(),
            activeRideId: rideId || null,
          });
        }
      } catch (error) {
        console.error("Error updating driver location:", error);
        socket.emit("error", { message: "Error al actualizar ubicación" });
      }
    });

    socket.on("join-room", (roomId) => {
      socket.join(roomId);
      console.log(`${socket.id} se unió a la sala: ${roomId}`);
    });

    // Eventos de typing para el chat
    socket.on("typing", ({ rideId, userType }) => {
      socket.to(rideId).emit("user-typing", { userType });
    });

    socket.on("stop-typing", ({ rideId, userType }) => {
      socket.to(rideId).emit("user-stop-typing", { userType });
    });

    socket.on("message", async ({ rideId, msg, userType, time }) => {
      const date = moment().tz("America/Bogota").format("MMM DD");
      socket.to(rideId).emit("receiveMessage", { msg, by: userType, time });
      try {
        const ride = await rideModel.findOne({ _id: rideId });
        if (ride) {
          ride.messages.push({
            msg: msg,
            by: userType,
            time: time,
            date: date,
            timestamp: new Date(),
          });
          await ride.save();
        }
      } catch (error) {
        console.log("Error guardando mensaje: ", error);
      }
    });

    socket.on("disconnect", () => {
      console.log(`Cliente desconectado: ${socket.id}`);
      // Clean up driver tracking on disconnect
      for (const [driverId, driverData] of connectedDrivers.entries()) {
        if (driverData.socketId === socket.id) {
          connectedDrivers.delete(driverId);
          console.log(`Driver ${driverId} removed from tracking`);
          break;
        }
      }
    });
  });
}

const sendMessageToSocketId = (socketId, messageObject) => {
  if (io) {
    console.log("Mensaje enviado a: ", socketId);
    io.to(socketId).emit(messageObject.event, messageObject.data);
  } else {
    console.log("Socket.io no inicializado.");
  }
};

// New helper function to send to room
const sendMessageToRoom = (room, messageObject) => {
  if (io) {
    console.log(`Mensaje enviado a sala: ${room}`);
    io.to(room).emit(messageObject.event, messageObject.data);
  } else {
    console.log("Socket.io no inicializado.");
  }
};

// Get connected drivers count
const getConnectedDriversCount = () => {
  return connectedDrivers.size;
};

module.exports = { 
  initializeSocket, 
  sendMessageToSocketId,
  sendMessageToRoom,
  getConnectedDriversCount,
};
