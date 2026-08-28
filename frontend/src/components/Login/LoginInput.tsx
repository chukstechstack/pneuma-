import React, { useState } from "react";
import { Eye, EyeOff, Loader2, ShieldCheck, Terminal } from "lucide-react";
import { GoogleIcon } from "./GoogleIcon";
import { Link } from "react-router-dom";
import { UseFormRegister, FieldErrors, UseFormHandleSubmit } from "react-hook-form";

export interface LoginInputProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  handleSubmit: UseFormHandleSubmit<any, any>;
  onSubmit: (data: any) => void;
  isSubmitting?: boolean;
}

const LoginInput: React.FC<LoginInputProps> = ({ 
  register, 
  errors = {}, 
  handleSubmit, 
  onSubmit, 
  isSubmitting 
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const getErrMsg = (err: any) => (typeof err === "string" ? err : err?.message);

  return (
    <div className="w-full max-w-md mx-auto relative">
      
      {/* Mobile Card Frame Wrapper */}
      <div className="bg-[#07090e] border border-white/10 sm:border-transparent p-6 sm:p-0 rounded-2xl sm:rounded-none shadow-2xl sm:shadow-none relative overflow-hidden">
        
        {/* Top Tech Accent Line for Mobile Card */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent sm:hidden" />

        {/* Header */}
        <div className="mb-6 sm:mb-8">
    
          <h1 className="font-black text-3xl sm:text-4xl tracking-tight text-white uppercase mb-2 leading-none">
            Sign <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-emerald-400">In</span>
          </h1>
          <p className="text-gray-400 font-sans text-xs sm:text-sm tracking-wide leading-relaxed">
            Enter your credentials to resume your session.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          
          {/* Email Field */}
          <div className="flex flex-col gap-1 w-full">
            <input
              {...register("email")}
              type="email"
              autoComplete="username"
              placeholder="Email Address (name@domain.com)"
              className={`w-full px-4 py-3.5 bg-black/80 backdrop-blur-md border rounded-xl sm:rounded-none text-white text-xs font-mono outline-none transition-all placeholder:text-gray-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 shadow-inner ${
                errors.email ? "border-rose-500 bg-rose-500/10" : "border-white/15 hover:border-white/30"
              }`}
            />
            {errors.email && <p className="text-[10px] font-mono text-rose-400 mt-0.5">{getErrMsg(errors.email)}</p>}
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-1 w-full">
            <div className="relative w-full flex items-center">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Password"
                className={`w-full px-4 py-3.5 pr-12 bg-black/80 backdrop-blur-md border rounded-xl sm:rounded-none text-white text-xs font-mono outline-none transition-all placeholder:text-gray-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 shadow-inner ${
                  errors.password ? "border-rose-500 bg-rose-500/10" : "border-white/15 hover:border-white/30"
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
            
            {/* Row configuration for Forgot Password link under the password input */}
            <div className="flex items-center justify-between px-0.5 pt-1">
              {errors.password ? (
                <p className="text-[10px] font-mono text-rose-400">{getErrMsg(errors.password)}</p>
              ) : (
                <span />
              )}
              <Link 
                to="/forgotpassword" 
                className="text-[10px] font-mono uppercase tracking-wider text-red-500 hover:text-red-400 hover:underline ml-auto"
              >
                Forgot password? 
              </Link>
            </div>
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center gap-2.5 py-1">
            <input
              type="checkbox"
              id="rememberDevice"
              {...register("rememberDevice")}
              className="w-4 h-4 rounded-none border-white/20 bg-black/90 text-emerald-500 focus:ring-0 cursor-pointer accent-emerald-500"
            />
            <label htmlFor="rememberDevice" className="text-xs text-gray-400 font-mono tracking-wider cursor-pointer select-none">
              Remember me on this device
            </label>
          </div>

          {/* Submit Button */}
          <div className="mt-2">
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full relative group overflow-hidden border border-emerald-500/80 py-4 text-xs font-black uppercase tracking-[0.3em] text-black bg-emerald-400 hover:bg-emerald-300 transition-all duration-300 shadow-[0_0_25px_rgba(16,185,129,0.35)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 rounded-xl sm:rounded-none"
            >
              <div className="absolute inset-0 w-1/2 h-full bg-white/30 skew-x-[45deg] -translate-x-full group-hover:translate-x-[300%]" />
              {isSubmitting ? (
                <Loader2 size={16} className="animate-spin text-black" />
              ) : (
                <span className="flex items-center gap-2 font-mono font-bold">
                  <ShieldCheck size={14} /> SIGN IN
                </span>
              )}
            </button>
          </div>

          {/* OAuth Divider */}
          <div className="flex items-center gap-4 my-2">
            <span className="flex-1 h-[1px] bg-white/15"></span>
            <span className="text-[9px] uppercase tracking-[0.3em] text-gray-500 font-mono">Or</span>
            <span className="flex-1 h-[1px] bg-white/15"></span>
          </div>

          {/* Google OAuth Button */}
          <a
            href="https://pneuma-api-0bvr.onrender.com/auth/google"
            className="w-full flex items-center justify-center gap-3 bg-black/80 backdrop-blur-md border border-white/15 py-3.5 px-4 text-white/90 text-xs font-mono tracking-wider no-underline transition-all hover:bg-white hover:text-black hover:border-white shadow-lg group rounded-xl sm:rounded-none"
          >
            <GoogleIcon />
            <span className="truncate">Continue with Google</span>
          </a>

          {/* Sign Up Link */}
          <div className="text-center pt-4 border-t border-white/10 mt-2">
            <p className="text-xs text-gray-400 font-sans">
              Don't have an account?{" "}
              <Link to="/register" className="text-red-500 font-bold font-mono tracking-wider hover:text-red-400 hover:underline uppercase ml-1">
                 Sign up 
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginInput;