import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient, useMutation } from "@tanstack/react-query"; 

import api from "@api/axios.js";
import { registerSchema } from "@schemas/auth_Schema.js";
import RegisterInput from "@components/RegisterInput.jsx";
import FullPageLoader from "@components/Loader.jsx";
import doveLogoUrl from "@assets/pneuma.png";
import { useAuthStore } from "@store/useAuthStore";
import socket from "@api/socketApi.js"

import "../styles/Loader.css";
import "../styles/R_&_L_Inputs/R_Layout.css";

const Register = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: registerUser, isPending } = useMutation({
    mutationFn: (apiPayload) => api.post("/auth/register", apiPayload),
    onSuccess: async (response) => {
      console.log("Registration successful! Server response:", response);
      const { id, uuid } = response.data.user;
      useAuthStore.getState().setAuth(id, uuid);
      socket.connect();
      socket.emit("📤 Emitting_Registered_User_Uuid", { userUuid: uuid });
      console.log(" 💤☢️ socket connected for User:", uuid);
      await queryClient.invalidateQueries({ queryKey: ["homeFeed"] });
      navigate("/home");
    },
    onError: (err) => {
      const message = err?.response?.data?.error || err.message;
      alert(`Registration failed: ${message}`);
      console.error(message);
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
