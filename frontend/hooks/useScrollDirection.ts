import { useState, useEffect } from 'react';

export function useScrollDirection() {
  const [showOnScroll, setShowOnScroll] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 50) {
        setShowOnScroll(true);
      } else if (currentScrollY < lastScrollY) {
        setShowOnScroll(true);
      } else if (currentScrollY > lastScrollY) {
        setShowOnScroll(false);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return showOnScroll;
}

