const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

const express = require("express");
require("dotenv").config();

const app = express();

app.use(express.json());

// Routes
const authRoutes = require("./Routes/AuthRoutes");


app.use("/api/auth", authRoutes);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Zyntra API running on port ${PORT}`);
});