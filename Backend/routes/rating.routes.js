const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const ratingController = require("../controllers/rating.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// Submit rating (user or captain)
router.post(
  "/submit",
  authMiddleware.authUser || authMiddleware.authCaptain,
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
  authMiddleware.authUser || authMiddleware.authCaptain,
  ratingController.getRatingStatus
);

module.exports = router;
