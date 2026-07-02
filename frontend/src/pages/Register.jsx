import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import RegisterInput from "../components/RegisterInput.jsx";
import api from "../api/axios.js";
import doveLogoUrl from "../assets/pneuma.png";
import FullPageLoader from "../components/Loader.jsx";
import "../styles/Loader.css";
import TaskContext from "../context/TaskContext.jsx";
// 🌟 Link your custom filename using standard brackets destructuring
import { registerSchema } from "../components/zodShemaValidation.js";
import "../styles/R_&_L_Inputs/R_Layout.css";

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { FreshLoad } = useContext(TaskContext);
  const [errors, setErrors] = useState({});
  const [register, setRegister] = useState({
    password: "",
    confirmPassword: "",
    first_name: "",
    last_name: "",
    email: "",
  });

  const { password, confirmPassword, first_name, last_name, email } = register;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegister((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const validationResult = registerSchema.safeParse({
      first_name,
      last_name,
      email,
      password,
      confirmPassword,
    });

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
      const { confirmPassword: _confirmPassword, ...apiPayload } = register;

      await api.post("/auth/register", apiPayload);
      await FreshLoad();

      setRegister({
        password: "",
        confirmPassword: "",
        first_name: "",
        last_name: "",
        email: "",
      });
      navigate("/home");
    } catch (err) {
      const message = err?.response?.data?.error || err.message;
      alert(`Registration failed: ${message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="register-layout">
      {/*=======Register_Layout==============================================*/}
      {/* Full screen loader target component */}
      {isLoading && <FullPageLoader />}

      {/*-----Background_Register_Glow----*/}
      <div className="register-ambient-glow"></div>
      {/*==================Register_Section=====================*/}
      <section className="register-container">
        {/*================R_Header================================================*/}
        <header className="register-header">
          <Link to="/" className="register-brand-link">
            <span>
              {/*----Register_img------*/}
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
          {/*---Register_Title---------*/}
          <h1 className="register-title">Begin Your Journey</h1>
          <div className="register-divider"></div>
          {/*----------Register_subtitle-----*/}
          <p className="register-subtitle">
            Create your personal sanctuary workspace archive.
          </p>
        </header>

        {/*========Register_Input_Field==========*/}
        <RegisterInput
          handleChange={handleChange}
          password={password}
          confirmPassword={confirmPassword}
          first_name={first_name}
          last_name={last_name}
          email={email}
          handleSubmit={handleSubmit}
          errors={errors}
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
