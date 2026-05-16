const express = require("express");

const cors = require("cors");

require("dotenv").config();

const app = express();



// =====================================
// DATABASE
// =====================================

require("./config/db");



// =====================================
// MIDDLEWARE
// =====================================

app.use(cors());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);



// =====================================
// ROUTES IMPORT
// =====================================

const authRoutes =
  require("./Routes/AuthRoutes");

const cartRoutes =
  require("./Routes/CartRoutes");

const favoriteRoutes =
  require("./Routes/FavoritesRoutes");

const addressRoutes =
  require("./Routes/AddressRoutes");



// =====================================
// API ROUTES
// =====================================

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/cart",
  cartRoutes
);

app.use(
  "/api/favorite",
  favoriteRoutes
);

app.use(
  "/api/address",
  addressRoutes
);



// =====================================
// TEST ROUTE
// =====================================

app.get("/", (req, res) => {

  res.send("API Running...");
});



// =====================================
// 404 ROUTE
// =====================================

app.use((req, res) => {

  res.status(404).json({

    success: false,

    message: "Route Not Found"
  });
});



// =====================================
// GLOBAL ERROR HANDLER
// =====================================

app.use((err, req, res, next) => {

  console.log("SERVER ERROR:", err);

  res.status(500).json({

    success: false,

    message: "Internal Server Error"
  });
});



// =====================================
// SERVER
// =====================================

const PORT =
  process.env.PORT || 3000;



app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );
});