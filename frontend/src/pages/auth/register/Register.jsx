import React, { useState } from "react";
import RegisterInput from "./inputRegister.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";


const Register = () => {
  const navigate = useNavigate()
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
       const res = await axios.post(
        "http://localhost:3000/auth/register",
        register,
        { withCredentials: true}
      );
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
      const message = err.response?.data?.error || err.message
      toast.error(message)
      console.error(err)
    }
  };
  return (
    <div>
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
