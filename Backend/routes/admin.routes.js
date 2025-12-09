const express = require("express");
const router = express.Router();
const { param, body } = require("express-validator");
const adminController = require("../controllers/admin.controller");
const { authAdmin } = require("../middlewares/auth.middleware");

// Admin routes - all protected by authAdmin middleware
router.get("/captains", authAdmin, adminController.getAllCaptains);

// SECURITY: Added input validation for status toggle
router.patch("/captain/:id/status",
    authAdmin,
    param("id").isMongoId().withMessage("ID de capitán inválido"),
    body("status").isIn(["active", "inactive"]).withMessage("Estado inválido. Debe ser 'active' o 'inactive'"),
    adminController.toggleCaptainStatus
);

module.exports = router;
