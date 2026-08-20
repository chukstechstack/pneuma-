import React, { useState, ReactNode } from "react";
import { Eye, EyeOff, Loader2, User } from "lucide-react";
import { useWatch } from "react-hook-form";
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
    <div className="w-full max-w-[360px]">
      {/* Header */}
      <div className="mb-5">
        <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-wider text-white mb-1 uppercase">
          Begin Your Journey
        </h1>
        <p className="text-gray-400 text-xs leading-relaxed">
          Create your account to start journaling daily and publishing your life book.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3.5">
        
        {/* Full Name */}
        <div className="flex flex-col gap-1 w-full">
          <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
              <User size={16} />
            </div>
            <input 
              {...register("full_name")} 
              placeholder="John Doe" 
              className={`w-full pl-10 pr-3.5 bg-black/60 border rounded-lg py-3.5 text-white text-xs outline-none transition-all placeholder:text-gray-600 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] ${
                errors.full_name ? "border-red-500/80 bg-red-500/5" : "border-white/10"
              }`} 
            />
          </div>
          {errors.full_name && <p className="text-[10px] text-red-400 mt-0.5 pl-0.5">{getErrMsg(errors.full_name)}</p>}
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1 w-full">
          <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400">
            Email Address
          </label>
          <input 
            {...register("email")} 
            type="email" 
            placeholder="name@example.com" 
            className={`w-full bg-black/60 border rounded-lg px-3.5 py-3.5 text-white text-xs outline-none transition-all placeholder:text-gray-600 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] ${
              errors.email ? "border-red-500/80 bg-red-500/5" : "border-white/10"
            }`} 
          />
          {errors.email && <p className="text-[10px] text-red-400 mt-0.5 pl-0.5">{getErrMsg(errors.email)}</p>}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1 w-full">
          <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400">
            Password
          </label>
          <div className="relative w-full flex items-center">
            <input 
              {...register("password")} 
              type={showPassword ? "text" : "password"} 
              placeholder="••••••••" 
              className={`w-full bg-black/60 border rounded-lg px-3.5 py-3.5 pr-10 text-white text-xs outline-none transition-all placeholder:text-gray-600 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] ${
                errors.password ? "border-red-500/80 bg-red-500/5" : "border-white/10"
              }`} 
            />
            <button 
              type="button" 
              className="absolute right-3.5 bg-transparent border-none text-gray-400 cursor-pointer flex items-center justify-center hover:text-white transition-colors" 
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password ? (
            <p className="text-[10px] text-red-400 mt-0.5 pl-0.5">{getErrMsg(errors.password)}</p>
          ) : (
            <PasswordStrength passwordValue={passwordValue} />
          )}
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-1 w-full">
          <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400">
            Confirm Password
          </label>
          <div className="relative w-full flex items-center">
            <input 
              {...register("confirmPassword")} 
              type={showConfirmPassword ? "text" : "password"} 
              placeholder="••••••••" 
              className={`w-full bg-black/60 border rounded-lg px-3.5 py-3.5 pr-10 text-white text-xs outline-none transition-all placeholder:text-gray-600 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] ${
                errors.confirmPassword ? "border-red-500/80 bg-red-500/5" : "border-white/10"
              }`} 
            />
            <button 
              type="button" 
              className="absolute right-3.5 bg-transparent border-none text-gray-400 cursor-pointer flex items-center justify-center hover:text-white transition-colors" 
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-[10px] text-red-400 mt-0.5 pl-0.5">{getErrMsg(errors.confirmPassword)}</p>}
        </div>

        {/* Terms and Conditions Checkbox Slot */}
        {children}

        {/* Submit Button */}
        <div className="mt-1">
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full border border-[#d4af37]/60 py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-[#d4af37] bg-[#d4af37]/10 hover:bg-[#d4af37] hover:text-[#010102] transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.15)] flex items-center justify-center gap-2 rounded-lg cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 my-1">
          <span className="flex-1 h-[1px] bg-white/10"></span>
          <span className="text-[9px] uppercase tracking-widest text-white/30 font-mono">Or</span>
          <span className="flex-1 h-[1px] bg-white/10"></span>
        </div>

        {/* Google OAuth Button */}
        <a 
          href="https://pneuma-api-0bvr.onrender.com/auth/google" 
          className="w-full flex items-center justify-center gap-2.5 bg-black/60 border border-white/10 rounded-lg py-3.5 text-white/90 text-xs font-medium no-underline transition-all hover:bg-black/90 hover:border-white/25"
        >
          <GoogleIcon />
          <span>Continue with Google</span>
        </a>

        <p className="text-center text-xs text-gray-400 pt-1">
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