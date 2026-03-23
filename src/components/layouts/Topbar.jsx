import { NavLink } from "react-router-dom";
import { signOut } from "../../lib/auth";
import NotificationBell from "../../pages/students/components/NotificationBell";
import "./layout.css";

export default function Topbar({ toggleSidebar }) {
  const handleLogout = async () => {
    await signOut();
    navigate("/login"); // 🔥 IMPORTANT
  };
  return (
    <div className="topbar">
      <button className="hamburger" onClick={toggleSidebar}>
        ☰
      </button>
      <h3>Dashboard</h3>

      <div className="TopBarButtons">
        <div className="header-right">
          <NotificationBell />
        </div>
        <NavLink to="/students/add">
          <button className="btn btn-primary">+Add Student</button>
        </NavLink>
        <button className="btn btn-primary" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}
