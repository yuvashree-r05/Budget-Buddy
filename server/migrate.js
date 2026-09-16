require("dotenv").config();
const mongoose = require("mongoose");
const Expense = require("./models/Expense");
const Income = require("./models/Income");

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const expensesToFix = await Expense.find({ date: { $exists: false } });
  for (const exp of expensesToFix) {
    exp.date = exp.createdAt;
    await exp.save();
  }

  const incomesToFix = await Income.find({ date: { $exists: false } });
  for (const inc of incomesToFix) {
    inc.date = inc.createdAt;
    await inc.save();
  }

  console.log(`Backfilled ${expensesToFix.length} expenses, ${incomesToFix.length} incomes`);
  process.exit();
};

run();