const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  month: { type: String, required: true }, // "2026-09"
  totalBudget: { type: Number, required: true },
  categoryLimits: { type: Map, of: Number, default: {} }
}, { timestamps: true });

budgetSchema.index({ userId: 1, month: 1 }, { unique: true });

module.exports = mongoose.model("Budget", budgetSchema);