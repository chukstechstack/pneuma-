import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { registerSchema } from "@schemas/auth_Schema.js";
import RegisterInput from "@/components/Register/RegisterInput.js";
import FullPageLoader from "@components/Loader.jsx";
import doveLogoUrl from "@assets/pneuma.png";

import { RegisterFormValues } from "@pages/Register/Register.types";
import { useRegisterMutation } from "@pages/Register/useRegisterMutation";

import "../styles/Loader.css";
import "../styles/R_&_L_Inputs/R_Layout.css";

const Register = () => {
  const navigate = useNavigate();
  const { mutate: registerUser, isPending } = useRegisterMutation();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormValues): void => {
    const { confirmPassword: _confirmPassword, ...apiPayload } = data;
    registerUser(apiPayload);
  };

  return (
    <main className="register-layout">
      {isPending && <FullPageLoader />}
      <div className="register-ambient-glow"></div>
      <section className="register-container">
        <header className="register-header">
          <Link to="/" className="register-brand-link">
            <span className="register-logo-wrapper">
              <img src={doveLogoUrl} className="nav-logo-img-register" alt="Pneuma Logo" />
            </span>
            Pneuma
          </Link>
          <h1 className="register-title">Begin Your Journey</h1>
          <div className="register-divider"></div>
        </header>

        <RegisterInput
          register={register}
          errors={errors}
          control={control as any}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
        />

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