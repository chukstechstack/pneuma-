import React, { useState, useContext } from "react";
import RegisterInput from "../components/RegisterInput.jsx";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios.js";
import "../styles/NavBar.css";
import FullPageLoader from "../components/Loader.jsx";
import "../styles/Loader.css";
import TaskContext from "../context/TaskContext.jsx";


const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { getTasks } = useContext(TaskContext);
  const [register, setRegister] = useState({
    username: "",
    password: "",
    first_name: "",
    last_name: "",
    country: "",
    email: "",
  });

  const { username, password, first_name, last_name, country, email } = register;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegister((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await api.post("/auth/register", register);
      await getTasks();
      setRegister({
        username: "",
        password: "",
        first_name: "",
        last_name: "",
        country: "",
        email: "",
      });
      navigate("/home");
    } catch (err) {
      const message = err.response?.data?.error || err.message;
      console.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="register-layout">
      {/* Full screen loader target component */}
      {isLoading && <FullPageLoader />}
      
      {/* Ambient background accent glow */}
      <div className="register-ambient-glow"></div>

      <section className="register-container">
        
        {/* Architectural Header Accent */}
        <header className="register-header">
          <Link to="/" className="register-brand-link">Pneuma</Link>
          <h1 className="register-title">Begin Your Journey</h1>
          <div className="register-divider"></div>
          <p className="register-subtitle">Create your personal sanctuary workspace archive.</p>
        </header>

        {/* Form Grid Injection */}
        <RegisterInput
          handleChange={handleChange}
          username={username}
          password={password}
          first_name={first_name}
          last_name={last_name}
          country={country}
          email={email}
          handleSubmit={handleSubmit}
        />

        {/* Lower Navigation Footer Alternative link */}
        <footer className="register-footer">
          <span>Already mapping your legacy?</span>
          <span 
            onClick={() => navigate("/login")} 
            className="register-login-link"
            style={{ cursor: "pointer" }}
          >
            Come On In
          </span>
        </footer>
      </section>
    </main>
  );
};

export default Register;
