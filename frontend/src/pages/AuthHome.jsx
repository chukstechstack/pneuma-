import React from "react";
import { useNavigate } from "react-router-dom";

const AuthHome = () => {
  const navigate = useNavigate();
  return (
    <div>
      <h1> Register / Login </h1>
      <button onClick={() => navigate("/auth/login")}> Go to Login</button>
      <button onClick={() => navigate("/auth/register")}>Go to Register</button>
    </div>
  );
};
export default AuthHome;
