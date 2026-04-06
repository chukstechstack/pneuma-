import React from "react";

const LoginInput = ({ handleChange, password, email }) => {
  return (
    <div>
      <form onSubmit={() => handleChange}>
        
        <input
          type="string"
          name="password"
          value={password}
          onChange={handleChange}
          placeHolder="password"
        />
        ,
        <input
          type="email"
          name="email"
          value={email}
          onChange={handleChange}
          placeHolder="email"
        />
        ,<button type="submit"> Submit</button>
      </form>
    </div>
  );
};
export default LoginInput;
