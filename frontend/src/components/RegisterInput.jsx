import React from "react";

const RegisterInput = ({
  handleChange,
  username,
  password,
  first_name,
  last_name,
  country,
  email,
  handleSubmit
}) => {
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          value={username}
          onChange={handleChange}
          placeholder="username"
        /> <hr />
        
        <input
          type="text"
          name="password"
          value={password}
          onChange={handleChange}
          placeholder="password"
        /> <hr />
        
        
        <input
          type="text"
          name="first_name"
          value={first_name}
          onChange={handleChange}
          placeholder="first_name"
        /> <hr />
      
        
        <input
          type="text"
          name="country"
          value={country}
          onChange={handleChange}
          placeholder="country"
        /> <hr />
        
        
        <input
          type="string"
          name="last_name"
          value={last_name}
          onChange={handleChange}
          placeholder="last_name"
        /> <hr />
      
        
        <input
          type="email"
          name="email"
          value={email}
          onChange={handleChange}
          placeholder="email"
        /> <hr />
      
        <button type="submit"> Submit</button> <a href="http://localhost:3000/auth/google" className="google-btn"></a>
      </form>
    </div>
  );
};
export default RegisterInput;


