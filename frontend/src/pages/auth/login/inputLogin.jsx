import React from "react";


const LoginInput = ({
 
  handleChange,
  password,
  email,
  handleSubmit,
}) => {
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          value={email}
          onChange={handleChange}
          placeholder="email"
        />
        <hr />
        <input
          type="string"
          name="password"
          value={password}
          onChange={handleChange}
          placeholder="password"
        />

        <hr />
        <button type="submit"> Submit</button>
        <a href="http://localhost:3000/auth/google" className="google-btn">
        
          Sign in with Google
        </a>
      </form>
    </div>
  );
};
export default LoginInput;
