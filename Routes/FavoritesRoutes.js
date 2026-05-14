const express = require("express");

const router = express.Router();

const verifyToken =
require("../MiddleWare/AuthMiddleWare");

const {

  addFavorite,

  removeFavorite,

  getFavorites,

  checkFavorite,

} = require("../controllers/FaveroitesController");



// ==============================
// ADD FAVORITE
// ==============================

router.post(
  "/add",
  verifyToken,
  addFavorite
);



// ==============================
// REMOVE FAVORITE
// ==============================

router.delete(
  "/remove",
  verifyToken,
  removeFavorite
);



// ==============================
// GET ALL FAVORITES
// ==============================

router.get(
  "/all",
  verifyToken,
  getFavorites
);



// ==============================
// CHECK FAVORITE
// ==============================

router.get(
  "/check/:product_id",
  verifyToken,
  checkFavorite
);


module.exports = router;