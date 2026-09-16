import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../styles/Income.css";

const API_URL = process.env.REACT_APP_API_URL;
const getCurrentMonth = () => new Date().toISOString().slice(0, 7);
const getTodayDate = () => new Date().toISOString().slice(0, 10);

const Income = () => {

  const user = JSON.parse(localStorage.getItem("user"));

  const [source, setSource] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(getTodayDate());

  const [incomeList, setIncomeList] = useState([]);
  const [month, setMonth] = useState(getCurrentMonth());

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchIncome();
  }, []);

  const fetchIncome = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/income/${user._id}`);
      setIncomeList(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async () => {

    if (!source || !amount || !date) {
      alert("Please fill all details");
      return;
    }

    try {

      if (editingId) {

        await axios.put(
          `${API_URL}/api/income/update/${editingId}`,
          { source, amount, date }
        );

        alert("Income Updated Successfully");

      } else {

        await axios.post(
          `${API_URL}/api/income/add`,
          { userId: user._id, source, amount, date }
        );

        alert("Income Added Successfully");

      }

      setSource("");
      setAmount("");
      setDate(getTodayDate());
      setEditingId(null);

      fetchIncome();

    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    }

  };

  const handleEdit = (income) => {
    setEditingId(income._id);
    setSource(income.source);
    setAmount(income.amount);
    setDate(
      income.date
        ? new Date(income.date).toISOString().slice(0, 10)
        : getTodayDate()
    );
  };

  const handleDelete = async (id) => {

    const confirmDelete = window.confirm("Delete this income?");
    if (!confirmDelete) return;

    try {

      await axios.delete(`${API_URL}/api/income/delete/${id}`);

      fetchIncome();

      if (editingId === id) {
        setEditingId(null);
        setSource("");
        setAmount("");
        setDate(getTodayDate());
      }

      alert("Income Deleted Successfully");

    } catch (error) {
      alert(error.response?.data?.message || "Delete Failed");
    }

  };

  const filteredIncome = incomeList.filter((income) => {
    if (!income.date) return false;
    return new Date(income.date).toISOString().slice(0, 7) === month;
  });

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-content">
        <h1>Income Management</h1>

        <div className="income-card">

          <input
            type="text"
            placeholder="Income Source"
            value={source}
            onChange={(e) => setSource(e.target.value)}
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

          <button onClick={handleSubmit}>
            {editingId ? "Update Income" : "Add Income"}
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

        <div className="income-table-container">

          <h2>Your Income Sources</h2>

          <table className="income-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Source</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {
                filteredIncome.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="no-data">
                      No income logged for {month}.
                    </td>
                  </tr>
                ) : (
                  filteredIncome.map((income) => (
                    <tr key={income._id}>
                      <td>{new Date(income.date).toLocaleDateString()}</td>
                      <td>{income.source}</td>
                      <td>₹{income.amount}</td>
                      <td>
                        <button className="edit-btn" onClick={() => handleEdit(income)}>
                          Edit
                        </button>
                        <button className="delete-btn" onClick={() => handleDelete(income._id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )
              }
            </tbody>
          </table>

        </div>
      </div>
    </div>
  );
};

export default Income;