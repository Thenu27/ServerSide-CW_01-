import { useState } from "react";
import api from "../../components/Api/Api";
import "./RegisterPage.css";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {

  const navigate = useNavigate()

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

  const register = async () => {
        window.alert(
        "Please check your email and verify your account before logging in."
      );
    try {
      const response = await api.post("/auth/register", formData);
      console.log(response.data.message);



      navigate("/"); // optional: redirect to login page
    } catch (err) {
      console.log(err);
      window.alert("Error Registering User!");
    }
  };


  

  return (
    <div className="page">
      <div className="card">
        <div className="brand">
          {/* <div className="logo">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div> */}
          <h2>Create your account</h2>
          <p>Get started — it's free</p>
        </div>

        <div className="form">
          <div className="row">
            {/* <div className="field">
              <label>First name</label>
              <input
                type="text"
                name="firstName"
                placeholder="Jane"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label>Last name</label>
              <input
                type="text"
                name="lastName"
                placeholder="Doe"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div> */}
          </div>

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
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Min. 8 characters"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button onClick={register} className="btn-submit">
            Create account
          </button>
        </div>

        <div className="footer">
          Already have an account? <a onClick={()=>navigate('/')}>Sign in</a>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;