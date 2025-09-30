import React from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { theme } from '../styles/theme';

const gradientAnimation = keyframes`
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
`;

const Footer = styled.footer`
  padding: ${theme.spacing.xl} 0 ${theme.spacing.lg};
  position: relative;
  z-index: 2;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  background: linear-gradient(180deg, transparent 0%, rgba(99, 102, 241, 0.02) 100%);

  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing.lg} 0 ${theme.spacing.md};
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;

  @media (max-width: ${theme.breakpoints.md}) {
    padding: 0 1rem;
  }
`;

const FooterContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 2rem;

  @media (max-width: ${theme.breakpoints.md}) {
    flex-direction: column;
    text-align: center;
  }
`;

const Copyright = styled.p`
  color: ${theme.colors.textSecondary};
  font-size: 0.875rem;

  span {
    background: ${theme.gradients.text};
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: ${gradientAnimation} 3s ease infinite;
    font-weight: 600;
  }
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 2rem;

  @media (max-width: ${theme.breakpoints.sm}) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const FooterLink = styled(motion.a)`
  color: ${theme.colors.textSecondary};
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: color 0.3s ease;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    right: 0;
    height: 1px;
    background: ${theme.gradients.primary};
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }

  &:hover {
    color: ${theme.colors.text};

    &::after {
      transform: scaleX(1);
    }
  }
`;

const SocialSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const SocialIcon = styled(motion.a)`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: ${theme.radius.md};
  color: ${theme.colors.textSecondary};
  transition: all 0.3s ease;

  @media (max-width: ${theme.breakpoints.sm}) {
    width: 36px;
    height: 36px;
  }

  &:hover {
    background: ${theme.gradients.primary};
    color: white;
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(99, 102, 241, 0.3);
    border-color: transparent;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const ScrollToTop = styled(motion.button)`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${theme.gradients.primary};
  border: none;
  border-radius: ${theme.radius.full};
  color: white;
  font-size: 1.25rem;
  cursor: pointer;
  box-shadow: ${theme.shadows.lg};
  transition: all 0.3s ease;
  z-index: 1000;

  @media (max-width: ${theme.breakpoints.sm}) {
    width: 45px;
    height: 45px;
    bottom: 1rem;
    right: 1rem;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${theme.shadows.xl}, ${theme.shadows.glow};
  }
`;

const ModernFooter = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Footer>
        <Container>
          <FooterContent>
            <Copyright>
              <span>David Rajala</span>
            </Copyright>
          </FooterContent>
        </Container>
      </Footer>

      <ScrollToTop
        onClick={scrollToTop}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        ↑
      </ScrollToTop>
    </>
  );
};

export default ModernFooter;