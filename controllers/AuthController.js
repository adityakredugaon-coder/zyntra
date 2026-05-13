const dns = require("dns");

dns.setDefaultResultOrder("ipv4first");

const db = require("../config/db");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const nodemailer = require("nodemailer");

const generateToken = require("../utils/generateToken");



// ======================================
// GET USER PROFILE
// ======================================

exports.getUserProfile = async (req, res) => {

  try {

    const userId = req.user.user_id;

    const [users] = await db.query(

      `SELECT
        user_id,
        name,
        email,
        phone,
        dob,
        address1,
        address2,
        profileImage
      FROM users
      WHERE user_id = ?`,

      [userId]

    );

    if (users.length === 0) {

      return res.status(404).json({
        success: false,
        message: "User not found",
      });

    }

    return res.status(200).json({

      success: true,

      user: users[0],

    });

  } catch (err) {

    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Get profile error",
      error: err.message,
    });

  }

};



// ======================================
// UPDATE PROFILE
// ======================================

exports.updateProfile = async (req, res) => {

  try {

    const userId = req.user.user_id;

    const {
      name,
      phone,
      dob,
      address1,
      address2,
      profileImage,
    } = req.body;


    await db.query(

      `UPDATE users
      SET
        name = ?,
        phone = ?,
        dob = ?,
        address1 = ?,
        address2 = ?,
        profileImage = ?
      WHERE user_id = ?`,

      [
        name,
        phone,
        dob,
        address1,
        address2,
        profileImage,
        userId,
      ]

    );


    const [updatedUser] = await db.query(

      `SELECT
        user_id,
        name,
        email,
        phone,
        dob,
        address1,
        address2,
        profileImage
      FROM users
      WHERE user_id = ?`,

      [userId]

    );


    return res.status(200).json({

      success: true,

      message: "Profile updated successfully",

      user: updatedUser[0],

    });

  } catch (err) {

    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Update profile error",
      error: err.message,
    });

  }

};



// ======================================
// REGISTER USER
// ======================================

exports.registerUser = async (req, res) => {

  try {

    const {
      name,
      email,
      password,
    } = req.body;


    // VALIDATION
    if (!name || !email || !password) {

      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });

    }


    // CHECK EXISTING USER
    const [existingUser] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {

      return res.status(400).json({
        success: false,
        message: "User already exists",
      });

    }


    // HASH PASSWORD
    const hashedPassword =
      await bcrypt.hash(password, 10);


    // INSERT USER
    const [result] = await db.query(

      `INSERT INTO users
      (
        name,
        email,
        password
      )
      VALUES (?, ?, ?)`,

      [
        name,
        email,
        hashedPassword,
      ]

    );


    return res.status(201).json({

      success: true,

      message: "User registered successfully",

      user_id: result.insertId,

    });

  } catch (err) {

    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Register error",
      error: err.message,
    });

  }

};



// ======================================
// LOGIN USER
// ======================================

exports.loginUser = async (req, res) => {

  try {

    const {
      email,
      password,
    } = req.body;


    // VALIDATION
    if (!email || !password) {

      return res.status(400).json({
        success: false,
        message: "Email and password required",
      });

    }


    // CHECK USER
    const [users] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {

      return res.status(404).json({
        success: false,
        message: "User not found",
      });

    }


    const user = users[0];


    // CHECK PASSWORD
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {

      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });

    }


    // GENERATE TOKEN
    const token = generateToken(user);


    return res.status(200).json({

      success: true,

      message: "Login successful",

      token,

      user: {

        user_id: user.user_id,

        name: user.name,

        email: user.email,

      },

    });

  } catch (err) {

    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Login error",
      error: err.message,
    });

  }

};



// ======================================
// SEND OTP
// ======================================

exports.sendOtp = async (req, res) => {

  try {

    const userId = req.user.user_id;


    // GET USER
    const [users] = await db.query(
      "SELECT * FROM users WHERE user_id = ?",
      [userId]
    );

    if (users.length === 0) {

      return res.status(404).json({
        success: false,
        message: "User not found",
      });

    }


    const user = users[0];


    // GENERATE OTP
    const otp = Math.floor(
      100000 + Math.random() * 900000
    );


    // SAVE OTP
    await db.query(

      `UPDATE users
      SET
        otp = ?,
        otp_expire =
        NOW() + INTERVAL 5 MINUTE
      WHERE user_id = ?`,

      [
        otp,
        userId,
      ]

    );


    // EMAIL TRANSPORT
    const transporter =
      nodemailer.createTransport({

        host: "smtp.gmail.com",

        port: 587,

        secure: false,

        auth: {

          user: process.env.EMAIL_USER,

          pass: process.env.EMAIL_PASS,

        },

      });


    // SEND MAIL
    await transporter.sendMail({

      from: process.env.EMAIL_USER,

      to: user.email,

      subject: "Password Reset OTP",

      html: `<h2>Your OTP is: ${otp}</h2>`,

    });


    return res.status(200).json({

      success: true,

      message: "OTP sent successfully",

    });

  } catch (err) {

    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Send OTP error",
      error: err.message,
    });

  }

};



// ======================================
// VERIFY OTP
// ======================================

exports.verifyOtp = async (req, res) => {

  try {

    const userId = req.user.user_id;

    const { otp } = req.body;


    if (!otp) {

      return res.status(400).json({
        success: false,
        message: "OTP required",
      });

    }


    // CHECK OTP
    const [users] = await db.query(

      `SELECT * FROM users
      WHERE user_id = ?
      AND otp = ?
      AND otp_expire > NOW()`,

      [
        userId,
        otp,
      ]

    );


    if (users.length === 0) {

      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });

    }


    // RESET TOKEN
    const resetToken = jwt.sign(

      {
        user_id: userId,
        type: "reset",
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "10m",
      }

    );


    return res.status(200).json({

      success: true,

      message: "OTP verified",

      resetToken,

    });

  } catch (err) {

    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Verify OTP error",
      error: err.message,
    });

  }

};



// ======================================
// RESET PASSWORD
// ======================================

exports.resetPassword = async (req, res) => {

  try {

    const {
      password,
      confirmPassword,
    } = req.body;


    // VALIDATION
    if (!password || !confirmPassword) {

      return res.status(400).json({
        success: false,
        message: "All fields required",
      });

    }


    if (password !== confirmPassword) {

      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });

    }


    // GET TOKEN
    const token =
      req.headers.authorization?.split(" ")[1];


    if (!token) {

      return res.status(401).json({
        success: false,
        message: "Token required",
      });

    }


    // VERIFY TOKEN
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );


    if (decoded.type !== "reset") {

      return res.status(401).json({
        success: false,
        message: "Invalid reset token",
      });

    }


    // HASH PASSWORD
    const hashedPassword =
      await bcrypt.hash(password, 10);


    // UPDATE PASSWORD
    await db.query(

      `UPDATE users
      SET
        password = ?,
        otp = NULL,
        otp_expire = NULL
      WHERE user_id = ?`,

      [
        hashedPassword,
        decoded.user_id,
      ]

    );


    return res.status(200).json({

      success: true,

      message: "Password reset successful",

    });

  } catch (err) {

    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Reset password error",
      error: err.message,
    });

  }

};