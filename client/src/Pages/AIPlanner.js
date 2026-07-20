import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../styles/AIPlanner.css";

const API_URL = process.env.REACT_APP_API_URL;

const AIPlanner = () => {

  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [goal, setGoal] = useState(0);

  const [plan, setPlan] = useState("");

  const user =
    JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {

    try {

      const incomeRes = await axios.get(
        `${API_URL}/api/income/${user._id}`
      );

      const expenseRes = await axios.get(
        `${API_URL}/api/expense/${user._id}`
      );

      const goalRes = await axios.get(
        `${API_URL}/api/goal/${user._id}`
      );

      const totalIncome =
        incomeRes.data.reduce(
          (total, item) =>
            total + Number(item.amount),
          0
        );

      const totalExpense =
        expenseRes.data.reduce(
          (total, item) =>
            total + Number(item.amount),
          0
        );

      setIncome(totalIncome);
      setExpense(totalExpense);
      setGoal(goalRes.data.targetAmount);

    } catch (error) {
      console.log(error);
    }
  };

  const generatePlan = () => {

    const remaining =
      income - expense;

    let suggestion = "";

    if (remaining <= 0) {
      suggestion =
        "⚠️ You are spending more than your income.";
    }

    else if (remaining >= goal) {
      suggestion =
        `✅ You can achieve your savings goal of ₹${goal} this month.`;
    }

    else {
      suggestion =
        `📉 Reduce expenses by ₹${goal - remaining} to achieve your goal.`;
    }

    setPlan(
      `
Income: ₹${income}

Expense: ₹${expense}

Remaining Budget: ₹${remaining}

Recommended Savings: ₹${Math.round(
        remaining * 0.5
      )}

${suggestion}
      `
    );
  };

  return (
    <div className="dashboard-layout">

      <Sidebar />

      <div className="dashboard-content">

        <h1>AI Budget Planner</h1>

        <div className="planner-card">

          <h3>Total Income</h3>
          <p>₹{income}</p>

          <h3>Total Expense</h3>
          <p>₹{expense}</p>

          <h3>Savings Goal</h3>
          <p>₹{goal}</p>

          <button
            onClick={generatePlan}
          >
            Generate Plan
          </button>

        </div>

        {plan && (

          <div className="ai-result">

            <h2>Personalized Plan</h2>

            <pre>{plan}</pre>

          </div>

        )}

      </div>

    </div>
  );
};

export default AIPlanner;