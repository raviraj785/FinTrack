const Transaction = require("../models/Transaction");

// GET ALL TRANSACTIONS
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json(transactions);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// ADD TRANSACTION
const addTransaction = async (req, res) => {
  try {
    const {
      title,
      category,
      amount,
      type,
      date,
      description,
    } = req.body;

    if (
      !title ||
      !category ||
      !amount ||
      !type ||
      !date
    ) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    const transaction = await Transaction.create({
      user: req.user.id,
      title,
      category,
      amount,
      type,
      date,
      description,
    });

    res.status(201).json({
      message: "Transaction added successfully",
      transaction,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// UPDATE TRANSACTION
const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    const {
      title,
      category,
      amount,
      type,
      date,
      description,
    } = req.body;

    transaction.title = title;
    transaction.category = category;
    transaction.amount = amount;
    transaction.type = type;
    transaction.date = date;
    transaction.description = description;

    await transaction.save();

    res.status(200).json({
      message: "Transaction updated successfully",
      transaction,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// DELETE TRANSACTION
const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    await transaction.deleteOne();

    res.status(200).json({
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
};