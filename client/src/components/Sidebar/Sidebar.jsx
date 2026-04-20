import { useState } from "react";
import "./Sidebar.css";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      {/* Toggle button */}
      <button className="menu-btn" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "✕" : "☰"}
      </button>

      {/* Overlay */}
      {isOpen && <div className="overlay" onClick={() => setIsOpen(false)} />}

      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <h2 className="sidebar-logo">Alumni System</h2>

        <div className="sidebar-nav">
          <div
            onClick={() => {
              navigate("/dashboard");
              setIsOpen(false); // optional: close after click
            }}
            className={`nav-item ${
              location.pathname === "/dashboard" ? "active" : ""
            }`}
          >
            Dashboard
          </div>

          <div
            onClick={() => {
              navigate("/view-alumni");
              setIsOpen(false);
            }}
            className={`nav-item ${
              location.pathname === "/view-alumni" ? "active" : ""
            }`}
          >
            View Alumni
          </div>

          <div
            onClick={() => {
              navigate("/report");
              setIsOpen(false);
            }}
            className={`nav-item ${
              location.pathname === "/report" ? "active" : ""
            }`}
          >
            Reports
          </div>
                   
        </div>

        <div className="logout-btn">Logout</div>
      </div>
    </>
  );
};

export default Sidebar;