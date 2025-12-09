const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { body } = require("express-validator");
const { authUser } = require("../middlewares/auth.middleware");
const { loginLimiter, registrationLimiter, passwordResetLimiter, emailVerificationLimiter } = require("../middlewares/rateLimiter.middleware");

// SECURITY: Rate limited registration - 3 attempts per hour
router.post("/register",
    registrationLimiter,
    body("email").isEmail().withMessage("Invalid Email"),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters long"),
    body("fullname.firstname").isLength({min:2}).withMessage("First name must be at least 2 characters long"),
    body("phone").isLength({min:10, max:10}).withMessage("Phone number should be of 10 digits only"),
    userController.registerUser
);

// SECURITY: Rate limited email verification - 5 attempts per hour with enhanced validation
router.post("/verify-email",
    emailVerificationLimiter,
    body("userId").isMongoId().withMessage("ID de usuario inválido"),
    body("token").isString().isLength({ min: 6, max: 6 }).withMessage("Token de verificación inválido"),
    userController.verifyEmail
);

// SECURITY: Rate limited login - 5 attempts per 15 minutes to prevent brute force
router.post("/login",
    loginLimiter,
    body("email").isEmail().withMessage("Invalid Email"),
    userController.loginUser
);

router.post("/update", authUser,
    body("fullname.firstname").isLength({min:2}).withMessage("First name must be at least 2 characters long"),
    body("fullname.lastname").isLength({min:2}).withMessage("Last name must be at least 2 characters long"),
    body("phone").isLength({min:10, max:10}).withMessage("Phone number should be of 10 digits only"),
    userController.updateUserProfile
);

router.get("/profile", authUser, userController.userProfile);

router.get("/logout", authUser, userController.logoutUser);

// SECURITY: Rate limited password reset - 3 attempts per hour
router.post(
    "/reset-password",
    passwordResetLimiter,
    body("token").notEmpty().withMessage("Token is required"),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters long"),
    userController.resetPassword
);

module.exports = router;
