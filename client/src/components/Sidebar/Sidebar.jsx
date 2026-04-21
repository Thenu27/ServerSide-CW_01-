import { useContext, useState } from "react";
import "./Sidebar.css";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../Api/Api";
import { AuthContext } from "../../contexts/AuthContext";

const Sidebar = () => {

  const {setAccessToken} = useContext(AuthContext)

  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const logout = async () => {
    try {
     const response = await api.post("/auth/logout"); 
     if(response){
      console.log(response.data);
     }
    } catch (err) {
      console.log(err);
    } finally {
      setAccessToken(null); 
      navigate("/"); 
    }
  };

  return (
    <>
      <button className="menu-btn" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "✕" : "☰"}
      </button>

      {isOpen && <div className="overlay" onClick={() => setIsOpen(false)} />}

      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <h2 className="sidebar-logo">Alumni System</h2>

        <div className="sidebar-nav">
          <div
            onClick={() => {
              navigate("/dashboard");
              setIsOpen(false);
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
              navigate("/view-analytics");   
              setIsOpen(false);
            }}
            className={`nav-item ${
              location.pathname === "/view-analytics" ? "active" : ""
            }`}
          >
            View Analytics
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

        <div onClick={()=>logout()} className="logout-btn">Logout</div>
      </div>
    </>
  );
};

export default Sidebar;