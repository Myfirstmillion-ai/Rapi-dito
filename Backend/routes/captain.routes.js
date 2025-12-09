const express = require("express");
const router = express.Router();
const captainController = require("../controllers/captain.controller");
const { body } = require("express-validator");
const { authCaptain } = require("../middlewares/auth.middleware");
const { loginLimiter, registrationLimiter, passwordResetLimiter, emailVerificationLimiter } = require("../middlewares/rateLimiter.middleware");

// SECURITY: Rate limited registration - 3 attempts per hour
router.post("/register",
    registrationLimiter,
    body("email").isEmail().withMessage("Invalid Email"),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters long"),
    body("phone").isLength({ min: 10, max: 10 }).withMessage("Phone Number should be of 10 characters only"),
    body("fullname.firstname").isLength({min:3}).withMessage("First name must be at least 3 characters long"),
    captainController.registerCaptain
);

// SECURITY: Rate limited email verification - 5 attempts per hour with enhanced validation
router.post("/verify-email",
    emailVerificationLimiter,
    body("userId").isMongoId().withMessage("ID de usuario inválido"),
    body("token").isString().isLength({ min: 6, max: 6 }).withMessage("Token de verificación inválido"),
    captainController.verifyEmail
);

// SECURITY: Rate limited login - 5 attempts per 15 minutes to prevent brute force
router.post("/login",
    loginLimiter,
    body("email").isEmail().withMessage("Invalid Email"),
    captainController.loginCaptain
);

router.post("/update", 
    body("captainData.phone").isLength({ min: 10, max: 10 }).withMessage("Phone Number should be of 10 characters only"),
    body("captainData.fullname.firstname").isLength({min:2}).withMessage("First name must be at least 2 characters long"),
    authCaptain,
    captainController.updateCaptainProfile
);

router.get("/profile", authCaptain, captainController.captainProfile);

router.get("/logout", authCaptain, captainController.logoutCaptain);

// SECURITY: Rate limited password reset - 3 attempts per hour
router.post(
    "/reset-password",
    passwordResetLimiter,
    body("token").notEmpty().withMessage("Token is required"),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters long"),
    captainController.resetPassword
);

module.exports = router;
