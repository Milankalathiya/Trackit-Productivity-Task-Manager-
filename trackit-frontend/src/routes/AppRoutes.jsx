import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Tasks from "../pages/Tasks";
import Habits from "../pages/Habits";
import Analytics from "../pages/Analytics";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/tasks" element={<Tasks />} />
      <Route path="/habits" element={<Habits />} />
      <Route path="/analytics" element={<Analytics />} />
    </Routes>
  );
};

export default AppRoutes;
