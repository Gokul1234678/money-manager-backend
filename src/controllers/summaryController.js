const Transaction = require("../models/Transaction");

// Helper function to get date range
const getDateRange = (range) => {
  const now = new Date();
  let startDate;

  if (range === "weekly") {
    startDate = new Date();
    startDate.setDate(now.getDate() - 7);
  } else if (range === "monthly") {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  } else if (range === "yearly") {
    startDate = new Date(now.getFullYear(), 0, 1);
  }

  return { startDate, endDate: now };
};

// ✅ Summary API
exports.getSummary = async (req, res) => {
  try {
    const { range, startDate, endDate } = req.query;

    let filter = {};

    // Custom date range
    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // Weekly / Monthly / Yearly
    if (range) {
      const dates = getDateRange(range);
      filter.date = {
        $gte: dates.startDate,
        $lte: dates.endDate,
      };
    }

    const transactions = await Transaction.find(filter);

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((txn) => {
      if (txn.type === "income") totalIncome += txn.amount;
      else totalExpense += txn.amount;
    });

    res.json({
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
