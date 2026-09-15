import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";

import {
  FaMoneyBillWave,
  FaWallet,
  FaPiggyBank,
  FaChartPie
} from "react-icons/fa";

import "../styles/Dashboard.css";

const API_URL = process.env.REACT_APP_API_URL;

const Dashboard = () => {

  const user =
    JSON.parse(localStorage.getItem("user")) || {};

  const userName = user.name || "User";

  const [incomeData, setIncomeData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [goalAmount, setGoalAmount] = useState(0);

  const [aiSuggestion, setAiSuggestion] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {

    fetchIncome();
    fetchExpenses();
    fetchGoal();

  }, []);

  const fetchIncome = async () => {

    try {

      const response = await axios.get(
        `${API_URL}/api/income/${user._id}`
      );

      setIncomeData(response.data);

    } catch (error) {

      console.log("Income Fetch Error", error);

    }
  };

  const fetchExpenses = async () => {

    try {

      const response = await axios.get(
        `${API_URL}/api/expense/${user._id}`
      );

      setExpenseData(response.data);

    } catch (error) {

      console.log("Expense Fetch Error", error);

    }
  };

  const fetchGoal = async () => {

    try {

      const response = await axios.get(
        `${API_URL}/api/goal/${user._id}`
      );

      console.log("Goal Data:", response.data);

      if (response.data) {
        setGoalAmount(response.data.targetAmount || 0);
      }

    } catch (error) {

      console.log("Goal Fetch Error", error);

    }
  };

  const totalIncome = incomeData.reduce(
    (total, item) => total + Number(item.amount),
    0
  );

  const totalExpense = expenseData.reduce(
    (total, item) => total + Number(item.amount),
    0
  );

  const budgetLeft =
    totalIncome - totalExpense;

  useEffect(() => {

    if (totalIncome > 0) {
      fetchAiSuggestion();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalIncome, totalExpense, goalAmount]);

  const fetchAiSuggestion = async () => {

    setAiLoading(true);

    try {

      const categoryTotals = {};

      expenseData.forEach((item) => {

        const category =
          item.category || "Others";

        categoryTotals[category] =
          (categoryTotals[category] || 0) +
          Number(item.amount);

      });

      const response = await axios.post(
        `${API_URL}/api/ai/suggestions`,
        {
          totalIncome,
          totalExpense,
          goalAmount,
          categoryTotals
        }
      );

      setAiSuggestion(response.data.suggestion);

    } catch (error) {

      console.log("AI Suggestion Fetch Error", error);
      setAiSuggestion("Couldn't load a suggestion right now.");

    } finally {

      setAiLoading(false);

    }
  };

  return (
    <div className="dashboard-layout">

      <Sidebar />

      <div className="dashboard-content">

        <h1>
          Welcome, {userName} 👋
        </h1>

        <p>
          Let's create your personalized budget plan.
        </p>

        <div className="summary-cards">

          <div className="card">
            <FaMoneyBillWave />
            <h3>Total Income</h3>
            <h2>₹{totalIncome}</h2>
          </div>

          <div className="card">
            <FaWallet />
            <h3>Total Expense</h3>
            <h2>₹{totalExpense}</h2>
          </div>

          <div className="card">
            <FaPiggyBank />
            <h3>Savings Goal</h3>
            <h2>₹{goalAmount}</h2>
          </div>

          <div className="card">
            <FaChartPie />
            <h3>Budget Left</h3>
            <h2>₹{budgetLeft}</h2>
          </div>

        </div>

        <div className="planner-section">

          <h2>Monthly Budget Planner</h2>

          <p>
            Enter your income and expenses.
            BudgetBuddy will generate a personalized
            savings and spending plan for you.
          </p>

          <button>
            Generate Budget Plan
          </button>

        </div>

        <div className="ai-section">

          <h2>AI Suggestions</h2>

          {
            totalIncome === 0 ? (
              <p>
                Add income details to receive
                personalized recommendations.
              </p>
            ) : aiLoading ? (
              <p>
                Generating your suggestion...
              </p>
            ) : (
              <p>
                {aiSuggestion}
              </p>
            )
          }

        </div>

      </div>

    </div>
  );
};

export default Dashboard;