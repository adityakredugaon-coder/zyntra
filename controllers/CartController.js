const db = require("../config/db");



// ======================================
// ADD TO CART
// ======================================

exports.addToCart = async (req, res) => {

  try {

    // USER ID FROM TOKEN
    const userId = req.user.user_id;

    console.log("DECODED USER :", req.user);

    console.log("USER ID :", userId);


    const {
      product_id,
      quantity,
    } = req.body;


    // VALIDATION
    if (!product_id || !quantity) {

      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });

    }


    // CHECK USER ID
    if (!userId) {

      return res.status(401).json({
        success: false,
        message: "User ID missing in token",
      });

    }


    // CHECK PRODUCT EXISTS
    const [product] = await db.query(
      "SELECT * FROM products WHERE product_id = ?",
      [product_id]
    );

    if (product.length === 0) {

      return res.status(404).json({
        success: false,
        message: "Product not found",
      });

    }


    // CHECK PRODUCT ALREADY EXISTS
    const [existing] = await db.query(
      "SELECT * FROM cart WHERE user_id = ? AND product_id = ?",
      [userId, product_id]
    );


    // UPDATE QUANTITY
    if (existing.length > 0) {

      await db.query(
        "UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?",
        [quantity, userId, product_id]
      );

      return res.status(200).json({
        success: true,
        message: "Cart updated successfully",
      });

    }


    // INSERT PRODUCT
    await db.query(
      "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)",
      [userId, product_id, quantity]
    );


    return res.status(201).json({
      success: true,
      message: "Product added to cart",
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Add to cart error",
      error: error.message,
    });

  }

};




// ======================================
// GET CART
// ======================================

exports.getCart = async (req, res) => {

  try {

    const userId = req.user.user_id;


    const [cart] = await db.query(

      `SELECT 
        cart.id,
        cart.user_id,
        cart.product_id,
        cart.quantity,

        products.name,
        products.description,
        products.short_description,
        products.price,
        products.discount_price,
        products.category,
        products.sub_category,
        products.image

      FROM cart

      JOIN products
      ON cart.product_id = products.product_id

      WHERE cart.user_id = ?

      ORDER BY cart.id DESC`,

      [userId]

    );


    return res.status(200).json({

      success: true,

      totalItems: cart.length,

      cart,

    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Get cart error",
      error: error.message,
    });

  }

};




// ======================================
// REMOVE CART ITEM
// ======================================

exports.removeCartItem = async (req, res) => {

  try {

    const userId = req.user.user_id;

    const cartId = req.params.id;


    // CHECK ITEM EXISTS
    const [item] = await db.query(
      "SELECT * FROM cart WHERE id = ? AND user_id = ?",
      [cartId, userId]
    );


    if (item.length === 0) {

      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });

    }


    // DELETE ITEM
    await db.query(
      "DELETE FROM cart WHERE id = ? AND user_id = ?",
      [cartId, userId]
    );


    return res.status(200).json({
      success: true,
      message: "Item removed from cart",
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Remove cart item error",
      error: error.message,
    });

  }

};




// ======================================
// UPDATE QUANTITY
// ======================================

exports.updateQuantity = async (req, res) => {

  try {

    const userId = req.user.user_id;

    const cartId = req.params.id;

    const { quantity } = req.body;


    // VALIDATION
    if (!quantity || quantity <= 0) {

      return res.status(400).json({
        success: false,
        message: "Valid quantity required",
      });

    }


    // CHECK ITEM EXISTS
    const [item] = await db.query(
      "SELECT * FROM cart WHERE id = ? AND user_id = ?",
      [cartId, userId]
    );


    if (item.length === 0) {

      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });

    }


    // UPDATE QUANTITY
    await db.query(
      "UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?",
      [quantity, cartId, userId]
    );


    return res.status(200).json({
      success: true,
      message: "Quantity updated successfully",
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Update quantity error",
      error: error.message,
    });

  }

};