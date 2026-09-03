const express = require("express");

const {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
} = require("../controllers/transactionController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Get all transactions
router.get("/", protect, getTransactions);

// Add transaction
router.post("/", protect, addTransaction);

// Update transaction
router.put("/:id", protect, updateTransaction);

// Delete transaction
router.delete("/:id", protect, deleteTransaction);

module.exports = router;