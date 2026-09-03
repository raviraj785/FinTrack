const Budget = require("../models/Budget");

// GET ALL BUDGETS
const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json(budgets);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// ADD BUDGET
const addBudget = async (req, res) => {
  try {
    const { category, limit } = req.body;

    if (!category || !limit) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    if (Number(limit) <= 0) {
      return res.status(400).json({
        message: "Budget limit must be greater than 0",
      });
    }

    const budget = await Budget.create({
      user: req.user.id,
      category,
      limit: Number(limit),
    });

    res.status(201).json({
      message: "Budget added successfully",
      budget,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// UPDATE BUDGET
const updateBudget = async (req, res) => {
  try {
    const budget = await Budget.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!budget) {
      return res.status(404).json({
        message: "Budget not found",
      });
    }

    const { category, limit } = req.body;

    if (!category || !limit) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    if (Number(limit) <= 0) {
      return res.status(400).json({
        message: "Budget limit must be greater than 0",
      });
    }

    budget.category = category;
    budget.limit = Number(limit);

    await budget.save();

    res.status(200).json({
      message: "Budget updated successfully",
      budget,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// DELETE BUDGET
const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!budget) {
      return res.status(404).json({
        message: "Budget not found",
      });
    }

    await budget.deleteOne();

    res.status(200).json({
      message: "Budget deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


module.exports = {
  getBudgets,
  addBudget,
  updateBudget,
  deleteBudget,
};