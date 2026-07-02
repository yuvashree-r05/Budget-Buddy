require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const incomeRoutes = require("./routes/income");
const expenseRoutes = require("./routes/expense");
const goalRoutes = require("./routes/goal");


const app = express();

/* ================= MIDDLEWARE ================= */

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/income", incomeRoutes);
app.use("/api/expense", expenseRoutes);
app.use("/api/goal", goalRoutes);

/* ================= DATABASE ================= */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully");
  })
  .catch((err) => {
    console.error("MongoDB Connection Failed");
    console.error(err);
  });

/* ================= TEST ROUTE ================= */

app.get("/", (req, res) => {
  res.send("BudgetBuddy Backend Running");
});

/* ================= ERROR HANDLER ================= */

app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).send("SOMETHING BROKE");
});

/* ================= SERVER ================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `BudgetBuddy running on backend successfully ${PORT}!`
  );
});