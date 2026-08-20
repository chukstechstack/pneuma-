import { useState, useEffect, useRef } from "react";

export function useScrollReveal(threshold = 0.1): [React.RefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const currentRef = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    if (currentRef) observer.observe(currentRef);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isVisible];
}