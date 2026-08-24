import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "@/api/axios.js";
import { useAuthStore } from "@store/useAuthStore.js";
import { MobileNavBar } from "@components/NavBar/Mobile/MobileNavBar";
import { DesktopNavBar } from "@/components/NavBar/Desktop/DesktopNavBar";
import { ChatDock } from "@/pages/NavBar/ChatDock";

const NavBar: React.FC = () => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [activeChatTargetUuid, setActiveChatTargetUuid] = useState<string | null>(null);

  const { userUuid } = useAuthStore();

  // 👉 Matches the query key and endpoint structure used in your profile page
  const { data: profileData } = useQuery({
    queryKey: ["profileFeed", "me"],
    queryFn: async () => {
      const res = await api.get(`/task/profile/me`);
      return res.data;
    },
    enabled: !!userUuid,
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const userAvatar = profileData?.profile?.avatar_url;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDifference = Math.abs(currentScrollY - lastScrollY);

      if (currentScrollY < 20) {
        setIsVisible(true);
      } else if (scrollDifference > 8) {
        setIsVisible(currentScrollY <= lastScrollY);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <>
      <MobileNavBar
        isVisible={isVisible}
        userUuid={userUuid ?? null}
        userAvatar={userAvatar}
        pathname={location.pathname}
        onOpenCreate={() => setIsCreateOpen(true)}
        onSelectConversation={(partnerUuid) => {
          setActiveChatTargetUuid(partnerUuid);
        }}
      />

      <DesktopNavBar
        userUuid={userUuid ?? null}
        userAvatar={userAvatar} // 👉 Live connected to the shared cache!
        pathname={location.pathname}
        onOpenCreate={() => setIsCreateOpen(true)}
        onSelectConversation={(partnerUuid) => {
          setActiveChatTargetUuid(partnerUuid);
        }}
      />
      
      {activeChatTargetUuid && (
        <ChatDock 
          targetProfileUuid={activeChatTargetUuid} 
          isOpen={!!activeChatTargetUuid} 
          onClose={() => setActiveChatTargetUuid(null)} 
        />
      )} 
    </>
  );
};

export default NavBar;