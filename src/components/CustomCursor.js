import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, useSpring } from 'framer-motion';

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.5;
  }
`;

const CursorContainer = styled.div`
  @media (pointer: coarse) {
    display: none;
  }
`;

const Cursor = styled(motion.div)`
  width: 40px;
  height: 40px;
  border: 2px solid rgba(99, 102, 241, 0.5);
  border-radius: 50%;
  position: fixed;
  pointer-events: none;
  z-index: 10000;
  transition: border-color 0.2s ease;
  mix-blend-mode: difference;

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 5px;
    height: 5px;
    background: rgba(99, 102, 241, 1);
    border-radius: 50%;
  }

  &.hovering {
    border-color: rgba(139, 92, 246, 0.8);
    transform: scale(1.5);
    background: rgba(99, 102, 241, 0.1);
  }

  &.clicking {
    animation: ${pulse} 0.5s ease;
  }
`;

const CursorFollower = styled(motion.div)`
  width: 200px;
  height: 200px;
  position: fixed;
  pointer-events: none;
  z-index: 9999;
  opacity: 0.05;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.8) 0%, transparent 50%);
  border-radius: 50%;
  filter: blur(40px);
`;

const CustomCursor = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const springConfig = { damping: 25, stiffness: 350 };
  const cursorX = useSpring(0, springConfig);
  const cursorY = useSpring(0, springConfig);

  const followerSpringConfig = { damping: 30, stiffness: 100 };
  const followerX = useSpring(0, followerSpringConfig);
  const followerY = useSpring(0, followerSpringConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      cursorX.set(e.clientX - 20);
      cursorY.set(e.clientY - 20);
      followerX.set(e.clientX - 100);
      followerY.set(e.clientY - 100);
      setIsVisible(true);
    };

    const handleMouseEnter = (e) => {
      if (e.target.matches('a, button, input, textarea, [data-cursor-hover]')) {
        setIsHovering(true);
      }
    };

    const handleMouseLeave = (e) => {
      if (e.target.matches('a, button, input, textarea, [data-cursor-hover]')) {
        setIsHovering(false);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseOut = () => setIsVisible(false);
    const handleMouseOver = () => setIsVisible(true);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseEnter, true);
    document.addEventListener('mouseout', handleMouseLeave, true);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseout', handleMouseOut);
    document.addEventListener('mouseover', handleMouseOver);

    // Hide default cursor
    document.body.style.cursor = 'none';

    // Add cursor styles to interactive elements
    const style = document.createElement('style');
    style.innerHTML = `
      * { cursor: none !important; }
      a, button, input, textarea, [data-cursor-hover] { cursor: none !important; }
    `;
    document.head.appendChild(style);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseEnter, true);
      document.removeEventListener('mouseout', handleMouseLeave, true);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('mouseover', handleMouseOver);
      document.body.style.cursor = 'auto';
      style.remove();
    };
  }, [cursorX, cursorY, followerX, followerY]);

  if (!isVisible) return null;

  return (
    <CursorContainer>
      <Cursor
        className={`${isHovering ? 'hovering' : ''} ${isClicking ? 'clicking' : ''}`}
        style={{
          left: cursorX,
          top: cursorY,
        }}
      />
      <CursorFollower
        style={{
          left: followerX,
          top: followerY,
        }}
      />
    </CursorContainer>
  );
};

export default CustomCursor;