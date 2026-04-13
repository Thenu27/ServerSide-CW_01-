import "./Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2 className="sidebar-logo">Alumni System</h2>

      <div className="sidebar-nav">
        <div className="nav-item active">Dashboard</div>
        <div className="nav-item">View Alumni</div>
      </div>

      <div className="logout-btn">Logout</div>
    </div>
  );
};

export default Sidebar;