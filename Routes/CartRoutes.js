const express = require("express");

const router = express.Router();


// CONTROLLERS
const {
  addToCart,
  getCart,
  removeCartItem,
  updateQuantity,
} = require("../controllers/cartController");


// MIDDLEWARE
const verifyToken =
require("../middleware/AuthMiddleWare");



// ======================================
// ADD TO CART
// ======================================

router.post(
  "/add",
  verifyToken,
  addToCart
);



// ======================================
// GET USER CART
// ======================================

router.get(
  "/get-cart",
  verifyToken,
  getCart
);



// ======================================
// REMOVE CART ITEM
// ======================================

router.delete(
  "/remove/:id",
  verifyToken,
  removeCartItem
);



// ======================================
// UPDATE QUANTITY
// ======================================

router.put(
  "/update/:id",
  verifyToken,
  updateQuantity
);


module.exports = router;