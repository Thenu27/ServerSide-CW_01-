import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../components/Api/Api";
import "./ForgotPasswordPage.css";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!email) {
      alert("Enter your email");
      return;
    }

    try {
      const response = await api.post("/auth/forgot-password", { email });
      alert(response.data.message);
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="page">
      <div className="card forgot-card">

        {/* Brand */}
        <div className="brand">
          <h2>Forgot Password</h2>
          <p>Enter your email to receive a reset link</p>
        </div>

        {/* Form */}
        <div className="form">
          <div className="field">
            <label>Email</label>
            <input
              type="email"
              placeholder="jane@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button onClick={handleSubmit} className="btn-submit">
            Send Reset Link
          </button>
        </div>

        {/* Footer */}
        <div className="footer">
          Remember your password?{" "}
          <a onClick={() => navigate("/")}>Sign in</a>
        </div>

      </div>
    </div>
  );
};

export default ForgotPasswordPage;