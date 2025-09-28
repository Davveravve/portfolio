import React from 'react';
import styled, { keyframes } from 'styled-components';

const ripple = keyframes`
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    transform: translate(-50%, -50%) scale(0.9);
  }
`;

const Container = styled.div`
  pointer-events: none;
  absolute: 0;
  inset: 0;
  select: none;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  mask-image: linear-gradient(to bottom, white, transparent);
`;

const RippleCircle = styled.div`
  position: absolute;
  border-radius: 50%;
  border: 1px solid ${props => props.color ? props.color.replace('rgb', 'rgba').replace(')', `, ${props.borderOpacity || 0.3})`) : `rgba(255, 255, 255, ${props.borderOpacity || 0.3})`};
  background: ${props => props.color ? props.color.replace('rgb', 'rgba').replace(')', `, ${props.bgOpacity || 0.05})`) : `rgba(255, 255, 255, ${props.bgOpacity || 0.05})`};
  box-shadow: 0 0 20px ${props => props.color ? props.color.replace('rgb', 'rgba').replace(')', `, ${props.shadowOpacity || 0.1})`) : `rgba(255, 255, 255, ${props.shadowOpacity || 0.1})`};
  animation: ${ripple} var(--duration, 2s) ease calc(var(--i, 0) * 0.2s) infinite;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(1);
  will-change: transform;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  -webkit-transform-style: preserve-3d;
  transform-style: preserve-3d;
`;

export const RippleBackground = ({
  mainCircleSize = 210,
  mainCircleOpacity = 0.24,
  numCircles = 8,
  lineColor = '#ffffff',
  className,
  ...props
}) => {
  return (
    <Container className={className} {...props}>
      {Array.from({ length: numCircles }, (_, i) => {
        const size = mainCircleSize + Math.pow(i * 1.3, 1.8) * 20;
        const opacity = Math.max(mainCircleOpacity - i * 0.02, 0.01);
        const borderOpacity = mainCircleOpacity * 1.5;
        const bgOpacity = mainCircleOpacity * 0.3;
        const shadowOpacity = mainCircleOpacity * 0.8;

        return (
          <RippleCircle
            key={i}
            color={lineColor}
            borderOpacity={borderOpacity}
            bgOpacity={bgOpacity}
            shadowOpacity={shadowOpacity}
            style={{
              width: `${size}px`,
              height: `${size}px`,
              opacity,
              '--i': i,
              '--duration': '2s',
            }}
          />
        );
      })}
    </Container>
  );
};

export default RippleBackground;