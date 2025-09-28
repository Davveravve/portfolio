import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, createGlobalStyle } from 'styled-components';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { collection, getDocs, query, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { theme, glassMorphism } from '../styles/theme';
import ModernProjectCard from '../components/ModernProjectCard';
import ContactSection from '../components/ContactSection';
import ModernFooter from '../components/ModernFooter';
import AboutMeSection from '../components/AboutMeSection';

// Global styles for the modern look
const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    overflow-x: hidden;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: ${theme.colors.background};
    color: ${theme.colors.text};
    overflow-x: hidden;
    width: 100%;
    position: relative;

    /* Hide scrollbar for all browsers */
    &::-webkit-scrollbar {
      display: none;
    }
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }

  ::selection {
    background: ${theme.colors.accent};
    color: white;
  }
`;

// Animations
const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(2deg); }
`;

const glow = keyframes`
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
`;

const gradientShift = keyframes`
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
`;

// Main container
const Portfolio = styled.div`
  min-height: 100vh;
  background: ${theme.colors.background};
  position: relative;
  overflow-x: hidden;
  width: 100%;

  /* Mesh gradient overlay */
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${theme.gradients.mesh};
    opacity: 0.4;
    pointer-events: none;
    z-index: 1;
  }
`;

// Navigation
const Nav = styled(motion.nav)`
  position: fixed;
  top: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  ${glassMorphism}
  padding: 1rem 2rem;
  border-radius: ${theme.radius.full};
  display: flex;
  gap: 2rem;
  align-items: center;

  @media (max-width: 768px) {
    left: 1rem;
    transform: none;
    width: auto;
    max-width: calc(100% - 2rem);
    padding: 0.75rem 1.25rem;
    gap: 1.5rem;
    top: 1rem;
    justify-content: flex-start;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    left: 1rem;
    transform: none;
    width: auto;
    max-width: calc(100% - 2rem);
    padding: 0.75rem 1rem;
    gap: 1rem;
    top: 1rem;
    justify-content: flex-start;
  }

  @media (max-width: 480px) {
    left: 0.5rem;
    transform: none;
    width: auto;
    max-width: calc(100% - 1rem);
    padding: 0.6rem 0.8rem;
    gap: 0.8rem;
  }
`;

const NavItem = styled(motion.button)`
  color: ${theme.colors.textSecondary};
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: ${theme.transitions.normal};
  position: relative;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  white-space: nowrap;
  overflow: visible;
  text-overflow: unset;

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: 0.85rem;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 0.8rem;
    padding: 0.5rem 0.75rem;
    min-width: fit-content;
    flex-shrink: 0;
  }

  @media (max-width: 480px) {
    font-size: 0.75rem;
    padding: 0.4rem 0.6rem;
    flex-shrink: 0;
  }

  &:hover {
    color: ${theme.colors.text};
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    right: 0;
    height: 2px;
    background: ${theme.gradients.primary};
    transform: scaleX(0);
    transition: transform ${theme.transitions.normal};
  }

  &:hover::after {
    transform: scaleX(1);
  }
`;

const NavButton = styled(motion.button)`
  background: ${theme.gradients.primary};
  color: white;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: ${theme.radius.full};
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: ${theme.transitions.normal};

  @media (max-width: ${theme.breakpoints.sm}) {
    display: none;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.glow};
  }
`;

// Hero Section
const HeroSection = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
  padding: 0 2rem;

  @media (max-width: ${theme.breakpoints.md}) {
    padding: 0 1rem;
    min-height: calc(100vh - 80px);
    padding-top: 80px;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: 60px 0.5rem 0;
    min-height: calc(100vh - 60px);
  }
`;

const HeroContent = styled(motion.div)`
  max-width: 1200px;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 2rem;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    gap: 1rem;
    padding: 0 0.5rem;
  }
`;

const HeroText = styled.div``;

const Badge = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  ${glassMorphism}
  padding: 0.5rem 1rem;
  border-radius: ${theme.radius.full};
  margin-bottom: 2rem;

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    background: #10b981;
    border-radius: 50%;
    animation: ${glow} 2s ease-in-out infinite;
  }

  span {
    font-size: 0.875rem;
    color: ${theme.colors.textSecondary};
  }
`;

const HeroTitle = styled(motion.h1)`
  font-size: clamp(2.5rem, 8vw, 5rem);
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  background: ${theme.gradients.text};
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${gradientShift} 3s ease infinite;

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: clamp(1.75rem, 7vw, 2.5rem);
    margin-bottom: 1rem;
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-size: 1.25rem;
  color: ${theme.colors.textSecondary};
  margin-bottom: 2rem;
  line-height: 1.6;

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: 1.1rem;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 0.95rem;
    line-height: 1.5;
    margin-bottom: 1.5rem;
  }
`;

