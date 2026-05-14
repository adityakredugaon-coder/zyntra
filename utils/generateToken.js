const jwt = require("jsonwebtoken");


// ======================================
// GENERATE JWT TOKEN
// ======================================

const generateToken = (user) => {

  return jwt.sign(

    {
      user_id: user.user_id,
      email: user.email,
      type: "login",
    },

    process.env.JWT_SECRET,

    {
      expiresIn: "90d",
    }

  );

};


module.exports = generateToken;