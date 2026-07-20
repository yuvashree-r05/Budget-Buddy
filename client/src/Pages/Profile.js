import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import "../styles/Profile.css";

const Profile = () => {

  const navigate = useNavigate();

  const user =
    JSON.parse(localStorage.getItem("user")) || {};

  const handleLogout = () => {

    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmLogout) return;

    localStorage.removeItem("user");

    navigate("/login");

  };

  return (

    <div className="dashboard-layout">

      <Sidebar />

      <div className="dashboard-content">

        <h1>My Profile</h1>

        <div className="profile-card">

          <div className="profile-icon">

            <FaUserCircle />

          </div>

          <h2>{user.name}</h2>

          <p className="profile-tagline">

            Welcome to BudgetBuddy 💖

          </p>

          <div className="profile-details">

            <div className="detail-row">

              <h3>Name</h3>

              <p>{user.name}</p>

            </div>

            <div className="detail-row">

              <h3>Email</h3>

              <p>{user.email}</p>

            </div>

            <div className="detail-row">

              <h3>Account Status</h3>

              <p>Active ✅</p>

            </div>

            <div className="detail-row">

              <h3>Application</h3>

              <p>BudgetBuddy Personal Finance Tracker</p>

            </div>

          </div>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >

            Logout

          </button>

        </div>

      </div>

    </div>

  );

};

export default Profile;