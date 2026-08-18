import React from "react";
import { Link } from "react-router-dom";
import { BookMarked, Sparkles } from "lucide-react";
import doveLogoUrl from "@assets/pneuma.png";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-[#010102] text-white font-sans selection:bg-[#d4af37]/30 selection:text-[#d4af37] flex flex-col lg:flex-row">
      
      {/* Left Panel: Cinematic Brand / Story */}
      <div className="lg:w-1/2 relative bg-gradient-to-br from-[#09090b] via-[#010102] to-[#121008] border-r border-white/[0.06] p-8 sm:p-12 lg:p-16 flex flex-col justify-between overflow-hidden">
        {/* Glowing Background Accent */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#d4af37]/15 via-transparent to-transparent blur-[80px] pointer-events-none" />

        {/* Top: Logo */}
        <div>
          <Link to="/" className="inline-flex items-center gap-3 group">
            <img src={doveLogoUrl} className="w-8 h-8 object-contain filter contrast-125 group-hover:scale-105 transition-transform" alt="Logo" />
            <span className="font-serif text-xl tracking-[0.3em] font-bold text-white">PNEUMA</span>
          </Link>
        </div>

        {/*=======Middle: Mission Statement===============*/}
        <div className="my-auto py-12 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#d4af37]/40 bg-[#d4af37]/10 mb-6">
            <Sparkles size={14} className="text-[#d4af37]" />
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#d4af37]">Faith & Legacy Portfolio</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-wide uppercase text-white mb-6 leading-[1.15]">
            Publish your life journey as a referenced book.
          </h2>

          <p className="text-gray-300 text-base sm:text-lg font-normal leading-relaxed mb-8">
            Record your daily wins, defeats, and prayers in your private diary. Compile your spiritual walk into an organized memoir and pass down a true heritage to your children and grandchildren.
          </p>

          <div className="flex items-center gap-4 text-xs font-mono tracking-widest text-[#d4af37] uppercase">
            <BookMarked size={18} />
            <span>Habakkuk 2:2 // Write the vision & make it plain</span>
          </div>
        </div>

        {/* Bottom: Copyright */}
        <div className="text-xs font-mono text-gray-400 tracking-widest">
          © {new Date().getFullYear()} PNEUMA. All rights reserved.
        </div>
      </div>

      {/* Right Panel: Form Container */}
      <div className="lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16 relative">
        <div className="w-full max-w-md mx-auto">
          <div className="mb-8">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-wider text-white mb-2">{title}</h1>
            <p className="text-gray-400 text-sm sm:text-base">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};