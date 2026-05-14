const db = require("../config/db");

// ADD TO FAVORITE
const addToFavorite = async (req, res) => {

    try {

        const user_id = req.user.id;
        const { product_id } = req.body;

        if (!product_id) {
            return res.status(400).json({
                success: false,
                message: "Product id required"
            });
        }

        const sql = `
            INSERT INTO favorites (user_id, product_id)
            VALUES (?, ?)
        `;

        db.query(sql, [user_id, product_id], (err, result) => {

            if (err) {

                // Duplicate favorite
                if (err.code === "ER_DUP_ENTRY") {
                    return res.status(200).json({
                        success: false,
                        message: "Already in favorites"
                    });
                }

                return res.status(500).json({
                    success: false,
                    message: "Add favorite error",
                    error: err.message
                });
            }

            res.status(201).json({
                success: true,
                message: "Added to favorites"
            });
        });

    } catch (e) {

        res.status(500).json({
            success: false,
            message: "Server error",
            error: e.message
        });
    }
};

// REMOVE FAVORITE
const removeFavorite = async (req, res) => {

    try {

        const user_id = req.user.id;
        const { product_id } = req.params;

        const sql = `
            DELETE FROM favorites
            WHERE user_id = ? AND product_id = ?
        `;

        db.query(sql, [user_id, product_id], (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Remove favorite error",
                    error: err.message
                });
            }

            res.json({
                success: true,
                message: "Removed from favorites"
            });
        });

    } catch (e) {

        res.status(500).json({
            success: false,
            message: "Server error",
            error: e.message
        });
    }
};

// GET FAVORITES
const getFavorites = async (req, res) => {

    try {

        const user_id = req.user.id;

        const sql = `
            SELECT 
                favorites.id,
                products.*
            FROM favorites
            JOIN products
            ON favorites.product_id = products.id
            WHERE favorites.user_id = ?
            ORDER BY favorites.id DESC
        `;

        db.query(sql, [user_id], (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Fetch favorite error",
                    error: err.message
                });
            }

            res.json({
                success: true,
                favorites: result
            });
        });

    } catch (e) {

        res.status(500).json({
            success: false,
            message: "Server error",
            error: e.message
        });
    }
};

module.exports = {
    addToFavorite,
    removeFavorite,
    getFavorites
};