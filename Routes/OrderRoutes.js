const express = require("express");

const router = express.Router();


// ======================================================
// CONTROLLERS
// ======================================================

const {

  placeOrder,
  getOrdersByUser,

} = require("../controllers/OrderController");


// ======================================================
// AUTH MIDDLEWARE
// ======================================================

const authMiddleware =
require("../middleware/AuthMiddleWare");


// ======================================================
// PLACE ORDER
// ======================================================

router.post(

  "/add",

  authMiddleware,

  placeOrder
);


// ======================================================
// GET CURRENT USER ORDERS
// ======================================================

router.get(

  "/get",

  authMiddleware,

  getOrdersByUser
);


module.exports = router;