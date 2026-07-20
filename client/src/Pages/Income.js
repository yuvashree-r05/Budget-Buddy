import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../styles/Income.css";

const API_URL = process.env.REACT_APP_API_URL;

const Income = () => {

  const user = JSON.parse(localStorage.getItem("user"));

  const [source, setSource] = useState("");
  const [amount, setAmount] = useState("");

  const [incomeList, setIncomeList] = useState([]);

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchIncome();
  }, []);

  const fetchIncome = async () => {

    try {

      const response = await axios.get(
        `${API_URL}/api/income/${user._id}`
      );

      setIncomeList(response.data);

    } catch (error) {

      console.log(error);

    }

  };

  const handleSubmit = async () => {

    if (!source || !amount) {
      alert("Please fill all details");
      return;
    }

    try {

      if (editingId) {

        await axios.put(
          `${API_URL}/api/income/update/${editingId}`,
          {
            source,
            amount
          }
        );

        alert("Income Updated Successfully");

      } else {
         console.log("Editing ID:", editingId);
console.log({
  source,
  amount
});
        await axios.post(
          `${API_URL}/api/income/add`,
          {
            userId: user._id,
            source,
            amount
          }
        );

        alert("Income Added Successfully");

      }

      setSource("");
      setAmount("");
      setEditingId(null);

      fetchIncome();

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Something went wrong"
      );

    }

  };

  const handleEdit = (income) => {

    setEditingId(income._id);

    setSource(income.source);

    setAmount(income.amount);

  };

  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Delete this income?"
    );

    if (!confirmDelete) return;

    try {

      await axios.delete(
        `${API_URL}/income/delete/${id}`
      );

      fetchIncome();

      if (editingId === id) {

        setEditingId(null);
        setSource("");
        setAmount("");

      }

      alert("Income Deleted Successfully");

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Delete Failed"
      );

    }

  };

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
            onChange={(e) =>
              setSource(e.target.value)
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

          <button onClick={handleSubmit}>
            {editingId ? "Update Income" : "Add Income"}
          </button>

        </div>

        <div className="income-table-container">

          <h2>Your Income Sources</h2>

          <table className="income-table">

            <thead>

              <tr>

                <th>Source</th>

                <th>Amount</th>

                <th>Actions</th>

              </tr>

            </thead>

            <tbody>

              {
                incomeList.length === 0 ? (

                  <tr>

                    <td
                      colSpan="3"
                      className="no-data"
                    >
                      No income added yet.
                    </td>

                  </tr>

                ) :

                incomeList.map((income) => (

                  <tr key={income._id}>

                    <td>{income.source}</td>

                    <td>₹{income.amount}</td>

                    <td>

                      <button
                        className="edit-btn"
                        onClick={() =>
                          handleEdit(income)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() =>
                          handleDelete(income._id)
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

export default Income;