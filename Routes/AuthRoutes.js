const express = require("express");
const router = express.Router();

const authController = require("../controllers/AuthController");

const authMiddleware = require("../middleware/AuthMiddleWare");

// ================= PUBLIC ROUTES =================
router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);

// ================= PROTECTED ROUTES =================
router.get("/profile", authMiddleware, authController.getUserProfile);

router.post("/forgot-password", authMiddleware, authController.sendOtp);

router.post("/verify-otp", authMiddleware, authController.verifyOtp);

router.post("/reset-password", authMiddleware, authController.resetPassword);

module.exports = router;