import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
  FaHome,
  FaMoneyBillWave,
  FaClipboardList,
  FaBullseye,
  FaRobot,
  FaChartBar,
  FaUser,
  FaSignOutAlt
} from "react-icons/fa";

import "../styles/Sidebar.css";

const Sidebar = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const user =
    JSON.parse(localStorage.getItem("user")) || {};

  const userName =
    user.name || "User";

  const handleLogout = () => {

    localStorage.removeItem("user");

    alert("Logged Out Successfully");

    navigate("/login");
  };

  return (
    <div className="sidebar">

      <h2>BudgetBuddy</h2>

      <div className="user-profile">

        <div className="avatar">
          {userName.charAt(0).toUpperCase()}
        </div>

        <h3>{userName}</h3>

      </div>

      <ul>

        <li
          className={
            location.pathname === "/dashboard"
              ? "active"
              : ""
          }
          onClick={() => navigate("/dashboard")}
        >
          <FaHome />
          Dashboard
        </li>

        <li
          className={
            location.pathname === "/income"
              ? "active"
              : ""
          }
          onClick={() => navigate("/income")}
        >
          <FaMoneyBillWave />
          Income
        </li>

        <li
          className={
            location.pathname === "/expense"
              ? "active"
              : ""
          }
          onClick={() => navigate("/expense")}
        >
          <FaClipboardList />
          Expenses
        </li>

        <li
          className={
            location.pathname === "/goal"
              ? "active"
              : ""
          }
          onClick={() => navigate("/goal")}
        >
          <FaBullseye />
          Savings Goal
        </li>

        <li
          className={
            location.pathname === "/planner"
              ? "active"
              : ""
          }
          onClick={() => navigate("/planner")}
        >
          <FaRobot />
          AI Planner
        </li>

        <li
          className={
            location.pathname === "/reports"
              ? "active"
              : ""
          }
          onClick={() => navigate("/reports")}
        >
          <FaChartBar />
          Reports
        </li>

        <li
          className={
            location.pathname === "/profile"
              ? "active"
              : ""
          }
          onClick={() => navigate("/profile")}
        >
          <FaUser />
          Profile
        </li>

        <li onClick={handleLogout}>
          <FaSignOutAlt />
          Logout
        </li>

      </ul>

    </div>
  );
};

export default Sidebar;