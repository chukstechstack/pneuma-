import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import api from "@/api/axios.js";
import { loginSchema } from "../schemas/auth_Schema.js";
import LoginInput from "@/components/Login/LoginInput.js";
import FullPageLoader from "@components/Loader.jsx";
import doveLogoUrl from "../assets/pneuma.png";
import { useAuthStore } from "@store/useAuthStore";
import socket from "@/api/socketApi.js"

import "../styles/Loader.css";
import "../styles/R_&_L_Inputs/R_Layout.css";

const Login = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: loginUser, isPending } = useMutation({
    mutationFn: (credentials) => api.post("/auth/login", credentials),
    onSuccess: async (response) => {
      console.log("Registration successful! Server response:", response);
      console.log("User data:", response.data);
      const { id, uuid } = response.data.user || response.data;
      useAuthStore.getState().setAuth(id, uuid);

      socket.connect();
      socket.emit("current_Logged_In_User_Uuid", { userUuid: uuid });
      console.log(" 💤☢️ socket connected for User:", uuid);
      await queryClient.invalidateQueries({ queryKey: ["homeFeed"] });
      navigate("/home");
    },
    onError: (err: any) => {
      const message = err?.response?.data?.error || (err instanceof Error ? err.message : String(err));
      alert(`Login failed: ${message}`);
      console.error(message);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
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
