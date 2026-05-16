const express = require("express");

const router = express.Router();

const {
  placeOrder,
  getOrdersByUser,
} = require("../controllers/OrderController");

router.post("/add", placeOrder);

router.get("/user/:userId", getOrdersByUser);

module.exports = router;