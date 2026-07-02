const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

/* ================= SIGNUP ================= */

router.post("/signup", async (req, res) => {

try {


const { name, email, password } = req.body;

const existingUser =
  await User.findOne({
    email: email.toLowerCase()
  });

if (existingUser) {
  return res.status(400).json({
    message: "User already exists"
  });
}

const hashedPassword =
  await bcrypt.hash(password, 10);

const user = new User({
  name,
  email: email.toLowerCase(),
  password: hashedPassword
});

await user.save();

res.status(201).json({
  message: "Signup Successful"
});


} catch (error) {


console.error(error);

res.status(500).json({
  message: "Server Error"
});


}

});

/* ================= LOGIN ================= */

router.post("/login", async (req, res) => {

try {


const { email, password } = req.body;

const user = await User.findOne({
  email: email.toLowerCase()
});

if (!user) {
  return res.status(400).json({
    message: "Please complete signup first"
  });
}

const isMatch =
  await bcrypt.compare(
    password,
    user.password
  );

if (!isMatch) {
  return res.status(400).json({
    message: "Invalid Password"
  });
}

res.status(200).json({

  message: "Login Successful",

  user: {
    _id: user._id,
    name: user.name,
    email: user.email
  }

});


} catch (error) {


console.error(error);

res.status(500).json({
  message: "Server Error"
});


}

});

module.exports = router;
