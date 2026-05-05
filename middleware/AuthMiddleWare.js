const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 🔒 Check header
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    // 🔒 Check Bearer token
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Invalid token format" });
    }

    const token = authHeader.split(" ")[1];

    // 🔒 Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 👉 save user data
    req.user = {
      id: decoded.id,
      email: decoded.email
    };

    next();

  } catch (err) {
    console.error("Auth Error:", err.message);

    return res.status(401).json({
      message: "Unauthorized / Token expired"
    });
  }
};

module.exports = authMiddleware;