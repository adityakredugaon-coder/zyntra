const dns = require("dns");

dns.setDefaultResultOrder("ipv4first");

const express = require("express");

const cors = require("cors");

require("dotenv").config();

const app = express();



// ======================================
// MIDDLEWARE
// ======================================

app.use(cors());

app.use(express.json({
  limit: "10mb",
}));

app.use(express.urlencoded({
  extended: true,
}));



// ======================================
// ROUTES IMPORT
// ======================================

const authRoutes =
require("./Routes/AuthRoutes");

app.use("/api/auth", authRoutes);

const cartRoutes =
require("./Routes/CartRoutes");

app.use("/api/cart", cartRoutes);

const favoriteRoutes =
require("./Routes/FavoritesRoutes");

app.use("/api/favorite", favoriteRoutes);



// ======================================
// HOME ROUTE
// ======================================

app.get("/", (req, res) => {

  return res.status(200).json({
    success: true,
    message: "Zyntra API Running Successfully",
  });

});



// ======================================
// 404 ROUTE
// ======================================

app.use((req, res) => {

  return res.status(404).json({
    success: false,
    message: "Route Not Found",
  });

});



// ======================================
// GLOBAL ERROR HANDLER
// ======================================

app.use((err, req, res, next) => {

  console.log("SERVER ERROR :", err);


  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: err.message,
  });

});



// ======================================
// SERVER
// ======================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log(
    `Zyntra API running on port ${PORT}`
  );

});