import React from 'react';

interface AtlasLogoProps {
  className?: string;
  onClick?: () => void;
}

export const AtlasLogo: React.FC<AtlasLogoProps> = ({ className = '', onClick }) => {
  return (
    <div 
      id="atlas-ocean-logo" 
      onClick={onClick}
      className={`flex items-center gap-3 select-none cursor-pointer group ${className}`}
    >
      {/* Stylized Atlas Ocean Emblem */}
      <div className="relative w-12 h-12 flex-shrink-0 flex items-center justify-center">
        <svg 
          viewBox="0 0 100 100" 
          className="w-full h-full drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
        >
          {/* Outer circle frame */}
          <circle cx="50" cy="50" r="46" fill="none" stroke="#e0834c" strokeWidth="4" />
          <circle cx="50" cy="50" r="43" fill="#3f3835" />
          
          {/* Dynamic Ocean Sail / Wave motifs */}
          <path 
            d="M24 64 C35 52, 60 50, 78 66 C65 60, 42 60, 24 64 Z" 
            fill="#d26e38" 
          />
          <path 
            d="M32 50 C45 36, 68 34, 82 46 C68 42, 50 42, 32 50 Z" 
            fill="#e5935f" 
          />
          <path 
            d="M48 22 C48 38, 38 68, 20 72 C32 60, 52 40, 56 22 Z" 
            fill="#f3c8a3" 
          />
          <path 
            d="M54 20 C64 36, 75 50, 84 60 C72 52, 62 40, 54 20 Z" 
            fill="#e27439" 
          />
          <circle cx="50" cy="38" r="4" fill="#fceee2" />
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col text-left">
        <span className="text-[#f1ece7] text-xl font-extrabold tracking-wider font-serif uppercase leading-tight drop-shadow-sm">
          ATLAS OCEAN
        </span>
        <span className="text-[#d8cebe] text-[10px] font-semibold tracking-[0.38em] uppercase leading-none pl-0.5 mt-0.5">
          P L A T F O R M
        </span>
      </div>
    </div>
  );
};
