import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Dashboard from "./Pages/Dashboard";
import Income from "./Pages/Income";
import Expense from "./Pages/Expense";
import Goal from "./Pages/Goal";
import Profile from "./Pages/Profile";
import AIPlanner from "./Pages/AIPlanner";
import Reports from "./Pages/Reports";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/income" element={<Income />} />

        <Route path="/expense" element={<Expense />} />

        <Route path="/goal" element={<Goal />} />

        <Route path="/profile" element={<Profile />} />

        <Route path="/planner" element={<AIPlanner />} />

        <Route path="/reports" element={<Reports />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;