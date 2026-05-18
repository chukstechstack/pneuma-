import React, { useState, useContext } from "react";
import RegisterInput from "../components/RegisterInput.jsx";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import { Link } from "react-router-dom";
import "../styles/Register.css";
import FullPageLoader from "../components/Loader.jsx";
import "../styles/Loader.css";
import TaskContext from "../context/TaskContext.jsx";

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { getTasks } = useContext(TaskContext);
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
      setIsLoading(true);
      await api.post("/auth/register", register);
      await getTasks();
      setRegister({
        username: "",
        password: "",
        first_name: "",
        last_name: "",
        country: "",
        email: "",
      });

      navigate("/home");
    } catch (err) {
      const message = err.response?.data?.error || err.message;
      console.error(message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      {isLoading && <FullPageLoader />}
      <div className="input-body">
        <div className="sign-up">
          <h1> Sign up</h1>
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
    </div>
  );
};

export default Register;
