import { Link } from "react-router-dom";
import "./VerifySuccess.css";

const VerifySuccess = () => {
  return (
    <div className="verify-page">
      <div className="verify-card">
        <div className="verify-icon success">✓</div>
        <h1>Email Verified</h1>
        <p>Your email has been verified successfully. You can now log in.</p>

        <Link to="/login" className="verify-btn">
          Go to Login
        </Link>
      </div>
    </div>
  );
};

export default VerifySuccess;