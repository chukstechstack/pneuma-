import React from "react";
import { Link } from "react-router-dom";
import ProfileEngagement from "@/components/Profile/Engagement.js";
import ProfileJournal from "@components/Profile/Journal.jsx";
import { useProfileData } from "@pages/Profile/useProfileData";
import { InnerCircleUser } from "@pages/Profile/Profile.types";
import NavBar from "@/pages/NavBar/NavBar";
import { Users, X, Loader2, Sparkles, Shield } from "lucide-react";

const Profile = () => {
  const {
    isDockOpen,
    setIsDockOpen,
    data,
    isLoading,
    isError,
    innerCircle,
    dockLoading,
    toggleConnection,
    handleMessageInitialization,
    currentUserUuid,
    navigate,
  } = useProfileData();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#010102] text-white flex flex-col items-center justify-center p-6">
        <Loader2 size={36} className="text-[#d4af37] animate-spin mb-4" />
        <p className="text-gray-400 font-mono tracking-widest text-sm">Reflecting on profile journal...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-[#010102] text-white flex flex-col items-center justify-center p-6 text-center">
        <p className="text-red-400 font-mono tracking-widest text-sm mb-4">Error loading profile data.</p>
        <button 
          onClick={() => navigate("/homefeed")}
          className="border border-[#d4af37]/60 px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] text-[#d4af37] bg-[#d4af37]/10 hover:bg-[#d4af37] hover:text-[#010102] transition-all rounded-xl"
        >
          Return to Feed
        </button>
      </div>
    );
  }

  const { profile, tasks, isOwner, relationStatus } = data!;
  const profileAvatarUrl = ((profile as any)?.avatar_url as string | undefined) ||
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80";

  return (
    <div className="min-h-screen bg-[#010102] text-white font-sans selection:bg-[#d4af37]/30 selection:text-[#d4af37]">
      <NavBar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        
        {/* Profile Header Card */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-[#09090b] via-[#121008] to-[#010102] border border-white/[0.08] relative overflow-hidden shadow-2xl mb-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#d4af37]/15 via-transparent to-transparent blur-[60px] pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left relative z-10">
            <div className="relative">
              <img 
                src={profileAvatarUrl} 
                alt={`${profile.first_name}`}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-2 border-[#d4af37]/50 shadow-[0_0_20px_rgba(212,175,55,0.2)]"
              />
              <div className="absolute bottom-0 right-0 p-1.5 bg-[#010102] border border-[#d4af37]/40 rounded-full text-[#d4af37]">
                <Shield size={14} />
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 mb-3">
                <Sparkles size={12} className="text-[#d4af37]" />
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#d4af37]">Sanctuary Citizen</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-4xl font-bold tracking-wide uppercase text-white">
                {profile.first_name} {profile.last_name}
              </h1>
              <p className="text-gray-400 text-xs sm:text-sm font-mono mt-1">
                {((profile as any)?.bio as string | undefined) || "Building a legacy of faith, daily records, and spiritual growth."}
              </p>
            </div>
          </div>

          {(relationStatus === "active" || isOwner) && (
            <button 
              onClick={() => setIsDockOpen(true)}
              className="relative z-10 inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-white/15 bg-white/[0.03] hover:border-[#d4af37] text-xs font-mono uppercase tracking-widest text-gray-200 hover:text-[#d4af37] transition-all shadow-md"
            >
              <Users size={16} />
              <span>{isOwner ? "My Inner Circle" : "Inner Circle"}</span>
            </button>
          )}
        </div>

        {/* Engagement Action Dock */}
        <div className="mb-8">
          <ProfileEngagement
            isOwner={isOwner}
            active_Relationtionship_Request_Status={relationStatus}
            connect_Request_Handler={() => {
              const action =
                relationStatus === "active" || relationStatus === "pending" ? "disconnect" : "connect";
              (toggleConnection as unknown as (arg: any) => void)(action);
            }}
            onMessageClick={() => handleMessageInitialization(profile.id)}
          />
        </div>

        {/* Profile Journal Scrolls */}
        <ProfileJournal
          isOwner={isOwner}
          active_Relationtionship_Request_Status={relationStatus}
          tasks={tasks}
          navigate={navigate}
          currentUserUuid={currentUserUuid}
        />

        {/* Inner Circle Modal Drawer */}
        {isDockOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-[#09090b] border border-white/[0.12] rounded-3xl p-6 sm:p-8 relative shadow-2xl animate-in fade-in zoom-in-95 duration-200">
              
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-6">
                <div className="flex items-center gap-2">
                  <Users size={20} className="text-[#d4af37]" />
                  <h3 className="font-serif text-xl font-bold uppercase tracking-wider text-white">Your Connections</h3>
                </div>
                <button 
                  onClick={() => setIsDockOpen(false)}
                  className="p-2 rounded-full border border-white/10 text-gray-400 hover:text-white hover:border-[#d4af37] transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="max-h-[60vh] overflow-y-auto space-y-3 pr-2">
                {dockLoading ? (
                  <div className="py-12 flex justify-center items-center">
                    <Loader2 size={24} className="text-[#d4af37] animate-spin" />
                  </div>
                ) : innerCircle.length === 0 ? (
                  <p className="text-center py-10 text-gray-400 text-sm font-mono">No connections found in your inner circle yet.</p>
                ) : (
                  innerCircle.map((user: InnerCircleUser) => (
                    <div 
                      key={user.uuid} 
                      className="flex items-center justify-between p-3.5 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-[#d4af37]/40 transition-all"
                    >
                      <Link 
                        to={`/profile/${user.uuid}`} 
                        onClick={() => setIsDockOpen(false)}
                        className="flex items-center gap-3.5 group"
                      >
                        <img
                          src={user.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"}
                          className="w-11 h-11 rounded-full object-cover border border-[#d4af37]/30 group-hover:border-[#d4af37] transition-colors"
                          alt={`${user.first_name}`}
                        />
                        <span className="text-sm font-semibold text-white group-hover:text-[#d4af37] transition-colors">
                          {user.first_name} {user.last_name}
                        </span>
                      </Link>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Profile;