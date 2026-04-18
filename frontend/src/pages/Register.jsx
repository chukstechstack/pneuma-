import React, { useState } from "react";
import RegisterInput from "../components/RegisterInput.jsx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import { Link } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [register, setRegister] = useState({
    username: "",
    password: "",
    first_name: "",
    last_name: "",
    country: "",
    email: "",
  });

  const { username, password, first_name, last_name, country, email } =
    register;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegister((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/register", register);
      toast.success(res.data.message);

      setRegister({
        username: "",
        password: "",
        first_name: "",
        last_name: "",
        country: "",
        email: "",
      });

      navigate("/taskhome/home");
    } catch (err) {
      const message = err.response?.data?.error || err.message;
      toast.error(message);
      console.error(err);
    }
  };
  return (
    <div>
      <div>
        <h1> Register </h1>
        <Link to="/">Back</Link> <hr /> <br />
      </div>
      <RegisterInput
        handleChange={handleChange}
        username={username}
        password={password}
        first_name={first_name}
        last_name={last_name}
        country={country}
        email={email}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default Register;
