import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Loader2 } from "lucide-react";
import api from "@/api/axios";
import { supabase } from "../../api/supabaseClient";

type LogoutButtonProps = {
  className?: string; // Allows passing custom Tailwind classes if needed
};

export const LogoutButton: React.FC<LogoutButtonProps> = ({ className = "" }) => {
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await api.post("/auth/logout");

      await supabase.auth.signOut();

      localStorage.removeItem("token");

      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Logout failed:", err);
      navigate("/login", { replace: true });
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loggingOut}
      className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-mono uppercase tracking-wider hover:bg-red-500 hover:text-white transition-all cursor-pointer shadow-sm disabled:opacity-50 ${className}`}
    >
      {loggingOut ? (
        <Loader2 size={15} className="animate-spin" />
      ) : (
        <>
          <LogOut size={15} />
          <span>Log Out</span>
        </>
      )}
    </button>
  );
};