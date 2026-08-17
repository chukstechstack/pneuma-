import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { LoginInputProps } from "./LoginInput.types";
import { GoogleIcon } from "./GoogleIcon";

const LoginInput: React.FC<LoginInputProps> = ({ register, errors = {}, handleSubmit, onSubmit }) => {
  const [showPassword, setShowPassword] = useState(false);

  const getErrMsg = (err: any) => (typeof err === "string" ? err : err?.message);

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        
        {/* Email */}
        <div className="flex flex-col gap-1.5 w-full">
          <input
            {...register("email")}
            type="email"
            placeholder="Email address"
            className={`w-full bg-[#060609] border rounded-xl px-4 py-4 text-white text-sm tracking-wide outline-none transition-all duration-500 placeholder:text-white/50 focus:border-[#d4af37]/70 focus:bg-[#0c0c12] focus:shadow-[0_0_25px_rgba(212,175,55,0.08)] ${
              errors.email ? "border-red-500/80 bg-red-500/5" : "border-white/[0.08]"
            }`}
          />
          {errors.email && <p className="text-xs text-red-400 tracking-wide mt-1 pl-1">{getErrMsg(errors.email)}</p>}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5 w-full">
          <div className="relative w-full flex items-center">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className={`w-full bg-[#060609] border rounded-xl px-4 py-4 pr-12 text-white text-sm tracking-wide outline-none transition-all duration-500 placeholder:text-white/50 focus:border-[#d4af37]/70 focus:bg-[#0c0c12] focus:shadow-[0_0_25px_rgba(212,175,55,0.08)] ${
                errors.password ? "border-red-500/80 bg-red-500/5" : "border-white/[0.08]"
              }`}
            />
            <button
              type="button"
              className="absolute right-4 bg-transparent border-none text-white/40 cursor-pointer flex items-center justify-center hover:text-white transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-400 tracking-wide mt-1 pl-1">{getErrMsg(errors.password)}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="mt-4">
          <button 
            className="w-full bg-gradient-to-r from-[#d4af37] via-[#e2be52] to-[#d4af37] text-[#010102] py-4 text-xs font-bold uppercase tracking-[0.3em] rounded-xl cursor-pointer transition-all duration-500 shadow-[0_4px_30px_rgba(212,175,55,0.2)] hover:shadow-[0_6px_40px_rgba(212,175,55,0.35)] hover:scale-[1.01] active:scale-[0.99]" 
            type="submit"
          >
            Continue
          </button>
        </div>

        {/* OAuth Divider */}
        <div className="flex items-center gap-4 my-2">
          <span className="flex-1 h-[1px] bg-white/[0.06]"></span>
          <span className="text-[10px] uppercase tracking-[0.25em] text-white/40 font-medium">or</span>
          <span className="flex-1 h-[1px] bg-white/[0.06]"></span>
        </div>

        {/* Google OAuth Button */}
        <a
          href="https://pneuma-api-0bvr.onrender.com/auth/google"
          className="w-full flex items-center justify-center gap-3 bg-[#060609] border border-white/[0.08] rounded-xl py-4 text-white/90 text-sm font-medium no-underline transition-all duration-300 hover:bg-[#0c0c12] hover:border-white/20 shadow-sm"
        >
          <GoogleIcon />
          <span>Sign up with Google</span>
        </a>
      </form>
    </div>
  );
};

export default LoginInput;