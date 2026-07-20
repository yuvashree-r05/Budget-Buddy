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

const Reports = () => {

  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [goal, setGoal] = useState(0);
  const [expenseData, setExpenseData] = useState([]);

  const user =
    JSON.parse(localStorage.getItem("user"));

  const chartColors = [
    getComputedStyle(document.documentElement)
      .getPropertyValue("--chart-color-1"),

    getComputedStyle(document.documentElement)
      .getPropertyValue("--chart-color-2"),

    getComputedStyle(document.documentElement)
      .getPropertyValue("--chart-color-3"),

    getComputedStyle(document.documentElement)
      .getPropertyValue("--chart-color-4"),

    getComputedStyle(document.documentElement)
      .getPropertyValue("--chart-color-5")
  ];

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {

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

      setGoal(
        goalRes.data?.targetAmount || 0
      );

      setExpenseData(
        expenseRes.data || []
      );

    } catch (error) {

      console.log(
        "Reports Error",
        error
      );

    }
  };

  const savedAmount =
    income - expense;

  const progress =
    goal > 0
      ? Math.min(
          (savedAmount / goal) * 100,
          100
        )
      : 0;

  const categoryTotals = {};

  expenseData.forEach((item) => {

    const category =
      item.category || "Others";

    if (categoryTotals[category]) {

      categoryTotals[category] +=
        Number(item.amount);

    } else {

      categoryTotals[category] =
        Number(item.amount);

    }

  });

  const pieData = Object.keys(
    categoryTotals
  ).map((category) => ({
    name: category,
    value: categoryTotals[category]
  }));

  return (
    <div className="dashboard-layout">

      <Sidebar />

      <div className="dashboard-content">

        <h1>Financial Reports</h1>

        <div className="report-cards">

          <div className="report-card">
            <h3>Total Income</h3>
            <h2>₹{income}</h2>
          </div>

          <div className="report-card">
            <h3>Total Expense</h3>
            <h2>₹{expense}</h2>
          </div>

          <div className="report-card">
            <h3>Total Saved</h3>
            <h2>₹{savedAmount}</h2>
          </div>

          <div className="report-card">
            <h3>Goal Progress</h3>
            <h2>{progress.toFixed(0)}%</h2>
          </div>

        </div>

        <div className="progress-section">

          <h2>
            Savings Goal Progress
          </h2>

          <div className="progress-bar">

            <div
              className="progress-fill"
              style={{
                width: `${progress}%`
              }}
            />

          </div>

          <p className="progress-text">
            ₹{savedAmount} saved out of ₹{goal}
          </p>

        </div>

        <div className="chart-section">

          <h2>
            Expense Breakdown
          </h2>

          {pieData.length > 0 ? (

            <ResponsiveContainer
              width="100%"
              height={350}
            >

              <PieChart>

                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  dataKey="value"
                  label
                >

                  {pieData.map(
                    (entry, index) => (

                      <Cell
                        key={index}
                        fill={
                          chartColors[
                            index %
                            chartColors.length
                          ]
                        }
                      />

                    )
                  )}

                </Pie>

                <Tooltip />
                <Legend />

              </PieChart>

            </ResponsiveContainer>

          ) : (

            <div className="no-chart-data">

              <p>
                No expense data available
                yet.
              </p>

            </div>

          )}

        </div>

      </div>

    </div>
  );
};

export default Reports;