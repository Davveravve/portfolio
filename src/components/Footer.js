// src/components/Footer.js
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const FooterContainer = styled.footer`
  background-color: white;
  color: #0f172a;
  padding: 3rem 0;
  border-top: 1px solid #e5e7eb;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const Copyright = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: #64748b;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1.5rem;
  margin: 1.5rem 0;
`;

const SocialLink = styled(motion.a)`
  color: #0f172a;
  font-size: 1.5rem;
  transition: var(--transition);

  &:hover {
    color: #ef4444;
  }
`;

const FooterInfo = styled.div`
  margin-bottom: 1.5rem;
`;

const Name = styled.h3`
  font-size: 1.5rem;
  margin: 0;
  margin-bottom: 0.5rem;
`;

const Tagline = styled.p`
  font-size: 1rem;
  color: #64748b;
  margin: 0;
`;

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <FooterContainer>
      <FooterContent>
        <FooterInfo>
          <Name>David Rajala</Name>
          <Tagline>Creative Developer</Tagline>
        </FooterInfo>
        
        <SocialLinks>
          <SocialLink 
            href="https://github.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.9 }}
          >
            <i className="fab fa-github"></i>
          </SocialLink>
          <SocialLink 
            href="https://linkedin.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.9 }}
          >
            <i className="fab fa-linkedin"></i>
          </SocialLink>
          <SocialLink 
            href="https://twitter.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.9 }}
          >
            <i className="fab fa-twitter"></i>
          </SocialLink>
        </SocialLinks>
        
        <Copyright>
          &copy; {currentYear} David Rajala. All rights reserved.
        </Copyright>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;