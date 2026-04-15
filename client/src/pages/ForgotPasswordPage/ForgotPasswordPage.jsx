import { useState } from "react";
import api from "../../components/Api/Api";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");

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
    <div>
      <h1>Forgot Password</h1>
      <p>Enter your email to receive a reset link</p>

      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button onClick={handleSubmit}>
        Send Reset Link
      </button>
    </div>
  );
};

export default ForgotPasswordPage;