import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuthStore } from "@store/useAuthStore";
import { MobileNavBar } from "@components/NavBar/Mobile/MobileNavBar";
import { DesktopNavBar } from "@/components/NavBar/Desktop/DesktopNavBar";
import { ChatDock } from "@/components/NavBar/ChatDock";

const NavBar: React.FC = () => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // 💬 State to track which user's chat box should be opened when clicked from the inbox dropdown
  const [activeChatTargetUuid, setActiveChatTargetUuid] = useState<string | null>(null);

  const { userUuid } = useAuthStore();

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
        pathname={location.pathname}
        onOpenCreate={() => setIsCreateOpen(true)}
        onSelectConversation={(partnerUuid) => {
          setActiveChatTargetUuid(partnerUuid);
        }}
      />

      <DesktopNavBar
        userUuid={userUuid ?? null}
        pathname={location.pathname}
        onOpenCreate={() => setIsCreateOpen(true)}
        onSelectConversation={(partnerUuid) => {
          setActiveChatTargetUuid(partnerUuid);
          console.log("Opening chat box for user:", partnerUuid);
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