import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useWatch } from "react-hook-form"; // Import this to track values

const RegisterInput = ({ register, errors, control, handleSubmit, onSubmit }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Use watch to get the current password value for strength calculation
  const passwordValue = useWatch({ control, name: "password" });

  const getPasswordStrength = (pass) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strengthScore = getPasswordStrength(passwordValue);

  const getStrengthMeta = (score) => {
    if (!passwordValue) return { width: "0%", color: "transparent", label: "" };
    switch (score) {
      case 1: return { width: "25%", color: "#ea4335", label: "Weak" };
      case 2: return { width: "50%", color: "#fbbc05", label: "Fair" };
      case 3: return { width: "75%", color: "#34a853", label: "Good" };
      case 4: return { width: "100%", color: "#00c851", label: "Strong!" };
      default: return { width: "0%", color: "transparent", label: "" };
    }
  };

  const strengthMeta = getStrengthMeta(strengthScore);

  return (
    <div className="form-input-container">
      <form onSubmit={handleSubmit(onSubmit)} className="form-wrapper">
        
        {/* Name Fields */}
        <div className="name-fields-row">
          <div className="input-group">
            <input {...register("first_name")} placeholder="First name" className={errors.first_name ? "input-error-border" : ""} />
            {errors.first_name && <p className="error-text">{errors.first_name.message}</p>}
          </div>
          <div className="input-group">
            <input {...register("last_name")} placeholder="Last name" className={errors.last_name ? "input-error-border" : ""} />
            {errors.last_name && <p className="error-text">{errors.last_name.message}</p>}
          </div>
        </div>

        {/* Email */}
        <div className="name-fields-row">
          <div className="input-group standard-width">
            <input {...register("email")} type="email" placeholder="Email address" className={errors.email ? "input-error-border" : ""} />
            {errors.email && <p className="error-text">{errors.email.message}</p>}
          </div>
        </div>

        {/* Password */}
        <div className="name-fields-row">
          <div className="input-group standard-width">
            <div className="password-wrapper">
              <input {...register("password")} type={showPassword ? "text" : "password"} placeholder="Password" className={errors.password ? "input-error-border" : ""} />
              <button type="button" className="password-toggle-btn" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              {passwordValue && (
                <div className="strength-bar-track">
                  <div className="strength-bar-fill" style={{ width: strengthMeta.width, backgroundColor: strengthMeta.color }} />
                </div>
              )}
            </div>
            {errors.password ? <p className="error-text">{errors.password.message}</p> : (
              passwordValue && <span className="strength-label" style={{ color: strengthMeta.color }}>{strengthMeta.label}</span>
            )}
          </div>
        </div>

        {/* Confirm Password */}
        <div className="name-fields-row">
          <div className="input-group standard-width">
            <div className="password-wrapper">
              <input {...register("confirmPassword")} type={showConfirmPassword ? "text" : "password"} placeholder="Confirm Password" className={errors.confirmPassword ? "input-error-border" : ""} />
              <button type="button" className="password-toggle-btn" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.confirmPassword && <p className="error-text">{errors.confirmPassword.message}</p>}
          </div>
        </div>

        <div className="submit-actions-block">
          <button className="register-submit-btn" type="submit">Continue</button>
        </div>

        {/* ... (Keep your existing Google OAuth section) */}
      </form>
    </div>
  );
};

export default RegisterInput;