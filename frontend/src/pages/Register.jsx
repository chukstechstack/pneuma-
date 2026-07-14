import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient, useMutation } from "@tanstack/react-query"; // Import useMutation

import api from "../api/axios.js";
import { registerSchema } from "../schemas/registerSchema.js";
import RegisterInput from "../components/RegisterInput.jsx";
import FullPageLoader from "../components/Loader.jsx";
import doveLogoUrl from "../assets/pneuma.png";

import "../styles/Loader.css";
import "../styles/R_&_L_Inputs/R_Layout.css";

const Register = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // 1. Define the mutation
  const { mutate: registerUser, isPending } = useMutation({
    mutationFn: (userData) => api.post("/auth/register", userData),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["homeFeed"] });
      navigate("/home");
    },
    onError: (err) => {
      const message = err?.response?.data?.error || err.message;
      alert(`Registration failed: ${message}`);
    },
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data) => {
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
              <img
                src={doveLogoUrl}
                className="nav-logo-img-register"
                alt="Pneuma Logo"
              />
            </span>
            Pneuma
          </Link>
          <h1 className="register-title">Begin Your Journey</h1>
          <div className="register-divider"></div>
        </header>

        <RegisterInput
          register={register}
          errors={errors}
          control={control}
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
