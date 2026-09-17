import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

import "../styles/Reports.css";

const API_URL = process.env.REACT_APP_API_URL;
const getCurrentMonth = () => new Date().toISOString().slice(0, 7);

const Reports = () => {

  const user = JSON.parse(localStorage.getItem("user"));

  const [month, setMonth] = useState(getCurrentMonth());
  const [summary, setSummary] = useState({
    income: 0, spent: 0, savingsGoal: 0, categoryTotals: {}, netSavings: 0
  });
  const [savedAmount, setSavedAmount] = useState(0); // lifetime, shown as its own card only

  const [aiSummary, setAiSummary] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const chartColors = [
    getComputedStyle(document.documentElement).getPropertyValue("--chart-color-1"),
    getComputedStyle(document.documentElement).getPropertyValue("--chart-color-2"),
    getComputedStyle(document.documentElement).getPropertyValue("--chart-color-3"),
    getComputedStyle(document.documentElement).getPropertyValue("--chart-color-4"),
    getComputedStyle(document.documentElement).getPropertyValue("--chart-color-5")
  ];

  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month]);

  const fetchReports = async () => {
    try {
      const summaryRes = await axios.get(
        `${API_URL}/api/budget/summary/${user._id}`,
        { params: { month } }
      );
      setSummary(summaryRes.data);

      const savingsRes = await axios.get(
        `${API_URL}/api/budget/lifetime-savings/${user._id}`
      );
      setSavedAmount(savingsRes.data.savedAmount);

    } catch (error) {
      console.log("Reports Error", error);
    }
  };

  const goal = summary.savingsGoal || 0;

  // Net savings for the SELECTED month (income - spent for that month),
  // not lifetime savings. Falls back to a manual calc if the backend
  // response is missing netSavings for any reason.
  const monthlyNetSavings = summary.netSavings ?? (summary.income - summary.spent);

  // Goal progress now compares this month's net savings to the goal,
  // instead of lifetime savings. This makes it respect the month picker
  // just like Income, Expense, and the pie chart already do.
  const progress = goal > 0
    ? Math.min((monthlyNetSavings / goal) * 100, 100)
    : 0;

  const pieData = Object.keys(summary.categoryTotals || {}).map((category) => ({
    name: category,
    value: summary.categoryTotals[category]
  }));

  useEffect(() => {
    if (summary.income > 0 || pieData.length > 0) {
      fetchAiSummary();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [summary, month]);

  const fetchAiSummary = async () => {
    setAiLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/ai/ask`, {
        userId: user._id,
        question: `Give me a short spending summary for ${month}, highlighting my biggest category and one way to improve.`
      });

      setAiSummary(response.data.answer);

    } catch (error) {
      console.log("AI Summary Fetch Error", error);
      setAiSummary("Couldn't load a summary right now.");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-content">
        <h1>Financial Reports</h1>

        <div className="month-selector">
          <label>Month: </label>
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />
        </div>

        <div className="report-cards">
          <div className="report-card">
            <h3>Income ({month})</h3>
            <h2>₹{summary.income}</h2>
          </div>

          <div className="report-card">
            <h3>Expense ({month})</h3>
            <h2>₹{summary.spent}</h2>
          </div>

          <div className="report-card">
            <h3>Total Saved (lifetime)</h3>
            <h2>₹{savedAmount}</h2>
          </div>

          <div className="report-card">
            <h3>Goal Progress ({month})</h3>
            <h2>{progress.toFixed(0)}%</h2>
          </div>
        </div>

        <div className="progress-section">
          <h2>Savings Goal Progress ({month})</h2>

          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>

          <p className="progress-text">
            ₹{monthlyNetSavings} saved out of ₹{goal} this month
          </p>
        </div>

        <div className="chart-section">
          <h2>Expense Breakdown ({month})</h2>

          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={120} dataKey="value" label>
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="no-chart-data">
              <p>No expense data available for {month}.</p>
            </div>
          )}
        </div>

        <div className="ai-summary-section">
          <h2>AI Spending Summary</h2>

          {
            summary.income === 0 && pieData.length === 0 ? (
              <p>Add income and expense details for {month} to get an AI-generated summary.</p>
            ) : aiLoading ? (
              <p>Generating your summary...</p>
            ) : (
              <p>{aiSummary}</p>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default Reports;