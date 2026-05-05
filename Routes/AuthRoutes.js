const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  sendOtp,
  verifyOtp,
  resetPassword
} = require("../controllers/AuthController");

// 🔐 middleware import
const authMiddleware = require("../middleware/authMiddleware");

// ================= PUBLIC ROUTES =================
router.post("/register", registerUser);
router.post("/login", loginUser);

// ================= PROTECTED ROUTES =================
// 👉 अब email नहीं लगेगा, current user से काम होगा
router.post("/forgot-password", authMiddleware, sendOtp);

// 👉 OTP verify भी current user के लिए
router.post("/verify-otp", authMiddleware, verifyOtp);

// 👉 password reset भी token से
router.post("/reset-password", authMiddleware, resetPassword);

module.exports = router;