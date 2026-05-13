const jwt = require("jsonwebtoken");


// ======================================
// VERIFY TOKEN MIDDLEWARE
// ======================================

const verifyToken = (req, res, next) => {

  try {

    // GET AUTH HEADER
    const authHeader = req.headers.authorization;


    // CHECK AUTH HEADER
    if (!authHeader) {

      return res.status(401).json({
        success: false,
        message: "Authorization header missing",
      });

    }


    // CHECK TOKEN FORMAT
    if (!authHeader.startsWith("Bearer ")) {

      return res.status(401).json({
        success: false,
        message: "Invalid token format",
      });

    }


    // GET TOKEN
    const token = authHeader.split(" ")[1];


    // VERIFY TOKEN
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );


    // SAVE USER DATA
    req.user = decoded;


    // DEBUG
    console.log("DECODED USER :", decoded);


    next();

  } catch (error) {

    console.log("TOKEN ERROR :", error.message);


    // TOKEN EXPIRED
    if (error.name === "TokenExpiredError") {

      return res.status(401).json({
        success: false,
        message: "Token expired",
      });

    }


    // INVALID TOKEN
    if (error.name === "JsonWebTokenError") {

      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });

    }


    // OTHER ERRORS
    return res.status(500).json({
      success: false,
      message: "Authentication failed",
      error: error.message,
    });

  }

};


module.exports = verifyToken;