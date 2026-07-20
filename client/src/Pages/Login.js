import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Auth.css";
const API_URL = process.env.REACT_APP_API_URL;
const Login = () => {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async () => {

    if (!formData.email.trim() || !formData.password) {
      alert("Please fill all details");
      return;
    }

    try {

      setLoading(true);

      const response = await axios.post(
        `${API_URL}/api/auth/login`,
        {
          email: formData.email.trim(),
          password: formData.password
        }
      );

      if (response.data.user) {

        localStorage.setItem(
          "user",
          JSON.stringify(response.data.user)
        );

      }

      alert(
        response.data.message ||
        "Login Successful"
      );

      navigate("/dashboard");

    } catch (error) {

      console.error(error);

      alert(
        error.response?.data?.message ||
        "Unable to connect to server"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="auth-container">

      <div className="auth-card">

        <h1>BudgetBuddy</h1>

        <h2>Welcome Back</h2>

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging In..." : "Login"}
        </button>

        <p>
          Don't have an account?

          <span
            className="auth-link"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </span>

        </p>

      </div>

    </div>
  );
};

export default Login;