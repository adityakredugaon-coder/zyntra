const express = require("express");

const router = express.Router();

const authMiddleware =
require("../middleware/AuthMiddleware");

const {

  addFavorite,
  removeFavorite,
  getFavorites,
  checkFavorite,

} = require("../controllers/FaveroitesController");


// ADD FAVORITE
router.post(
  "/add",
  authMiddleware,
  addFavorite
);


// REMOVE FAVORITE
router.delete(
  "/remove",
  authMiddleware,
  removeFavorite
);


// GET ALL FAVORITES
router.get(
  "/all",
  authMiddleware,
  getFavorites
);


// CHECK FAVORITE
router.get(
  "/check/:product_id",
  authMiddleware,
  checkFavorite
);

module.exports = router;