const HeroButtons = styled(motion.div)`
  display: flex;
  gap: 1rem;

  @media (max-width: ${theme.breakpoints.lg}) {
    justify-content: center;
  }
`;

const PrimaryButton = styled(motion.button)`
  background: ${theme.gradients.primary};
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: ${theme.radius.md};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: ${theme.transitions.normal};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  @media (max-width: ${theme.breakpoints.sm}) {
    width: 100%;
    padding: 0.875rem 1.5rem;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: ${theme.shadows.glow};
  }
`;

const HeroVisual = styled(motion.div)`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: ${theme.breakpoints.lg}) {
    margin-top: 3rem;
  }
`;

const FloatingCard = styled(motion.div)`
  ${glassMorphism}
  padding: 1.5rem;
  border-radius: ${theme.radius.xl};
  position: absolute;
  animation: ${float} 6s ease-in-out infinite;
  min-width: 200px;

  @media (max-width: ${theme.breakpoints.lg}) {
    min-width: 180px;
    padding: 1.25rem;
  }

  @media (max-width: ${theme.breakpoints.md}) {
    min-width: 150px;
    padding: 1rem;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    display: none;
  }

  &:nth-child(1) {
    top: 0;
    right: 10%;
    animation-delay: 0s;
  }

  &:nth-child(2) {
    bottom: 10%;
    left: 5%;
    animation-delay: 2s;
  }

  &:nth-child(3) {
    top: 50%;
    right: 40%;
    animation-delay: 4s;
    z-index: -1;
  }
`;

const CardTitle = styled.h3`
  font-size: 1.125rem;
  margin-bottom: 0.5rem;
  background: ${theme.gradients.text};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const CardText = styled.p`
  font-size: 0.875rem;
  color: ${theme.colors.textSecondary};
`;

// Projects Section
const ProjectsSection = styled.section`
  padding: ${theme.spacing['3xl']} 0;
  position: relative;
  z-index: 2;

  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing['2xl']} 0;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.xl} 0;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;

  @media (max-width: ${theme.breakpoints.md}) {
    padding: 0 1rem;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: 0 0.75rem;
  }
`;

const SectionHeader = styled(motion.div)`
  text-align: center;
  margin-bottom: ${theme.spacing['2xl']};
`;

const SectionLabel = styled(motion.p)`
  color: ${theme.colors.accent};
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 0.5rem;
`;

const SectionTitle = styled(motion.h2)`
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 800;
  margin-bottom: 1rem;
  background: ${theme.gradients.text};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: clamp(1.75rem, 5vw, 2.5rem);
  }
`;

const SectionSubtitle = styled(motion.p)`
  font-size: 1.125rem;
  color: ${theme.colors.textSecondary};
  max-width: 600px;
  margin: 0 auto;
`;

const ProjectsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-top: ${theme.spacing['2xl']};
  justify-items: center;

  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding: 0 1rem;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
    padding: 0 0.5rem;
  }
`;

const ProjectCard = styled(motion.div)`
  ${glassMorphism}
  border-radius: ${theme.radius.xl};
  overflow: hidden;
  cursor: pointer;
  transition: all ${theme.transitions.normal};
  position: relative;

  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: ${theme.shadows.xl}, ${theme.shadows.glow};

    .project-image {
      transform: scale(1.1);
    }

    .project-overlay {
      opacity: 1;
    }
  }
`;

const ProjectImage = styled.div`
  height: 300px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform ${theme.transitions.slow};
  }
`;

const ProjectOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  display: flex;
  align-items: flex-end;
  padding: 2rem;
  opacity: 0;
  transition: opacity ${theme.transitions.normal};
`;

const ProjectContent = styled.div`
  padding: 1.5rem;
`;

const ProjectTags = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const ProjectTag = styled.span`
  font-size: 0.75rem;
  padding: 0.25rem 0.75rem;
  background: rgba(99, 102, 241, 0.1);
  color: ${theme.colors.accent};
  border-radius: ${theme.radius.full};
  border: 1px solid rgba(99, 102, 241, 0.2);
`;

const ProjectTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
`;

const ProjectDescription = styled.p`
  color: ${theme.colors.textSecondary};
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const ProjectLink = styled(motion.a)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: ${theme.colors.accent};
  text-decoration: none;
  font-weight: 500;

  &:hover {
    gap: 0.75rem;
  }
`;

// About Section
const AboutSection = styled.section`
  padding: ${theme.spacing['3xl']} 0;
  position: relative;
  z-index: 2;
`;

const AboutContent = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

