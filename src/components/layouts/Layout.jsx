import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "./layout.css";

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="layout">
      <Sidebar isOpen={sidebarOpen} closeSidebar={closeSidebar} />

      {sidebarOpen && <div className="overlay" onClick={closeSidebar}></div>}

      <div className="content">
        <Topbar toggleSidebar={toggleSidebar} />
        <div className="main-content">{children}</div>
      </div>
    </div>
  );
}
