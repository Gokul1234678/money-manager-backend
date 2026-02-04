const express = require("express");
const router = express.Router();

const {
  addTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
} = require("../controllers/transactionController");

router.post("/", addTransaction);          // Add income / expense
router.get("/", getTransactions);           // Get all + filters
router.put("/:id", updateTransaction);      // Edit (12-hour rule)
router.delete("/:id", deleteTransaction);   // Optional

module.exports = router;
