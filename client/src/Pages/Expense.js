import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../styles/Expense.css";

const API_URL = process.env.REACT_APP_API_URL;

const Expense = () => {

  const user =
    JSON.parse(localStorage.getItem("user"));

  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");

  const [expenses, setExpenses] = useState([]);

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

    if (!category || !amount) {
      alert("Please fill all details");
      return;
    }

    try {

      if (editingId) {

        await axios.put(
          `${API_URL}/api/expense/update/${editingId}`,
          {
            category,
            amount
          }
        );

        alert("Expense Updated");

      } else {

        await axios.post(
          `${API_URL}/api/expense/add`,
          {
            userId: user._id,
            category,
            amount
          }
        );

        alert("Expense Added");

      }

      setCategory("");
      setAmount("");
      setEditingId(null);

      fetchExpenses();

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Failed"
      );

    }

  };

  const editExpense = (expense) => {

    setCategory(expense.category);
    setAmount(expense.amount);
    setEditingId(expense._id);

  };

  const deleteExpense = async (id) => {

    if (!window.confirm("Delete this expense?"))
      return;

    await axios.delete(
      `${API_URL}/api/expense/delete/${id}`
    );

    fetchExpenses();

  };

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
            onChange={(e) =>
              setCategory(e.target.value)
            }
          />

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) =>
              setAmount(e.target.value)
            }
          />

          <button onClick={handleExpense}>

            {editingId
              ? "Update Expense"
              : "Add Expense"}

          </button>

        </div>

        <div className="expense-table">

          <table>

            <thead>

              <tr>

                <th>Category</th>

                <th>Amount</th>

                <th>Actions</th>

              </tr>

            </thead>

            <tbody>

              {
                expenses.map((expense) => (

                  <tr key={expense._id}>

                    <td>{expense.category}</td>

                    <td>₹{expense.amount}</td>

                    <td>

                      <button
                        onClick={() =>
                          editExpense(expense)
                        }
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          deleteExpense(expense._id)
                        }
                      >
                        Delete
                      </button>

                    </td>

                  </tr>

                ))
              }

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );

};

export default Expense;