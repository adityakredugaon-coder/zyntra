const db = require("../config/db");


// ==============================
// ADD FAVORITE
// ==============================

exports.addFavorite = async (
  req,
  res
) => {

  try {

    const user_id =
      req.user.user_id;

    const { product_id } =
      req.body;

    if (!product_id) {

      return res.status(400).json({
        success: false,
        message: "Product id required",
      });
    }

    console.log("USER ID :", user_id);
    console.log("PRODUCT ID :", product_id);


    // CHECK ALREADY EXISTS
    const [alreadyExists] =
      await db.query(

        "SELECT * FROM favorites WHERE user_id=? AND product_id=?",

        [user_id, product_id]
      );


    if (alreadyExists.length > 0) {

      return res.json({
        success: true,
        message: "Already in favorites",
      });
    }


    // INSERT FAVORITE
    await db.query(

      "INSERT INTO favorites (user_id, product_id) VALUES (?, ?)",

      [user_id, product_id]
    );


    res.json({
      success: true,
      message: "Added to favorites",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Add favorite error",
      error: error.message,
    });
  }
};



// ==============================
// REMOVE FAVORITE
// ==============================

exports.removeFavorite = async (
  req,
  res
) => {

  try {

    const user_id =
      req.user.user_id;

    const { product_id } =
      req.body;


    await db.query(

      "DELETE FROM favorites WHERE user_id=? AND product_id=?",

      [user_id, product_id]
    );


    res.json({
      success: true,
      message: "Removed from favorites",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Remove favorite error",
      error: error.message,
    });
  }
};



// ==============================
// GET ALL FAVORITES
// ==============================

exports.getFavorites = async (
  req,
  res
) => {

  try {

    const user_id =
      req.user.user_id;

    const [favorites] =
      await db.query(

        `
        SELECT
        favorites.id AS favorite_id,
        favorites.product_id,
        products.*
        FROM favorites
        INNER JOIN products
        ON favorites.product_id = products.product_id
        WHERE favorites.user_id=?
        ORDER BY favorites.id DESC
        `,

        [user_id]
      );

    res.json({
      success: true,
      total: favorites.length,
      favorites,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Get favorites error",
      error: error.message,
    });
  }
};



// ==============================
// CHECK FAVORITE
// ==============================

exports.checkFavorite = async (
  req,
  res
) => {

  try {

    const user_id =
      req.user.user_id;

    const product_id =
      req.params.product_id;


    const [favorite] =
      await db.query(

        "SELECT * FROM favorites WHERE user_id=? AND product_id=?",

        [user_id, product_id]
      );


    res.json({
      success: true,
      isFavorite:
      favorite.length > 0,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Check favorite error",
      error: error.message,
    });
  }
};