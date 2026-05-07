const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

const express = require("express");
require("dotenv").config();

const app = express();

app.use(express.json());
const productRoutes = require("./routes/ProductRoutes");

// routes
app.use("/api/auth", require("./Routes/AuthRoutes"));
app.use("/api/products", productRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Zyntra API running on port ${PORT}`);
});