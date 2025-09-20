import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 1rem 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background-color: ${props => props.scrolled ? 'rgba(255, 255, 255, 0.95)' : 'transparent'};
  backdrop-filter: ${props => props.scrolled ? 'blur(10px)' : 'none'};
  box-shadow: ${props => props.scrolled ? '0 4px 20px rgba(0, 0, 0, 0.1)' : 'none'};
  opacity: ${props => props.scrolled ? 1 : 0};
  transform: ${props => props.scrolled ? 'translateY(0)' : 'translateY(-10px)'};
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0 3rem;

  @media (max-width: 768px) {
    padding: 0 1.5rem;
  }
`;

const Logo = styled(Link).withConfig({
  shouldForwardProp: (prop) => prop !== 'scrolled'
})`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.scrolled ? '#0f172a' : 'white'};
  transition: var(--transition);
  opacity: ${props => props.scrolled ? 1 : 0};
  transform: ${props => props.scrolled ? 'translateY(0)' : 'translateY(-10px)'};

  &:hover {
    color: var(--main-color, #ef4444);
  }
`;

const Nav = styled(motion.nav)`
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: ${props => props.scrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.9)'};
    backdrop-filter: blur(10px);
    padding: 2rem;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    border-radius: 0 0 10px 10px;
    pointer-events: ${props => props.isOpen ? 'auto' : 'none'};
  }

  @media (min-width: 769px) {
    display: flex !important;
  }
`;

const NavLink = styled(motion.div).withConfig({
  shouldForwardProp: (prop) => !['scrolled', 'isActive'].includes(prop)
})`
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  opacity: ${props => props.scrolled ? 1 : 0};
  transform: ${props => props.scrolled ? 'translateY(0)' : 'translateY(-10px)'};
  transition: var(--transition);

  a {
    color: ${props => props.isActive ? 'var(--main-color, #ef4444)' : (props.scrolled ? '#0f172a' : 'white')};
    transition: var(--transition);
    position: relative;

    &:after {
      content: '';
      position: absolute;
      bottom: -5px;
      left: 0;
      width: 0;
      height: 2px;
      background-color: var(--main-color, #ef4444);
      transition: var(--transition);
    }

    &:hover {
      color: var(--main-color, #ef4444);

      &:after {
        width: 100%;
      }
    }
  }
`;

const MobileMenuButton = styled(motion.button).withConfig({
  shouldForwardProp: (prop) => prop !== 'scrolled'
})`
  display: none;
  background: none;
  border: none;
  font-size: 1.8rem;
  cursor: pointer;
  color: ${props => props.scrolled ? '#0f172a' : 'white'};
  transition: color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 0.5rem;
  width: 48px;
  height: 48px;
  align-items: center;
  justify-content: center;

  &:hover {
    color: var(--main-color, #ef4444);
  }

  @media (max-width: 768px) {
    display: flex;
  }
`;

const LanguageToggle = styled(motion.button).withConfig({
  shouldForwardProp: (prop) => prop !== 'scrolled'
})`
  background: none;
  border: 2px solid ${props => props.scrolled ? 'rgba(15, 23, 42, 0.1)' : 'rgba(255, 255, 255, 0.2)'};
  color: ${props => props.scrolled ? '#0f172a' : 'white'};
  border-radius: 20px;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 60px;
  justify-content: center;

  &:hover {
    background: ${props => props.scrolled ? 'rgba(var(--main-color-rgb, 239, 68, 68), 0.1)' : 'rgba(255, 255, 255, 0.1)'};
    border-color: var(--main-color, #ef4444);
    color: var(--main-color, #ef4444);
  }

  @media (max-width: 768px) {
    margin-top: 1rem;
    border-color: ${props => props.scrolled ? 'rgba(15, 23, 42, 0.2)' : 'rgba(15, 23, 42, 0.2)'};
    color: ${props => props.scrolled ? '#0f172a' : '#0f172a'};
  }
`;

function Header({ onAboutClick, onContactClick }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { currentLanguage, toggleLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <HeaderContainer scrolled={scrolled}>
      <HeaderContent>
        <Logo to="/" scrolled={scrolled}>David Rajala</Logo>
        
        <MobileMenuButton
          onClick={toggleMenu}
          scrolled={scrolled}
          whileTap={{ scale: 0.95 }}
          animate={{ rotate: menuOpen ? 180 : 0 }}
          transition={{
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1]
          }}
        >
          {menuOpen ? '✕' : '☰'}
        </MobileMenuButton>

        <AnimatePresence>
          {(menuOpen || window.innerWidth > 768) && (
            <Nav
              isOpen={menuOpen}
              scrolled={scrolled}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{
                duration: 0.3,
                ease: [0.4, 0, 0.2, 1]
              }}
            >
          <NavLink
            isActive={location.pathname === '/'}
            scrolled={scrolled}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/" onClick={closeMenu}>{t('nav.projects')}</Link>
          </NavLink>

          <NavLink
            scrolled={scrolled}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <a href="#" onClick={(e) => {
              e.preventDefault();
              onAboutClick();
              closeMenu();
            }}>{t('nav.about')}</a>
          </NavLink>

          <NavLink
            scrolled={scrolled}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <a href="#" onClick={(e) => {
              e.preventDefault();
              onContactClick();
              closeMenu();
            }}>{t('nav.contact')}</a>
          </NavLink>

          <LanguageToggle
            onClick={toggleLanguage}
            scrolled={scrolled}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {currentLanguage.toUpperCase()}
          </LanguageToggle>
            </Nav>
          )}
        </AnimatePresence>
      </HeaderContent>
    </HeaderContainer>
  );
}

export default Header;