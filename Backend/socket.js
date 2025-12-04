const moment = require("moment-timezone");
const { Server } = require("socket.io");
const userModel = require("./models/user.model");
const rideModel = require("./models/ride.model");
const captainModel = require("./models/captain.model");
const frontendLogModel = require("./models/frontend-log.model");

let io;

function initializeSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
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
      } else if (userType === "captain") {
        await captainModel.findByIdAndUpdate(userId, { socketId: socket.id });
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

module.exports = { initializeSocket, sendMessageToSocketId };
