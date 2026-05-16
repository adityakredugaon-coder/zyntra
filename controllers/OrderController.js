const db = require("../config/db");

// ================= PLACE ORDER =================

exports.placeOrder = (req, res) => {

  const {
    user_id,
    product_id,
    address_id,
    total_price,
    payment_method,
  } = req.body;

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

  db.query(
    sql,
    [
      user_id,
      product_id,
      address_id,
      total_price,
      payment_method,
    ],

    (err, result) => {

      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      res.json({
        success: true,
        message: "Order Placed Successfully",

        orderId: result.insertId,
      });
    }
  );
};

// ================= GET USER ORDERS =================

exports.getOrdersByUser = (req, res) => {

  const userId = req.params.userId;

  const sql = `
    SELECT

      orders.id,
      orders.total_price,
      orders.payment_method,
      orders.status,
      orders.created_at,

      products.name AS product_name,
      products.image AS product_image,
      products.price

    FROM orders

    JOIN products
    ON orders.product_id = products.id

    WHERE orders.user_id = ?

    ORDER BY orders.id DESC
  `;

  db.query(sql, [userId], (err, result) => {

    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    res.json({
      success: true,
      data: result,
    });
  });
};