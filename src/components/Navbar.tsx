import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Logo } from './Logo';
import { MobileMenu } from './MobileMenu';
import { NAV_LINKS } from '../constants';

interface NavbarProps {
  onScrollToDashboard?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onScrollToDashboard }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header
        className="relative z-10 flex items-center justify-between px-5 sm:px-8 py-4 sm:py-5"
        style={{
          maxWidth: 1280,
          margin: '0 auto',
        }}
      >
        {/* Left: Logo */}
        <a
          href="#"
          className="flex items-center"
          aria-label="Ironclad home"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <Logo fillColor="#192837" className="transition-opacity hover:opacity-70" />
        </a>

        {/* Center: Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(link => (
            <a
              key={link}
              href="#"
              className="text-sm font-medium transition-opacity hover:opacity-70"
              style={{ color: 'var(--color-text)' }}
              onClick={(e) => {
                e.preventDefault();
                if (onScrollToDashboard) {
                  onScrollToDashboard();
                }
              }}
            >
              {link}
            </a>
          ))}
        </nav>

        {/* Right: Desktop CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <button
            type="button"
            className="text-sm font-semibold px-5 py-2.5 rounded-full text-white transition-all hover:shadow-lg active:scale-95 cursor-pointer"
            style={{ backgroundColor: '#7342E2' }}
            onClick={onScrollToDashboard}
          >
            Start For Free
          </button>
          <button
            type="button"
            className="text-sm font-semibold px-5 py-2.5 rounded-full transition-all hover:shadow-lg active:scale-95 cursor-pointer"
            style={{
              backgroundColor: '#F2F2EE',
              color: 'var(--color-text)',
            }}
          >
            Sign In
          </button>
        </div>

        {/* Mobile menu trigger */}
        <button
          type="button"
          className="md:hidden flex items-center justify-center"
          style={{
            color: 'var(--color-text)',
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
          }}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Slide-in Mobile Drawer */}
      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onScrollToDashboard={onScrollToDashboard}
      />
    </>
  );
};
