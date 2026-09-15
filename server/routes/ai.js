const express = require("express");
const router = express.Router();
const { getSuggestions } = require("../controller/aiController");

router.post("/suggestions", getSuggestions);

module.exports = router;