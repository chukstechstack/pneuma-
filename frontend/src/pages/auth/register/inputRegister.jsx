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
        />
        ,
        <input
          type="text"
          name="password"
          value={password}
          onChange={handleChange}
          placeholder="password"
        />
        ,
        <input
          type="text"
          name="first_name"
          value={first_name}
          onChange={handleChange}
          placeholder="first_name"
        />
        ,
        <input
          type="text"
          name="country"
          value={country}
          onChange={handleChange}
          placeholder="country"
        />
        ,
        <input
          type="string"
          name="last_name"
          value={last_name}
          onChange={handleChange}
          placeholder="last_name"
        />
        ,
        <input
          type="email"
          name="email"
          value={email}
          onChange={handleChange}
          placeholder="email"
        />
        ,<button type="submit"> Submit</button>
      </form>
    </div>
  );
};
export default RegisterInput;


