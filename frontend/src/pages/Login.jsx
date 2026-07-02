import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import LoginInput from "../components/LoginInput.jsx";
import api from "../api/axios.js";
import TaskContext from "../context/TaskContext.jsx";
import FullPageLoader from "../components/Loader.jsx";
import doveLogoUrl from "../assets/pneuma.png";
import "../styles/R_&_L_Inputs/R_Layout.css";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Loader.css";

import { loginSchema } from "../components/zodShemaValidation.js";

const Login = () => {
  const [login, setLogin] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { FreshLoad } = useContext(TaskContext);
  const navigate = useNavigate();

  const { email, password } = login;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLogin((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const validationResult = loginSchema.safeParse({ email, password });

    if (!validationResult.success) {
      const formattedErrors = {};
      validationResult.error.issues.forEach((issue) => {
        formattedErrors[issue.path] = issue.message;
      });
      setErrors(formattedErrors);
      return;
    }

    try {
      setIsLoading(true);
      const res = await api.post("/auth/login", login);
      setLogin({
        email: "",
        password: "",
      });
      await FreshLoad();
      navigate("/home");
      console.log(res);
    } catch (err) {
      const message = err?.response?.data?.error || err.message;
      alert(`Login failed: ${message}`);
      console.log(message);
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
          <Link to="/" className="register-brand-link">
            <span>
              <span className="register-logo-wrapper">
                <img
                  src={doveLogoUrl}
                  className="nav-logo-img-register"
                  alt="Pneuma Logo"
                />
              </span>
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
          errors={errors} // Sent error collection to children nodes
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
