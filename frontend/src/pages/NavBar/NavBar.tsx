import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "@/api/axios.js";
import { useAuthStore } from "@store/useAuthStore.js";
import { MobileNavBar } from "@components/NavBar/Mobile/MobileNavBar";
import { DesktopNavBar } from "@/components/NavBar/Desktop/DesktopNavBar";
import { ChatDock } from "@/pages/NavBar/ChatDock";

interface NavBarProps {
  forceHideNavBar?: boolean;
}

const NavBar: React.FC<NavBarProps> = ({ forceHideNavBar = false }) => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [activeChatTargetUuid, setActiveChatTargetUuid] = useState<string | null>(null);

  const { userUuid } = useAuthStore();

  // Use refs to track scroll positions without triggering React re-renders inside the listener
  const lastScrollYRef = useRef(0);
  const tickingRef = useRef(false);

  const { data: profileData } = useQuery({
    queryKey: ["profileFeed", "me"],
    queryFn: async () => {
      const res = await api.get(`/task/profile/me`);
      return res.data;
    },
    enabled: !!userUuid,
    staleTime: 5 * 60 * 1000, // Extended stale time to prevent background thrashing
    refetchOnWindowFocus: false,
  });

  const userAvatar = profileData?.profile?.avatar_url;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const lastScrollY = lastScrollYRef.current;
      const scrollDifference = Math.abs(currentScrollY - lastScrollY);

      if (!tickingRef.current) {
        window.requestAnimationFrame(() => {
          if (currentScrollY < 20) {
            setIsVisible(true);
          } else if (scrollDifference > 8) {
            const shouldBeVisible = currentScrollY <= lastScrollY;
            // Only update state if the visibility status actually changes to prevent layout thrashing
            setIsVisible((prev) => (prev !== shouldBeVisible ? shouldBeVisible : prev));
          }

          lastScrollYRef.current = currentScrollY;
          tickingRef.current = false;
        });

        tickingRef.current = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <MobileNavBar
        isVisible={isVisible}
        forceHideNavBar={forceHideNavBar} 
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
        userAvatar={userAvatar}
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