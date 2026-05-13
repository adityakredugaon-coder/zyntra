const db = require("../config/db");

// ================= ADD TO CART =================
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user?.user_id;

    console.log("BODY:", req.body);

    const product_id = Number(req.body.product_id);
    const quantity = Number(req.body.quantity || 1);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not found in token",
      });
    }

    if (!product_id || isNaN(product_id)) {
      return res.status(400).json({
        success: false,
        message: "product_id required",
      });
    }

    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "quantity required",
      });
    }

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

    const [existing] = await db.query(
      "SELECT * FROM cart WHERE user_id = ? AND product_id = ?",
      [userId, product_id]
    );

    if (existing.length > 0) {
      await db.query(
        "UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?",
        [quantity, userId, product_id]
      );

      return res.json({
        success: true,
        message: "Cart updated",
      });
    }

    await db.query(
      "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)",
      [userId, product_id, quantity]
    );

    return res.status(201).json({
      success: true,
      message: "Added to cart",
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ================= GET CART =================
exports.getCart = async (req, res) => {
  try {
    const userId = req.user?.user_id;

    const [cart] = await db.query(
      `SELECT 
        cart.id,
        cart.product_id,
        cart.quantity,
        products.name,
        products.description,
        products.price,
        products.image
      FROM cart
      JOIN products ON cart.product_id = products.product_id
      WHERE cart.user_id = ?
      ORDER BY cart.id DESC`,
      [userId]
    );

    return res.json({
      success: true,
      totalItems: cart.length,
      data: cart,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ================= REMOVE CART =================
exports.removeCartItem = async (req, res) => {
  try {
    const userId = req.user?.user_id;
    const cartId = req.params.id;

    await db.query(
      "DELETE FROM cart WHERE id = ? AND user_id = ?",
      [cartId, userId]
    );

    return res.json({
      success: true,
      message: "Removed from cart",
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ================= UPDATE QTY =================
exports.updateQuantity = async (req, res) => {
  try {
    const userId = req.user?.user_id;
    const cartId = req.params.id;
    const quantity = Number(req.body.quantity);

    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid quantity",
      });
    }

    await db.query(
      "UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?",
      [quantity, cartId, userId]
    );

    return res.json({
      success: true,
      message: "Updated",
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};