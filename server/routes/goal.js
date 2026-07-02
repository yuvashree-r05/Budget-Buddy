const express = require("express");
const Goal = require("../models/Goal");

const router = express.Router();

/* ================= SAVE GOAL ================= */

router.post("/save", async (req, res) => {

  try {

    const { userId, targetAmount } = req.body;

    const existingGoal = await Goal.findOne({ userId });

    if (existingGoal) {

      existingGoal.targetAmount = targetAmount;

      await existingGoal.save();

      return res.status(200).json({
        message: "Goal Updated Successfully",
        goal: existingGoal
      });

    }

    const goal = new Goal({
      userId,
      targetAmount
    });

    await goal.save();

    res.status(201).json({
      message: "Goal Saved Successfully",
      goal
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message
    });

  }

});


/* ================= GET GOAL ================= */

router.get("/:userId", async (req, res) => {

  try {

    const goal = await Goal.findOne({
      userId: req.params.userId
    });

    res.status(200).json(goal);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});


/* ================= UPDATE GOAL ================= */

router.put("/update/:id", async (req, res) => {

  try {

    const goal = await Goal.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!goal) {

      return res.status(404).json({
        message: "Goal not found"
      });

    }

    res.status(200).json({
      message: "Goal Updated Successfully",
      goal
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message
    });

  }

});


module.exports = router;