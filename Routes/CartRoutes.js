const express = require("express");

const router = express.Router();

const CartController =
require("../controllers/CartController");

// ================= ADD TO CART =================

router.post(
  "/add",
  CartController.addToCart
);

// ================= GET CART =================

router.get(
  "/get-cart",
  CartController.getCart
);

// ================= UPDATE CART =================

router.put(
  "/update-cart",
  CartController.updateCartQuantity
);

// ================= REMOVE CART =================

router.delete(
  "/remove-cart",
  CartController.removeCartItem
);

module.exports = router;