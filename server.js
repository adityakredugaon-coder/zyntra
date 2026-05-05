const express = require("express");
require("dotenv").config();

const app = express();

app.use(express.json());

// routes
app.use("/api/auth", require("./Routes/AuthRoutes"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Zyntra API running on port ${PORT}`);
});