// src/components/Header.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/Header.css';

// Array of roles to cycle through
const roles = ["DESIGNER", "DEVELOPER", "CREATOR"];

const Header = () => {
  const [roleIndex, setRoleIndex] = useState(0);
  
  // Effect to cycle through roles every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prevIndex) => (prevIndex + 1) % roles.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, []);

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
        
        <Tagline>Building digital experiences that matter</Tagline>
        
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
  margin-top: 4rem;
  opacity: 0.2;
  
  @media (max-width: 480px) {
    font-size: 1rem;
    margin-top: 3rem;
  }
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