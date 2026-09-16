const Budget = require("../models/Budget");
const Expense = require("../models/Expense");
const Income = require("../models/Income");
const Goal = require("../models/Goal");

const getMonthRange = (month) => {
  const [year, mon] = month.split("-").map(Number);
  const start = new Date(year, mon - 1, 1);
  const end = new Date(year, mon, 1);
  return { start, end };
};

const computeMonthlySummary = async (userId, month) => {
  const { start, end } = getMonthRange(month);

  const expenses = await Expense.find({ userId, date: { $gte: start, $lt: end } });
  const incomes = await Income.find({ userId, date: { $gte: start, $lt: end } });
  const goalDoc = await Goal.findOne({ userId });

  const spent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const income = incomes.reduce((sum, i) => sum + i.amount, 0);

  const categoryTotals = {};
  expenses.forEach(e => {
    const category = e.category || "Others";
    categoryTotals[category] = (categoryTotals[category] || 0) + e.amount;
  });

  const budgetDoc = await Budget.findOne({ userId, month });
  const totalBudget = budgetDoc?.totalBudget || 0;

  return {
    month,
    totalBudget,
    income,
    spent,
    left: totalBudget - spent,
    netSavings: income - spent,
    savingsGoal: goalDoc?.targetAmount || 0,
    categoryTotals
  };
};

const computeLifetimeSavings = async (userId) => {
  const expenses = await Expense.find({ userId });
  const incomes = await Income.find({ userId });

  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);

  return { totalIncome, totalExpense, savedAmount: totalIncome - totalExpense };
};

const setBudget = async (req, res) => {
  try {
    const { userId, month, totalBudget, categoryLimits } = req.body;
    if (!userId || !month || totalBudget === undefined) {
      return res.status(400).json({ message: "userId, month and totalBudget are required" });
    }

    const budget = await Budget.findOneAndUpdate(
      { userId, month },
      { totalBudget, categoryLimits },
      { new: true, upsert: true }
    );

    res.status(200).json(budget);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getMonthlySummary = async (req, res) => {
  try {
    const { userId } = req.params;
    const month = req.query.month || new Date().toISOString().slice(0, 7);
    const summary = await computeMonthlySummary(userId, month);
    res.status(200).json(summary);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  setBudget,
  getMonthlySummary,
  computeMonthlySummary,
  computeLifetimeSavings
};