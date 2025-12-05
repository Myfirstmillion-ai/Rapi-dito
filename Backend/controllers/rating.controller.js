const rideModel = require("../models/ride.model");
const userModel = require("../models/user.model");
const captainModel = require("../models/captain.model");
const { validationResult } = require("express-validator");
const { sendMessageToSocketId } = require("../socket");

/**
 * Submit rating for a completed ride
 * @route POST /ratings/submit
 */
module.exports.submitRating = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId, stars, comment, raterType } = req.body;

  try {
    // Find the ride
    const ride = await rideModel
      .findById(rideId)
      .populate("user")
      .populate("captain");

    if (!ride) {
      return res.status(404).json({ message: "Viaje no encontrado" });
    }

    // Verify ride is completed
    if (ride.status !== "completed") {
      return res.status(400).json({ 
        message: "Solo puedes calificar viajes completados" 
      });
    }

    // Verify the rater is part of this ride
    if (raterType === "user") {
      if (ride.user._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ 
          message: "No autorizado para calificar este viaje" 
        });
      }

      // Check if user already rated
      if (ride.rating && ride.rating.userToCaptain && ride.rating.userToCaptain.stars) {
        return res.status(400).json({ 
          message: "Ya has calificado este viaje" 
        });
      }

      // Save rating to ride
      ride.rating = ride.rating || {};
      ride.rating.userToCaptain = {
        stars,
        comment: comment || "",
        createdAt: new Date(),
      };
      await ride.save();

      // Update captain's average rating
      const captain = await captainModel.findById(ride.captain._id);
      const newCount = captain.rating.count + 1;
      const newAverage = 
        (captain.rating.average * captain.rating.count + stars) / newCount;
      
      captain.rating.average = Math.round(newAverage * 10) / 10;
      captain.rating.count = newCount;
      await captain.save();

      // Notify captain via socket
      if (captain.socketId) {
        sendMessageToSocketId(captain.socketId, {
          event: "rating:received",
          data: {
            rideId: ride._id,
            stars,
            newAverage: captain.rating.average,
          },
        });
      }

    } else if (raterType === "captain") {
      if (ride.captain._id.toString() !== req.captain._id.toString()) {
        return res.status(403).json({ 
          message: "No autorizado para calificar este viaje" 
        });
      }

      // Check if captain already rated
      if (ride.rating && ride.rating.captainToUser && ride.rating.captainToUser.stars) {
        return res.status(400).json({ 
          message: "Ya has calificado este viaje" 
        });
      }

      // Save rating to ride
      ride.rating = ride.rating || {};
      ride.rating.captainToUser = {
        stars,
        comment: comment || "",
        createdAt: new Date(),
      };
      await ride.save();

      // Update user's average rating
      const user = await userModel.findById(ride.user._id);
      const newCount = user.rating.count + 1;
      const newAverage = 
        (user.rating.average * user.rating.count + stars) / newCount;
      
      user.rating.average = Math.round(newAverage * 10) / 10;
      user.rating.count = newCount;
      await user.save();

      // Notify user via socket
      if (user.socketId) {
        sendMessageToSocketId(user.socketId, {
          event: "rating:received",
          data: {
            rideId: ride._id,
            stars,
            newAverage: user.rating.average,
          },
        });
      }
    }

    return res.status(200).json({
      message: "Calificación enviada exitosamente",
      ride: {
        _id: ride._id,
        rating: ride.rating,
      },
    });
  } catch (err) {
    console.error("Error submitting rating:", err);
    return res.status(500).json({ message: err.message });
  }
};

/**
 * Get rating status for a ride
 * @route GET /ratings/:rideId/status
 */
module.exports.getRatingStatus = async (req, res) => {
  const { rideId } = req.params;

  try {
    const ride = await rideModel.findById(rideId);

    if (!ride) {
      return res.status(404).json({ message: "Viaje no encontrado" });
    }

    const status = {
      rideId: ride._id,
      status: ride.status,
      userRated: !!(ride.rating && ride.rating.userToCaptain && ride.rating.userToCaptain.stars),
      captainRated: !!(ride.rating && ride.rating.captainToUser && ride.rating.captainToUser.stars),
    };

    return res.status(200).json(status);
  } catch (err) {
    console.error("Error getting rating status:", err);
    return res.status(500).json({ message: err.message });
  }
};
