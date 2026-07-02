const express = require("express");
const Expense = require("../models/Expense");

const router = express.Router();

/* ADD EXPENSE */

router.post("/add", async (req, res) => {

  try {

    const {
      userId,
      category,
      amount
    } = req.body;

    const expense = new Expense({
      userId,
      category,
      amount
    });

    await expense.save();

    res.status(201).json({
      message: "Expense Added Successfully",
      expense
    });

  } catch (error) {

    res.status(500).json({
      message: "Server Error"
    });
  }
});

/* GET EXPENSES */

router.get("/:userId", async (req, res) => {

  try {

    const expenses = await Expense.find({
      userId: req.params.userId
    });

    res.status(200).json(expenses);

  } catch (error) {

    res.status(500).json({
      message: "Server Error"
    });
  }
});

/* UPDATE AND DELETE */

router.put("/update/:id", async (req, res) => {

    const expense = await Expense.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    res.json({
        message: "Expense Updated",
        expense
    });

});

router.delete("/delete/:id", async (req, res) => {

    await Expense.findByIdAndDelete(req.params.id);

    res.json({
        message: "Expense Deleted"
    });

});

module.exports = router;