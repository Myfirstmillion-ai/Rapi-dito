const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const ratingController = require("../controllers/rating.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// Middleware to accept both user and captain authentication
const authUserOrCaptain = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: "Unauthorized User" });
  }

  // Create fake response handlers to capture auth middleware behavior
  let userAuthPassed = false;
  let captainAuthPassed = false;

  const fakeNext = () => {
    if (!userAuthPassed) {
      userAuthPassed = true;
      return next();
    } else if (!captainAuthPassed) {
      captainAuthPassed = true;
      return next();
    }
  };

  const fakeRes = {
    status: () => ({ json: () => {} })
  };

  // Try user auth first
  try {
    await authMiddleware.authUser(req, fakeRes, fakeNext);
    if (userAuthPassed) return;
  } catch (error) {
    // Continue to captain auth
  }

  // Try captain auth if user auth failed
  try {
    await authMiddleware.authCaptain(req, fakeRes, fakeNext);
    if (captainAuthPassed) return;
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized User" });
  }

  // If neither worked
  return res.status(401).json({ message: "Unauthorized User" });
};

// Submit rating (user or captain)
router.post(
  "/submit",
  authUserOrCaptain,
  [
    body("rideId").isMongoId().withMessage("ID de viaje inválido"),
    body("stars")
      .isInt({ min: 1, max: 5 })
      .withMessage("Las estrellas deben ser entre 1 y 5"),
    body("comment")
      .optional()
      .isString()
      .isLength({ max: 250 })
      .withMessage("El comentario no puede tener más de 250 caracteres"),
    body("raterType")
      .isIn(["user", "captain"])
      .withMessage("Tipo de calificador inválido"),
  ],
  ratingController.submitRating
);

// Get rating status for a ride
router.get(
  "/:rideId/status",
  authUserOrCaptain,
  ratingController.getRatingStatus
);

module.exports = router;
