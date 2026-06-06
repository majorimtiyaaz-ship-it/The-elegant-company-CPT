import React, { useState, useEffect } from 'react';
import { View } from '../types';
import { Menu, X } from 'lucide-react';

interface NavigationProps {
  currentView: View;
  onNavigate: (view: View, sectionId?: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navClass = `fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
    isScrolled ? 'bg-transparent backdrop-blur-sm py-2' : 'bg-transparent py-6'
  }`;

  // Helper to determine text color
  const getTextClass = (view: View) => {
    const isActive = currentView === view;
    if (isActive) return 'text-elegant-gold';
    return isScrolled ? 'text-elegant-dark' : 'text-elegant-dark md:text-white';
  };
  
  const linkBaseClass = "cursor-pointer text-sm font-semibold tracking-widest uppercase hover:text-elegant-gold transition-colors";

  const handleNavClick = (view: View, sectionId?: string) => {
    onNavigate(view, sectionId);
    setIsMobileMenuOpen(false);
  };

  const logoColorClass = isScrolled ? 'text-elegant-dark' : 'text-elegant-dark md:text-white';

  return (
    <nav className={navClass}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="w-10 h-10"></div>

        {/* Desktop Menu - Cloaked when in hero section on home view before scroll */}
        <div className={`hidden md:flex gap-8 items-center transition-all duration-500 ${
          currentView === View.HOME && !isScrolled 
            ? 'opacity-0 pointer-events-none translate-y-[-10px]' 
            : 'opacity-100 translate-y-0'
        }`}>
          <span className={`${linkBaseClass} ${getTextClass(View.HOME)}`} onClick={() => handleNavClick(View.HOME, 'home')}>Home</span>
          <span className={`${linkBaseClass} ${isScrolled ? 'text-elegant-dark' : 'text-elegant-dark md:text-white'}`} onClick={() => handleNavClick(View.HOME, 'portfolio')}>Collection</span>
          <span className={`${linkBaseClass} ${getTextClass(View.DESIGN_STUDIO)}`} onClick={() => handleNavClick(View.DESIGN_STUDIO)}>AI Design Studio</span>
          <span className={`${linkBaseClass} ${isScrolled ? 'text-elegant-dark' : 'text-elegant-dark md:text-white'}`} onClick={() => handleNavClick(View.HOME, 'contact')}>Contact</span>
        </div>

        {/* Mobile Toggle - Cloaked when in hero section on home view before scroll */}
        <div className={`md:hidden cursor-pointer transition-all duration-500 ${
          currentView === View.HOME && !isScrolled 
            ? 'opacity-0 pointer-events-none' 
            : 'opacity-100'
        } ${isScrolled ? 'text-elegant-dark' : 'text-elegant-dark md:text-white'}`} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (currentView !== View.HOME || isScrolled) && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg py-6 flex flex-col items-center gap-6 animate-fade-in">
          <span className="text-elegant-dark font-semibold tracking-widest uppercase" onClick={() => handleNavClick(View.HOME, 'home')}>Home</span>
          <span className="text-elegant-dark font-semibold tracking-widest uppercase" onClick={() => handleNavClick(View.HOME, 'portfolio')}>Collection</span>
          <span className="text-elegant-dark font-semibold tracking-widest uppercase" onClick={() => handleNavClick(View.DESIGN_STUDIO)}>AI Design Studio</span>
          <span className="text-elegant-dark font-semibold tracking-widest uppercase" onClick={() => handleNavClick(View.HOME, 'contact')}>Contact</span>
        </div>
      )}
    </nav>
  );
};