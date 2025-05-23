// src/components/NavBar.jsx
import { Link } from "react-router-dom";

const NavBar = () => (
  <nav>
    <Link to="/dashboard">Dashboard</Link>
    <Link to="/tasks">Tasks</Link>
    <Link to="/habits">Habits</Link>
    <Link to="/analytics">Analytics</Link>
  </nav>
);

export default NavBar;
