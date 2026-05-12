const db = require("../config/db");

const jwt = require("jsonwebtoken");


// ================= ADD TO CART =================

exports.addToCart = async (req, res) => {

  try {

    const token =
      req.headers.authorization?.split(" ")[1];

    if (!token) {

      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const { product_id, quantity } = req.body;

    if (!product_id) {

      return res.status(400).json({
        success: false,
        message: "Product id required",
      });
    }

    // CHECK PRODUCT
    const [product] = await db.query(

      "SELECT * FROM products WHERE id=?",

      [product_id]
    );

    if (product.length === 0) {

      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // CHECK EXISTING CART
    const [existing] = await db.query(

      "SELECT * FROM cart WHERE user_id=? AND product_id=?",

      [decoded.id, product_id]
    );

    // UPDATE QUANTITY
    if (existing.length > 0) {

      await db.query(

        "UPDATE cart SET quantity = quantity + ? WHERE user_id=? AND product_id=?",

        [
          quantity || 1,
          decoded.id,
          product_id,
        ]
      );

      return res.status(200).json({
        success: true,
        message: "Cart updated successfully",
      });
    }

    // INSERT NEW ITEM
    await db.query(

      "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)",

      [
        decoded.id,
        product_id,
        quantity || 1,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Product added to cart",
    });

  } catch (err) {

    console.log("ADD CART ERROR => ", err);

    res.status(500).json({
      success: false,
      message: "Add to cart error",
    });
  }
};


// ================= GET CART =================

exports.getCart = async (req, res) => {

  try {

    const token =
      req.headers.authorization?.split(" ")[1];

    if (!token) {

      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const [cart] = await db.query(

      `SELECT 
        cart.id,
        cart.quantity,

        products.id AS product_id,
        products.name,
        products.description,
        products.price,
        products.category,
        products.image

       FROM cart

       JOIN products

       ON cart.product_id = products.id

       WHERE cart.user_id=?`,

      [decoded.id]
    );

    // TOTAL DIFFERENT PRODUCTS
    const [totalItems] = await db.query(

      `SELECT COUNT(*) AS total_cart_items
       FROM cart
       WHERE user_id=?`,

      [decoded.id]
    );

    // TOTAL QUANTITY
    const [totalQuantity] = await db.query(

      `SELECT SUM(quantity) AS total_quantity
       FROM cart
       WHERE user_id=?`,

      [decoded.id]
    );

    res.status(200).json({

      success: true,

      message: "Cart fetched successfully",

      totalCartItems:
          totalItems[0].total_cart_items || 0,

      totalQuantity:
          totalQuantity[0].total_quantity || 0,

      cart,
    });

  } catch (err) {

    console.log("GET CART ERROR => ", err);

    res.status(500).json({
      success: false,
      message: "Get cart error",
    });
  }
};


// ================= UPDATE CART QUANTITY =================

exports.updateCartQuantity = async (req, res) => {

  try {

    const token =
      req.headers.authorization?.split(" ")[1];

    if (!token) {

      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const { cart_id, quantity } = req.body;

    if (!cart_id || !quantity) {

      return res.status(400).json({
        success: false,
        message: "Cart id and quantity required",
      });
    }

    await db.query(

      "UPDATE cart SET quantity=? WHERE id=?",

      [quantity, cart_id]
    );

    res.status(200).json({
      success: true,
      message: "Quantity updated successfully",
    });

  } catch (err) {

    console.log("UPDATE CART ERROR => ", err);

    res.status(500).json({
      success: false,
      message: "Update cart error",
    });
  }
};


// ================= REMOVE CART ITEM =================

exports.removeCartItem = async (req, res) => {

  try {

    const token =
      req.headers.authorization?.split(" ")[1];

    if (!token) {

      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const { cart_id } = req.body;

    if (!cart_id) {

      return res.status(400).json({
        success: false,
        message: "Cart id required",
      });
    }

    await db.query(

      "DELETE FROM cart WHERE id=?",

      [cart_id]
    );

    res.status(200).json({
      success: true,
      message: "Item removed successfully",
    });

  } catch (err) {

    console.log("REMOVE CART ERROR => ", err);

    res.status(500).json({
      success: false,
      message: "Remove item error",
    });
  }
};