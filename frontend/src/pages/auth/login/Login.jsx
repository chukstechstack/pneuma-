import React, { useState } from "react";
import LoginInput from "./inputLogin.jsx";

const Login = () => {
  const [login, setLogin] = useState({
    password: "",
    email: "",
  });

  const { password, email } = login;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLogin((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <div>
      <LoginInput
        handleChange={handleChange}
        password={password}
        email={email}
      />
    </div>
  );
};

export default Login;
