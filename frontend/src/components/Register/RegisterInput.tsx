import React, { useState, ReactNode } from "react";
import { Eye, EyeOff, Loader2, Terminal, Cpu } from "lucide-react";
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
    <div className="w-full max-w-md relative">
      
      {/* Header Status */}
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/10 font-mono text-[10px] tracking-[0.3em] text-emerald-400 uppercase">
        <span className="flex items-center gap-2">
          <Terminal size={12} className="animate-pulse" /> ACCOUNT REGISTRATION
        </span>
        <span className="text-gray-500 font-bold">[SECURE]</span>
      </div>

      {/* Main Form Title Area */}
      <div className="mb-8">
        <h1 className="font-black text-3xl sm:text-4xl tracking-tight text-white uppercase mb-2 leading-none">
          Establish <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-emerald-400">Identity</span>
        </h1>
        <p className="text-gray-400 font-sans text-xs sm:text-sm tracking-wide leading-relaxed">
          Initialize your credentials to join our community network.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        
        {/* Full Name Input Box */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400">
            Full Name
          </label>
          <input 
            {...register("full_name")} 
            placeholder="John Doe" 
            className={`w-full px-4 py-3.5 bg-black/90 border rounded-none text-white text-xs font-mono outline-none transition-all placeholder:text-gray-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 shadow-inner ${
              errors.full_name ? "border-rose-500 bg-rose-500/10" : "border-white/20 hover:border-white/40"
            }`} 
          />
          {errors.full_name && <p className="text-[10px] font-mono text-rose-400 mt-0.5">{getErrMsg(errors.full_name)}</p>}
        </div>

        {/* Email Input Box */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400">
            Email Address
          </label>
          <input 
            {...register("email")} 
            type="email" 
            placeholder="name@domain.com" 
            className={`w-full px-4 py-3.5 bg-black/90 border rounded-none text-white text-xs font-mono outline-none transition-all placeholder:text-gray-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 shadow-inner ${
              errors.email ? "border-rose-500 bg-rose-500/10" : "border-white/20 hover:border-white/40"
            }`} 
          />
          {errors.email && <p className="text-[10px] font-mono text-rose-400 mt-0.5">{getErrMsg(errors.email)}</p>}
        </div>

        {/* Password Input Box */}
        <div className="flex flex-col gap-1.5 w-full">
          <div className="flex items-center justify-between">
            <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400">
              Password
            </label>
            {/* Forgot Password Link in Red */}
            <Link 
              to="/forgot-password" 
              className="text-[10px] font-mono text-red-500 hover:text-red-400 tracking-wider uppercase transition-colors"
            >
              [ Forgot Password? ]
            </Link>
          </div>
          <div className="relative w-full flex items-center">
            <input 
              {...register("password")} 
              type={showPassword ? "text" : "password"} 
              placeholder="••••••••••••" 
              className={`w-full px-4 py-3.5 pr-12 bg-black/90 border rounded-none text-white text-xs font-mono outline-none transition-all placeholder:text-gray-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 shadow-inner ${
                errors.password ? "border-rose-500 bg-rose-500/10" : "border-white/20 hover:border-white/40"
              }`} 
            />
            <button 
              type="button" 
              className="absolute right-4 bg-transparent border-none text-gray-400 cursor-pointer flex items-center justify-center hover:text-white transition-colors z-10" 
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password ? (
            <p className="text-[10px] font-mono text-rose-400 mt-0.5">{getErrMsg(errors.password)}</p>
          ) : (
            <PasswordStrength passwordValue={passwordValue} />
          )}
        </div>

        {/* Confirm Password Input Box */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400">
            Confirm Password
          </label>
          <div className="relative w-full flex items-center">
            <input 
              {...register("confirmPassword")} 
              type={showConfirmPassword ? "text" : "password"} 
              placeholder="••••••••••••" 
              className={`w-full px-4 py-3.5 pr-12 bg-black/90 border rounded-none text-white text-xs font-mono outline-none transition-all placeholder:text-gray-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 shadow-inner ${
                errors.confirmPassword ? "border-rose-500 bg-rose-500/10" : "border-white/20 hover:border-white/40"
              }`} 
            />
            <button 
              type="button" 
              className="absolute right-4 bg-transparent border-none text-gray-400 cursor-pointer flex items-center justify-center hover:text-white transition-colors z-10" 
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-[10px] font-mono text-rose-400 mt-0.5">{getErrMsg(errors.confirmPassword)}</p>}
        </div>

        {/* Terms of Service / Privacy Slot in Red */}
        <div className="py-1 text-red-500 [&_a]:text-red-500 [&_a]:underline hover:[&_a]:text-red-400">
          {children}
        </div>

        {/* Emerald Green Action Trigger */}
        <div className="mt-2">
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full relative group overflow-hidden border border-emerald-500/80 py-4 text-xs font-black uppercase tracking-[0.3em] text-black bg-emerald-400 hover:bg-emerald-300 transition-all duration-300 shadow-[0_0_25px_rgba(16,185,129,0.35)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <div className="absolute inset-0 w-1/2 h-full bg-white/30 skew-x-[45deg] -translate-x-full group-hover:translate-x-[300%]" />
            {isSubmitting ? (
              <Loader2 size={16} className="animate-spin text-black" />
            ) : (
              <span className="flex items-center gap-2 font-mono font-bold">
                <Cpu size={14} /> REGISTER ACCOUNT
              </span>
            )}
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 my-2">
          <span className="flex-1 h-[1px] bg-white/15"></span>
          <span className="text-[9px] uppercase tracking-[0.3em] text-gray-500 font-mono">Or</span>
          <span className="flex-1 h-[1px] bg-white/15"></span>
        </div>

        {/* Google OAuth Button */}
        <a 
          href="https://pneuma-api-0bvr.onrender.com/auth/google" 
          className="w-full flex items-center justify-center gap-3 bg-black/90 border border-white/20 py-3.5 text-white/90 text-xs font-mono tracking-wider no-underline transition-all hover:bg-white hover:text-black hover:border-white shadow-lg group"
        >
          <GoogleIcon />
          <span>Continue with Google</span>
        </a>

        {/* Login Link in Red */}
        <div className="text-center pt-4 border-t border-white/10 mt-2">
          <p className="text-xs text-gray-400 font-sans">
            Already registered?{" "}
            <Link to="/login" className="text-red-500 font-bold font-mono tracking-wider hover:text-red-400 hover:underline uppercase ml-1">
              [ Login ]
            </Link>
          </p>
        </div>

      </form>
    </div>
  );
};

export default RegisterInput;