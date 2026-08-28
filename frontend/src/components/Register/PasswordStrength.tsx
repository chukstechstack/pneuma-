import React from "react";
import { Check, X } from "lucide-react";

interface PasswordStrengthProps {
  passwordValue?: string;
}

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({ passwordValue = "" }) => {
  if (!passwordValue) return null;

  const checks = [
    { label: "8+ chars", met: passwordValue.length >= 8 },
    { label: "Uppercase", met: /[A-Z]/.test(passwordValue) },
    { label: "Number", met: /[0-9]/.test(passwordValue) },
    { label: "Symbol", met: /[^A-Za-z0-9]/.test(passwordValue) },
  ];

  const score = checks.filter((c) => c.met).length;

  // Dynamic bar colors based on score progression
  const barColor = 
    score <= 1 ? "bg-rose-500" :
    score === 2 ? "bg-amber-500" :
    score === 3 ? "bg-emerald-400" : "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]";

  return (
    <div className="flex flex-col gap-2 mt-2 pt-1">
      {/* Segmented Progress Track */}
      <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full bg-black/60 rounded-full overflow-hidden p-[1px] border border-white/10">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`h-full transition-all duration-300 rounded-full ${
              score >= level ? barColor : "bg-white/10"
            }`}
          />
        ))}
      </div>

      {/* Mini Criteria Checklist */}
      <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] font-mono text-gray-400">
        {checks.map((check, index) => (
          <div key={index} className="flex items-center gap-1.5">
            {check.met ? (
              <Check size={12} className="text-emerald-400 shrink-0" />
            ) : (
              <X size={12} className="text-gray-600 shrink-0" />
            )}
            <span className={check.met ? "text-gray-300" : "text-gray-500"}>
              {check.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};