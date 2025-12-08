const rideService = require("../services/ride.service");
const { validationResult } = require("express-validator");
const mapService = require("../services/map.service");
const { sendMessageToSocketId } = require("../socket");
const rideModel = require("../models/ride.model");
const userModel = require("../models/user.model");

module.exports.chatDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const ride = await rideModel
      .findOne({ _id: id })
      .populate("user", "socketId fullname phone")
      .populate("captain", "socketId fullname phone");

    if (!ride) {
      return res.status(400).json({ message: "Ride not found" });
    }

    const response = {
      user: {
        socketId: ride.user?.socketId,
        fullname: ride.user?.fullname,
        phone: ride.user?.phone,
        _id: ride.user?._id,
      },
      captain: {
        socketId: ride.captain?.socketId,
        fullname: ride.captain?.fullname,
        phone: ride.captain?.phone,
        _id: ride.captain?._id,
      },
      messages: ride.messages,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports.createRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { pickup, destination, vehicleType } = req.body;

  try {
    const ride = await rideService.createRide({
      user: req.user._id,
      pickup,
      destination,
      vehicleType,
    });

    const user = await userModel.findOne({ _id: req.user._id });
    if (user) {
      user.rides.push(ride._id);
      await user.save();
    }

    res.status(201).json(ride);

    Promise.resolve().then(async () => {
      try {
        const pickupCoordinates = await mapService.getAddressCoordinate(pickup);
        console.log("Pickup Coordinates", pickupCoordinates);

        const captainsInRadius = await mapService.getCaptainsInTheRadius(
          pickupCoordinates.lat,
          pickupCoordinates.lng,
          4,
          vehicleType
        );

        ride.otp = "";

        const rideWithUser = await rideModel
          .findOne({ _id: ride._id })
          .populate("user");

        console.log(
          captainsInRadius.map(
            (captain) => `${captain.fullname.firstname} ${captain.fullname.lastname || ''}`
          ).join(', ')
        );
        captainsInRadius.forEach((captain) => {
          sendMessageToSocketId(captain.socketId, {
            event: "new-ride",
            data: rideWithUser,
          });
        });
      } catch (e) {
        console.error("Background task failed:", e.message);
      }
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports.getFare = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { pickup, destination } = req.query;

  try {
    const { fare, distanceTime } = await rideService.getFare(
      pickup,
      destination
    );
    
    // Get coordinates for pickup and destination
    const pickupCoordinates = await mapService.getAddressCoordinate(pickup);
    const destinationCoordinates = await mapService.getAddressCoordinate(destination);
    
    return res.status(200).json({ 
      fare, 
      distanceTime,
      pickupCoordinates: {
        lat: pickupCoordinates.lat,
        lng: pickupCoordinates.lng
      },
      destinationCoordinates: {
        lat: destinationCoordinates.lat,
        lng: destinationCoordinates.lng
      }
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports.confirmRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId } = req.body;

  try {
    // Attempt to confirm the ride with atomic update (race condition safe)
    const ride = await rideService.confirmRide({
      rideId,
      captain: req.captain,
    });

    // Get coordinates for pickup and destination
    const pickupCoordinates = await mapService.getAddressCoordinate(ride.pickup);
    const destinationCoordinates = await mapService.getAddressCoordinate(ride.destination);
    
    // Add coordinates to ride data for client
    const rideWithCoordinates = {
      ...ride.toObject(),
      pickupCoordinates: {
        lat: pickupCoordinates.lat,
        lng: pickupCoordinates.lng
      },
      destinationCoordinates: {
        lat: destinationCoordinates.lat,
        lng: destinationCoordinates.lng
      }
    };

    // Notify the user that their ride was accepted
    sendMessageToSocketId(ride.user.socketId, {
      event: "ride-confirmed",
      data: rideWithCoordinates,
    });

    // CRITICAL: Broadcast to ALL other drivers that this ride is no longer available
    // This prevents the race condition UI issue where other drivers still see the request
    Promise.resolve().then(async () => {
      try {
        const captainsInRadius = await mapService.getCaptainsInTheRadius(
          pickupCoordinates.lat,
          pickupCoordinates.lng,
          4,
          ride.vehicle
        );

        // Emit RIDE_TAKEN event to all captains except the one who accepted
        captainsInRadius.forEach((captain) => {
          if (captain._id.toString() !== req.captain._id.toString()) {
            sendMessageToSocketId(captain.socketId, {
              event: "ride-taken",
              data: { rideId: ride._id, takenBy: req.captain._id },
            });
          }
        });
      } catch (e) {
        console.error("Failed to notify captains about ride acceptance:", e.message);
      }
    });

    return res.status(200).json(ride);
  } catch (err) {
    console.error("Error confirming ride:", err);
    
    // Handle race condition error specifically
    if (err.message === "Este viaje ya fue aceptado por otro conductor") {
      return res.status(409).json({ message: err.message });
    }
    
    return res.status(500).json({ message: err.message });
  }
};

module.exports.startRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId, otp } = req.query;

  try {
    const ride = await rideService.startRide({
      rideId,
      otp,
      captain: req.captain,
    });

    sendMessageToSocketId(ride.user.socketId, {
      event: "ride-started",
      data: ride,
    });

    return res.status(200).json(ride);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports.endRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId } = req.body;

  try {
    const ride = await rideService.endRide({ rideId, captain: req.captain });

    // Notify user that ride ended
    sendMessageToSocketId(ride.user.socketId, {
      event: "ride-ended",
      data: ride,
    });

    // Request ratings from both user and captain
    sendMessageToSocketId(ride.user.socketId, {
      event: "rating:request",
      data: {
        rideId: ride._id,
        raterType: "user",
        rateeType: "captain",
        ratee: {
          _id: ride.captain._id,
          name: `${ride.captain.fullname.firstname} ${ride.captain.fullname.lastname || ""}`.trim(),
          rating: ride.captain.rating,
        },
      },
    });

    sendMessageToSocketId(ride.captain.socketId, {
      event: "rating:request",
      data: {
        rideId: ride._id,
        raterType: "captain",
        rateeType: "user",
        ratee: {
          _id: ride.user._id,
          name: `${ride.user.fullname.firstname} ${ride.user.fullname.lastname || ""}`.trim(),
          rating: ride.user.rating,
        },
      },
    });

    return res.status(200).json(ride);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports.cancelRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId } = req.query;

  try {
    const ride = await rideModel.findOneAndUpdate(
      { _id: rideId },
      {
        status: "cancelled",
      },
      { new: true }
    );

    // Notify captains asynchronously - don't block the response
    Promise.resolve().then(async () => {
      try {
        const pickupCoordinates = await mapService.getAddressCoordinate(ride.pickup);
        const captainsInRadius = await mapService.getCaptainsInTheRadius(
          pickupCoordinates.lat,
          pickupCoordinates.lng,
          4,
          ride.vehicle
        );

        captainsInRadius.forEach((captain) => {
          sendMessageToSocketId(captain.socketId, {
            event: "ride-cancelled",
            data: ride,
          });
        });
      } catch (error) {
        console.error("Failed to notify captains about ride cancellation:", error.message);
      }
    });
    
    return res.status(200).json(ride);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