const AboutStats = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
`;

const StatCard = styled(motion.div)`
  ${glassMorphism}
  padding: 2rem;
  border-radius: ${theme.radius.xl};
  text-align: center;

  h3 {
    font-size: 3rem;
    font-weight: 800;
    background: ${theme.gradients.text};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 0.5rem;
  }

  p {
    color: ${theme.colors.textSecondary};
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
`;

// Main Component
const ModernPortfolio = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { scrollY } = useScroll();
  const heroRef = useRef(null);
  const projectsRef = useRef(null);
  const aboutRef = useRef(null);

  // Parallax effects
  const y1 = useTransform(scrollY, [0, 500], [0, 100]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  // Fetch projects from Firebase
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsQuery = query(collection(db, 'projects'), orderBy('displayOrder', 'desc'));
        const projectsSnapshot = await getDocs(projectsQuery);
        const projectsData = projectsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          tags: doc.data().technologies || ['React', 'Node.js'],
          image: doc.data().media?.[0]?.url || doc.data().thumbnail || '',
        }));
        setProjects(projectsData.slice(0, 6)); // Show only 6 projects
      } catch (error) {
        console.error('Error fetching projects:', error);
        // Fallback projects
        setProjects([
          {
            id: 1,
            title: "E-Commerce Platform",
            description: "Modern e-commerce solution with AI-powered recommendations",
            tags: ["React", "Node.js", "AI"],
            image: "",
          },
          {
            id: 2,
            title: "Banking Dashboard",
            description: "Secure financial management system with real-time analytics",
            tags: ["TypeScript", "GraphQL", "D3.js"],
            image: "",
          },
          {
            id: 3,
            title: "Social Media App",
            description: "Next-generation social platform with Web3 integration",
            tags: ["Next.js", "Blockchain", "WebRTC"],
            image: "",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <>
      <GlobalStyle />
      <Portfolio>
        {/* Navigation */}
        <Nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <NavItem onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Home</NavItem>
          <NavItem onClick={() => projectsRef.current?.scrollIntoView({ behavior: 'smooth' })}>Projects</NavItem>
          <NavItem onClick={() => aboutRef.current?.scrollIntoView({ behavior: 'smooth' })}>About</NavItem>
          <NavItem onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>Contact</NavItem>
          <NavButton onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>Let's Talk</NavButton>
        </Nav>

        {/* Hero Section */}
        <HeroSection ref={heroRef}>
          <HeroContent>
            <HeroText>
              <Badge
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <span>Available for projects</span>
              </Badge>

              <HeroTitle
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                David Rajala
              </HeroTitle>

              <HeroSubtitle
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                Crafting digital experiences that merge creativity with cutting-edge technology
              </HeroSubtitle>

              <HeroButtons
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <PrimaryButton
                  onClick={() => projectsRef.current?.scrollIntoView({ behavior: 'smooth' })}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Projects
                </PrimaryButton>
              </HeroButtons>
            </HeroText>

            <HeroVisual>
              <FloatingCard style={{ y: y1 }}>
                <CardTitle>Full Stack</CardTitle>
                <CardText>React & Node.js Expert</CardText>
              </FloatingCard>

              <FloatingCard style={{ y: y2 }}>
                <CardTitle>Modern Tech</CardTitle>
                <CardText>Firebase & Cloud Solutions</CardText>
              </FloatingCard>

              <FloatingCard>
                <CardTitle>Clean Code</CardTitle>
                <CardText>Scalable Architecture</CardText>
              </FloatingCard>
            </HeroVisual>
          </HeroContent>
        </HeroSection>

        {/* Projects Section */}
        <ProjectsSection ref={projectsRef}>
          <Container>
            <SectionHeader>
              <SectionLabel
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                Portfolio
              </SectionLabel>
              <SectionTitle
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                Featured Projects
              </SectionTitle>
              <SectionSubtitle
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                Showcasing my best work in design and development
              </SectionSubtitle>
            </SectionHeader>

            <ProjectsGrid>
              {loading ? (
                <>
                  {[1, 2, 3].map(i => (
                    <ProjectCard
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.5 }}
                      style={{ minHeight: '400px' }}
                    />
                  ))}
                </>
              ) : (
                projects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ModernProjectCard
                      project={project}
                      onClick={() => window.location.href = `/project/${project.id}`}
                    />
                  </motion.div>
                ))
              )}
            </ProjectsGrid>
          </Container>
        </ProjectsSection>

        {/* About Section */}
        <div ref={aboutRef}>
          <AboutMeSection />
        </div>

        {/* Contact Section */}
        <ContactSection />

        {/* Footer */}
        <ModernFooter />
      </Portfolio>
    </>
  );
};

export default ModernPortfolio;