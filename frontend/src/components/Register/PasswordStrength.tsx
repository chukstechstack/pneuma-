import React from "react";

interface PasswordStrengthProps {
  passwordValue?: string;
}

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({ passwordValue }) => {
  if (!passwordValue) return null;

  const score = [
    passwordValue.length >= 8,
    /[A-Z]/.test(passwordValue),
    /[0-9]/.test(passwordValue),
    /[^A-Za-z0-9]/.test(passwordValue),
  ].filter(Boolean).length;

  const meta = [
    { width: "25%", color: "#ea4335", label: "Weak" },
    { width: "50%", color: "#fbbc05", label: "Fair" },
    { width: "75%", color: "#34a853", label: "Good" },
    { width: "100%", color: "#00c851", label: "Strong!" },
  ][score - 1] || { width: "0%", color: "transparent", label: "" };

  return (
    <>
      <div className="strength-bar-track">
        <div className="strength-bar-fill" style={{ width: meta.width, backgroundColor: meta.color }} />
      </div>
      <span className="strength-label" style={{ color: meta.color }}>
        {meta.label}
      </span>
    </>
  );
};