import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const LoginInput = ({ register, errors, handleSubmit, onSubmit }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="form-input-container">
      <form onSubmit={handleSubmit(onSubmit)} className="form-wrapper">
        <div className="input-group standard-width">
          <input
            {...register("email")}
            type="email"
            placeholder="Email address"
            className={errors.email ? "input-error-border" : ""}
          />
          {errors.email && <p className="error-text">{errors.email.message}</p>}
        </div>

        <div className="input-group standard-width">
          <div className="password-wrapper">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className={errors.password ? "input-error-border" : ""}
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <p className="error-text">{errors.password.message}</p>}
        </div>

        <div className="submit-actions-block">
          <button className="register-submit-btn" type="submit">Continue</button>
        </div>

        {/* OAuth Link */}
        <div className="auth-divider-block">
          <span className="divider-line"></span>
          <span className="divider-text">or</span>
          <span className="divider-line"></span>
        </div>
        <a href="https://pneuma-api-0bvr.onrender.com/auth/google" className="google-oauth-btn">
          <span>Sign in with Google</span>
        </a>
      </form>
    </div>
  );
};

export default LoginInput;