const express = require("express");

const router = express.Router();


// CONTROLLERS
const AuthController =
require("../controllers/AuthController");


// MIDDLEWARE
const verifyToken =
require("../middleware/AuthMiddleWare");



// ======================================
// REGISTER USER
// ======================================

router.post(
  "/register",
  AuthController.registerUser
);



// ======================================
// LOGIN USER
// ======================================

router.post(
  "/login",
  AuthController.loginUser
);



// ======================================
// GET USER PROFILE
// ======================================

router.get(
  "/profile",
  verifyToken,
  AuthController.getUserProfile
);



// ======================================
// UPDATE PROFILE
// ======================================

router.put(
  "/update-profile",
  verifyToken,
  AuthController.updateProfile
);



// ======================================
// SEND OTP
// ======================================

router.post(
  "/send-otp",
  verifyToken,
  AuthController.sendOtp
);



// ======================================
// VERIFY OTP
// ======================================

router.post(
  "/verify-otp",
  verifyToken,
  AuthController.verifyOtp
);



// ======================================
// RESET PASSWORD
// ======================================

router.post(
  "/reset-password",
  AuthController.resetPassword
);


module.exports = router;