const express = require("express");
const router = express.Router();
const {
  setBudget,
  getMonthlySummary,
  computeLifetimeSavings
} = require("../controller/budgetController");

router.post("/", setBudget);
router.get("/summary/:userId", getMonthlySummary);

router.get("/lifetime-savings/:userId", async (req, res) => {
  try {
    const result = await computeLifetimeSavings(req.params.userId);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;