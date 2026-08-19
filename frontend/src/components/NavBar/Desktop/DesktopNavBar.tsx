import React, { useState } from "react";
import { Link } from "react-router-dom";
import doveLogoUrl from "@assets/pneuma.png";
import { Home, PlusSquare, BookOpen, Bell, Search } from "lucide-react";
import { DesktopMessagesDropdown } from "./MessagesDropdown";

interface DesktopNavBarProps {
  userUuid: string | null;
  pathname: string;
  onOpenCreate: () => void;
  onSelectConversation: (partnerUuid: string) => void;
}

export const DesktopNavBar: React.FC<DesktopNavBarProps> = ({ 
  userUuid, 
  pathname, 
  onOpenCreate,
  onSelectConversation 
}) => {
  const [isInboxOpen, setIsInboxOpen] = useState(false);

  const isActive = (path: string) => pathname.startsWith(path);

  const getLinkClasses = (path: string) => `
    relative flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-medium tracking-wide transition-all duration-200
    ${isActive(path) 
      ? "text-[#d4af37] bg-[#d4af37]/10 font-semibold" 
      : "text-white/60 hover:text-white hover:bg-white/[0.04]"
    }
  `;

  return (
    <header className="fixed top-5 left-0 right-0 z-50 px-6 hidden md:block">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 bg-[#121214]/80 backdrop-blur-2xl border border-white/[0.08] rounded-full px-5 py-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
        
        {/* Brand & Logo */}
        <Link to="/homefeed" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-8 h-8 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center p-1 group-hover:border-[#d4af37] transition-all">
            <img src={doveLogoUrl} className="w-full h-full object-contain filter drop-shadow" alt="Pneuma Logo" />
          </div>
          <span className="font-serif text-base font-bold tracking-[0.15em] text-white/90 uppercase">
            Pneuma
          </span>
        </Link>

        {/* Search */}
        <div className="relative max-w-xs w-full mx-2">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            id="desktop-search"
            name="desktop-search"
            type="text"
            placeholder="Search archive insights..."
            className="w-full bg-[#09090b]/60 border border-white/10 rounded-full pl-9 pr-4 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#d4af37]/50 transition-all font-normal"
          />
        </div>

        {/* Nav Links */}
        <nav className="flex items-center gap-1">
          <Link to="/homefeed" className={getLinkClasses("/homefeed")}>
            <Home size={15} strokeWidth={isActive("/homefeed") ? 2 : 1.5} />
            <span>Home</span>
          </Link>

          <Link to={`/feed/${userUuid || "sanctuary"}`} className={getLinkClasses("/feed")}>
            <BookOpen size={15} strokeWidth={isActive("/feed") ? 2 : 1.5} />
            <span>Journal</span>
          </Link>

          {/* ✅ Clean integration without wrapper bubbling bugs */}
          <DesktopMessagesDropdown
            isOpen={isInboxOpen}
            onToggle={() => setIsInboxOpen((prev) => !prev)}
            onClose={() => setIsInboxOpen(false)}
            onSelectConversation={onSelectConversation}
            getLinkClasses={getLinkClasses}
          />

          <Link to="/notifications" className={getLinkClasses("/notifications")}>
            <div className="relative flex items-center">
              <Bell size={15} strokeWidth={isActive("/notifications") ? 2 : 1.5} />
              <span className="absolute -top-1.5 -right-2 bg-[#d4af37] text-black text-[9px] font-bold px-1.5 py-0.2 rounded-full shadow-md">
                3
              </span>
            </div>
            <span className="ml-1">Alerts</span>
          </Link>

          <Link to="/profile" className={getLinkClasses("/profile")}>
            <div className="w-5 h-5 rounded-full overflow-hidden ring-1 ring-[#d4af37]/50">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSysX8k1gABg8LHF0QSukobgjnwgnxqX1Pqjcxx6AafbTLSGRq8560Mz8I&s=10"
                className="w-full h-full object-cover"
                alt="Profile"
              />
            </div>
            <span>Profile</span>
          </Link>

          <div className="w-px h-4 bg-white/10 mx-1" />

          <Link
            to="/createtask"
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider bg-gradient-to-r from-[#d4af37] to-[#aa8c2c] text-black shadow-[0_0_15px_rgba(212,175,55,0.25)] hover:opacity-95 transition-all active:scale-95 ml-1"
          >
            <PlusSquare size={15} strokeWidth={2.2} />
            <span>Post</span>
          </Link>

        </nav>

      </div>
    </header>
  );
};