import React from "react";
import { Link } from "react-router-dom";
import { 
  Home, 
  BookOpen, 
  Plus, 
  Bell, 
  Search, 
  MessageSquare 
} from "lucide-react";

interface MobileNavBarProps {
  isVisible: boolean;
  userUuid: string | null;
  pathname: string;
  onOpenCreate: () => void; // Added prop
}

export const MobileNavBar: React.FC<MobileNavBarProps> = ({ isVisible, userUuid, pathname, onOpenCreate }) => {
  const isActive = (path: string) => pathname.startsWith(path);

  const getMobileLinkClass = (path: string) => `
    flex flex-col items-center justify-center p-2 rounded-full transition-all duration-200
    ${isActive(path) 
      ? "text-[#d4af37] bg-[#d4af37]/10" 
      : "text-white/40 hover:text-white/80"
    }
  `;

  return (
    <div className="md:hidden">
      
      {/* MOBILE TOP SLIM BAR */}
      <nav
        className={`fixed top-0 left-0 right-0 z-40 bg-[#09090b]/85 backdrop-blur-xl border-b border-white/[0.06] px-4 py-2.5 flex items-center justify-between transition-transform duration-300 ${
          !isVisible ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="flex-1 mr-3">
          <div className="flex items-center gap-2 w-full bg-[#121214] border border-white/10 rounded-full px-3.5 py-1.5 text-white/40 text-xs font-light">
            <Search size={14} className="text-[#d4af37]" />
            <span className="truncate">Search archive insights...</span>
          </div>
        </div>

        <Link
          to="/messages"
          className="relative flex items-center justify-center w-9 h-9 rounded-full bg-white/[0.03] border border-white/10 text-white/80 shrink-0"
        >
          <MessageSquare size={16} />
          <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full shadow-md">
            9
          </span>
        </Link>
      </nav>

      {/* MOBILE BOTTOM FLOATING DOCK */}
      <nav
        className={`fixed bottom-5 left-4 right-4 z-40 bg-[#121214]/90 backdrop-blur-2xl border border-white/[0.08] rounded-full px-3 py-2 flex items-center justify-between shadow-[0_15px_35px_rgba(0,0,0,0.8)] transition-transform duration-300 ${
          !isVisible ? "translate-y-28" : "translate-y-0"
        }`}
      >
        <Link to="/homefeed" className={getMobileLinkClass("/homefeed")}>
          <Home size={20} strokeWidth={isActive("/homefeed") ? 2 : 1.5} />
        </Link>

        <Link to={userUuid ? `/feed/${userUuid}` : "#"} className={getMobileLinkClass("/feed")}>
          <BookOpen size={20} strokeWidth={isActive("/feed") ? 2 : 1.5} />
        </Link>

        {/* Floating Center Create Action Button */}
{/* Floating Center Create Action Link */}
<Link
  to="/createtask"
  className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#d4af37] to-[#aa8c2c] text-black shadow-[0_0_20px_rgba(212,175,55,0.35)] flex items-center justify-center hover:scale-105 active:scale-95 transition-all shrink-0"
>
  <Plus size={22} strokeWidth={2.5} />
</Link>

        <Link to="/notifications" className={getMobileLinkClass("/notifications")}>
          <div className="relative">
            <Bell size={20} strokeWidth={isActive("/notifications") ? 2 : 1.5} />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#d4af37]" />
          </div>
        </Link>

        <Link to="/profile" className={getMobileLinkClass("/profile")}>
          <div className="w-5 h-5 rounded-full overflow-hidden ring-1 ring-[#d4af37]/60">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSysX8k1gABg8LHF0QSukobgjnwgnxqX1Pqjcxx6AafbTLSGRq8560Mz8I&s=10"
              className="w-full h-full object-cover"
              alt="Me Profile"
            />
          </div>
        </Link>
      </nav>

    </div>
  );
};