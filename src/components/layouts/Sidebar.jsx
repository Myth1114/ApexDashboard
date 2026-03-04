import { HomeIcon, LayoutDashboard, UserPlus } from "lucide-react";
import { NavLink } from "react-router-dom";
import "./layout.css";

export default function Sidebar({ isOpen, closeSidebar }) {
  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="SidebarHeader">
        <div className="Apex">
          <HomeIcon />
          <h2>Apex Global</h2>
        </div>
        <ul>
          <li>
            <NavLink to="/" end onClick={closeSidebar}>
              <LayoutDashboard />

              <span className="SidebarTitle">Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/students/add" onClick={closeSidebar}>
              <UserPlus />

              <span className="SidebarTitle">Add Student</span>
            </NavLink>
          </li>
        </ul>
      </div>

      <div className="sidebar-user">
        <strong>The Apex Global Pvt. Ltd.</strong>
        <div style={{ opacity: 0.7 }}>Bhairahawa</div>
      </div>
    </div>
  );
}
