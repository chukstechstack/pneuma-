import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const RegisterInput = ({
  handleChange,
  password,
  confirmPassword,
  first_name,
  last_name,
  email,
  handleSubmit,
  errors = {},
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const getPasswordStrength = (pass) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strengthScore = getPasswordStrength(password);

  const getStrengthMeta = (score) => {
    if (!password) return { width: "0%", color: "transparent", label: "" };
    switch (score) {
      case 1:
        return { width: "25%", color: "#ea4335", label: "Weak" };
      case 2:
        return { width: "50%", color: "#fbbc05", label: "Fair" };
      case 3:
        return { width: "75%", color: "#34a853", label: "Good" };
      case 4:
        return { width: "100%", color: "#00c851", label: "Strong!" };
      default:
        return { width: "0%", color: "transparent", label: "" };
    }
  };

  const strengthMeta = getStrengthMeta(strengthScore);

  return (
    <div className="form-input-container">
      <form onSubmit={handleSubmit} className="form-wrapper">
        {/*------Form-Input-First_Name---------------*/}
        <div className="name-fields-row">
          <div className="input-group">
            <input
              type="text"
              name="first_name"
              value={first_name}
              onChange={handleChange}
              placeholder="First name"
              className={errors.first_name ? "input-error-border" : ""}
            />
            {errors.first_name && (
              <p className="error-text">{errors.first_name}</p>
            )}
          </div>
          {/*------Form-Input-Last_Name---------------*/}
          <div className="input-group">
            <input
              type="text"
              name="last_name"
              value={last_name}
              onChange={handleChange}
              placeholder="Last name"
              className={errors.last_name ? "input-error-border" : ""}
            />
            {errors.last_name && (
              <p className="error-text">{errors.last_name}</p>
            )}
          </div>
        </div>

        {/*---------Email_Field----------- */}
        <div className="name-fields-row">
          <div className="input-group standard-width">
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="Email address"
              className={errors.email ? "input-error-border" : ""}
            />
            {/*------Email_Error---------------*/}
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>
        </div>

        {/*----Password_Field--------------- */}
        <div className="name-fields-row">
          <div className="input-group standard-width">
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={handleChange}
                placeholder="Password"
                className={errors.password ? "input-error-border" : ""}
              />
              {/*----Password_Eye_Icon--------------- */}
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>

              {/*----Password_Strength_Indicator--------------- */}
              {password && (
                <div className="strength-bar-track">
                  <div
                    className="strength-bar-fill"
                    style={{
                      width: strengthMeta.width,
                      backgroundColor: strengthMeta.color,
                    }}
                  />
                </div>
              )}
            </div>

            {/*------Password_Error_&_Label---------------*/}
            {errors.password ? (
              <p className="error-text">{errors.password}</p>
            ) : (
              password && (
                <span
                  className="strength-label"
                  style={{ color: strengthMeta.color }}
                >
                  {strengthMeta.label}
                </span>
              )
            )}
          </div>
        </div>

        {/*----------Confirm_Password_Field-----*/}
        <div className="name-fields-row">
          <div className="input-group standard-width">
            <div className="password-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className={errors.confirmPassword ? "input-error-border" : ""}
              />
              {/*----------Confirm_Password_Eye_Icon-----*/}
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {/*----------Confirm_Password_Error_Message-----*/}
            {errors.confirmPassword && (
              <p className="error-text">{errors.confirmPassword}</p>
            )}
          </div>
        </div>

        {/*---Submit_Button-----------*/}
        <div className="submit-actions-block">
          <button className="register-submit-btn" type="submit">
            Continue
          </button>
        </div>

        {/*---Line_Divide-------*/}
        <div className="auth-divider-block">
          <span className="divider-line"></span>
          <span className="divider-text">or</span>
          <span className="divider-line"></span>
        </div>

        {/*-----Google_Auth------------*/}
        <a href="https://onrender.com" className="google-oauth-btn">
          <svg
            className="google-svg-icon"
            viewBox="0 0 24 24"
            width="18"
            height="18"
          >
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Sign up with Google</span>
        </a>
      </form>
    </div>
  );
};

export default RegisterInput;
