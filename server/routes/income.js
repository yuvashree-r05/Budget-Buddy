const express = require("express");
const Income = require("../models/Income");

const router = express.Router();

/* ADD INCOME */

router.post("/add", async (req, res) => {

  console.log("========== INCOME REQUEST ==========");
  console.log(req.body);

  try {

    const { userId, source, amount, date } = req.body;

    const income = new Income({
      userId,
      source,
      amount,
      date: date || Date.now()
    });

    await income.save();

    console.log("Income Saved");

    res.status(201).json({
      message: "Income Added Successfully"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message
    });

  }
});
/* GET ALL INCOME */

router.get("/:userId", async (req, res) => {

  try {

    const incomes = await Income.find({
      userId: req.params.userId
    });

    res.status(200).json(incomes);

  } catch (error) {

    res.status(500).json({
      message: "Server Error"
    });
  }
});

// UPDATE

router.put("/update/:id", async (req, res) => {

  try {

    console.log("Update ID:", req.params.id);
    console.log("Update Body:", req.body);

    const income = await Income.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!income) {
      return res.status(404).json({
        message: "Income not found"
      });
    }

    console.log("Updated Income:", income);

    res.json({
      message: "Income Updated Successfully",
      income
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message
    });

  }

});

// DELETE

router.delete("/delete/:id", async (req, res) => {

  await Income.findByIdAndDelete(
    req.params.id
  );

  res.json({
    message: "Income Deleted Successfully"
  });

});

router.get("/debug/:userId", async (req, res) => {
  const incomes = await Income.find({ userId: req.params.userId }).lean();
  res.json(incomes);
});

module.exports = router;