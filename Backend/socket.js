const moment = require("moment-timezone");
const { Server } = require("socket.io");
const userModel = require("./models/user.model");
const rideModel = require("./models/ride.model");
const captainModel = require("./models/captain.model");
const frontendLogModel = require("./models/frontend-log.model");

let io;
// Map to track connected drivers for better management
const connectedDrivers = new Map();

function initializeSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
    // Enable reconnection
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  });

  io.on("connection", (socket) => {
    console.log(`Cliente conectado: ${socket.id}`);

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
      const { userId, userType } = data;
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

    socket.on("update-location-captain", async (data) => {
      const { userId, location } = data;

      if (!location || !location.ltd || !location.lng) {
        return socket.emit("error", { message: "Datos de ubicación inválidos" });
      }
      
      await captainModel.findByIdAndUpdate(userId, {
        location: {
          type: "Point",
          coordinates: [location.lng, location.ltd],
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
