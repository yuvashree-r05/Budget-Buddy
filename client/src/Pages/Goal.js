import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../styles/Goal.css";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

const API_URL = process.env.REACT_APP_API_URL;

const Goal = () => {

  const user = JSON.parse(localStorage.getItem("user"));

  const [targetAmount, setTargetAmount] = useState("");
  const [goalId, setGoalId] = useState("");

  const [incomeData, setIncomeData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);

  useEffect(() => {

    fetchGoal();
    fetchIncome();
    fetchExpense();

  }, []);

  /* ===========================
          FETCH GOAL
  =========================== */

  const fetchGoal = async () => {

    try {

      const response = await axios.get(
        `${API_URL}/api/goal/${user._id}`
      );

      if (response.data) {

        setGoalId(response.data._id);
        setTargetAmount(response.data.targetAmount);

      }

    } catch (error) {

      console.log(error);

    }

  };

  /* ===========================
          FETCH INCOME
  =========================== */

  const fetchIncome = async () => {

    try {

      const response = await axios.get(
        `${API_URL}/api/income/${user._id}`
      );

      setIncomeData(response.data);

    } catch (error) {

      console.log(error);

    }

  };

  /* ===========================
          FETCH EXPENSE
  =========================== */

  const fetchExpense = async () => {

    try {

      const response = await axios.get(
        `${API_URL}/api/expense/${user._id}`
      );

      setExpenseData(response.data);

    } catch (error) {

      console.log(error);

    }

  };

  /* ===========================
          SAVE / UPDATE GOAL
  =========================== */

  const handleGoal = async () => {

    if (!targetAmount) {

      alert("Please enter your savings goal.");
      return;

    }

    try {

      if (goalId) {

        await axios.put(
          `${API_URL}/api/goal/update/${goalId}`,
          {
            targetAmount
          }
        );

        alert("Goal Updated Successfully");

      } else {

        await axios.post(
          `${API_URL}/api/goal/save`,
          {
            userId: user._id,
            targetAmount
          }
        );

        alert("Goal Saved Successfully");

      }

      fetchGoal();

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Something went wrong"
      );

    }

  };

  /* ===========================
        CALCULATIONS
  =========================== */

  const totalIncome = incomeData.reduce(

    (sum, income) =>
      sum + Number(income.amount),

    0

  );

  const totalExpense = expenseData.reduce(

    (sum, expense) =>
      sum + Number(expense.amount),

    0

  );

  const savings = totalIncome - totalExpense;

  const remaining = Math.max(

    Number(targetAmount) - savings,

    0

  );

  const progress =

    Number(targetAmount) > 0

      ? Math.min(

          (savings / Number(targetAmount)) * 100,

          100

        )

      : 0;

  const chartData = [

    {

      name: "Finance",

      Income: totalIncome,

      Expense: totalExpense

    }

  ];
  return (

    <div className="dashboard-layout">

      <Sidebar />

      <div className="dashboard-content">

        <h1>Financial Goal</h1>

        <div className="goal-summary">

          <div className="goal-box">

            <h3>🎯 Target Goal</h3>

            <p>₹{Number(targetAmount).toLocaleString()}</p>

          </div>

          <div className="goal-box">

            <h3>💰 Saved</h3>

            <p>₹{savings.toLocaleString()}</p>

          </div>

          <div className="goal-box">

            <h3>📉 Remaining</h3>

            <p>₹{remaining.toLocaleString()}</p>

          </div>

        </div>

        {/* Progress */}

        <div className="progress-card">

          <h2>Goal Progress</h2>

          <div className="progress-bar">

            <div

              className="progress-fill"

              style={{

                width: `${progress}%`

              }}

            ></div>

          </div>

          <p>

            {progress.toFixed(1)}% Completed

          </p>

        </div>

        {/* Goal Form */}

        <div className="goal-card">

          <h2>

            {goalId

              ? "Update Savings Goal"

              : "Create Savings Goal"}

          </h2>

          <input

            type="number"

            placeholder="Enter Target Amount"

            value={targetAmount}

            onChange={(e) =>

              setTargetAmount(e.target.value)

            }

          />

          <button onClick={handleGoal}>

            {

              goalId

                ? "Update Goal"

                : "Save Goal"

            }

          </button>

        </div>

        {/* Chart */}

        <div className="chart-card">

          <h2>Financial Overview</h2>

          <ResponsiveContainer

            width="100%"

            height={350}

          >

            <BarChart

              data={chartData}

            >

              <CartesianGrid

                strokeDasharray="3 3"

              />

              <XAxis

                dataKey="name"

              />

              <YAxis />

              <Tooltip />

              <Legend />

              <Bar

                dataKey="Income"

                fill="#d8899d"

                radius={[8,8,0,0]}

              />

              <Bar

                dataKey="Expense"

                fill="#8fb9ff"

                radius={[8,8,0,0]}

              />

            </BarChart>

          </ResponsiveContainer>

        </div>

        {/* Financial Summary */}

        <div className="tips-card">

          <h2>

            📋 Financial Summary

          </h2>

          <ul>

            <li>

              💰 Total Income :

              ₹{totalIncome.toLocaleString()}

            </li>

            <li>

              💸 Total Expense :

              ₹{totalExpense.toLocaleString()}

            </li>

            <li>

              🏦 Current Savings :

              ₹{savings.toLocaleString()}

            </li>

            <li>

              🎯 Remaining Goal :

              ₹{remaining.toLocaleString()}

            </li>

            <li>

              {

                remaining === 0 && Number(targetAmount) > 0

                  ? "🎉 Congratulations! You have achieved your savings goal."

                  : "💡 Keep saving consistently to reach your target."

              }

            </li>

          </ul>

        </div>

      </div>

    </div>

  );

};

export default Goal;