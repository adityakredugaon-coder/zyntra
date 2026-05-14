const express = require("express");

const router = express.Router();

const {
    addToFavorite,
    removeFavorite,
    getFavorites
} = require("../controllers/FaveroitesController");

const authMiddleware = require("../middleware/AuthMiddleWare");

// ADD
router.post(
    "/add",
    authMiddleware,
    addToFavorite
);

// REMOVE
router.delete(
    "/remove/:product_id",
    authMiddleware,
    removeFavorite
);

// GET
router.get(
    "/all",
    authMiddleware,
    getFavorites
);

module.exports = router;