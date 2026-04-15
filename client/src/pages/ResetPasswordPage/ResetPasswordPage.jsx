import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../components/Api/Api";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const token = params.get("token");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const sendData = async () => {
    try {
      const response = await api.post("/auth/reset-password", {
        token,
        newPassword: formData.newPassword,
      });

      if (response) {
        alert(response.data.message || "Password updated successfully");
        navigate("/login");
      }
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Error updating password");
    }
  };

  const resetPassword = async () => {
    if (!token) {
      alert("Invalid reset link");
      return;
    }

    if (!formData.newPassword || !formData.confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await sendData();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-page">
      <div className="reset-card">
        <h1>Reset Password</h1>
        <p>Enter your new password below.</p>

        <div className="reset-field">
          <label>New Password</label>
          <input
            type="password"
            name="newPassword"
            placeholder="Enter new password"
            value={formData.newPassword}
            onChange={handleChange}
          />
        </div>

        <div className="reset-field">
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm new password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>

        <button
          type="button"
          className="reset-btn"
          onClick={resetPassword}
          disabled={loading}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </div>
    </div>
  );
};

export default ResetPasswordPage;