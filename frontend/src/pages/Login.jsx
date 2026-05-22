import React, { useState, useContext } from "react";
import LoginInput from "../components/LoginInput.jsx";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios.js";
import TaskContext from "../context/TaskContext.jsx";
import "../styles/Inputs.css";
import FullPageLoader from "../components/Loader.jsx";
import "../styles/Loader.css";
import doveLogoUrl from "../assets/pneuma.png";

const Login = () => {
  const [login, setLogin] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { getTasks } = useContext(TaskContext);
  const navigate = useNavigate();

  const { email, password } = login;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLogin((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await api.post("/auth/login", login);
      setLogin({
        email: "",
        password: "",
      });
      await getTasks();
      navigate("/home");
      console.log(res);
    } catch (err) {
      const message = err?.response?.data?.error || err.message;
      console.log(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="register-layout">
      {isLoading && <FullPageLoader />}

      {/* Decorative background aura blur */}
      <div className="register-ambient-glow"></div>

      <section className="register-container">
        {/* Architectural Header Accent */}
        <header className="register-header">
          <Link to="/" className="register-brand-link">
            <span>
              <img
                src={doveLogoUrl}
                className="nav-logo-img"
                alt="Pneuma Logo"
              />
            </span>
            Pneuma
          </Link>
          <h1 className="register-title">Welcome Back</h1>
          <div className="register-divider"></div>
          <p className="register-subtitle">
            Enter your sanctuary to document your journey.
          </p>
        </header>

        {/* Input Wrapper Target */}
        <LoginInput
          handleChange={handleChange}
          email={email}
          password={password}
          handleSubmit={handleSubmit}
        />

        {/* Direct Link Alternative Action */}
        <footer className="register-footer">
          <span>New to the archive?</span>
          <span
            onClick={() => navigate("/register")}
            className="register-login-link"
            style={{ cursor: "pointer" }}
          >
            Join Us
          </span>
        </footer>
      </section>
    </main>
  );
};

export default Login;
