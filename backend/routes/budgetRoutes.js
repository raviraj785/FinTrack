const express = require("express");

const {
  getBudgets,
  addBudget,
  updateBudget,
  deleteBudget,
} = require("../controllers/budgetController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Get all budgets
router.get("/", protect, getBudgets);

// Add budget
router.post("/", protect, addBudget);

// Update budget
router.put("/:id", protect, updateBudget);

// Delete budget
router.delete("/:id", protect, deleteBudget);

module.exports = router;