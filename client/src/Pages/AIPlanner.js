import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../styles/AIPlanner.css";

const API_URL = process.env.REACT_APP_API_URL;
const getCurrentMonth = () => new Date().toISOString().slice(0, 7);

const AIPlanner = () => {

  const user = JSON.parse(localStorage.getItem("user"));

  const [month, setMonth] = useState(getCurrentMonth());
  const [summary, setSummary] = useState({
    totalBudget: 0, income: 0, spent: 0, left: 0, netSavings: 0, savingsGoal: 0
  });

  const [plan, setPlan] = useState("");
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
    } catch (error) {
      console.log("Summary Fetch Error", error);
    }
  };

  const generatePlan = async () => {
    setAiLoading(true);
    setPlan("");

    try {
      const response = await axios.post(`${API_URL}/api/ai/ask`, {
        userId: user._id,
        question: `Give me a short personalized budget plan for ${month}.`
      });

      setPlan(response.data.answer);

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

        <div className="month-selector">
          <label>Month: </label>
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />
        </div>

        <div className="planner-card">
          <h3>Income ({month})</h3>
          <p>₹{summary.income}</p>

          <h3>Expense ({month})</h3>
          <p>₹{summary.spent}</p>

          <h3>Savings Goal</h3>
          <p>₹{summary.savingsGoal}</p>

          <button onClick={generatePlan} disabled={aiLoading}>
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