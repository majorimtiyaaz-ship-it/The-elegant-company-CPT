import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface ConsultationButtonProps {
  className?: string;
  onClick?: () => void;
  showMicrocopy?: boolean;
  variant?: 'gold' | 'dark' | 'outline';
  size?: 'normal' | 'large';
  text?: string;
}

export const ConsultationButton: React.FC<ConsultationButtonProps> = ({
  className = '',
  onClick,
  showMicrocopy = true,
  variant = 'gold',
  size = 'large',
  text = 'Request a Consultation'
}) => {
  // Sophisticated colors matching The Elegant Company brand guidelines
  let bgClass = '';
  let textClass = 'text-white';
  let borderClass = 'border-transparent';
  let hoverClass = '';

  switch (variant) {
    case 'dark':
      // Deep charcoal/black
      bgClass = 'bg-[#1a1a1a]';
      hoverClass = 'hover:bg-[#252525] hover:shadow-[0_12px_32px_rgba(26,26,26,0.12)]';
      break;
    case 'outline':
      // Sophisticated transparent with gold border
      bgClass = 'bg-transparent';
      textClass = 'text-[#1a1a1a] border-[#c5a059]';
      borderClass = 'border-2';
      hoverClass = 'hover:bg-[#c5a059] hover:text-white hover:shadow-[0_12px_32px_rgba(197,160,89,0.15)]';
      break;
    case 'gold':
    default:
      // Real luxury elegant-gold (#c5a059)
      bgClass = 'bg-[#c5a059]';
      hoverClass = 'hover:bg-[#b48f48] hover:shadow-[0_12px_32px_rgba(197,160,89,0.22)]';
      break;
  }

  // Luxury spacing padding - beautifully compact with guaranteed 48px minimal mobile touch target height
  const paddingClass = size === 'large'
    ? 'py-3.5 px-8 md:py-4 md:px-10 text-xs tracking-[0.2em] md:tracking-[0.22em] min-h-[48px] md:min-h-[54px]'
    : 'py-3 px-7 md:py-3.5 md:px-8 text-[11px] tracking-[0.18em] md:tracking-[0.2em] min-h-[48px]';

  return (
    <div className={`flex flex-col items-center justify-center text-center select-none ${className}`}>
      <button
        onClick={onClick}
        className={`
          ${bgClass} ${textClass} ${borderClass} ${hoverClass} ${paddingClass}
          font-sans font-bold uppercase
          rounded-sm
          transition-all duration-300 ease-out
          active:scale-[0.98]
          cursor-pointer
          relative
          overflow-hidden
          group
          flex
          items-center
          justify-center
          gap-2.5
          border
        `}
      >
        {/* Subtle interior gold-white shimmer line for premium depth */}
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none"></span>
        
        {/* Subtle interior glow border layout details */}
        <span className="absolute inset-x-0 top-0 h-[1px] bg-white/15 pointer-events-none"></span>
        
        {/* Text and visual indicators */}
        <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-[-2px]">
          {text}
        </span>
        
        {/* Elegantly scaled arrow reveal on hover */}
        <ArrowUpRight 
          size={15} 
          className="relative z-10 text-current transition-all duration-300 transform translate-y-[1px] opacity-75 group-hover:translate-x-[2px] group-hover:translate-y-[-1px] group-hover:opacity-100 shrink-0" 
        />
      </button>

      {showMicrocopy && (
        <span className="text-[10px] md:text-[11px] text-stone-400 font-sans tracking-[0.12em] uppercase font-light mt-3 block animate-fade-in">
          “We respond within 24 hours”
        </span>
      )}

      {/* Styled animation keyframe inject for shimmer inside button */}
      <style>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
};
