import React from "react";
import { Link } from "react-router-dom";
import { motion, MotionValue } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";

interface HeroProps {
  heroScale: MotionValue<number>;
  heroOpacity: MotionValue<number>;
  heroY: MotionValue<number>;
}

export const Hero: React.FC<HeroProps> = ({ heroScale, heroOpacity, heroY }) => {
  return (
    <motion.div 
      style={{ scale: heroScale, opacity: heroOpacity, y: heroY }}
      className="sticky top-20 z-10 origin-top sticky-hero-wrap"
    >
      <section className="relative min-h-[75vh] flex flex-col justify-center items-center px-6 pt-24 pb-6 text-center animate-hero-reveal">
        
        {/* Cinematic Yellowish Rating Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-[#d4af37]/40 bg-[#d4af37]/10 backdrop-blur-md mb-8 shadow-[0_0_25px_rgba(212,175,55,0.18)]"
        >
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={15} 
                fill="#d4af37" 
                className="text-[#d4af37] drop-shadow-[0_0_8px_rgba(212,175,55,0.9)]" 
              />
            ))}
          </div>
          <span className="h-3 w-[1px] bg-[#d4af37]/40"></span>
          <span className="text-xs font-mono font-semibold uppercase tracking-[0.2em] text-[#d4af37]">
            Rated 4.9/5 by 1,200+ Believers
          </span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-serif text-5xl sm:text-7xl lg:text-8xl font-bold tracking-[0.15em] uppercase text-white mb-6 max-w-5xl leading-[1.1]"
        >
          Koinonia
        </motion.h1>

        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: "80px" }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="h-[2px] bg-[#d4af37]/60 mx-auto mb-8 shadow-[0_0_10px_#d4af37]" 
        />

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-gray-200 text-lg sm:text-xl font-normal max-w-3xl mx-auto mb-10 leading-[1.8] tracking-wide"
        >
          Record your daily wins and losses like a personal diary, solve life's challenges together in a Christian Q&A community, and turn your life story into a published book for your children.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full max-w-md mx-auto sm:max-w-none mb-6"
        >
          <Link 
            to="/register" 
            className="w-full sm:w-auto border border-[#d4af37]/60 px-10 py-4 text-sm font-bold uppercase tracking-[0.25em] text-[#d4af37] bg-[#d4af37]/10 hover:bg-[#d4af37] hover:text-[#010102] transition-all duration-300 shadow-[0_0_30px_rgba(212,175,55,0.2)] flex items-center justify-center gap-3 group"
          >
            <span>Start Your Diary</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link 
            to="/login" 
            className="w-full sm:w-auto border border-white/20 px-10 py-4 text-sm font-bold uppercase tracking-[0.25em] text-gray-200 hover:border-white hover:text-white transition-all duration-300 flex items-center justify-center shadow-sm"
          >
            Sign In
          </Link>
        </motion.div>
      </section>
    </motion.div>
  );
};