import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../components/Api/Api";
import "./LoginPage.css";
import { AuthContext } from "../../contexts/AuthContext";

const LoginPage = () => {


  const {accessToken,setAccessToken} = useContext(AuthContext)
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleForgotPassword = ()=>{
    navigate('/forgot-password')
  }

  const login = async () => {
    try {
      const response = await api.post("/auth/login", formData);
      setAccessToken(response.data.accessToken);
      navigate("/dashboard")
    } catch (err) {
      console.log(err);

      if (err.response?.status === 403) {
        alert("Please verify your email first");
      } else {
        alert("Invalid email or password");
      }
    }
  };


  return (
    <div className="page">
      <div className="card login-card">

        {/* Brand */}
        <div className="brand">
          <h2>Welcome back</h2>
          <p>Sign in to your account</p>
        </div>

        {/* Form */}
        <div className="form">
          <div className="field">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="jane@example.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <div className="field-top">
              <label>Password</label>
              <a onClick={handleForgotPassword}>Forgot password?</a>
            </div>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button onClick={login} className="btn-submit">
            Sign in
          </button>
        </div>

        {/* Footer */}
        <div className="footer">
          Don't have an account? <a onClick={()=>{navigate('/register')}}>Sign up</a>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;