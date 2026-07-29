import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useWatch } from "react-hook-form";
import { RegisterInputProps } from "./RegisterInput.types";
import { GoogleIcon } from "./GoogleIcon";
import { PasswordStrength } from "./PasswordStrength";

const RegisterInput: React.FC<RegisterInputProps> = ({
  register,
  errors,
  control,
  handleSubmit,
  onSubmit,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const passwordValue = useWatch({ control, name: "password" });

  const getErrMsg = (err: any) => (typeof err === "string" ? err : err?.message);

  return (
    <div className="form-input-container">
      <form onSubmit={handleSubmit(onSubmit)} className="form-wrapper">
        <div className="name-fields-row">
          <div className="input-group">
            <input {...register("first_name")} placeholder="First name" className={errors.first_name ? "input-error-border" : ""} />
            {errors.first_name && <p className="error-text">{getErrMsg(errors.first_name)}</p>}
          </div>
          <div className="input-group">
            <input {...register("last_name")} placeholder="Last name" className={errors.last_name ? "input-error-border" : ""} />
            {errors.last_name && <p className="error-text">{getErrMsg(errors.last_name)}</p>}
          </div>
        </div>

        <div className="name-fields-row">
          <div className="input-group standard-width">
            <input {...register("email")} type="email" placeholder="Email address" className={errors.email ? "input-error-border" : ""} />
            {errors.email && <p className="error-text">{getErrMsg(errors.email)}</p>}
          </div>
        </div>

        <div className="name-fields-row">
          <div className="input-group standard-width">
            <div className="password-wrapper">
              <input {...register("password")} type={showPassword ? "text" : "password"} placeholder="Password" className={errors.password ? "input-error-border" : ""} />
              <button type="button" className="password-toggle-btn" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password ? <p className="error-text">{getErrMsg(errors.password)}</p> : <PasswordStrength passwordValue={passwordValue} />}
          </div>
        </div>

        <div className="name-fields-row">
          <div className="input-group standard-width">
            <div className="password-wrapper">
              <input {...register("confirmPassword")} type={showConfirmPassword ? "text" : "password"} placeholder="Confirm Password" className={errors.confirmPassword ? "input-error-border" : ""} />
              <button type="button" className="password-toggle-btn" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.confirmPassword && <p className="error-text">{getErrMsg(errors.confirmPassword)}</p>}
          </div>
        </div>

        <div className="submit-actions-block">
          <button className="register-submit-btn" type="submit">Continue</button>
        </div>

        <div className="auth-divider-block">
          <span className="divider-line"></span>
          <span className="divider-text">or</span>
          <span className="divider-line"></span>
        </div>

        <a href="https://pneuma-api-0bvr.onrender.com/auth/google" className="google-oauth-btn">
          <GoogleIcon />
          <span>Sign up with Google</span>
        </a>
      </form>
    </div>
  );
};

export default RegisterInput;