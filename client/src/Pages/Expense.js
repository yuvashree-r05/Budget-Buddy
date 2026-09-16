import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../styles/Expense.css";

const API_URL = process.env.REACT_APP_API_URL;
const getCurrentMonth = () => new Date().toISOString().slice(0, 7);
const getTodayDate = () => new Date().toISOString().slice(0, 10);

const Expense = () => {

  const user = JSON.parse(localStorage.getItem("user"));

  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(getTodayDate());

  const [expenses, setExpenses] = useState([]);
  const [month, setMonth] = useState(getCurrentMonth());

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/expense/${user._id}`
      );
      setExpenses(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleExpense = async () => {

    if (!category || !amount || !date) {
      alert("Please fill all details");
      return;
    }

    try {

      if (editingId) {

        await axios.put(
          `${API_URL}/api/expense/update/${editingId}`,
          { category, amount, date }
        );

        alert("Expense Updated");

      } else {

        await axios.post(
          `${API_URL}/api/expense/add`,
          { userId: user._id, category, amount, date }
        );

        alert("Expense Added");

      }

      setCategory("");
      setAmount("");
      setDate(getTodayDate());
      setEditingId(null);

      fetchExpenses();

    } catch (error) {
      alert(error.response?.data?.message || "Failed");
    }

  };

  const editExpense = (expense) => {
    setCategory(expense.category);
    setAmount(expense.amount);
    setDate(
      expense.date
        ? new Date(expense.date).toISOString().slice(0, 10)
        : getTodayDate()
    );
    setEditingId(expense._id);
  };

  const deleteExpense = async (id) => {
    if (!window.confirm("Delete this expense?")) return;

    await axios.delete(`${API_URL}/api/expense/delete/${id}`);
    fetchExpenses();
  };

  // filter to the selected month, client-side
  const filteredExpenses = expenses.filter((expense) => {
    if (!expense.date) return false;
    return new Date(expense.date).toISOString().slice(0, 7) === month;
  });

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-content">
        <h1>Expense Management</h1>

        <div className="expense-card">

          <input
            type="text"
            placeholder="Expense Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <button onClick={handleExpense}>
            {editingId ? "Update Expense" : "Add Expense"}
          </button>

        </div>

        <div className="month-selector">
          <label>Month: </label>
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />
        </div>

        <div className="expense-table">

          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {
                filteredExpenses.length > 0 ? (
                  filteredExpenses.map((expense) => (
                    <tr key={expense._id}>
                      <td>{new Date(expense.date).toLocaleDateString()}</td>
                      <td>{expense.category}</td>
                      <td>₹{expense.amount}</td>
                      <td>
                        <button onClick={() => editExpense(expense)}>Edit</button>
                        <button onClick={() => deleteExpense(expense._id)}>Delete</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="no-data-row">
                      No expenses logged for {month}.
                    </td>
                  </tr>
                )
              }
            </tbody>
          </table>

        </div>
      </div>
    </div>
  );
};

export default Expense;