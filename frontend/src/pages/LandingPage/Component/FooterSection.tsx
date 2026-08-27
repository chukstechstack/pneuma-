import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Terminal, Plus, Minus, ShieldAlert } from "lucide-react";

export const FooterSection: React.FC = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const faqs = [
    {
      code: "PROTOCOL_01",
      question: "WHAT IS PNEUMA'S CORE MISSION?",
      answer:
        "Direct-action humanitarian deployment. We override bureaucracy to land aid, resources, and human defense directly into war zones, extreme poverty, and isolated crises.",
    },
    {
      code: "PROTOCOL_02",
      question: "HOW DO FIELD DEPLOYMENTS WORK?",
      answer:
        "We operate outside corporate committees. Tactical volunteers and funds deploy within hours of alert confirmation directly to boots on the ground.",
    },
    {
      code: "PROTOCOL_03",
      question: "IS PNEUMA AFFILIATED WITH ANY GOVERNMENT?",
      answer:
        "Zero political binding. Zero corporate oversight. Complete operational independence focused 100% on preserving human lives.",
    },
    {
      code: "PROTOCOL_04",
      question: "WHERE DOES CAPITAL ALLOCATION GO?",
      answer:
        "100% to field assets, emergency trauma medical kits, food lines, and rapid extraction/shelter infrastructure.",
    },
  ];

  return (
    <footer className="w-full bg-[#030305] text-white pt-20 pb-12 border-t border-white/10 font-mono relative overflow-hidden select-none">

      {/* 1. CRAZY GIANT SCROLLING MARQUEE HEADER */}
      <div className="w-full border-b border-white/10 pb-8 overflow-hidden whitespace-nowrap opacity-90">
        <div className="inline-block animate-marquee tracking-tighter font-black text-[14vw] leading-none uppercase text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-emerald-200 to-white">
          NO PERMISSION REQUIRED // DEFEND HUMANITY // DISPATCH NOW //
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto px-6 md:px-12 py-16">

        {/* 2. UNCONVENTIONAL ASYMMETRIC COMMAND SYSTEM */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

          {/* LEFT: MONOLITHIC FAQ MANIFEST (7 COLS) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-3 text-emerald-500 text-xs font-bold tracking-[0.3em] uppercase mb-8">
              <Terminal size={16} /> [SYSTEM DECLASSIFIED MANIFEST]
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = activeFaq === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className={`cursor-pointer transition-all duration-200 border-l-2 p-6 bg-[#07070c] ${isOpen
                        ? "border-emerald-500 bg-emerald-950/10"
                        : "border-white/10 hover:border-white/40"
                      }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] text-emerald-500 font-bold tracking-widest">
                          {faq.code}
                        </span>
                        <h4 className="text-sm sm:text-base font-black tracking-wider text-white uppercase">
                          {faq.question}
                        </h4>
                      </div>
                      <div className="text-emerald-500">
                        {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                      </div>
                    </div>

                    {isOpen && (
                      <p className="mt-4 text-xs sm:text-sm font-sans text-gray-300 leading-relaxed pl-16 border-t border-white/5 pt-3">
                        {faq.answer}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: MASSIVE TACTICAL DISPATCH CTA TERMINAL (5 COLS) */}
          <div className="lg:col-span-5 bg-[#080a0f] border-2 border-emerald-500/40 p-8 sm:p-10 rounded-none relative flex flex-col justify-between min-h-[500px]">
            {/* Top Status Lights */}
            <div className="flex justify-between items-center border-b border-white/10 pb-6 mb-8">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <ShieldAlert size={18} className="text-emerald-500" />
            </div>

            {/* Core Direct Message */}
            <div className="space-y-6">
              <h3 className="text-4xl sm:text-6xl font-black text-white uppercase leading-[0.85] tracking-tighter">
                OVERRIDE <br />
                <span className="text-emerald-500">JOIN OUR COMMUNITY.</span>
              </h3>
              <p className="text-xs sm:text-sm font-sans text-gray-400 leading-relaxed">
                We don't do newsletter footers or generic email signups. If you want to stand on the front lines, support field triage, or fund active deployments, enter the matrix immediately.
              </p>
            </div>

            {/* Giant Action Button - Kept Red for urgent CTA visibility */}
            <div className="mt-10 pt-6 border-t border-white/10">
              <Link
                to="/register"
                className="w-full py-6 bg-red-600 hover:bg-red-500 text-white font-black text-sm tracking-[0.2em] uppercase flex items-center justify-between px-8 transition-colors duration-150"
              >
                <span>  Join us   </span>
                <ArrowUpRight size={22} strokeWidth={3} />
              </Link>
            </div>
          </div>

        </div>

        {/* 3. HARDWARE INDUSTRIAL DIRECTORY BAR */}
        <div className="mt-24 pt-12 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-8 text-xs uppercase font-bold tracking-widest">
          <div>
            <span className="text-gray-600 block mb-3">// NAVIGATION</span>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#about-us" className="hover:text-emerald-500">[02] WHO WE ARE</a></li>
              <li><a href="#triage" className="hover:text-emerald-500">[03] THE CRISIS</a></li>
              <li><a href="#solutions" className="hover:text-emerald-500">[04] SOLUTIONS</a></li>
            </ul>
          </div>

          <div>
            <span className="text-gray-600 block mb-3">// NETWORK</span>
            <ul className="space-y-2 text-gray-300">
              <li><a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-emerald-500">GITHUB_SRC</a></li>
              <li><a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-emerald-500">NETWORK_X</a></li>
            </ul>
          </div>

          <div>
            <span className="text-gray-600 block mb-3">// ENCRYPTION</span>
            <p className="text-gray-500 font-mono text-[10px]">
              AES_256_GCM <br />
              PNEUMA_PROTOCOL_V4
            </p>
          </div>

          <div className="text-right flex flex-col justify-between">
            <span className="text-emerald-500">// ALL SYSTEMS NOMINAL</span>
            <p className="text-gray-600 text-[10px]">
              &copy; {new Date().getFullYear()} PNEUMA PROTOCOL
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
};