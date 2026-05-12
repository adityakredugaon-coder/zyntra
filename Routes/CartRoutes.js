const express = require("express");

const router = express.Router();

const cartController =
require("../controllers/CartController");

const authMiddleware =
require("../middleware/AuthMiddleWare");



router.post(
  "/add",
  authMiddleware,
  cartController.addToCart
);

router.get(
  "/get",
  authMiddleware,
  cartController.getCart
);

router.put(
  "/update",
  authMiddleware,
  cartController.updateCartQuantity
);

router.delete(
  "/remove",
  authMiddleware,
  cartController.removeCartItem
);

module.exports = router;