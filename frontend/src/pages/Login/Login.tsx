import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Sparkles, ShieldCheck, KeyRound, ArrowLeft } from "lucide-react";

import { loginSchema } from "../../schemas/auth_Schema.js";
import LoginInput from "@/components/Login/LoginInput.js";
import FullPageLoader from "@components/Loader.jsx";
import doveLogoUrl from "@assets/pneuma.png";

import { LoginFormValues } from "./Login.types.js";
import { useLoginMutation } from "./useLoginMutation.js";

const Login = () => {
  const navigate = useNavigate();
  const { mutate: loginUser, isPending } = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <main className="min-h-screen bg-[#010102] text-white flex flex-col lg:flex-row font-sans selection:bg-[#d4af37]/30 selection:text-[#d4af37] relative overflow-x-hidden">
      {isPending && <FullPageLoader />}

      {/* ================= LEFT SIDE: CINEMATIC BRANDING PANEL ================= */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-[#07070a] via-[#010102] to-[#120f04] p-16 flex-col justify-between border-r border-white/[0.06] overflow-hidden">
        
        {/* Abstract Gold Light Orbs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#d4af37]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.07)_0%,_transparent_70%)] blur-[100px] pointer-events-none" />

        {/* Top Header Link */}
        <div className="relative z-10 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-3 group text-white no-underline">
            <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center group-hover:border-[#d4af37]/50 transition-colors shadow-lg">
              <img src={doveLogoUrl} className="w-5 h-5 object-contain filter contrast-125 group-hover:scale-110 transition-transform" alt="Logo" />
            </div>
            <span className="font-serif text-lg tracking-[0.3em] font-bold">PNEUMA</span>
          </Link>

          <Link to="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/50 hover:text-[#d4af37] transition-colors">
            <ArrowLeft size={14} /> Return Home
          </Link>
        </div>

        {/* Center Editorial Statement */}
        <div className="relative z-10 max-w-lg my-auto py-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 text-[#d4af37] text-xs font-semibold uppercase tracking-[0.3em] mb-8 shadow-sm">
            <Sparkles size={14} /> Welcome Back, Keeper
          </div>
          <h2 className="font-serif text-4xl xl:text-5xl font-bold tracking-[0.05em] uppercase leading-[1.2] mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-[#d4af37]/80">
            Pick up where your legacy left off.
          </h2>
          <p className="text-gray-400 text-base leading-relaxed font-light">
            Your daily entries, compiled wisdom, and private fellowship await your return. Re-enter your sanctuary.
          </p>
        </div>

        {/* Bottom Trust Indicators */}
        <div className="relative z-10 flex items-center gap-8 text-xs text-white/40 uppercase tracking-[0.2em] font-medium border-t border-white/5 pt-6">
          <span className="flex items-center gap-2"><ShieldCheck size={16} className="text-[#d4af37]" /> Secure Access</span>
          <span className="flex items-center gap-2"><KeyRound size={16} className="text-[#d4af37]" /> Encrypted Vault</span>
        </div>
      </div>

      {/* ================= RIGHT SIDE: FORM CONTAINER ================= */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-20 relative">
        
        {/* Mobile Header Banner */}
        <div className="absolute top-6 left-6 lg:hidden">
          <Link to="/" className="inline-flex items-center gap-2 text-white no-underline">
            <img src={doveLogoUrl} className="w-6 h-6 object-contain filter contrast-125" alt="Logo" />
            <span className="font-serif text-sm tracking-[0.3em] font-bold">PNEUMA</span>
          </Link>
        </div>

        <div className="w-full max-w-[460px] relative z-10 mt-12 lg:mt-0">
          
          {/* Form Header */}
          <header className="mb-10 text-center lg:text-left">
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-[0.08em] uppercase text-white mb-3">
              Welcome Back
            </h1>
            <p className="text-gray-400 text-sm tracking-wide">
              Enter your sanctuary to document your journey.
            </p>
            <div className="w-12 h-[2px] bg-[#d4af37] mt-4 mx-auto lg:mx-0 shadow-[0_0_12px_#d4af37]"></div>
          </header>

          <LoginInput
            register={register}
            errors={errors}
            handleSubmit={handleSubmit}
            onSubmit={loginUser}
          />

          {/* Form Footer */}
          <footer className="text-center mt-10 pt-6 border-t border-white/[0.06] text-sm text-gray-400 flex items-center justify-center gap-2">
            <span>New to the archive?</span>
            <span
              onClick={() => navigate("/register")}
              className="text-[#d4af37] font-bold tracking-[0.1em] uppercase text-xs cursor-pointer hover:underline transition-all"
            >
              Join Us
            </span>
          </footer>

        </div>
      </div>
    </main>
  );
};

export default Login;