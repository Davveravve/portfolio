// src/components/Header.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/Header.css';

// Array of roles to cycle through
const roles = ["DESIGNER", "UTVECKLARE", "SKAPARE"];

const Header = () => {
  const [roleIndex, setRoleIndex] = useState(0);
  const [dots, setDots] = useState('');
  const [increasing, setIncreasing] = useState(true);
  
  // Effect to cycle through roles every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prevIndex) => (prevIndex + 1) % roles.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Effect for the animated dots
  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots(prevDots => {
        if (increasing) {
          // Add dots until we reach 4
          if (prevDots.length < 4) {
            return prevDots + '.';
          } else {
            setIncreasing(false);
            return prevDots.slice(0, -1);
          }
        } else {
          // Remove dots until we reach 1
          if (prevDots.length > 1) {
            return prevDots.slice(0, -1);
          } else {
            setIncreasing(true);
            return prevDots + '.';
          }
        }
      });
    }, 1000);
    
    return () => clearInterval(dotsInterval);
  }, [increasing]);

  const baseTagline = "Passionerad digital hantverkare under utveckling";
  
  return (
    <HeaderContainer>
      <HeroSection>
        <NameContainer>
          <Name>DAVID RAJALA</Name>
        </NameContainer>
        
        <RoleContainer>
          <AnimatePresence mode="wait">
            <Role
              key={roleIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -9 }}
              transition={{ duration: 0.3 }}
            >
              {roles[roleIndex]}
            </Role>
          </AnimatePresence>
        </RoleContainer>
        
        <Tagline>
          {baseTagline}
          <AnimatedDots>{dots}</AnimatedDots>
        </Tagline>
        
        {/* Just a subtle hint to scroll */}
        <ScrollIndicator>↓</ScrollIndicator>
      </HeroSection>
    </HeaderContainer>
  );
};

// Styled Components
const HeaderContainer = styled.header`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 90vh; /* Reduced from 100vh to leave some room at bottom */
  background-color: #0a0e17;
  color: white;
`;

const HeroSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  text-align: center;
  padding: 0 1rem;
`;

const NameContainer = styled.div`
  margin-bottom: 1rem;
  width: 100%;
  white-space: nowrap; /* Prevents line breaks */
`;

const Name = styled.h1`
  font-size: 4rem;
  font-weight: 700;
  letter-spacing: 3px;
  
  /* Responsive font size adjustments */
  @media (max-width: 768px) {
    font-size: 3rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2.5rem;
    letter-spacing: 2px;
  }
`;

const RoleContainer = styled.div`
  height: 0rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.4rem;
`;

const Role = styled(motion.h2)`
  font-size: 3.6rem;
  font-weight: 700;
  color: #c45b5b;
  letter-spacing: 2px;
  
  /* Responsive font size adjustments */
  @media (max-width: 768px) {
    font-size: 3rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2.5rem;
    letter-spacing: 1px;
  }
`;

const Tagline = styled.p`
  font-size: 1.2rem;
  margin-top: 17rem;
  opacity: 0.7;
  
  @media (max-width: 480px) {
    font-size: 1rem;
    margin-top: 3rem;
  }
`;

const AnimatedDots = styled.span`
  display: inline-block;
  min-width: 30px;
  text-align: left;
`;

const ScrollIndicator = styled.div`
  position: absolute;
  bottom: 10vh;
  font-size: 1.3rem;
  opacity: 0.3;
  animation: bounce 2s infinite;
 
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-10px);
    }
    60% {
      transform: translateY(-5px);
    }
  }
`;

export default Header;