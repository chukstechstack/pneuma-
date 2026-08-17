import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuthStore } from "@store/useAuthStore";
import { MobileNavBar } from "@components/NavBar/MobileNavBar";
import { DesktopNavBar } from "@components/NavBar/DesktopNavBar";


const NavBar: React.FC = () => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
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
      <MobileNavBar isVisible={isVisible} userUuid={userUuid ?? null} pathname={location.pathname} />
      <DesktopNavBar userUuid={userUuid ?? null} pathname={location.pathname} />
    </>
  );
};

export default NavBar;

