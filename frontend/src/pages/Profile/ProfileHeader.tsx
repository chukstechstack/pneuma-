import React from "react";
import ProfileEngagement from "@/components/Profile/Engagement.js";
import ProfileJournal from "@components/Profile/Journal.jsx";
import ProfileShareButton from "@/components/Profile/ProfileShareButton"; // 👈 Import the new file
import NavBar from "@/pages/NavBar/NavBar";
import { Users, Sparkles, Shield } from "lucide-react";

type ProfileContentProps = {
  data: {
    profile: {
      uuid: string;
      full_name?: string;
      avatar_url?: string;
      bio?: string;
      [key: string]: any;
    };
    tasks: Array<any>;
    isOwner: boolean;
  };
  onOpenInnerCircle: () => void;
  onOpenMessageDock: () => void;
};

export const ProfileContent: React.FC<ProfileContentProps> = ({
  data,
  onOpenInnerCircle,
  onOpenMessageDock,
}) => {
  const { profile, tasks, isOwner } = data;
  const profileAvatarUrl =
    profile.avatar_url ||
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80";

  return (
    <div className="min-h-screen bg-[#010102] text-white font-sans selection:bg-[#d4af37]/30 selection:text-[#d4af37]">
      <NavBar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-20 space-y-8">
        
        {/* Unified Profile Header Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#09090b] via-[#121008] to-[#010102] border border-white/[0.08] relative overflow-hidden shadow-2xl flex flex-col gap-6">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#d4af37]/15 via-transparent to-transparent blur-[60px] pointer-events-none" />

          {/* User Bio Header Section */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left relative z-10">
            <div className="relative shrink-0">
              <img 
                src={profileAvatarUrl} 
                alt={profile.full_name || "Sanctuary Citizen"}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-2 border-[#d4af37]/50 shadow-[0_0_20px_rgba(212,175,55,0.2)]"
              />
              <div className="absolute bottom-0 right-0 p-1.5 bg-[#010102] border border-[#d4af37]/40 rounded-full text-[#d4af37]">
                <Shield size={14} />
              </div>
            </div>

            <div className="space-y-2 flex-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10">
                <Sparkles size={12} className="text-[#d4af37]" />
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#d4af37]">Sanctuary Citizen</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-wide uppercase text-white">
                {profile.full_name || "Sanctuary Citizen"}
              </h1>
              <p className="text-gray-400 text-xs sm:text-sm font-mono max-w-lg leading-relaxed">
                {profile.bio || "Building a legacy of faith, daily records, and spiritual growth."}
              </p>
            </div>
          </div>

          {/* Embedded Toolbar Inside Profile Border */}
          <div className="pt-5 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
            <ProfileEngagement
              isOwner={isOwner}
              targetProfileUuid={profile.uuid} 
              targetFullName={profile.full_name || "Sanctuary Citizen"} 
              targetAvatarUrl={profileAvatarUrl}          
              onMessageClick={onOpenMessageDock}
            />

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* 👈 Clean extracted component */}
              <ProfileShareButton profileUuid={profile.uuid} />

              <button 
                onClick={onOpenInnerCircle}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-white/15 bg-white/[0.03] hover:border-[#d4af37] text-xs font-mono uppercase tracking-wider text-gray-200 hover:text-[#d4af37] transition-all shadow-md cursor-pointer"
              >
                <Users size={15} />
                <span>{isOwner ? "My Inner Circle" : "Inner Circle"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Profile Journal Scrolls */}
        <ProfileJournal tasks={tasks} />

      </div>
    </div>
  );
};

export default ProfileContent;