const db = require("../config/db");

// ===========================================
// PLACE ORDER
// ===========================================

exports.placeOrder = async (req, res) => {

  try {

    const user_id = req.user.user_id;

    const {
      product_id,
      address_id,
      total_price,
      payment_method,
    } = req.body;

    // ================= VALIDATION =================

    if (
      !product_id ||
      !address_id ||
      !total_price ||
      !payment_method
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields required",
      });
    }

    // ================= CHECK PRODUCT =================

    const [product] = await db.query(
      `
      SELECT * FROM products
      WHERE product_id = ?
      `,
      [product_id]
    );

    if (product.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // ================= CHECK ADDRESS =================

    const [address] = await db.query(
      `
      SELECT * FROM addresses
      WHERE id = ?
      AND user_id = ?
      `,
      [address_id, user_id]
    );

    if (address.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    // ================= INSERT ORDER =================

    const sql = `
      INSERT INTO orders
      (
        user_id,
        product_id,
        address_id,
        total_price,
        payment_method
      )
      VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(
      sql,
      [
        user_id,
        product_id,
        address_id,
        total_price,
        payment_method,
      ]
    );

    res.status(201).json({

      success: true,

      message: "Order Placed Successfully",

      orderId: result.insertId,
    });

  } catch (error) {

    console.log(
      "PLACE ORDER ERROR:",
      error
    );

    res.status(500).json({

      success: false,

      message: error.message,
    });
  }
};

// ===========================================
// GET CURRENT USER ORDERS
// ===========================================

exports.getOrdersByUser = async (req, res) => {

  try {

    const user_id =
      req.user.user_id;

    const sql = `

      SELECT

        orders.id,
        orders.total_price,
        orders.payment_method,
        orders.status,
        orders.created_at,

        products.product_id AS product_id,
        products.name AS product_name,
        products.image AS product_image,
        products.price,
        products.discount_price,

        addresses.fullName,
        addresses.mobile,
        addresses.city,
        addresses.state,
        addresses.pincode,
        addresses.houseNo,
        addresses.area

      FROM orders

      JOIN products
      ON orders.product_id = products.product_id

      JOIN addresses
      ON orders.address_id = addresses.id

      WHERE orders.user_id = ?

      ORDER BY orders.id DESC
    `;

    const [orders] =
      await db.query(
        sql,
        [user_id]
      );

    res.status(200).json({

      success: true,

      data: orders,
    });

  } catch (error) {

    console.log(
      "GET ORDER ERROR:",
      error
    );

    res.status(500).json({

      success: false,

      message: error.message,
    });
  }
};