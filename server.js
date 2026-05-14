const express = require("express");

const cors = require("cors");

require("dotenv").config();

const app = express();


// DATABASE
const db =
require("./config/db");


// ROUTES
const authRoutes =
require("./routes/AuthRoutes");

const cartRoutes =
require("./routes/CartRoutes");

const favoriteRoutes =
require("./Routes/FavoritesRoutes");



// MIDDLEWARE
app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
  extended: true,
}));


// API ROUTES
app.use("/api/auth", authRoutes);

app.use("/api/cart", cartRoutes);


app.use(
  "/api/favorite",
  favoriteRoutes
);


// TEST ROUTE
app.get("/", (req, res) => {

  res.send("API Running...");
});


// SERVER
const PORT =
process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );
});