const dns = require("dns");
dns.setDefaultResultOrder("ipv4first"); // ✅ FIX for Render IPv6 issue

const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// ================= REGISTER =================
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const [existing] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    res.json({
      message: "User registered successfully",
      userId: result.insertId,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Register error" });
  }
};

// ================= LOGIN =================
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email & password required" });
    }

    const [users] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, type: "login" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login error" });
  }
};

// ================= SEND OTP =================
exports.sendOtp = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const [users] = await db.query(
      "SELECT * FROM users WHERE id = ?",
      [decoded.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = users[0];

    const otp = Math.floor(100000 + Math.random() * 900000);

    await db.query(
      "UPDATE users SET otp=?, otp_expire=NOW() + INTERVAL 5 MINUTE WHERE id=?",
      [otp, user.id]
    );

    // ✅ FIXED SMTP CONFIG
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      to: user.email,
      subject: "OTP for Password Reset",
      html: `<h3>Your OTP is: ${otp}</h3>`,
    });

    res.json({ message: "OTP sent to your email" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error sending OTP", err: err.message });
  }
};

// ================= VERIFY OTP =================
exports.verifyOtp = async (req, res) => {
  try {
    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({ message: "OTP required" });
    }

    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const [users] = await db.query(
      "SELECT * FROM users WHERE id=? AND otp=? AND otp_expire > NOW()",
      [decoded.id, Number(otp)]
    );

    if (users.length === 0) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // ✅ SECURE RESET TOKEN
    const resetToken = jwt.sign(
      { id: decoded.id, type: "reset" },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );

    res.json({
      message: "OTP verified",
      resetToken
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "OTP verify error" });
  }
};

// ================= RESET PASSWORD =================
exports.resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
      return res.status(400).json({ message: "All fields required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ IMPORTANT SECURITY CHECK
    if (decoded.type !== "reset") {
      return res.status(403).json({
        message: "Invalid token for password reset",
      });
    }

    const [users] = await db.query(
      "SELECT * FROM users WHERE id=?",
      [decoded.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = users[0];

    const isSame = await bcrypt.compare(password, user.password);

    if (isSame) {
      return res.status(400).json({
        message: "New password must be different from old password",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      "UPDATE users SET password=?, otp=NULL, otp_expire=NULL WHERE id=?",
      [hashedPassword, user.id]
    );

    res.json({ message: "Password updated successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Reset error" });
  }
};