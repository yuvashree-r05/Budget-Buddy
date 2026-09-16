const express = require("express");
const router = express.Router();
const { askAI, getSuggestions } = require("../controller/aiController");

router.post("/ask", askAI);
router.post("/suggestions", getSuggestions);

module.exports = router;