const Transaction = require("../models/Transaction");

// ✅ Add Income / Expense --- POST localhost:5000/api/transactions
exports.addTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.create(req.body);
    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ Get Transactions (with filters)  --- GET localhost:5000/api/transactions
exports.getTransactions = async (req, res) => {
  try {
    const { type, category, division, startDate, endDate } = req.query;

    let filter = {};

    if (type) filter.type = type;
    if (category) filter.category = category;
    if (division) filter.division = division;

    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const transactions = await Transaction.find(filter).sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update Transaction (12-hour rule) --- PUT localhost:5000/api/transactions/:id
exports.updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    const hoursPassed =
      (Date.now() - new Date(transaction.createdAt)) / (1000 * 60 * 60);

    if (hoursPassed > 12) {
      return res
        .status(403)
        .json({ message: "Edit not allowed after 12 hours" });
    }

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedTransaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ Delete Transaction (Optional)
exports.deleteTransaction = async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
