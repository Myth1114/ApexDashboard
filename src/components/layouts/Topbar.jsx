import { NavLink } from "react-router-dom";
import "./layout.css";

export default function Topbar({ toggleSidebar }) {
  return (
    <div className="topbar">
      <button className="hamburger" onClick={toggleSidebar}>
        ☰
      </button>
      <h3>Dashboard</h3>
      <NavLink className="btn btn-primary" to="/students/add">
        +Add Student
      </NavLink>
    </div>
  );
}
