import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { theme, glassMorphism } from '../styles/theme';

const CardContainer = styled(motion.div)`
  position: relative;
  perspective: 1000px;
  cursor: pointer;
  width: 100%;

  @media (max-width: ${theme.breakpoints.sm}) {
    max-width: 400px;
    margin: 0 auto;
  }

  @media (max-width: 480px) {
    max-width: 350px;
    margin: 0 auto;
  }
`;

const Card = styled(motion.div)`
  ${glassMorphism}
  border-radius: ${theme.radius.xl};
  overflow: hidden;
  transform-style: preserve-3d;
  transition: all 0.6s cubic-bezier(0.23, 1, 0.320, 1);
  position: relative;
  width: 100%;

  @media (max-width: ${theme.breakpoints.md}) {
    transform-style: none;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    border-radius: ${theme.radius.lg};
  }

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      rgba(99, 102, 241, 0.1) 0%,
      rgba(139, 92, 246, 0.05) 50%,
      transparent 100%
    );
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
  }

  &:hover {
    transform: rotateY(5deg) rotateX(-5deg) translateZ(20px);
    box-shadow:
      0 25px 50px -12px rgba(0, 0, 0, 0.5),
      0 0 50px rgba(99, 102, 241, 0.2);

    @media (max-width: ${theme.breakpoints.md}) {
      transform: translateY(-5px);
    }

    .project-image {
      transform: scale(1.05);
    }

    .hover-content {
      opacity: 1;
      transform: translateY(0);
    }

    .tags {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

const ImageContainer = styled.div`
  position: relative;
  height: 260px;
  overflow: hidden;
  background: linear-gradient(
    135deg,
    ${theme.colors.gradientStart} 0%,
    ${theme.colors.gradientMid} 50%,
    ${theme.colors.gradientEnd} 100%
  );

  @media (max-width: ${theme.breakpoints.sm}) {
    height: 180px;
  }

  @media (max-width: 480px) {
    height: 160px;
  }
`;

const ProjectImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.23, 1, 0.320, 1);
`;

const HoverContent = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 2rem;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.9) 0%,
    rgba(0, 0, 0, 0.7) 50%,
    transparent 100%
  );
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.4s ease;

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: 1.5rem;
  }
`;

const ViewButton = styled(motion.button)`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: ${theme.radius.full};
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateX(5px);
  }
`;

const Content = styled.div`
  padding: 1.5rem;
  position: relative;

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: 1.1rem;
  }

  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

const TagsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  overflow: hidden;
`;

const Tag = styled.span`
  font-size: 0.7rem;
  padding: 0.35rem 0.75rem;
  background: linear-gradient(
    135deg,
    rgba(99, 102, 241, 0.15) 0%,
    rgba(139, 92, 246, 0.1) 100%
  );
  color: ${theme.colors.accentLight};
  border-radius: ${theme.radius.full};
  border: 1px solid rgba(99, 102, 241, 0.3);
  font-weight: 500;
  letter-spacing: 0.02em;
  transform: translateX(-100%);
  opacity: 0;
  transition: all 0.4s ease;
  transition-delay: calc(var(--index) * 0.05s);
`;

const Title = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: ${theme.colors.text};
  transition: color 0.3s ease;

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 1.2rem;
    margin-bottom: 0.6rem;
  }

  @media (max-width: 480px) {
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
  }

  &:hover {
    background: ${theme.gradients.text};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const Description = styled.p`
  color: ${theme.colors.textSecondary};
  line-height: 1.6;
  margin-bottom: 1.25rem;
  font-size: 0.95rem;

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 0.85rem;
    margin-bottom: 0.9rem;
    line-height: 1.5;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
    margin-bottom: 0.8rem;
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ProjectType = styled.span`
  font-size: 0.8rem;
  color: ${theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
`;

const ArrowIcon = styled(motion.span)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: rgba(99, 102, 241, 0.1);
  border-radius: 50%;
  color: ${theme.colors.accent};
  font-size: 1.2rem;
  transition: all 0.3s ease;

  ${Card}:hover & {
    background: ${theme.colors.accent};
    color: white;
    transform: translateX(3px);
  }
`;

const GlowOrb = styled.div`
  position: absolute;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(99, 102, 241, 0.4) 0%,
    transparent 70%
  );
  filter: blur(40px);
  top: -100px;
  right: -100px;
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;

  ${Card}:hover & {
    opacity: 1;
  }
`;

const ModernProjectCard = ({ project, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <CardContainer
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick && onClick(project)}
      whileHover={{ z: 50 }}
    >
      <Card>
        <GlowOrb />

        <ImageContainer>
          <ProjectImage
            className="project-image"
            src={project.image || '/placeholder.jpg'}
            alt={project.title}
          />
          <HoverContent className="hover-content">
            <ViewButton
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Project →
            </ViewButton>
          </HoverContent>
        </ImageContainer>

        <Content>
          <TagsContainer>
            {project.tags?.map((tag, index) => (
              <Tag
                key={tag}
                className="tags"
                style={{ '--index': index }}
              >
                {tag}
              </Tag>
            ))}
          </TagsContainer>

          <Title>{project.title}</Title>
          <Description>{project.description}</Description>

          <Footer>
            <ProjectType>{project.type || 'Web Design'}</ProjectType>
            <ArrowIcon
              animate={{ x: isHovered ? 5 : 0 }}
            >
              →
            </ArrowIcon>
          </Footer>
        </Content>
      </Card>
    </CardContainer>
  );
};

export default ModernProjectCard;