const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  category: String,
  amount: Number,
  description: String,
  date: { type: Date, default: Date.now },      // when the expense happened — drives month bucketing
  createdAt: { type: Date, default: Date.now }  // when the record was created — audit trail only
});

module.exports = mongoose.model("Expense", expenseSchema);