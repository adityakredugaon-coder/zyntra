const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

const express = require("express");
require("dotenv").config();

const app = express();

app.use(express.json());

// Routes
const authRoutes = require("./routes/AuthRoutes");
const productRoutes = require("./routes/productRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Zyntra API running on port ${PORT}`);
});