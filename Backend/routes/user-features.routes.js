const express = require("express");
const router = express.Router();
const { body, param } = require("express-validator");
const userFeaturesController = require("../controllers/user-features.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// ==================== SAVED LOCATIONS ====================

// Get all saved locations
router.get(
  "/saved-locations",
  authMiddleware.authUser,
  userFeaturesController.getSavedLocations
);

// Add a saved location
router.post(
  "/saved-locations",
  authMiddleware.authUser,
  body("name")
    .isString()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("El nombre debe tener entre 1 y 100 caracteres"),
  body("address")
    .isString()
    .trim()
    .isLength({ min: 3, max: 500 })
    .withMessage("La dirección debe tener entre 3 y 500 caracteres"),
  body("coordinates.lat")
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitud inválida"),
  body("coordinates.lng")
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitud inválida"),
  body("type")
    .optional()
    .isIn(["home", "work", "other"])
    .withMessage("Tipo de ubicación inválido"),
  userFeaturesController.addSavedLocation
);

// Update a saved location
router.put(
  "/saved-locations/:id",
  authMiddleware.authUser,
  param("id").isMongoId().withMessage("ID de ubicación inválido"),
  body("name")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("El nombre debe tener entre 1 y 100 caracteres"),
  body("address")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 3, max: 500 })
    .withMessage("La dirección debe tener entre 3 y 500 caracteres"),
  body("coordinates.lat")
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitud inválida"),
  body("coordinates.lng")
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitud inválida"),
  body("type")
    .optional()
    .isIn(["home", "work", "other"])
    .withMessage("Tipo de ubicación inválido"),
  userFeaturesController.updateSavedLocation
);

// Delete a saved location
router.delete(
  "/saved-locations/:id",
  authMiddleware.authUser,
  param("id").isMongoId().withMessage("ID de ubicación inválido"),
  userFeaturesController.deleteSavedLocation
);

// ==================== SEARCH HISTORY ====================

// Get search history
router.get(
  "/search-history",
  authMiddleware.authUser,
  userFeaturesController.getSearchHistory
);

// Add to search history
router.post(
  "/search-history",
  authMiddleware.authUser,
  body("query")
    .isString()
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage("La búsqueda debe tener entre 1 y 500 caracteres"),
  body("coordinates.lat")
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitud inválida"),
  body("coordinates.lng")
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitud inválida"),
  userFeaturesController.addSearchHistory
);

// Clear search history
router.delete(
  "/search-history",
  authMiddleware.authUser,
  userFeaturesController.clearSearchHistory
);

module.exports = router;
