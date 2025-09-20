import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const Container = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
`;

const Svg = styled.svg`
  width: 100%;
  height: 100%;
  color: ${props => props.lineColor || 'white'};

  @media (max-width: 768px) {
    width: 120%;
    height: 120%;
    transform: translateX(-10%) translateY(-10%);
  }
`;

const FloatingPaths = ({ position, lineColor, lineOpacity = 0.15 }) => {
  const paths = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    d: `M${1200 + i * 30 * position} -${200 + i * 20}C${
      900 + i * 30 * position
    } ${100 + i * 25} ${600 + i * 30 * position} ${400 + i * 30} ${
      300 + i * 30 * position
    } ${600 + i * 25}C${100 + i * 30 * position} ${800 + i * 30} ${
      -200 + i * 30 * position
    } ${1000 + i * 25} -${400 + i * 30 * position} ${1200 + i * 20}`,
    width: 1.2 + i * 0.06,
    opacity: lineOpacity * (0.4 + i * 0.03),
  }));

  return (
    <Container>
      <Svg
        lineColor={lineColor}
        viewBox="-600 -400 2400 1800"
        fill="none"
      >
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={path.opacity}
            initial={{ pathLength: 0.3, opacity: path.opacity * 0.5 }}
            animate={{
              pathLength: 1,
              opacity: [path.opacity * 0.3, path.opacity, path.opacity * 0.3],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </Svg>
    </Container>
  );
};

const BackgroundPaths = ({ lineColor = 'white', lineOpacity = 0.15 }) => {
  return (
    <>
      <FloatingPaths position={1} lineColor={lineColor} lineOpacity={lineOpacity} />
      <FloatingPaths position={-1} lineColor={lineColor} lineOpacity={lineOpacity} />
    </>
  );
};

export default BackgroundPaths;