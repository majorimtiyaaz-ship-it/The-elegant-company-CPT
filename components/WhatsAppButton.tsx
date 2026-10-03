import React from 'react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { useBookBarVisible } from './BookCTA';

const WHATSAPP_NUMBER = '27638980781'; // 063 898 0781, international format, no leading 0
const MESSAGE = "Hi, I'd like to enquire about a custom piece.";

export const WhatsAppButton: React.FC = () => {
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(MESSAGE)}`;
  // The sticky bar takes over once it slides in, so the round button steps aside.
  const barShowing = useBookBarVisible();

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      tabIndex={barShowing ? -1 : 0}
      className={`
        fixed bottom-5 right-5 md:bottom-8 md:right-8 z-[9998]
        flex items-center justify-center
        w-14 h-14 md:w-16 md:h-16
        rounded-full
        bg-[#25D366]
        shadow-[0_8px_24px_rgba(0,0,0,0.25)]
        hover:shadow-[0_12px_32px_rgba(0,0,0,0.32)]
        hover:scale-105
        active:scale-95
        transition-all duration-300 ease-out
        focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#25D366]
        ${barShowing ? 'pointer-events-none translate-y-4 opacity-0' : 'opacity-100'}
      `}
    >
      <WhatsAppIcon className="h-8 w-8 md:h-9 md:w-9" fill="#ffffff" />
    </a>
  );
};
