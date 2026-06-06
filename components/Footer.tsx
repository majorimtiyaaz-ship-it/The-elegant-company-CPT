import React from 'react';
import { Instagram, Facebook } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-elegant-dark text-white py-16 px-6 border-t border-gray-800">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        
        <div className="md:col-span-1">
          <div className="flex items-center gap-3 mb-6 text-white">
             <svg width="56" height="56" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="50" cy="50" r="45" />
                {/* Styled E */}
                <path d="M35 30 H65" strokeLinecap="square" />
                <path d="M35 70 H65" strokeLinecap="square" />
                <path d="M35 30 V70" strokeLinecap="square" />
                <path d="M35 50 H55" strokeLinecap="square" />
                <path d="M55 50 L60 45" strokeLinecap="square" />
                <path d="M55 50 L60 55" strokeLinecap="square" />
             </svg>
             <div className="flex flex-col leading-none font-serif">
                <span className="text-2xl tracking-[0.1em] uppercase">The Elegant</span>
                <span className="text-base tracking-[0.2em] uppercase font-light text-gray-300">Company</span>
             </div>
          </div>
          
          <p className="text-gray-400 leading-relaxed mb-6">
            Crafting legacies through solid timber and traditional joinery. We create wooden furniture that tells your story.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-gray-400 hover:text-elegant-gold transition-colors"><Instagram size={20} /></a>
            <a href="#" className="text-gray-400 hover:text-elegant-gold transition-colors"><Facebook size={20} /></a>
          </div>
        </div>

        <div>
          <h4 className="text-elegant-gold font-bold tracking-widest uppercase mb-6 text-sm">Explore</h4>
          <ul className="space-y-4 text-gray-400">
            <li><a href="#" className="hover:text-white transition-colors">Living Room</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Dining Room</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Bedroom</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Office</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Outdoor</a></li>
          </ul>
        </div>

      </div>
      <div className="container mx-auto mt-16 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} The Elegant Company. All rights reserved.
      </div>
    </footer>
  );
};