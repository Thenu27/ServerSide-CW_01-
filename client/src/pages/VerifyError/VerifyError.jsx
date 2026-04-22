import { Link } from "react-router-dom";
import "./VerifyError.css";

const VerifyError = () => {
  return (
    <div className="verify-page">
      <div className="verify-card">
        <div className="verify-icon error">✕</div>
        <h1>Verification Failed</h1>
        <p>The verification link is invalid, expired, or has already been used.</p>

        <Link to="/" className="verify-btn">
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default VerifyError;