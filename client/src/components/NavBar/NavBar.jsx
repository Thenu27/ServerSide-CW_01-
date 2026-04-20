import "./Navbar.css";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="navbar-left">
        <h2 className="navbar-title">Alumni System</h2>

        {/* Navigation Links */}
        <div className="navbar-links">
          <Link to="/" className="nav-link">Dashboard</Link>
          <Link to="/alumni" className="nav-link">View Alumni</Link>
        </div>
      </div>

      <div className="navbar-right">
        <span className="navbar-user">Welcome, Admin</span>
        <button className="logout-btn">Logout</button>
      </div>
    </div>
  );
};

export default Navbar;