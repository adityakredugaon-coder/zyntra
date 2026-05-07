const db = require("../config/db");

// ================= ADD PRODUCT =================
exports.addProduct = async (req, res) => {
  try {
    const { name, description, price, category, image } = req.body;

    if (!name || !price) {
      return res.status(400).json({
        message: "Name and price are required",
      });
    }

    const [result] = await db.query(
      `INSERT INTO products 
      (name, description, price, category, image)
      VALUES (?, ?, ?, ?, ?)`,
      [name, description, price, category, image]
    );

    res.status(201).json({
      message: "Product added successfully",
      productId: result.insertId,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
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

    res.json(products);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Fetch products error",
    });
  }
};

// ================= GET SINGLE PRODUCT =================
exports.getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const [products] = await db.query(
      "SELECT * FROM products WHERE id = ?",
      [id]
    );

    if (products.length === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(products[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Single product error",
    });
  }
};

// ================= UPDATE PRODUCT =================
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, description, price, category, image } = req.body;

    await db.query(
      `UPDATE products 
       SET name=?, description=?, price=?, category=?, image=?
       WHERE id=?`,
      [name, description, price, category, image, id]
    );

    res.json({
      message: "Product updated successfully",
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Update product error",
    });
  }
};

// ================= DELETE PRODUCT =================
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      "DELETE FROM products WHERE id=?",
      [id]
    );

    res.json({
      message: "Product deleted successfully",
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Delete product error",
    });
  }
};