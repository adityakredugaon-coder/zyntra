const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  sendOtp,
  verifyOtp,
  resetPassword
} = require("../controllers/AuthController");

router.post("/register",registerUser);
router.post("/login",loginUser);
router.post("/forgot-password", sendOtp);     // email submit
router.post("/verify-otp", verifyOtp);        // OTP screen
router.post("/reset-password", resetPassword); // new password

module.exports = router;