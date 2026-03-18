import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "./layout.css";
import { Outlet } from "react-router-dom";

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div>
      <div className="layout">
        <aside className="SidebarContainer">
          <Sidebar isOpen={sidebarOpen} closeSidebar={closeSidebar} />
          {sidebarOpen && (
            <div className="overlay" onClick={closeSidebar}></div>
          )}
        </aside>
        <main className="content">
          <div className="TopbarContainer">
            <Topbar toggleSidebar={toggleSidebar} />
          </div>
          <div className="main-content">{children}</div>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
