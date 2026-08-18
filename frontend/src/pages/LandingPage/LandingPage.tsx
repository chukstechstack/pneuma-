import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useScroll, useTransform } from "framer-motion";
import { 
  BookOpen, MessageSquareCode, Menu, X, 
  ChevronDown, Quote, HeartHandshake, BookMarked, Flame, Lock, Star, ArrowRight 
} from "lucide-react";
import doveLogoUrl from "@assets/pneuma.png";
import { Hero } from "./Hero"; // <-- Imported extracted Hero component

export const LandingPage: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [starBurst, setStarBurst] = useState(false);

  // Framer Motion Ref for scroll effects
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Desktop-only scroll animations (disabled on mobile via CSS)
  const heroScale = useTransform(scrollYProgress, [0, 0.25], [1, 0.92]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0.2]);
  const heroY = useTransform(scrollYProgress, [0, 0.25], [0, 80]);

  const [introPhase, setIntroPhase] = useState<"animating" | "fading" | "done">(() => {
    const hasSeenIntro = sessionStorage.getItem("pneuma_intro_seen");
    return hasSeenIntro ? "done" : "animating";
  });

  useEffect(() => {
    if (introPhase === "done") return;
    const timer1 = setTimeout(() => setIntroPhase("fading"), 2800);
    const timer2 = setTimeout(() => {
      setIntroPhase("done");
      sessionStorage.setItem("pneuma_intro_seen", "true");
    }, 3600);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [introPhase]);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleRatingInteraction = (index: number) => {
    setActiveTestimonial(index);
    setStarBurst(true);
    setTimeout(() => setStarBurst(false), 500);
  };

  const faqs = [
    {
      q: "How does the daily diary and life portfolio work?",
      a: "Every day, you can record your wins, losses, reflections, and prayers like a personal diary. Over time, Pneuma aggregates these memories, organizing them so you can easily review your spiritual journey or compile them into a published book for your children and grandchildren."
    },
    {
      q: "What is the 'Stack Overflow for Christians' feature?",
      a: "It's a dedicated Q&A space where believers can post personal struggles, life challenges, or theological questions. Other members of the community chime in with advice, scriptural wisdom, and practical solutions, ensuring you never walk through trials alone."
    },
    {
      q: "Is my daily diary private or public?",
      a: "Your daily diary and life records are completely private by default. You have full control over what remains in your personal archive versus what you choose to share in the community Q&A or fellowship boards."
    },
    {
      q: "Can I actually publish my journal entries into a real book?",
      a: "Yes! Pneuma's vision is to help you document your walk with God so deeply that when you are older, your compiled diaries form a rich portfolio and memoir that you can print, publish, and pass down as a heritage to your children."
    }
  ];

  const partners = [
    "Grace Fellowship", "Sanctuary Network", "Kingdom Media", "Eclesia Labs", 
    "Veritas Capital", "Agape Group", "Covenant Collective", "Theology Foundation"
  ];

  const testimonials = [
    {
      text: "The idea of turning my personal prayer and diary entries into a published book for my children is priceless. Pneuma gives my daily walk an eternal purpose beyond social media noise.",
      name: "Michael Chang",
      role: "Software Architect",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      rating: 5
    },
    {
      text: "Having a Stack Overflow style platform for spiritual and life problems is genius. Getting answers grounded in faith instead of secular algorithms has been a true blessing.",
      name: "Elena Rostova",
      role: "Ministry Leader",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
      rating: 5
    },
    {
      text: "Pneuma brings accountability to my quiet times. The anonymous options let me discuss leadership burnout with absolute safety and profound biblical feedback.",
      name: "Pastor David Vance",
      role: "Community Director",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80",
      rating: 5
    }
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-[#010102] text-white font-sans selection:bg-[#d4af37]/30 selection:text-[#d4af37] relative overflow-x-hidden text-base sm:text-lg">
      
      {introPhase !== "done" && (
        <div className={`fixed inset-0 z-50 bg-[#010102] flex items-center justify-center transition-opacity duration-800 ${introPhase === "fading" ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
          <div className="flex items-center justify-center overflow-hidden py-10 px-4 w-full">
            <h1 className="font-serif text-6xl sm:text-8xl lg:text-9xl font-bold tracking-[0.25em] uppercase flex items-center justify-center">
              <span className="inline-block animate-smooth-slide-left text-gray-200">PNEU</span>
              <span className="inline-block animate-smooth-slide-right text-white animate-shine-bright">MA</span>
            </h1>
          </div>
        </div>
      )}

      <style>{`
        @keyframes smoothSlideLeft { 0% { transform: translateX(-140vw); opacity: 0; } 50% { opacity: 1; } 100% { transform: translateX(0); opacity: 1; } }
        @keyframes smoothSlideRight { 0% { transform: translateX(140vw); opacity: 0; } 50% { opacity: 1; } 100% { transform: translateX(0); opacity: 1; } }
        @keyframes shineBright { 0%, 40% { text-shadow: 0 0 10px rgba(255,255,255,0.2); } 60% { text-shadow: 0 0 50px rgba(255,255,255,1), 0 0 100px rgba(212,175,55,0.8); color: #ffffff; } 100% { text-shadow: 0 0 20px rgba(255,255,255,0.5); } }
        @keyframes navSlideDown { 0% { transform: translateY(-100%); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
        @keyframes contentReveal { 0% { transform: translateY(20px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
        @keyframes infiniteTickerSlow { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes starPop { 0% { transform: scale(1); filter: drop-shadow(0 0 0px rgba(212,175,55,0)); } 50% { transform: scale(1.3); filter: drop-shadow(0 0 15px rgba(212,175,55,1)); } 100% { transform: scale(1); filter: drop-shadow(0 0 2px rgba(212,175,55,0.4)); } }
        .animate-smooth-slide-left { animation: smoothSlideLeft 1.8s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
        .animate-smooth-slide-right { animation: smoothSlideRight 1.8s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
        .animate-shine-bright { animation: shineBright 2.5s ease-in-out forwards; }
        .animate-nav-slide-top { animation: navSlideDown 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${introPhase === "done" && sessionStorage.getItem("pneuma_intro_seen") ? "0s" : "2.8s"} both; }
        .animate-hero-reveal { animation: contentReveal 1s cubic-bezier(0.16, 1, 0.3, 1) ${introPhase === "done" && sessionStorage.getItem("pneuma_intro_seen") ? "0s" : "2.9s"} both; }
        .animate-ticker-slow { animation: infiniteTickerSlow 45s linear infinite; }
        .animate-ticker-slow:hover { animation-play-state: paused; }
        .animate-star-burst { animation: starPop 0.4s ease-in-out forwards; }
        
        @media (max-width: 768px) {
          .sticky-hero-wrap { position: relative !important; top: 0 !important; transform: none !important; opacity: 1 !important; }
        }
      `}</style>

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#d4af37]/15 via-transparent to-transparent blur-[100px] pointer-events-none" />

      {/* ==================== NAVBAR ==================== */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#010102]/85 border-b border-white/[0.06] animate-nav-slide-top">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <img src={doveLogoUrl} className="w-8 h-8 object-contain filter contrast-125 group-hover:scale-105 transition-transform" alt="Logo" />
            <span className="font-serif text-xl tracking-[0.3em] font-bold text-white">PNEUMA</span>
          </Link>

          <div className="hidden lg:flex items-center gap-8 xl:gap-10 text-sm font-semibold uppercase tracking-[0.2em] text-gray-200">
            <a href="#vision" className="hover:text-[#d4af37] transition-colors">Vision</a>
            <a href="#diary" className="hover:text-[#d4af37] transition-colors">Daily Diary</a>
            <a href="#testimonials" className="hover:text-[#d4af37] transition-colors">Reviews</a>
            <a href="#faqs" className="hover:text-[#d4af37] transition-colors">FAQs</a>
          </div>

          <div className="hidden lg:flex items-center gap-6">
            <Link to="/login" className="text-sm uppercase tracking-[0.2em] font-semibold text-gray-200 hover:text-white transition-colors py-2 px-3">Sign In</Link>
            <Link to="/register" className="border border-[#d4af37]/50 px-6 py-2.5 text-sm font-bold uppercase tracking-[0.2em] text-[#d4af37] hover:bg-[#d4af37] hover:text-[#010102] transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.15)]">Enter Sanctuary</Link>
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 text-gray-200 hover:text-white focus:outline-none" aria-label="Toggle Menu">
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-24 left-0 w-full bg-[#010102]/95 border-b border-white/[0.06] px-8 py-8 flex flex-col gap-6 backdrop-blur-xl shadow-2xl">
            <a href="#vision" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-200 hover:text-[#d4af37]">Vision</a>
            <a href="#diary" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-200 hover:text-[#d4af37]">Daily Diary</a>
            <a href="#testimonials" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-200 hover:text-[#d4af37]">Reviews</a>
            <a href="#faqs" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-200 hover:text-[#d4af37]">FAQs</a>
            <div className="flex flex-col gap-3 pt-4 border-t border-white/[0.06]">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full py-3 text-center text-sm font-semibold uppercase tracking-[0.2em] border border-white/15 text-gray-200">Sign In</Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="w-full py-3 text-center text-sm font-bold uppercase tracking-[0.2em] border border-[#d4af37] text-[#d4af37] bg-[#d4af37]/10">Enter Sanctuary</Link>
            </div>
          </div>
        )}
      </nav>

      {/* ==================== RENDER EXTRACTED HERO ==================== */}
      <Hero heroScale={heroScale} heroOpacity={heroOpacity} heroY={heroY} />

      {/* ==================== SOCIAL PROOF SECTION ==================== */}
      <section className="relative z-20 py-8 px-6 max-w-4xl mx-auto">
        <div className="flex flex-col items-center justify-center gap-4 py-6 px-8 rounded-2xl border border-white/[0.1] bg-gradient-to-b from-white/[0.03] to-white/[0.01] backdrop-blur-xl shadow-2xl text-center">
          <div className="flex -space-x-3 overflow-hidden">
            <img className="inline-block h-11 w-11 rounded-full ring-2 ring-[#010102] object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="User" />
            <img className="inline-block h-11 w-11 rounded-full ring-2 ring-[#010102] object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="User" />
            <img className="inline-block h-11 w-11 rounded-full ring-2 ring-[#010102] object-cover" src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80" alt="User" />
            <img className="inline-block h-11 w-11 rounded-full ring-2 ring-[#010102] object-cover" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80" alt="User" />
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-1.5 text-[#d4af37]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill="#d4af37" className="text-[#d4af37]" />
              ))}
            </div>
            <span className="text-sm sm:text-base text-gray-200 font-medium tracking-wide">
              Trusted by <strong className="text-white font-semibold">1,200+ believers</strong> building their legacy
            </span>
          </div>

          <div className="mt-4 pt-6 border-t border-white/[0.06] max-w-lg mx-auto w-full text-center">
            <p className="italic font-medium text-sm sm:text-base text-gray-300 tracking-wider leading-relaxed">"Write the vision and make it plain on tablets, that he may run who reads it."</p>
            <span className="block font-serif text-[11px] tracking-[0.3em] text-[#d4af37] mt-2 font-semibold">HABAKKUK 2:2</span>
          </div>
        </div>
      </section>

      {/* ==================== FLOWING LOGO MARQUEE ==================== */}
      <div className="relative z-20 bg-[#010102] pt-10 shadow-[0_-20px_40px_rgba(1,1,2,0.9)]">
        <section className="w-full py-10 bg-[#010102] border-y border-white/[0.06] overflow-hidden relative">
          <div className="absolute top-0 bottom-0 left-0 w-32 sm:w-48 bg-gradient-to-r from-[#010102] via-[#010102]/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-32 sm:w-48 bg-gradient-to-l from-[#010102] via-[#010102]/80 to-transparent z-10 pointer-events-none" />

          <div className="max-w-7xl mx-auto px-6 mb-6 text-center">
            <p className="text-[11px] uppercase tracking-[0.3em] font-mono text-gray-400 font-semibold">
              Trusted by ministries, fellowships, and creators globally
            </p>
          </div>

          <div className="flex w-max items-center animate-ticker-slow whitespace-nowrap">
            {[...partners, ...partners].map((partner, index) => (
              <div 
                key={index} 
                className="inline-flex items-center gap-3 mx-6 px-6 py-3.5 rounded-xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm text-gray-300 font-serif text-xs sm:text-sm tracking-[0.2em] uppercase hover:text-[#d4af37] hover:border-[#d4af37]/40 hover:bg-[#d4af37]/[0.03] transition-all duration-300 cursor-default shadow-sm group"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]/60 group-hover:scale-125 transition-transform" />
                <span>{partner}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ==================== BENTO FEATURES GRID ==================== */}
        <section id="vision" className="py-28 px-6 max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-sm font-bold uppercase tracking-[0.3em] text-[#d4af37] block mb-3">The Core Mission</span>
            <h2 className="font-serif text-3xl sm:text-5xl tracking-[0.1em] text-white font-bold">What Pneuma Stands For</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <BookOpen size={28} strokeWidth={1.8} />, title: "1. Daily Life Diary", desc: "Log your daily wins, losses, struggles, and gratitude at the end of every day. Build a faithful record of your spiritual walk for future reference.", tag: "Private & Secure" },
              { icon: <MessageSquareCode size={28} strokeWidth={1.8} />, title: "2. Christian Q&A Hub", desc: "Facing a tough problem or spiritual trial? Post your questions to the community, receive practical advice, and find solutions rooted in God's word like Stack Overflow for believers.", tag: "Community Solutions" },
              { icon: <BookMarked size={28} strokeWidth={1.8} />, title: "3. Generational Book", desc: "Pneuma automatically compiles your life records into an organized portfolio. When you grow old, publish your memoirs as a physical book to show your children.", tag: "Generational Legacy" },
              { icon: <HeartHandshake size={28} strokeWidth={1.8} />, title: "4. Prayer & Testimonies", desc: "Post specific prayer requests and track them on your timeline. Once God moves, mark them with an 'Answered!' badge to encourage the entire fellowship.", tag: "Faith Builders" },
              { icon: <Flame size={28} strokeWidth={1.8} />, title: "5. Scripture Tagging", desc: "Tie your daily diary entries and life questions directly to Bible verses. See how God's living word intersects with your everyday human experiences.", tag: "Biblically Grounded" },
              { icon: <Lock size={28} strokeWidth={1.8} />, title: "6. Anonymous Support", desc: "Share sensitive struggles, relationship friction, or deep personal doubts safely using anonymous posting options while still receiving godly counsel.", tag: "Safe & Confidential" }
            ].map((feat, idx) => (
              <div 
                key={idx}
                className="group border border-white/[0.08] bg-gradient-to-b from-white/[0.02] to-transparent p-8 rounded-2xl flex flex-col justify-between shadow-xl transition-colors hover:border-[#d4af37]/40"
              >
                <div>
                  <div className="text-[#d4af37] mb-6 p-3 bg-[#d4af37]/10 w-fit rounded-xl border border-[#d4af37]/20">{feat.icon}</div>
                  <h3 className="font-serif text-xl text-white mb-4 tracking-wider font-bold">{feat.title}</h3>
                  <p className="text-gray-400 text-sm font-normal leading-relaxed">{feat.desc}</p>
                </div>
                <span className="mt-8 text-xs font-mono uppercase tracking-widest text-[#d4af37] font-semibold">{feat.tag}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ==================== DIARY REFLECTION SECTION ==================== */}
        <section id="diary" className="py-28 px-6 max-w-6xl mx-auto border-t border-white/[0.06]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-sm font-bold uppercase tracking-[0.3em] text-[#d4af37] block mb-3">Daily Reflection</span>
              <h2 className="font-serif text-3xl sm:text-4xl tracking-[0.1em] text-white mb-6 font-bold">Capture Your Wins & Losses Every Single Day</h2>
              <p className="text-gray-200 text-base sm:text-lg font-normal leading-relaxed mb-6">At the close of each day, take a few quiet moments to document how God moved in your life. Write down your victories, examine your losses, and store your prayers safely in your digital diary.</p>
              <p className="text-gray-200 text-base sm:text-lg font-normal leading-relaxed">Looking back at how you overcame past trials becomes a powerful anchor for your faith when new challenges arise.</p>
            </div>
            <div className="border border-white/[0.12] bg-black/90 p-8 rounded-xl shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-6 text-xs sm:text-sm font-mono text-gray-300">
                <span>📖 Today's Entry</span>
                <span className="text-[#d4af37] font-semibold">August 17, 2026</span>
              </div>
              <div className="space-y-5 text-base font-normal">
                <div className="bg-emerald-950/30 border border-emerald-500/40 p-5 rounded-lg shadow-sm">
                  <p className="text-emerald-400 font-bold mb-2 text-xs uppercase tracking-wider">Today's Win</p>
                  <p className="text-gray-100 leading-relaxed text-sm sm:text-base">Maintained peace during a stressful work deadline and trusted God for the outcome.</p>
                </div>
                <div className="bg-amber-950/30 border border-amber-500/40 p-5 rounded-lg shadow-sm">
                  <p className="text-amber-400 font-bold mb-2 text-xs uppercase tracking-wider">Today's Lesson / Loss</p>
                  <p className="text-gray-100 leading-relaxed text-sm sm:text-base">Struggled with impatience in the morning. Need to commit my schedule to prayer earlier.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== TESTIMONIAL SYSTEM ==================== */}
        <section id="testimonials" className="py-28 px-6 max-w-6xl mx-auto border-t border-white/[0.06]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            <div className="lg:col-span-1">
              <span className="text-sm font-bold uppercase tracking-[0.3em] text-[#d4af37] block mb-3">Living Proof</span>
              <h2 className="font-serif text-3xl sm:text-4xl tracking-[0.1em] text-white font-bold mb-6">Voices from The Fellowship</h2>
              <p className="text-gray-400 text-sm sm:text-base font-normal leading-relaxed mb-6">See how believers globally are shaping their dashboards and converting daily prayers into concrete historical legacy publications.</p>
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button key={i} onClick={() => handleRatingInteraction(i)} className={`h-1.5 rounded-full transition-all duration-500 ${activeTestimonial === i ? "w-8 bg-[#d4af37]" : "w-2 bg-white/20"}`} aria-label={`Slide ${i + 1}`} />
                ))}
              </div>
            </div>

            <div className="lg:col-span-2 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#d4af37]/5 to-transparent blur-3xl -z-10 rounded-full" />
              <div className="border border-white/[0.12] bg-[#09090b]/90 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-2xl transition-all duration-500 hover:border-[#d4af37]/30">
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-6 mb-8">
                  <div className="flex items-center gap-1">
                    {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                      <Star key={i} size={18} fill="#d4af37" className={`text-[#d4af37] ${starBurst ? "animate-star-burst" : ""}`} />
                    ))}
                  </div>
                  <div className="text-[10px] font-mono text-gray-500 tracking-widest uppercase">Verified Citizenship Hub // 2026</div>
                </div>
                <div className="min-h-[140px] flex flex-col justify-between">
                  <div>
                    <Quote className="text-[#d4af37]/20 mb-4" size={38} strokeWidth={1.5} />
                    <p className="text-gray-100 text-base sm:text-lg font-light leading-relaxed">"{testimonials[activeTestimonial].text}"</p>
                  </div>
                  <div className="pt-6 mt-6 border-t border-white/[0.06] flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img src={testimonials[activeTestimonial].avatar} alt={testimonials[activeTestimonial].name} className="w-12 h-12 rounded-full object-cover border-2 border-[#d4af37]/40 shadow-md" />
                      <div>
                        <p className="text-sm font-bold text-white uppercase tracking-wider">{testimonials[activeTestimonial].name}</p>
                        <p className="text-xs text-gray-400 font-medium">{testimonials[activeTestimonial].role}</p>
                      </div>
                    </div>
                    <button onClick={() => handleRatingInteraction((activeTestimonial + 1) % testimonials.length)} className="p-2.5 rounded-full border border-white/10 text-gray-400 hover:text-white hover:border-[#d4af37] transition-all bg-white/[0.02]" aria-label="Next testimony">
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== FAQS ==================== */}
        <section id="faqs" className="py-28 px-6 max-w-4xl mx-auto border-t border-white/[0.06]">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-sm font-bold uppercase tracking-[0.3em] text-[#d4af37] block mb-3">Common Inquiries</span>
            <h2 className="font-serif text-3xl sm:text-5xl tracking-[0.1em] text-white font-bold">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-white/[0.12] bg-black/50 rounded-lg overflow-hidden transition-colors shadow-sm">
                <button onClick={() => toggleFaq(index)} className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 focus:outline-none">
                  <span className="font-serif text-lg sm:text-xl text-white tracking-wide font-bold">{faq.q}</span>
                  <ChevronDown size={22} className={`text-[#d4af37] transition-transform duration-300 shrink-0 ${openFaq === index ? "rotate-180" : ""}`} />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6 text-gray-200 text-base sm:text-lg font-normal leading-relaxed border-t border-white/[0.06] pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ==================== BOTTOM CTA GATE ==================== */}
        <section className="py-28 px-6 max-w-4xl mx-auto text-center border-t border-white/[0.06]">
          <h2 className="font-serif text-3xl sm:text-5xl tracking-[0.15em] mb-6 text-white uppercase font-bold">Begin Recording Your Legacy</h2>
          <p className="text-gray-200 font-normal text-lg sm:text-xl max-w-xl mx-auto mb-12 leading-relaxed">Join believers worldwide in journaling your daily walk, solving life's challenges together, and building a portfolio for your children.</p>
          <Link to="/register" className="inline-block border border-[#d4af37]/60 px-12 py-4 text-sm font-bold uppercase tracking-[0.25em] text-[#d4af37] bg-[#d4af37]/10 hover:bg-[#d4af37] hover:text-[#010102] transition-all duration-300 shadow-[0_0_30px_rgba(212,175,55,0.2)]">Enter The Sanctuary</Link>
        </section>
      </div>
    </div>
  );
};