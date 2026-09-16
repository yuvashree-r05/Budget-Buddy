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
const getCurrentMonth = () => new Date().toISOString().slice(0, 7);

const Dashboard = () => {

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const userName = user.name || "User";

  const [month, setMonth] = useState(getCurrentMonth());
  const [summary, setSummary] = useState({
    totalBudget: 0, income: 0, spent: 0, left: 0, netSavings: 0, savingsGoal: 0
  });
  const [budgetInput, setBudgetInput] = useState("");

  const [aiSuggestion, setAiSuggestion] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    fetchSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month]);

  const fetchSummary = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/budget/summary/${user._id}`,
        { params: { month } }
      );

      setSummary(response.data);
      setBudgetInput(response.data.totalBudget || "");

    } catch (error) {
      console.log("Summary Fetch Error", error);
    }
  };

  const saveBudget = async () => {
    try {
      await axios.post(`${API_URL}/api/budget`, {
        userId: user._id,
        month,
        totalBudget: Number(budgetInput)
      });

      fetchSummary();
    } catch (error) {
      console.log("Save Budget Error", error);
    }
  };

  useEffect(() => {
    if (summary.income > 0 || summary.spent > 0) {
      fetchAiSuggestion();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [summary.income, summary.spent, month]);

  const fetchAiSuggestion = async () => {
    setAiLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/ai/ask`, {
        userId: user._id,
        question: `Give me one short suggestion to manage my budget for ${month}.`
      });

      setAiSuggestion(response.data.answer);

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
        <h1>Welcome, {userName} 👋</h1>

        <div className="month-selector">
          <label>Month: </label>
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />
        </div>

        <div className="summary-cards">
          <div className="card">
            <FaMoneyBillWave />
            <h3>Income ({month})</h3>
            <h2>₹{summary.income}</h2>
          </div>

          <div className="card">
            <FaWallet />
            <h3>Expense ({month})</h3>
            <h2>₹{summary.spent}</h2>
          </div>

          <div className="card">
            <FaPiggyBank />
            <h3>Savings Goal</h3>
            <h2>₹{summary.savingsGoal}</h2>
          </div>

          <div className="card">
            <FaChartPie />
            <h3>Budget Left</h3>
            <h2>₹{summary.left}</h2>
          </div>
        </div>

        <div className="planner-section">
          <h2>Monthly Budget</h2>

          <p>Set how much you plan to spend this month — "Budget Left" updates automatically as you log expenses.</p>

          <input
            type="number"
            placeholder="Enter monthly budget"
            value={budgetInput}
            onChange={(e) => setBudgetInput(e.target.value)}
          />

          <button onClick={saveBudget}>Save Budget</button>
        </div>

        <div className="ai-section">
          <h2>AI Suggestions</h2>

          {
            summary.income === 0 && summary.spent === 0 ? (
              <p>Add income or expenses for {month} to get a suggestion.</p>
            ) : aiLoading ? (
              <p>Generating your suggestion...</p>
            ) : (
              <p>{aiSuggestion}</p>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default Dashboard;