import React, { useState, ReactNode } from "react";
import { Eye, EyeOff, Loader2, User } from "lucide-react";
import { useWatch } from "react-hook-form";
import { RegisterInputProps } from "./RegisterInput.types";
import { GoogleIcon } from "./GoogleIcon";
import { PasswordStrength } from "./PasswordStrength";
import { Link } from "react-router-dom";
import { UseFormRegister, FieldErrors, Control, UseFormHandleSubmit } from "react-hook-form";

interface ExtendedRegisterInputProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  control: Control<any>;
  handleSubmit: UseFormHandleSubmit<any>;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
  children?: ReactNode;
}

const RegisterInput: React.FC<ExtendedRegisterInputProps> = ({
  register,
  errors,
  control,
  handleSubmit,
  onSubmit,
  isSubmitting,
  children,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const passwordValue = useWatch({ control, name: "password" });

  const getErrMsg = (err: any) => (typeof err === "string" ? err : err?.message);

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        
        {/* Full Name */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className="block text-[11px] font-mono uppercase tracking-[0.2em] text-gray-300">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
              <User size={18} />
            </div>
            <input 
              {...register("full_name")} 
              placeholder="John Doe" 
              className={`w-full pl-11 pr-4 bg-black/60 border rounded-xl py-3.5 text-white text-sm outline-none transition-all placeholder:text-gray-600 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] ${
                errors.full_name ? "border-red-500/80 bg-red-500/5" : "border-white/15"
              }`} 
            />
          </div>
          {errors.full_name && <p className="text-[11px] text-red-400 mt-0.5 pl-0.5">{getErrMsg(errors.full_name)}</p>}
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className="block text-[11px] font-mono uppercase tracking-[0.2em] text-gray-300">
            Email Address
          </label>
          <input 
            {...register("email")} 
            type="email" 
            placeholder="name@example.com" 
            className={`w-full bg-black/60 border rounded-xl px-4 py-3.5 text-white text-sm outline-none transition-all placeholder:text-gray-600 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] ${
              errors.email ? "border-red-500/80 bg-red-500/5" : "border-white/15"
            }`} 
          />
          {errors.email && <p className="text-[11px] text-red-400 mt-0.5 pl-0.5">{getErrMsg(errors.email)}</p>}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className="block text-[11px] font-mono uppercase tracking-[0.2em] text-gray-300">
            Password
          </label>
          <div className="relative w-full flex items-center">
            <input 
              {...register("password")} 
              type={showPassword ? "text" : "password"} 
              placeholder="••••••••" 
              className={`w-full bg-black/60 border rounded-xl px-4 py-3.5 pr-12 text-white text-sm outline-none transition-all placeholder:text-gray-600 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] ${
                errors.password ? "border-red-500/80 bg-red-500/5" : "border-white/15"
              }`} 
            />
            
            <button 
              type="button" 
              className="absolute right-4 bg-transparent border-none text-gray-400 cursor-pointer flex items-center justify-center hover:text-white transition-colors" 
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password ? (
            <p className="text-[11px] text-red-400 mt-0.5 pl-0.5">{getErrMsg(errors.password)}</p>
          ) : (
            <PasswordStrength passwordValue={passwordValue} />
          )}
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className="block text-[11px] font-mono uppercase tracking-[0.2em] text-gray-300">
            Confirm Password
          </label>
          <div className="relative w-full flex items-center">
            <input 
              {...register("confirmPassword")} 
              type={showConfirmPassword ? "text" : "password"} 
              placeholder="••••••••" 
              className={`w-full bg-black/60 border rounded-xl px-4 py-3.5 pr-12 text-white text-sm outline-none transition-all placeholder:text-gray-600 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] ${
                errors.confirmPassword ? "border-red-500/80 bg-red-500/5" : "border-white/15"
              }`} 
            />
            <button 
              type="button" 
              className="absolute right-4 bg-transparent border-none text-gray-400 cursor-pointer flex items-center justify-center hover:text-white transition-colors" 
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-[11px] text-red-400 mt-0.5 pl-0.5">{getErrMsg(errors.confirmPassword)}</p>}
        </div>

        {/* 👉 Render Terms and Conditions Checkbox Slot Here */}
        {children}

        {/* Submit Button */}
        <div className="mt-2">
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full border border-[#d4af37]/60 py-4 text-sm font-bold uppercase tracking-[0.25em] text-[#d4af37] bg-[#d4af37]/10 hover:bg-[#d4af37] hover:text-[#010102] transition-all duration-300 shadow-[0_0_25px_rgba(212,175,55,0.15)] flex items-center justify-center gap-3 group rounded-xl cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 my-2">
          <span className="flex-1 h-[1px] bg-white/10"></span>
          <span className="text-[10px] uppercase tracking-widest text-white/30 font-mono">Or</span>
          <span className="flex-1 h-[1px] bg-white/10"></span>
        </div>

        {/* Google OAuth Button */}
        <a 
          href="https://pneuma-api-0bvr.onrender.com/auth/google" 
          className="w-full flex items-center justify-center gap-2.5 bg-black/60 border border-white/15 rounded-xl py-3.5 text-white/90 text-xs font-medium no-underline transition-all hover:bg-black/90 hover:border-white/30"
        >
          <GoogleIcon />
          <span>Continue with Google</span>
        </a>

        <p className="text-center text-sm text-gray-400 pt-2">
          Already have an account?{" "}
          <Link to="/login" className="text-[#d4af37] font-semibold hover:underline">
            Sign In
          </Link>
        </p>

      </form>
    </div>
  );
};

export default RegisterInput;