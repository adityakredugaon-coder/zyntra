const express = require("express");

const router = express.Router();

const {
  addProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/ProductController");

// ADD PRODUCT
router.post("/add", addProduct);

// GET ALL PRODUCTS
router.get("/all", getAllProducts);

// GET SINGLE PRODUCT
router.get("/:id", getSingleProduct);

// UPDATE PRODUCT
router.put("/update/:id", updateProduct);

// DELETE PRODUCT
router.delete("/delete/:id", deleteProduct);

module.exports = router;