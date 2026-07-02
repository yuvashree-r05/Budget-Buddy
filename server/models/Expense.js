const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  category: String,

  amount: Number,

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Expense", expenseSchema);