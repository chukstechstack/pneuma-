import React, { useState } from "react";
import { Eye, EyeOff, Loader2, Mail, Lock, ArrowRight } from "lucide-react";
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
    <div className="w-full max-w-[360px]">
      {/* Header */}
      <div className="mb-5">
        <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-wider text-white mb-1 uppercase">
          Welcome Back
        </h1>
        <p className="text-gray-400 text-xs leading-relaxed">
          Sign in to continue journaling and building your legacy book.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3.5">
        
        {/* Email */}
        <div className="flex flex-col gap-1 w-full">
          <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
              <Mail size={16} />
            </div>
            <input
              {...register("email")}
              type="email"
              placeholder="name@example.com"
              className={`w-full pl-10 pr-3.5 bg-black/60 border rounded-lg py-3.5 text-white text-xs outline-none transition-all placeholder:text-gray-600 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] [&:-webkit-autofill]:[box-shadow:0_0_0_1000px_#09090b_inset_!important] [&:-webkit-autofill]:[-webkit-text-fill-color:white_!important] ${
                errors.email ? "border-red-500/80 bg-red-500/5" : "border-white/10"
              }`}
            />
          </div>
          {errors.email && <p className="text-[10px] text-red-400 mt-0.5 pl-0.5">{getErrMsg(errors.email)}</p>}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1 w-full">
          <div className="flex items-center justify-between">
            <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400">
              Password
            </label>
            <Link to="/forgotpassword" className="text-xs text-[#d4af37] hover:underline font-medium">
              Forgot password?
            </Link>
          </div>
          <div className="relative w-full flex items-center">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
              <Lock size={16} />
            </div>
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className={`w-full pl-10 pr-10 bg-black/60 border rounded-lg py-3.5 text-white text-xs outline-none transition-all placeholder:text-gray-600 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] [&:-webkit-autofill]:[box-shadow:0_0_0_1000px_#09090b_inset_!important] [&:-webkit-autofill]:[-webkit-text-fill-color:white_!important] ${
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
          {errors.password && (
            <p className="text-[10px] text-red-400 mt-0.5 pl-0.5">{getErrMsg(errors.password)}</p>
          )}
        </div>

        {/* Remember Device Toggle */}
        <div className="flex items-center gap-2 mt-0.5">
          <input
            type="checkbox"
            id="rememberDevice"
            {...register("rememberDevice")}
            className="w-4 h-4 rounded border-white/20 bg-black/60 text-[#d4af37] focus:ring-[#d4af37] cursor-pointer"
          />
          <label htmlFor="rememberDevice" className="text-xs text-gray-400 cursor-pointer select-none">
            Remember this device
          </label>
        </div>

        {/* Submit Button */}
        <div className="mt-1">
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full border border-[#d4af37]/60 py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-[#d4af37] bg-[#d4af37]/10 hover:bg-[#d4af37] hover:text-[#010102] transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.15)] flex items-center justify-center gap-2 group rounded-lg cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>

        {/* OAuth Divider */}
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
          <span>Sign in with Google</span>
        </a>

        <p className="text-center text-xs text-gray-400 pt-1">
          Don't have an account yet?{" "}
          <Link to="/register" className="text-[#d4af37] font-semibold hover:underline">
            Join Us
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginInput;