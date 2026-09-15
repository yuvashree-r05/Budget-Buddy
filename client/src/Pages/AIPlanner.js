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
  const [aiLoading, setAiLoading] = useState(false);

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

  const generatePlan = async () => {

    setAiLoading(true);
    setPlan("");

    try {

      const categoryTotals = {};

      const expenseRes = await axios.get(
        `${API_URL}/api/expense/${user._id}`
      );

      (expenseRes.data || []).forEach((item) => {

        const category =
          item.category || "Others";

        categoryTotals[category] =
          (categoryTotals[category] || 0) +
          Number(item.amount);

      });

      const response = await axios.post(
        `${API_URL}/api/ai/suggestions`,
        {
          totalIncome: income,
          totalExpense: expense,
          goalAmount: goal,
          categoryTotals
        }
      );

      setPlan(response.data.suggestion);

    } catch (error) {

      console.log("AI Plan Error", error);
      setPlan("Couldn't generate a plan right now.");

    } finally {

      setAiLoading(false);

    }
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
            disabled={aiLoading}
          >
            {aiLoading ? "Generating..." : "Generate Plan"}
          </button>

        </div>

        {plan && (

          <div className="ai-result">

            <h2>Personalized Plan</h2>

            <p>{plan}</p>

          </div>

        )}

      </div>

    </div>
  );
};

export default AIPlanner;