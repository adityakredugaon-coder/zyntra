const db = require("../config/db");

// ================= ADD PRODUCT =================
exports.addProduct = async (req, res) => {
  try {

    const { name, description, price, category, image } = req.body;

    if (!name || price == null || price <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid name and price are required",
      });
    }

    const [result] = await db.query(
      `INSERT INTO products
      (name, description, price, category, image)
      VALUES (?, ?, ?, ?, ?)`,
      [name, description, price, category, image]
    );

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      productId: result.insertId,
    });

  } catch (err) {

    console.error("Add Product Error:", err);

    res.status(500).json({
      success: false,
      message: "Add product error",
    });
  }
};

// ================= GET ALL PRODUCTS =================
exports.getAllProducts = async (req, res) => {
  try {

    const [products] = await db.query(
      "SELECT * FROM products ORDER BY id DESC"
    );

    res.status(200).json({
      success: true,
      total: products.length,
      products,
    });

  } catch (err) {

    console.error("Fetch Products Error:", err);

    res.status(500).json({
      success: false,
      message: "Fetch products error",
    });
  }
};

// ================= GET SINGLE PRODUCT =================
exports.getSingleProduct = async (req, res) => {
  try {

    const { id } = req.params;

    const [products] = await db.query(
      "SELECT * FROM products WHERE id=?",
      [id]
    );

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product: products[0],
    });

  } catch (err) {

    console.error("Single Product Error:", err);

    res.status(500).json({
      success: false,
      message: "Single product error",
    });
  }
};

// ================= UPDATE PRODUCT =================
exports.updateProduct = async (req, res) => {
  try {

    const { id } = req.params;

    const { name, description, price, category, image } = req.body;

    const [result] = await db.query(
      `UPDATE products
       SET name=?, description=?, price=?, category=?, image=?
       WHERE id=?`,
      [name, description, price, category, image, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
    });

  } catch (err) {

    console.error("Update Product Error:", err);

    res.status(500).json({
      success: false,
      message: "Update product error",
    });
  }
};

// ================= DELETE PRODUCT =================
exports.deleteProduct = async (req, res) => {
  try {

    const { id } = req.params;

    const [result] = await db.query(
      "DELETE FROM products WHERE id=?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });

  } catch (err) {

    console.error("Delete Product Error:", err);

    res.status(500).json({
      success: false,
      message: "Delete product error",
    });
  }
};