const db = require("../config/db");

const jwt = require("jsonwebtoken");


// ================= ADD TO CART =================

exports.addToCart = async (req, res) => {

  try {

    const token =
      req.headers.authorization?.split(" ")[1];

    if (!token) {

      return res.status(401).json({
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
        message: "Product id required",
      });
    }

    // FIXED HERE
    const [product] = await db.query(

      "SELECT * FROM products WHERE id=?",

      [product_id]
    );

    if (product.length === 0) {

      return res.status(404).json({
        message: "Product not found",
      });
    }

    const [existing] = await db.query(

      "SELECT * FROM cart WHERE user_id=? AND product_id=?",

      [decoded.id, product_id]
    );

    if (existing.length > 0) {

      await db.query(

        "UPDATE cart SET quantity = quantity + ? WHERE user_id=? AND product_id=?",

        [
          quantity || 1,
          decoded.id,
          product_id,
        ]
      );

      return res.json({
        success: true,
        message: "Cart updated",
      });
    }

    await db.query(

      "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)",

      [
        decoded.id,
        product_id,
        quantity || 1,
      ]
    );

    res.json({
      success: true,
      message: "Product added to cart",
    });

  } catch (err) {

    console.log(err);

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

    const [totalItems] = await db.query(

      `SELECT COUNT(*) AS total_cart_items
       FROM cart
       WHERE user_id=?`,

      [decoded.id]
    );

    const [totalQuantity] = await db.query(

      `SELECT SUM(quantity) AS total_quantity
       FROM cart
       WHERE user_id=?`,

      [decoded.id]
    );

    res.json({

      success: true,

      message: "Cart fetched",

      totalCartItems:
          totalItems[0].total_cart_items || 0,

      totalQuantity:
          totalQuantity[0].total_quantity || 0,

      cart,
    });

  } catch (err) {

    console.log(err);

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
        message: "Cart id and quantity required",
      });
    }

    await db.query(

      "UPDATE cart SET quantity=? WHERE id=?",

      [quantity, cart_id]
    );

    res.json({
      success: true,
      message: "Quantity updated",
    });

  } catch (err) {

    console.log(err);

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
        message: "Cart id required",
      });
    }

    await db.query(

      "DELETE FROM cart WHERE id=?",

      [cart_id]
    );

    res.json({
      success: true,
      message: "Item removed",
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      message: "Remove item error",
    });
  }
};l̥