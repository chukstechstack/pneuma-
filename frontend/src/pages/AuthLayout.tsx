import React from "react";
import { Link } from "react-router-dom";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import doveLogoUrl from "@assets/pneuma.png";

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const earthAwsUrl = "https://pneuma-public-assets.s3.eu-north-1.amazonaws.com/Auth+Image/Authentication+Image+Aug+24%2C+2026%2C+06_04_42+PM.jpg";

  return (
    <div className="min-h-screen bg-[#030305] text-white font-sans selection:bg-rose-500/35 selection:text-rose-400 flex flex-col lg:flex-row overflow-x-hidden">
      
      {/* LEFT PANEL: Cinematic AWS S3 Earth Feed & Seamless Blending */}
      <div className="lg:w-[50%] relative bg-[#010103] hidden lg:flex flex-col justify-between p-12 lg:p-16 overflow-hidden transform-gpu">
        
        {/* Absolute Background Earth Image with Left Focal Shift & Right Blend */}
        <div className="absolute inset-0 z-0 bg-[#010103]">
          <img
            src={earthAwsUrl}
            alt="Orbital Earth Recon"
            loading="eager"
            decoding="async"
            className="w-full h-full object-cover object-left brightness-[0.75] contrast-125 scale-105 transform-gpu"
          />
          
          {/* Heavy Right Fade-to-Black Gradient */}
          <div className="absolute inset-y-0 right-0 w-64 bg-gradient-to-l from-[#010103] via-[#010103]/80 to-transparent pointer-events-none z-10" />

          {/* Vignettes and Edge Sweeps */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#010103_85%)] pointer-events-none" />
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#010103] via-[#010103]/60 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#010103] via-[#010103]/90 to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#010103] to-transparent pointer-events-none" />
        </div>

        {/* Top Branding on the Left Image Panel */}
        <div className="relative z-10 w-full flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <img src={doveLogoUrl} className="w-7 h-7 object-contain filter contrast-125 group-hover:scale-105 transition-transform" alt="Logo" />
            <span className="font-mono text-sm tracking-[0.4em] font-black text-white">PNEUMA</span>
          </Link>
        </div>

        {/* Bottom Ticker */}
        <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-gray-500 tracking-widest">
          <span>PNEUMA COMMAND PROTOCOL</span>
          <div className="flex items-center gap-2 text-white/40">
            <ShieldAlert size={12} className="text-rose-500" />
            <span>ENCRYPTED LINK</span>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: The Action Zone (Registration / Login Form) */}
      <div className="lg:w-[50%] flex flex-col justify-between p-8 sm:p-12 lg:p-16 relative bg-[#030305] z-10">
        
        {/* Top Bar: Brand (mobile view) & Visible Back Link */}
        <div className="w-full max-w-md mx-auto flex items-center justify-between mb-8">
          <Link to="/" className="lg:hidden inline-flex items-center gap-3 group">
            <img src={doveLogoUrl} className="w-7 h-7 object-contain filter contrast-125" alt="Logo" />
            <span className="font-mono text-sm tracking-[0.4em] font-black text-white">PNEUMA</span>
          </Link>

          <Link 
            to="/" 
            className="ml-auto inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-gray-400 hover:text-rose-400 transition-colors group"
          >
            <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
            <span> Back</span>
          </Link>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-md mx-auto my-auto">
          {children}
        </div>

        {/* Bottom Terminal Footer */}
        <div className="w-full max-w-md mx-auto mt-8 flex items-center justify-between text-[10px] font-mono text-gray-600 tracking-widest">
          <span>SECURE_SESSION // v4.08</span>
          <span className="text-rose-500/80 animate-pulse">● LIVE ENCRYPTION</span>
        </div>
      </div>

    </div>
  );
};