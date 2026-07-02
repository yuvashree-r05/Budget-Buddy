const mongoose = require("mongoose");

const incomeSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  source: String,

  amount: Number,

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Income", incomeSchema);