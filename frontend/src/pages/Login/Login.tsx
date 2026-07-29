import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginSchema } from "../../schemas/auth_Schema.js";
import LoginInput from "@/components/Login/LoginInput.js";
import FullPageLoader from "@components/Loader.jsx";
import doveLogoUrl from "../assets/pneuma.png";

import { LoginFormValues } from "./Login.types.js";
import { useLoginMutation } from "./useLoginMutation.js";

import "../styles/Loader.css";
import "../styles/R_&_L_Inputs/R_Layout.css";

const Login = () => {
  const navigate = useNavigate();
  const { mutate: loginUser, isPending } = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <main className="register-layout">
      {isPending && <FullPageLoader />}
      <div className="register-ambient-glow"></div>

      <section className="register-container">
        <header className="register-header">
          <Link to="/" className="register-brand-link">
            <span className="register-logo-wrapper"> 
              <img
                src={doveLogoUrl}
                className="nav-logo-img-register"
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

        <LoginInput
          register={register}
          errors={errors}
          handleSubmit={handleSubmit}
          onSubmit={loginUser}
        />

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