import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, BookOpen, MessageSquareCode, Menu, X, ChevronDown, Quote, HeartHandshake, BookMarked, Flame, Lock } from "lucide-react";
import doveLogoUrl from "@assets/pneuma.png";

export const LandingPage: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  
  // Check sessionStorage so the cinematic intro only plays ONCE per session/browser tab
  const [introPhase, setIntroPhase] = useState<"animating" | "fading" | "done">(() => {
    const hasSeenIntro = sessionStorage.getItem("pneuma_intro_seen");
    return hasSeenIntro ? "done" : "animating";
  });

  useEffect(() => {
    // If already seen in this session, skip setting up the timers
    if (introPhase === "done") return;

    // Smoother 3.5s sequence:
    // 0s - 1.8s: PNEUMA slides in from left & right, joins in center, shines bright white
    // 1.8s - 2.8s: Flash cuts out / dims smoothly
    // 2.8s onwards: Navbar slides in from top, hero content reveals gracefully
    const timer1 = setTimeout(() => {
      setIntroPhase("fading");
    }, 2800);

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

  return (
    <div className="min-h-screen bg-[#010102] text-white font-sans selection:bg-[#d4af37]/30 selection:text-[#d4af37] relative overflow-x-hidden text-base sm:text-lg">
      
      {/* ==================== SMOOTH CINEMATIC INTRO OVERLAY (Plays Once) ==================== */}
      {introPhase !== "done" && (
        <div 
          className={`fixed inset-0 z-[100] bg-[#010102] flex items-center justify-center transition-opacity duration-800 ${
            introPhase === "fading" ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <div className="flex items-center justify-center overflow-hidden py-10 px-4 w-full">
            <h1 className="font-serif text-6xl sm:text-8xl lg:text-9xl font-bold tracking-[0.25em] uppercase flex items-center justify-center">
              <span className="inline-block animate-smooth-slide-left text-gray-200">
                PNEU
              </span>
              <span className="inline-block animate-smooth-slide-right text-white animate-shine-bright">
                MA
              </span>
            </h1>
          </div>
        </div>
      )}

      {/* Smooth Tailwind Keyframes & Custom Animations */}
      <style>{`
        @keyframes smoothSlideLeft {
          0% {
            transform: translateX(-140vw);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes smoothSlideRight {
          0% {
            transform: translateX(140vw);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes shineBright {
          0%, 40% {
            text-shadow: 0 0 10px rgba(255,255,255,0.2);
          }
          60% {
            text-shadow: 0 0 50px rgba(255,255,255,1), 0 0 100px rgba(212,175,55,0.8);
            color: #ffffff;
          }
          100% {
            text-shadow: 0 0 20px rgba(255,255,255,0.5);
          }
        }
        @keyframes navSlideDown {
          0% {
            transform: translateY(-100%);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes contentReveal {
          0% {
            transform: translateY(20px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-smooth-slide-left {
          animation: smoothSlideLeft 1.8s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
        .animate-smooth-slide-right {
          animation: smoothSlideRight 1.8s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
        .animate-shine-bright {
          animation: shineBright 2.5s ease-in-out forwards;
        }
        .animate-nav-slide-top {
          animation: navSlideDown 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${introPhase === "done" && sessionStorage.getItem("pneuma_intro_seen") ? "0s" : "2.8s"} both;
        }
        .animate-hero-reveal {
          animation: contentReveal 1s cubic-bezier(0.16, 1, 0.3, 1) ${introPhase === "done" && sessionStorage.getItem("pneuma_intro_seen") ? "0s" : "2.9s"} both;
        }
      `}</style>

      {/* Cinematic Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#d4af37]/15 via-transparent to-transparent blur-[100px] pointer-events-none" />

      {/* ==================== NAVBAR ==================== */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#010102]/85 border-b border-white/[0.06] animate-nav-slide-top">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <img 
              src={doveLogoUrl} 
              className="w-8 h-8 object-contain filter contrast-125 group-hover:scale-105 transition-transform" 
              alt="Pneuma Logo" 
            />
            <span className="font-serif text-xl tracking-[0.3em] font-bold text-white">
              PNEUMA
            </span>
          </Link>

          {/* Desktop Nav Links (Hidden on tablet and mobile: lg:flex) */}
          <div className="hidden lg:flex items-center gap-8 xl:gap-10 text-sm font-semibold uppercase tracking-[0.2em] text-gray-200">
            <a href="#vision" className="hover:text-[#d4af37] transition-colors">Vision</a>
            <a href="#diary" className="hover:text-[#d4af37] transition-colors">Daily Diary</a>
            <a href="#community" className="hover:text-[#d4af37] transition-colors">Faith Q&A</a>
            <a href="#portfolio" className="hover:text-[#d4af37] transition-colors">Life Book</a>
            <a href="#faqs" className="hover:text-[#d4af37] transition-colors">FAQs</a>
          </div>

          {/* Action Buttons (Hidden on tablet and mobile: lg:flex) */}
          <div className="hidden lg:flex items-center gap-6">
            <Link 
              to="/login" 
              className="text-sm uppercase tracking-[0.2em] font-semibold text-gray-200 hover:text-white transition-colors py-2 px-3"
            >
              Sign In
            </Link>
            <Link 
              to="/register" 
              className="border border-[#d4af37]/50 px-6 py-2.5 text-sm font-bold uppercase tracking-[0.2em] text-[#d4af37] hover:bg-[#d4af37] hover:text-[#010102] transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.15)]"
            >
              Enter Sanctuary
            </Link>
          </div>

          {/* Mobile & Tablet Menu Button (Visible up to lg breakpoint) */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-200 hover:text-white focus:outline-none"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* Mobile & Tablet Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-24 left-0 w-full bg-[#010102]/95 border-b border-white/[0.06] px-8 py-8 flex flex-col gap-6 backdrop-blur-xl shadow-2xl">
            <a href="#vision" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-200 hover:text-[#d4af37]">Vision</a>
            <a href="#diary" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-200 hover:text-[#d4af37]">Daily Diary</a>
            <a href="#community" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-200 hover:text-[#d4af37]">Faith Q&A</a>
            <a href="#portfolio" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-200 hover:text-[#d4af37]">Life Book</a>
            <a href="#faqs" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-200 hover:text-[#d4af37]">FAQs</a>
            <div className="flex flex-col gap-3 pt-4 border-t border-white/[0.06]">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full py-3 text-center text-sm font-semibold uppercase tracking-[0.2em] border border-white/15 text-gray-200">Sign In</Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="w-full py-3 text-center text-sm font-bold uppercase tracking-[0.2em] border border-[#d4af37] text-[#d4af37] bg-[#d4af37]/10">Enter Sanctuary</Link>
            </div>
          </div>
        )}
      </nav>

      {/* ==================== HERO SECTION ==================== */}
      <section className="relative min-h-[90vh] flex flex-col justify-center items-center px-6 pt-36 pb-20 text-center animate-hero-reveal">
        
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 text-[#d4af37] text-xs sm:text-sm font-semibold uppercase tracking-[0.3em] mb-8 shadow-sm">
          <Sparkles size={16} />
          Your Spiritual Diary, Community Q&A, and Lifelong Book
        </div>

        <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-bold tracking-[0.15em] uppercase text-white mb-6 max-w-5xl leading-[1.1]">
          Pneuma
        </h1>

        <div className="w-20 h-[2px] bg-[#d4af37]/60 mx-auto mb-8 shadow-[0_0_10px_#d4af37]" />

        <p className="text-gray-200 text-lg sm:text-xl font-normal max-w-3xl mx-auto mb-12 leading-[1.8] tracking-wide">
          Record your daily wins and losses like a personal diary, solve life's challenges together in a Christian Q&A community, and turn your life story into a published book for your children.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
          <Link 
            to="/register" 
            className="w-full sm:w-auto border border-[#d4af37]/60 px-10 py-4 text-sm font-bold uppercase tracking-[0.25em] text-[#d4af37] hover:bg-[#d4af37] hover:text-[#010102] transition-all duration-300 shadow-[0_0_30px_rgba(212,175,55,0.2)] flex items-center justify-center gap-3 group"
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
        </div>

        {/* Scripture Quote */}
        <div className="mt-24 max-w-lg mx-auto">
          <p className="italic font-medium text-base text-gray-300 tracking-wider leading-relaxed">
            "Write the vision and make it plain on tablets, that he may run who reads it."
          </p>
          <span className="block font-serif text-xs tracking-[0.3em] text-[#d4af37] mt-3 font-semibold">HABAKKUK 2:2</span>
        </div>

      </section>

      {/* ==================== WHAT PNEUMA STANDS FOR ==================== */}
      <section id="vision" className="py-28 px-6 max-w-6xl mx-auto border-t border-white/[0.06]">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-bold uppercase tracking-[0.3em] text-[#d4af37] block mb-3">The Core Mission</span>
          <h2 className="font-serif text-3xl sm:text-5xl tracking-[0.1em] text-white font-bold">What Pneuma Stands For</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          <div className="border border-white/[0.12] bg-black/70 p-8 rounded-xl flex flex-col justify-between shadow-lg">
            <div>
              <div className="text-[#d4af37] mb-6 p-3 bg-[#d4af37]/10 w-fit rounded-lg">
                <BookOpen size={32} strokeWidth={1.8} />
              </div>
              <h3 className="font-serif text-xl text-white mb-4 tracking-wider font-bold">1. Daily Life Diary</h3>
              <p className="text-gray-200 text-base font-normal leading-relaxed">
                Log your daily wins, losses, struggles, and gratitude at the end of every day. Build a faithful record of your spiritual walk for future reference.
              </p>
            </div>
            <span className="mt-8 text-xs font-mono uppercase tracking-widest text-[#d4af37] font-semibold">Private & Secure</span>
          </div>

          <div className="border border-white/[0.12] bg-black/70 p-8 rounded-xl flex flex-col justify-between shadow-lg">
            <div>
              <div className="text-[#d4af37] mb-6 p-3 bg-[#d4af37]/10 w-fit rounded-lg">
                <MessageSquareCode size={32} strokeWidth={1.8} />
              </div>
              <h3 className="font-serif text-xl text-white mb-4 tracking-wider font-bold">2. Christian Q&A Hub</h3>
              <p className="text-gray-200 text-base font-normal leading-relaxed">
                Facing a tough problem or spiritual trial? Post your questions to the community, receive practical advice, and find solutions rooted in God's word like Stack Overflow for believers.
              </p>
            </div>
            <span className="mt-8 text-xs font-mono uppercase tracking-widest text-[#d4af37] font-semibold">Community Solutions</span>
          </div>

          <div className="border border-white/[0.12] bg-black/70 p-8 rounded-xl flex flex-col justify-between shadow-lg">
            <div>
              <div className="text-[#d4af37] mb-6 p-3 bg-[#d4af37]/10 w-fit rounded-lg">
                <BookMarked size={32} strokeWidth={1.8} />
              </div>
              <h3 className="font-serif text-xl text-white mb-4 tracking-wider font-bold">3. Generational Book</h3>
              <p className="text-gray-200 text-base font-normal leading-relaxed">
                Pneuma automatically compiles your life records into an organized portfolio. When you grow old, publish your memoirs as a physical book to show your children.
              </p>
            </div>
            <span className="mt-8 text-xs font-mono uppercase tracking-widest text-[#d4af37] font-semibold">Generational Legacy</span>
          </div>

          <div className="border border-white/[0.12] bg-black/70 p-8 rounded-xl flex flex-col justify-between shadow-lg">
            <div>
              <div className="text-[#d4af37] mb-6 p-3 bg-[#d4af37]/10 w-fit rounded-lg">
                <HeartHandshake size={32} strokeWidth={1.8} />
              </div>
              <h3 className="font-serif text-xl text-white mb-4 tracking-wider font-bold">4. Prayer & Testimonies</h3>
              <p className="text-gray-200 text-base font-normal leading-relaxed">
                Post specific prayer requests and track them on your timeline. Once God moves, mark them with an 'Answered!' badge to encourage the entire fellowship.
              </p>
            </div>
            <span className="mt-8 text-xs font-mono uppercase tracking-widest text-[#d4af37] font-semibold">Faith Builders</span>
          </div>

          <div className="border border-white/[0.12] bg-black/70 p-8 rounded-xl flex flex-col justify-between shadow-lg">
            <div>
              <div className="text-[#d4af37] mb-6 p-3 bg-[#d4af37]/10 w-fit rounded-lg">
                <Flame size={32} strokeWidth={1.8} />
              </div>
              <h3 className="font-serif text-xl text-white mb-4 tracking-wider font-bold">5. Scripture Tagging</h3>
              <p className="text-gray-200 text-base font-normal leading-relaxed">
                Tie your daily diary entries and life questions directly to Bible verses. See how God's living word intersects with your everyday human experiences.
              </p>
            </div>
            <span className="mt-8 text-xs font-mono uppercase tracking-widest text-[#d4af37] font-semibold">Biblically Grounded</span>
          </div>

          <div className="border border-white/[0.12] bg-black/70 p-8 rounded-xl flex flex-col justify-between shadow-lg">
            <div>
              <div className="text-[#d4af37] mb-6 p-3 bg-[#d4af37]/10 w-fit rounded-lg">
                <Lock size={32} strokeWidth={1.8} />
              </div>
              <h3 className="font-serif text-xl text-white mb-4 tracking-wider font-bold">6. Anonymous Support</h3>
              <p className="text-gray-200 text-base font-normal leading-relaxed">
                Share sensitive struggles, relationship friction, or deep personal doubts safely using anonymous posting options while still receiving godly counsel.
              </p>
            </div>
            <span className="mt-8 text-xs font-mono uppercase tracking-widest text-[#d4af37] font-semibold">Safe & Confidential</span>
          </div>

        </div>
      </section>

      {/* ==================== FEATURE 1: DAILY DIARY ==================== */}
      <section id="diary" className="py-28 px-6 max-w-6xl mx-auto border-t border-white/[0.06]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-sm font-bold uppercase tracking-[0.3em] text-[#d4af37] block mb-3">Daily Reflection</span>
            <h2 className="font-serif text-3xl sm:text-4xl tracking-[0.1em] text-white mb-6 font-bold">Capture Your Wins & Losses Every Single Day</h2>
            <p className="text-gray-200 text-base sm:text-lg font-normal leading-relaxed mb-6">
              At the close of each day, take a few quiet moments to document how God moved in your life. Write down your victories, examine your losses, and store your prayers safely in your digital diary.
            </p>
            <p className="text-gray-200 text-base sm:text-lg font-normal leading-relaxed">
              Looking back at how you overcame past trials becomes a powerful anchor for your faith when new challenges arise.
            </p>
          </div>
          <div className="border border-white/[0.12] bg-black/90 p-8 rounded-xl shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-6 text-xs sm:text-sm font-mono text-gray-300">
              <span>📖 Today's Entry</span>
              <span className="text-[#d4af37] font-semibold">August 17, 2026</span>
            </div>
            <div className="space-y-5 text-base font-normal">
              <div className="bg-emerald-950/30 border border-emerald-500/40 p-5 rounded-lg shadow-sm">
                <p className="text-emerald-400 font-bold mb-2 text-xs uppercase tracking-wider">Today's Win</p>
                <p className="text-gray-100 leading-relaxed">Maintained peace during a stressful work deadline and trusted God for the outcome.</p>
              </div>
              <div className="bg-amber-950/30 border border-amber-500/40 p-5 rounded-lg shadow-sm">
                <p className="text-amber-400 font-bold mb-2 text-xs uppercase tracking-wider">Today's Lesson / Loss</p>
                <p className="text-gray-100 leading-relaxed">Struggled with impatience in the morning. Need to commit my schedule to prayer earlier.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FEATURE 2: STACK OVERFLOW FOR CHRISTIANS ==================== */}
      <section id="community" className="py-28 px-6 max-w-6xl mx-auto border-t border-white/[0.06]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 border border-white/[0.12] bg-black/90 p-8 rounded-xl shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-6 text-xs sm:text-sm font-mono text-gray-300">
              <span>💬 Community Q&A Board</span>
              <span className="text-[#d4af37] font-semibold">3 Answers</span>
            </div>
            <div className="space-y-5 text-base font-normal">
              <div className="p-5 rounded-lg bg-white/[0.03] border border-white/[0.08] shadow-sm">
                <p className="text-white font-bold mb-3 leading-snug">"How do you stay steadfast in faith when facing prolonged financial uncertainty?"</p>
                <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-300 font-medium">
                  <span className="text-[#d4af37]">Asked by Daniel M.</span>
                  <span>•</span>
                  <span>Matthew 6:33 referenced</span>
                </div>
              </div>
              <div className="p-5 rounded-lg bg-[#d4af37]/10 border border-[#d4af37]/30 shadow-sm">
                <p className="text-xs font-bold text-[#d4af37] uppercase tracking-wider mb-2">Top Community Solution</p>
                <p className="text-gray-100 text-sm sm:text-base leading-relaxed">"Keep a physical journal of past provisions. When anxiety creeps in, reviewing how God pulled you through last year gives immense strength..."</p>
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <span className="text-sm font-bold uppercase tracking-[0.3em] text-[#d4af37] block mb-3">Collaborative Wisdom</span>
            <h2 className="font-serif text-3xl sm:text-4xl tracking-[0.1em] text-white mb-6 font-bold">Stack Overflow, But for Christian Believers</h2>
            <p className="text-gray-200 text-base sm:text-lg font-normal leading-relaxed mb-6">
              You don't have to carry your problems in isolation. On Pneuma, you can ask tough questions about life, doubt, relationships, or scripture, and get practical, godly advice from fellow believers.
            </p>
            <p className="text-gray-200 text-base sm:text-lg font-normal leading-relaxed">
              Share your trials, receive tested solutions, and help lift others out of difficult seasons with your own testimony.
            </p>
          </div>
        </div>
      </section>

      {/* ==================== FEATURE 3: PUBLISHABLE LIFE BOOK ==================== */}
      <section id="portfolio" className="py-28 px-6 max-w-6xl mx-auto border-t border-white/[0.06]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-sm font-bold uppercase tracking-[0.3em] text-[#d4af37] block mb-3">Generational Legacy</span>
            <h2 className="font-serif text-3xl sm:text-4xl tracking-[0.1em] text-white mb-6 font-bold">Turn Your Life Memories Into a Published Book</h2>
            <p className="text-gray-200 text-base sm:text-lg font-normal leading-relaxed mb-6">
              Your daily entries aren't lost in a digital void. Pneuma aggregates your spiritual journey into a structured portfolio. When you are older, you can format these diaries into a beautiful book.
            </p>
            <p className="text-gray-200 text-base sm:text-lg font-normal leading-relaxed">
              Publish your memoir to share with your children, grandchildren, and future generations as a living testimony of God's faithfulness in your life.
            </p>
          </div>
          <div className="border border-white/[0.12] bg-black/90 p-10 rounded-xl text-center relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#d4af37]/15 via-transparent to-transparent pointer-events-none" />
            <BookMarked size={56} className="text-[#d4af37] mx-auto mb-6" />
            <h3 className="font-serif text-2xl text-white mb-2 tracking-wider font-bold">The Book of My Walk</h3>
            <p className="text-xs uppercase tracking-[0.25em] text-[#d4af37] mb-6 font-mono font-semibold">Compiled Memoir & Portfolio</p>
            <p className="text-gray-200 text-base font-normal italic max-w-md mx-auto mb-8 leading-relaxed">
              "A generational record of victories, answered prayers, and God's unwavering guidance."
            </p>
            <div className="inline-block border border-[#d4af37]/50 px-8 py-3 text-xs sm:text-sm font-bold uppercase tracking-widest text-[#d4af37] bg-[#d4af37]/10 shadow-sm">
              Ready for Print & Publishing
            </div>
          </div>
        </div>
      </section>

      {/* ==================== TESTIMONIALS WITH REAL PICTURES ==================== */}
      <section className="py-28 px-6 max-w-7xl mx-auto border-t border-white/[0.06]">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-sm font-bold uppercase tracking-[0.3em] text-[#d4af37] block mb-3">Believer Stories</span>
          <h2 className="font-serif text-3xl sm:text-5xl tracking-[0.1em] text-white font-bold">How Pneuma is Changing Lives</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="border border-white/[0.12] bg-black/60 p-8 rounded-xl flex flex-col justify-between shadow-lg">
            <div>
              <Quote className="text-[#d4af37]/60 mb-4" size={28} />
              <p className="text-gray-100 text-base font-normal leading-relaxed mb-8">
                "Writing my daily wins and losses has grounded my faith. When I posted a struggle about career uncertainty on the Q&A board, brothers and sisters gave me incredible scriptural advice that changed my perspective."
              </p>
            </div>
            <div className="pt-5 border-t border-white/[0.08] flex items-center gap-4">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" 
                alt="Sarah Jenkins" 
                className="w-12 h-12 rounded-full object-cover border border-[#d4af37]/50 shadow-sm"
              />
              <div>
                <p className="text-sm font-bold text-white uppercase tracking-wider">Sarah Jenkins</p>
                <p className="text-xs text-gray-300 font-medium">Believer & Teacher</p>
              </div>
            </div>
          </div>

          <div className="border border-white/[0.12] bg-black/60 p-8 rounded-xl flex flex-col justify-between shadow-lg">
            <div>
              <Quote className="text-[#d4af37]/60 mb-4" size={28} />
              <p className="text-gray-100 text-base font-normal leading-relaxed mb-8">
                "The idea of turning my personal prayer and diary entries into a published book for your children is priceless. Pneuma gives my daily walk an eternal purpose beyond social media noise."
              </p>
            </div>
            <div className="pt-5 border-t border-white/[0.08] flex items-center gap-4">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" 
                alt="Michael Chang" 
                className="w-12 h-12 rounded-full object-cover border border-[#d4af37]/50 shadow-sm"
              />
              <div>
                <p className="text-sm font-bold text-white uppercase tracking-wider">Michael Chang</p>
                <p className="text-xs text-gray-300 font-medium">Software Architect</p>
              </div>
            </div>
          </div>

          <div className="border border-white/[0.12] bg-black/60 p-8 rounded-xl flex flex-col justify-between shadow-lg">
            <div>
              <Quote className="text-[#d4af37]/60 mb-4" size={28} />
              <p className="text-gray-100 text-base font-normal leading-relaxed mb-8">
                "Having a Stack Overflow style platform for spiritual and life problems is genius. Getting answers grounded in faith instead of secular algorithms has been a true blessing."
              </p>
            </div>
            <div className="pt-5 border-t border-white/[0.08] flex items-center gap-4">
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80" 
                alt="Elena Rostova" 
                className="w-12 h-12 rounded-full object-cover border border-[#d4af37]/50 shadow-sm"
              />
              <div>
                <p className="text-sm font-bold text-white uppercase tracking-wider">Elena Rostova</p>
                <p className="text-xs text-gray-300 font-medium">Ministry Leader</p>
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
            <div 
              key={index}
              className="border border-white/[0.12] bg-black/50 rounded-lg overflow-hidden transition-colors shadow-sm"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 focus:outline-none"
              >
                <span className="font-serif text-lg sm:text-xl text-white tracking-wide font-bold">{faq.q}</span>
                <ChevronDown 
                  size={22} 
                  className={`text-[#d4af37] transition-transform duration-300 shrink-0 ${openFaq === index ? "rotate-180" : ""}`} 
                />
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
        <p className="text-gray-200 font-normal text-lg sm:text-xl max-w-xl mx-auto mb-12 leading-relaxed">
          Join believers worldwide in journaling your daily walk, solving life's challenges together, and building a portfolio for your children.
        </p>
        <Link 
          to="/register" 
          className="inline-block border border-[#d4af37]/60 px-12 py-4 text-sm font-bold uppercase tracking-[0.25em] text-[#d4af37] hover:bg-[#d4af37] hover:text-[#010102] transition-all duration-300 shadow-[0_0_30px_rgba(212,175,55,0.2)]"
        >
          Create Your Sanctuary Account
        </Link>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="py-12 border-t border-white/[0.06] px-6 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs sm:text-sm uppercase tracking-[0.25em] text-gray-300 font-semibold">
        <div className="flex items-center gap-3">
          <img src={doveLogoUrl} className="w-6 h-6 object-contain filter grayscale" alt="Logo" />
          <span>&copy; {new Date().getFullYear()} PNEUMA ARCHIVE. ALL RIGHTS RESERVED.</span>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/login" className="hover:text-white transition-colors">Sign In</Link>
          <Link to="/register" className="hover:text-white transition-colors">Register</Link>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;