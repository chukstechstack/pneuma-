import React from "react";
import { Link } from "react-router-dom";
import { BookMarked, Sparkles, ArrowLeft } from "lucide-react";
import doveLogoUrl from "@assets/pneuma.png";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-[#010102] text-white font-sans selection:bg-[#d4af37]/30 selection:text-[#d4af37] flex flex-col lg:flex-row overflow-x-hidden">
      
      {/* Left Panel: Cinematic Brand / Story */}
      <div className="lg:w-[45%] relative bg-gradient-to-br from-[#09090b] via-[#010102] to-[#121008] border-r border-white/[0.06] p-8 sm:p-12 lg:p-14 flex flex-col justify-between">
        {/* Glowing Background Accent */}
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#d4af37]/10 via-transparent to-transparent blur-[80px] pointer-events-none" />

        {/* Top: Logo */}
        <div className="max-w-md lg:ml-auto lg:pr-4 w-full">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <img src={doveLogoUrl} className="w-7 h-7 object-contain filter contrast-125 group-hover:scale-105 transition-transform" alt="Logo" />
            <span className="font-serif text-lg tracking-[0.3em] font-bold text-white">PNEUMA</span>
          </Link>
        </div>

        {/* Middle: Mission Statement */}
        <div className="max-w-md lg:ml-auto lg:pr-4 w-full my-auto py-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 mb-5">
            <Sparkles size={13} className="text-[#d4af37]" />
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#d4af37]">Faith & Legacy Portfolio</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-4xl font-bold tracking-wide uppercase text-white mb-4 leading-[1.2]">
            Publish your life journey as a referenced book.
          </h2>

          <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-6 font-normal">
            Record your daily wins, defeats, and prayers in your private diary. Compile your spiritual walk into an organized memoir and pass down a true heritage to your children and grandchildren.
          </p>

          <div className="flex items-center gap-3 text-[11px] font-mono tracking-widest text-[#d4af37] uppercase">
            <BookMarked size={16} />
            <span>Habakkuk 2:2 // Write the vision & make it plain</span>
          </div>
        </div>

        {/* Bottom: Copyright */}
        <div className="max-w-md lg:ml-auto lg:pr-4 w-full text-[11px] font-mono text-gray-500 tracking-widest">
          © {new Date().getFullYear()} PNEUMA. All rights reserved.
        </div>
      </div>

      {/* Right Panel: Form Container with Back Button */}
      <div className="lg:w-[55%] flex flex-col justify-between p-8 sm:p-12 lg:p-16 relative bg-[#010102]">
        
        {/* Top Bar: Back to Landing Link */}
        <div className="w-full max-w-md mx-auto mb-4">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-gray-400 hover:text-[#d4af37] transition-colors group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            <span>Return to Home</span>
          </Link>
        </div>

        {/* Main Content Area */}
        <div className="w-full max-w-md mx-auto my-auto">
          {children}
        </div>

        {/* Empty footer spacer to balance layout alignment */}
        <div className="w-full max-w-md mx-auto mt-4"></div>
      </div>
    </div>
  );
};