import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { Language } from '../types';

interface ScrollToTopProps {
  lang: Language;
}

export const ScrollToTop: React.FC<ScrollToTopProps> = ({ lang }) => {
  const [isVisible, setIsVisible] = useState(false);
  const isAr = lang === 'ar';

  useEffect(() => {
    const handleScroll = () => {
      // Show button only when user scrolls down more than 280px
      if (window.scrollY > 280) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <button
      id="scroll-to-top-button"
      onClick={scrollToTop}
      className="fixed bottom-6 end-6 z-40 w-11 h-11 rounded-full bg-[#df6828] hover:bg-[#c65a1f] text-white shadow-xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-95 cursor-pointer group border-2 border-white/80 dark:border-neutral-700"
      title={isAr ? "الصعود لأعلى الصفحة" : "Scroll to Top"}
      aria-label={isAr ? "الصعود لأعلى الصفحة" : "Scroll to Top"}
    >
      <ArrowUp className="w-5 h-5 transition-transform duration-200 group-hover:-translate-y-0.5" />
      {/* Tooltip on hover */}
      <span className="sr-only">
        {isAr ? "الصعود للأعلى" : "Scroll to top"}
      </span>
    </button>
  );
};
