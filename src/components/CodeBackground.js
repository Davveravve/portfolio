import React from 'react';
import styled from 'styled-components';

const CodeContainer = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 1;
  font-family: 'Fira Code', 'Consolas', 'Monaco', monospace;
  font-size: 13px;
  line-height: 1.4;
  padding: 2rem;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    font-size: 10px;
    padding: 1rem;
  }
`;

const CodeLine = styled.div`
  color: ${props => props.color || 'rgba(255, 255, 255, 0.06)'};
  white-space: pre;
  user-select: none;
  margin-bottom: 2px;

  @media (max-width: 768px) {
    color: ${props => props.color ? props.color.replace('0.06', '0.04') : 'rgba(255, 255, 255, 0.04)'};
  }
`;

const CodeBackground = () => {
  const actualCode = [
    { text: '// PortfolioDesign.js - David Rajala Portfolio', color: 'rgba(106, 153, 85, 0.1)' },
    { text: 'import React, { useState, useEffect } from \'react\';', color: 'rgba(197, 134, 192, 0.08)' },
    { text: 'import styled, { keyframes } from \'styled-components\';', color: 'rgba(197, 134, 192, 0.08)' },
    { text: 'import { motion, AnimatePresence } from \'framer-motion\';', color: 'rgba(197, 134, 192, 0.08)' },
    { text: '', color: null },
    { text: '// Hero animations for role transitions', color: 'rgba(106, 153, 85, 0.1)' },
    { text: 'const float = keyframes`', color: 'rgba(86, 156, 214, 0.08)' },
    { text: '  0%, 100% { transform: translateY(0px); }', color: 'rgba(255, 255, 255, 0.06)' },
    { text: '  50% { transform: translateY(-10px); }', color: 'rgba(255, 255, 255, 0.06)' },
    { text: '`;', color: 'rgba(86, 156, 214, 0.08)' },
    { text: '', color: null },
    { text: 'const HeroSection = styled.section`', color: 'rgba(86, 156, 214, 0.08)' },
    { text: '  height: 100vh;', color: 'rgba(255, 255, 255, 0.06)' },
    { text: '  display: flex;', color: 'rgba(255, 255, 255, 0.06)' },
    { text: '  align-items: center;', color: 'rgba(255, 255, 255, 0.06)' },
    { text: '  background: ${props => props.backgroundColor};', color: 'rgba(255, 255, 255, 0.06)' },
    { text: '`;', color: 'rgba(86, 156, 214, 0.08)' },
    { text: '', color: null },
    { text: '// Dynamic role switching for "Designer" → "Utvecklare"', color: 'rgba(106, 153, 85, 0.1)' },
    { text: 'const [currentRole, setCurrentRole] = useState(0);', color: 'rgba(78, 201, 176, 0.08)' },
    { text: 'const heroRoles = ["DESIGNER", "UTVECKLARE", "SKAPARE"];', color: 'rgba(78, 201, 176, 0.08)' },
    { text: '', color: null },
    { text: 'useEffect(() => {', color: 'rgba(197, 134, 192, 0.08)' },
    { text: '  const interval = setInterval(() => {', color: 'rgba(255, 255, 255, 0.06)' },
    { text: '    setCurrentRole(prev => (prev + 1) % heroRoles.length);', color: 'rgba(255, 255, 255, 0.06)' },
    { text: '  }, 3000);', color: 'rgba(255, 255, 255, 0.06)' },
    { text: '  return () => clearInterval(interval);', color: 'rgba(197, 134, 192, 0.08)' },
    { text: '}, []);', color: 'rgba(255, 255, 255, 0.06)' },
    { text: '', color: null },
    { text: '// Smooth scroll to projects section', color: 'rgba(106, 153, 85, 0.1)' },
    { text: 'const scrollToProjects = () => {', color: 'rgba(220, 220, 170, 0.08)' },
    { text: '  document.getElementById(\'projects\')', color: 'rgba(255, 255, 255, 0.06)' },
    { text: '    .scrollIntoView({ behavior: \'smooth\' });', color: 'rgba(255, 255, 255, 0.06)' },
    { text: '};', color: 'rgba(220, 220, 170, 0.08)' },
    { text: '', color: null },
    { text: '// BackgroundPaths component for floating lines', color: 'rgba(106, 153, 85, 0.1)' },
    { text: '<BackgroundPaths', color: 'rgba(78, 201, 176, 0.08)' },
    { text: '  lineColor={heroSettings.lineColor}', color: 'rgba(255, 255, 255, 0.06)' },
    { text: '  lineOpacity={heroSettings.lineOpacity}', color: 'rgba(255, 255, 255, 0.06)' },
    { text: '/>', color: 'rgba(78, 201, 176, 0.08)' },
    { text: '', color: null },
    { text: '// Project modal with Framer Motion animations', color: 'rgba(106, 153, 85, 0.1)' },
    { text: '<ProjectModal', color: 'rgba(78, 201, 176, 0.08)' },
    { text: '  isOpen={isProjectModalOpen}', color: 'rgba(255, 255, 255, 0.06)' },
    { text: '  onClose={() => setIsProjectModalOpen(false)}', color: 'rgba(255, 255, 255, 0.06)' },
    { text: '  project={selectedProject}', color: 'rgba(255, 255, 255, 0.06)' },
    { text: '/>', color: 'rgba(78, 201, 176, 0.08)' },
    { text: '', color: null },
    { text: '// Contact form with Firebase integration', color: 'rgba(106, 153, 85, 0.1)' },
    { text: 'export default PortfolioDesign;', color: 'rgba(197, 134, 192, 0.08)' }
  ];

  return (
    <CodeContainer>
      {actualCode.map((line, index) => (
        <CodeLine
          key={index}
          color={line.color}
        >
          {line.text || '\u00A0'}
        </CodeLine>
      ))}
    </CodeContainer>
  );
};

export default CodeBackground;