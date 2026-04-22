import { Link } from "react-router-dom";
import "./NoAccess.css";

const NoAccess = () => {
  return (
    <div className="verify-page">
      <div className="verify-card">
        <div className="verify-icon error">✕</div>
        <h1>Access Denied</h1>
        <p>
          You don’t have permission to access this page. Please contact admin or
          try logging in with the correct account.
        </p>

        <Link to="/" className="verify-btn">
          Go to Login
        </Link>
      </div>
    </div>
  );
};

export default NoAccess;