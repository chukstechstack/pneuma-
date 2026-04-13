import React, { useState } from "react";
import LoginInput from "./inputLogin.jsx";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../../api/axios.js";
import { Link } from "react-router-dom"

const Login = () => {
  const [login, setLogin] = useState({
    password: "",
    email: "",
  });
  const navigate = useNavigate();

  const { email, password } = login;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLogin((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post("/auth/login", login);
      setLogin({
        email: "",
        password: "",
      });
      toast.success(res.data.message);
      navigate("/taskhome/home");
      console.log(res);
    } catch (err) {
      const message = err?.response?.data?.error || err.message;
      toast.error(message);
    }
  };
  return (
    <div>
      <Link to="/"> Back </Link> <hr /> <br/>
      <LoginInput
        handleChange={handleChange}
        email={email}
        password={password}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default Login;
