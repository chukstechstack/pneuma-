import React, { useState } from "react";
import { Eye, EyeOff, Loader2, Terminal, ShieldCheck, KeyRound } from "lucide-react";
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
    <div className="w-full max-w-md relative">
      
      {/* Terminal HUD Header Status */}
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/10 font-mono text-[10px] tracking-[0.3em] text-emerald-400 uppercase">
        <span className="flex items-center gap-2">
          <Terminal size={12} className="animate-pulse" /> SYS_AUTH_GATEWAY
        </span>
        <span className="text-gray-500 font-bold">[NODE_SECURE]</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="font-black text-3xl sm:text-4xl tracking-tight text-white uppercase mb-2 leading-none">
          Access <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-emerald-400">Terminal</span>
        </h1>
        <p className="text-gray-400 font-sans text-xs sm:text-sm tracking-wide leading-relaxed">
          Authenticate credentials to resume your session on the global Pneuma secure network.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        
        {/* Email */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400">
            Email Address // Comms Route
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

        {/* Password */}
        <div className="flex flex-col gap-1.5 w-full">
          <div className="flex items-center justify-between">
            <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400">
              Cipher Key // Password
            </label>
            <Link to="/forgotpassword" className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 hover:text-emerald-300 hover:underline">
              [ Reset Cipher? ]
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
          {errors.password && (
            <p className="text-[10px] font-mono text-rose-400 mt-0.5">{getErrMsg(errors.password)}</p>
          )}
        </div>

        {/* Remember Device Toggle */}
        <div className="flex items-center gap-2.5 py-1">
          <input
            type="checkbox"
            id="rememberDevice"
            {...register("rememberDevice")}
            className="w-4 h-4 rounded-none border-white/20 bg-black/90 text-emerald-500 focus:ring-0 cursor-pointer accent-emerald-500"
          />
          <label htmlFor="rememberDevice" className="text-xs text-gray-400 font-mono tracking-wider cursor-pointer select-none">
            Persist Session Token
          </label>
        </div>

        {/* Submit Button */}
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
                <ShieldCheck size={14} /> AUTHORIZE ENTRY
              </span>
            )}
          </button>
        </div>

        {/* OAuth Divider */}
        <div className="flex items-center gap-4 my-2">
          <span className="flex-1 h-[1px] bg-white/15"></span>
          <span className="text-[9px] uppercase tracking-[0.3em] text-gray-500 font-mono">Alternative Protocol</span>
          <span className="flex-1 h-[1px] bg-white/15"></span>
        </div>

        {/* Google OAuth Button */}
        <a
          href="https://pneuma-api-0bvr.onrender.com/auth/google"
          className="w-full flex items-center justify-center gap-3 bg-black/90 border border-white/20 py-3.5 text-white/90 text-xs font-mono tracking-wider no-underline transition-all hover:bg-white hover:text-black hover:border-white shadow-lg group"
        >
          <GoogleIcon />
          <span>AUTH // GOOGLE_SSO</span>
        </a>

        <div className="text-center pt-4 border-t border-white/10 mt-2">
          <p className="text-xs text-gray-400 font-sans">
            No operative clearance?{" "}
            <Link to="/register" className="text-emerald-400 font-bold font-mono tracking-wider hover:text-emerald-300 hover:underline uppercase ml-1">
              [ ESTABLISH IDENTITY ]
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginInput;