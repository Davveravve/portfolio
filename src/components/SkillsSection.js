import React from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { theme, glassMorphism } from '../styles/theme';

const fillProgress = keyframes`
  from {
    width: 0%;
  }
  to {
    width: var(--progress);
  }
`;

const Section = styled.section`
  padding: ${theme.spacing['3xl']} 0;
  position: relative;
  z-index: 2;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 3rem;
  margin-top: 3rem;

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

const SkillCategory = styled(motion.div)`
  ${glassMorphism}
  padding: 2rem;
  border-radius: ${theme.radius.xl};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${theme.gradients.primary};
    opacity: 0.8;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${theme.shadows.xl}, ${theme.shadows.glow};
  }
`;

const CategoryTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  background: ${theme.gradients.text};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const SkillItem = styled.div`
  margin-bottom: 1.5rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SkillHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const SkillName = styled.span`
  font-size: 0.95rem;
  color: ${theme.colors.text};
  font-weight: 500;
`;

const SkillLevel = styled.span`
  font-size: 0.875rem;
  color: ${theme.colors.textSecondary};
`;

const ProgressBar = styled.div`
  height: 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: ${theme.radius.full};
  overflow: hidden;
  position: relative;
`;

const ProgressFill = styled(motion.div)`
  height: 100%;
  background: ${theme.gradients.primary};
  border-radius: ${theme.radius.full};
  position: relative;
  box-shadow: 0 0 20px rgba(99, 102, 241, 0.5);

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    animation: shimmer 2s infinite;
  }

  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
`;

const TechStack = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 2rem;
`;

const TechBadge = styled(motion.span)`
  padding: 0.5rem 1rem;
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: ${theme.radius.full};
  font-size: 0.875rem;
  color: ${theme.colors.accentLight};
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(99, 102, 241, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(99, 102, 241, 0.3);
  }
`;

const SkillsSection = () => {
  const skills = {
    frontend: {
      title: 'Frontend Development',
      icon: null,
      skills: [
        { name: 'React.js', level: 95 },
        { name: 'Next.js', level: 90 },
        { name: 'TypeScript', level: 85 },
        { name: 'Tailwind CSS', level: 95 },
        { name: 'Framer Motion', level: 90 },
      ],
      tech: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3'],
    },
    backend: {
      title: 'Backend & Database',
      icon: null,
      skills: [
        { name: 'Node.js', level: 90 },
        { name: 'Express.js', level: 85 },
        { name: 'Firebase', level: 95 },
        { name: 'Supabase', level: 90 },
        { name: 'REST APIs', level: 88 },
      ],
      tech: ['Node.js', 'Firebase', 'Supabase', 'PostgreSQL', 'MongoDB', 'Prisma'],
    },
  };

  return (
    <Section>
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          <p style={{
            color: theme.colors.accent,
            fontSize: '0.875rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: '0.5rem'
          }}>
            Skills & Expertise
          </p>
          <h2 style={{
            fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
            fontWeight: 800,
            marginBottom: '1rem',
            background: theme.gradients.text,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Technical Proficiency
          </h2>
          <p style={{
            fontSize: '1.125rem',
            color: theme.colors.textSecondary,
            maxWidth: '600px',
            margin: '0 auto',
          }}>
            Mastering modern technologies to deliver exceptional digital experiences
          </p>
        </motion.div>

        <SkillsGrid>
          {Object.entries(skills).map(([key, category], categoryIndex) => (
            <SkillCategory
              key={key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: categoryIndex * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <CategoryTitle>
                {category.title}
              </CategoryTitle>

              {category.skills.map((skill, index) => (
                <SkillItem key={skill.name}>
                  <SkillHeader>
                    <SkillName>{skill.name}</SkillName>
                    <SkillLevel>{skill.level}%</SkillLevel>
                  </SkillHeader>
                  <ProgressBar>
                    <ProgressFill
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 1,
                        delay: categoryIndex * 0.1 + index * 0.1,
                        ease: [0.43, 0.13, 0.23, 0.96],
                      }}
                    />
                  </ProgressBar>
                </SkillItem>
              ))}

              <TechStack>
                {category.tech.map((tech, index) => (
                  <TechBadge
                    key={tech}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: categoryIndex * 0.1 + index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    {tech}
                  </TechBadge>
                ))}
              </TechStack>
            </SkillCategory>
          ))}
        </SkillsGrid>
      </Container>
    </Section>
  );
};

export default SkillsSection;