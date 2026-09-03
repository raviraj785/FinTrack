const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const budgetRoutes = require("./routes/budgetRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully ✅");
  })
  .catch((error) => {
    console.error("MongoDB Connection Failed ❌");
    console.error(error.message);
  });

// Auth Routes
app.use("/api/auth", authRoutes);

// Transaction Routes
app.use("/api/transactions", transactionRoutes);

// Budget Routes
app.use("/api/budgets", budgetRoutes);

// Test Route
app.get("/", (req, res) => {
  res.json({
    message: "FinTrack Backend is running successfully 🚀",
  });
});

// Local Development Server
if (require.main === module) {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Export app for Vercel
module.exports = app;