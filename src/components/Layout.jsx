import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar.jsx";
import "./layout.css";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="layout">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="layout-main">
        <Navbar open={sidebarOpen} setOpen={setSidebarOpen} />
        <main className="layout-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
