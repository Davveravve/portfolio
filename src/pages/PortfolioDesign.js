import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, getDocs, query, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useLanguage } from '../context/LanguageContext';
import ProjectCard from '../components/ProjectCard';
import ProjectModal from '../components/ProjectModal';
import ContactForm from '../components/ContactFormFirebase';
import Footer from '../components/Footer';
import AboutModal from '../components/AboutModal';
import ContactModal from '../components/ContactModal';
import RippleBackground from '../components/RippleBackground';
import ReviewsCarousel from '../components/ReviewsCarousel';
import { colors, gradients, textColors } from '../styles/colors';

// Animations
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const breathe = keyframes`
  0%, 100% {
    opacity: 0.4;
  }
  50% {
    opacity: 0.6;
  }
`;

const zoomPulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

const shimmer = keyframes`
  0%, 100% { background-position: 0% center; }
  50% { background-position: 100% center; }
`;

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-8px); }
  60% { transform: translateY(-4px); }
`;

// Styled Components
const HomeContainer = styled.div`
  min-height: 100vh;
  overflow-x: hidden;
  background: ${gradients.background};

  section + section {
    margin-top: 0;
  }
`;

const HeroSection = styled.section`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${textColors.onMedium};
  text-align: center;
  position: relative;
  overflow: hidden;
  margin: 0;
  border: none;
  background: ${gradients.hero};
`;

const HeroContent = styled(motion.div)`
  z-index: 2;
  position: relative;
  max-width: 800px;
  padding: 0 2rem;
`;

const HeroTitle = styled(motion.h1)`
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 900;
  margin-bottom: 1rem;
  line-height: 1.1;
  letter-spacing: -0.02em;
  position: relative;
  color: ${textColors.onMedium};
`;

const AnimatedRole = styled(motion.div)`
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  font-weight: 600;
  margin-bottom: 3rem;
  margin-top: -0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  min-height: 2.5em;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  position: relative;

  & > div {
    /* No drop shadow for cleaner look */
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  position: absolute;
  bottom: 8rem;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0.8;
  line-height: 1.6;
  color: #cbd5e1;

  @media (max-width: 768px) {
    bottom: 12rem;
    padding: 0 2rem;
    text-align: center;
  }
`;

const ScrollIndicator = styled(motion.div)`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.9);
  transition: var(--transition);
  z-index: 10;

  &:hover {
    color: white;
  }

  @media (max-width: 768px) {
    bottom: 6rem;
  }

  @media (max-height: 700px) {
    bottom: 4rem;
  }
`;

const ScrollText = styled.span`
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  display: block;
  text-align: center;
`;

const ScrollArrow = styled(motion.div)`
  position: relative;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;

  &::before {
    content: '';
    position: absolute;
    width: 12px;
    height: 12px;
    border-right: 2px solid currentColor;
    border-bottom: 2px solid currentColor;
    transform: rotate(45deg);
  }

  &::after {
    content: '';
    position: absolute;
    top: -5px;
    left: 50%;
    width: 12px;
    height: 12px;
    border-right: 2px solid currentColor;
    border-bottom: 2px solid currentColor;
    transform: translateX(-50%) rotate(45deg);
    opacity: 0.5;
  }

  animation: ${bounce} 2s infinite;
`;

const ProjectsSection = styled.section`
  padding: 6rem 0;
  background: linear-gradient(135deg, #F2E0DF 0%, #E3B8B8 100%);
  position: relative;
  margin: 0;
  border: none;

  @media (max-width: 768px) {
    padding: 4rem 0;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const SectionTitle = styled(motion.h2)`
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 800;
  text-align: center;
  margin-bottom: 1rem;
  color: #003332;
  letter-spacing: -0.02em;
`;

const SectionSubtitle = styled(motion.p)`
  text-align: center;
  font-size: 1.25rem;
  color: #034C36;
  margin-bottom: 4rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const CategoryFilter = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 4rem;
`;

const CategoryButton = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 50px;
  background: ${props => props.active
    ? `linear-gradient(135deg, #E3B8B8 0%, #034c36 100%)`
    : 'rgba(189, 205, 207, 0.3)'
  };
  color: ${props => props.active ? '#F2E0DF' : '#003332'};
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  backdrop-filter: blur(10px);
  border: 2px solid ${props => props.active ? 'transparent' : 'rgba(3, 76, 54, 0.2)'};
  box-shadow: ${props => props.active
    ? '0 8px 32px rgba(227, 184, 184, 0.3)'
    : '0 4px 20px rgba(0, 0, 0, 0.1)'
  };

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.active
      ? '0 12px 40px rgba(227, 184, 184, 0.4)'
      : '0 8px 30px rgba(0, 0, 0, 0.15)'
    };
  }

  @media (max-width: 768px) {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }
`;

const ProjectsGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  margin-bottom: 4rem;
  justify-content: center;

  @media (max-width: 768px) {
    gap: 1.5rem;
    justify-content: center;
  }
`;

const AboutSection = styled.section`
  padding: 6rem 0;
  background: linear-gradient(135deg, #BDCDCF 0%, #003332 100%);
  color: #F2E0DF;
  position: relative;
  margin: 0;
  border: none;

  @media (max-width: 768px) {
    padding: 4rem 0;
  }
`;

const AboutContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  margin-top: 3rem;
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
`;

const AboutText = styled.div`
  text-align: left;

  p {
    font-size: 1.125rem;
    line-height: 1.8;
    color: #F2E0DF;
    margin-bottom: 2rem;
  }

  @media (max-width: 768px) {
    text-align: center;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: flex-start;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const SocialLink = styled(motion.a)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #0f172a;
  border-radius: 50px;
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: var(--transition);
  border: 1px solid #0f172a;

  &:hover {
    background: rgba(var(--main-color-rgb, 239, 68, 68), 0.9);
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(var(--main-color-rgb, 239, 68, 68), 0.3);
    border-color: rgba(var(--main-color-rgb, 239, 68, 68), 0.9);
  }
`;

const ProfileImageContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  position: relative;
`;

const ProfileImageWrapper = styled.div`
  position: relative;
  padding: 8px;
  background: linear-gradient(45deg,
    var(--main-color, #ef4444) 0%,
    rgba(var(--main-color-rgb, 239, 68, 68), 0.8) 25%,
    rgba(var(--main-color-rgb, 239, 68, 68), 0.6) 50%,
    rgba(var(--main-color-rgb, 239, 68, 68), 0.8) 75%,
    var(--main-color, #ef4444) 100%
  );
  border-radius: 50%;
  box-shadow:
    0 0 0 4px rgba(255, 255, 255, 0.1),
    0 0 0 8px rgba(var(--main-color-rgb, 239, 68, 68), 0.2),
    0 20px 40px rgba(0, 0, 0, 0.3),
    0 40px 80px rgba(var(--main-color-rgb, 239, 68, 68), 0.2);
  animation: profileGlow 3s ease-in-out infinite alternate;

  @keyframes profileGlow {
    0% {
      box-shadow:
        0 0 0 4px rgba(255, 255, 255, 0.1),
        0 0 0 8px rgba(var(--main-color-rgb, 239, 68, 68), 0.2),
        0 20px 40px rgba(0, 0, 0, 0.3),
        0 40px 80px rgba(var(--main-color-rgb, 239, 68, 68), 0.2);
    }
    100% {
      box-shadow:
        0 0 0 4px rgba(255, 255, 255, 0.2),
        0 0 0 8px rgba(var(--main-color-rgb, 239, 68, 68), 0.4),
        0 25px 50px rgba(0, 0, 0, 0.4),
        0 50px 100px rgba(var(--main-color-rgb, 239, 68, 68), 0.3);
    }
  }

  &::before {
    content: '';
    position: absolute;
    top: -4px;
    left: -4px;
    right: -4px;
    bottom: -4px;
    background: linear-gradient(45deg,
      transparent 0%,
      rgba(255, 255, 255, 0.1) 25%,
      transparent 50%,
      rgba(255, 255, 255, 0.1) 75%,
      transparent 100%
    );
    border-radius: 50%;
    animation: shimmer 2s ease-in-out infinite;
    pointer-events: none;
  }

  @keyframes shimmer {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }

  @media (max-width: 768px) {
    padding: 6px;
  }
`;

const ProfileImage = styled.div`
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background-image: ${props => props.src ? `url(${props.src})` : 'none'};
  background-size: cover;
  background-position: center;
  background-color: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
  text-align: center;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: linear-gradient(135deg,
      rgba(255, 255, 255, 0.2) 0%,
      transparent 40%,
      transparent 60%,
      rgba(0, 0, 0, 0.1) 100%
    );
    pointer-events: none;
  }

  @media (max-width: 768px) {
    width: 250px;
    height: 250px;
  }
`;

const ContactSection = styled.section`
  padding: 6rem 0;
  background: linear-gradient(135deg, #E3B8B8 0%, #FF8128 100%);
  margin: 0;
  border: none;

  @media (max-width: 768px) {
    padding: 4rem 0;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #003332;

  h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #003332;
  }

  button {
    margin-top: 1.5rem;
    padding: 0.75rem 1.5rem;
    background: linear-gradient(135deg, #034C36 0%, #003332 100%);
    color: #F2E0DF;
    border: none;
    border-radius: 50px;
    cursor: pointer;
    font-weight: 600;
    transition: var(--transition);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 32px rgba(3, 76, 54, 0.3);
    }
  }
`;


// Action Buttons Section
const ActionButtonsSection = styled.section`
  padding: 6rem 0 8rem 0;
  background: linear-gradient(135deg, #F2E0DF 0%, #E3B8B8 50%, #FF8128 100%);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(3, 76, 54, 0.3), transparent);
  }
`;

const ActionButtonsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 3rem;
  max-width: 800px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const ActionButton = styled.button`
  background: linear-gradient(135deg, #BDCDCF 0%, rgba(189, 205, 207, 0.8) 100%);
  border: none;
  border-radius: 20px;
  padding: 3rem 2rem;
  cursor: pointer;
  box-shadow:
    0 10px 40px rgba(3, 76, 54, 0.1),
    0 0 0 1px rgba(3, 76, 54, 0.2);
  transition: all 0.2s ease;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg,
      rgba(3, 76, 54, 0.05) 0%,
      rgba(3, 76, 54, 0.1) 100%
    );
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  &:hover::before {
    opacity: 1;
  }

  &:hover {
    box-shadow:
      0 20px 60px rgba(3, 76, 54, 0.2),
      0 0 0 1px rgba(3, 76, 54, 0.4);
    transform: translateY(-4px);
  }

  &:active {
    transform: translateY(-2px);
  }
`;

const ActionButtonIcon = styled.div`
  width: 60px;
  height: 60px;
  margin: 0 auto 1rem auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #034C36 0%, #003332 100%);
  border-radius: 50%;
  transition: all 0.2s ease;

  svg {
    width: 30px;
    height: 30px;
    fill: white;
    transition: transform 0.2s ease;
  }

  ${ActionButton}:hover & {
    transform: scale(1.05);
    box-shadow: 0 10px 30px rgba(3, 76, 54, 0.4);

    svg {
      transform: scale(1.05);
    }
  }
`;

const ActionButtonText = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #003332;
  margin: 0 0 0.5rem 0;
  position: relative;
  z-index: 1;
`;

const ActionButtonSubtext = styled.p`
  font-size: 1rem;
  color: #034C36;
  margin: 0;
  position: relative;
  z-index: 1;
`;

const Portfolio = () => {
  const { t } = useLanguage();
  const [aboutData, setAboutData] = useState(null);
  const heroSettings = {
    heroName: 'David Rajala',
    heroDescription: 'Jag skapar digitala upplevelser som kombinerar kreativitet med funktionalitet.',
    heroRoles: ['DESIGNER', 'UTVECKLARE', 'SKAPARE'],
    backgroundColor: '#F2E0DF',
    useGradient: true,
    gradientColor2: '#E3B8B8',
    gradientColor3: '#FF8128',
    gradientRotation: 135,
    lineColor: '#ffffff',
    lineOpacity: 0.2,
    mainColor: '#034C36',
    textColor: '#034C36',
    roleTextColor: '#034C36',
    roleTransitionTime: 3
  };
  const [categories, setCategories] = useState([]);
  const [projects, setProjects] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState(0);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [showScrollBar, setShowScrollBar] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRole((prev) => (prev + 1) % heroSettings.heroRoles.length);
    }, heroSettings.roleTransitionTime * 1000);
    return () => clearInterval(interval);
  }, [heroSettings.heroRoles.length, heroSettings.roleTransitionTime]);

  useEffect(() => {
    fetchData();
  }, []);

  // Helper function to convert hex to rgb
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 239, g: 68, b: 68 }; // fallback to default red
  };

  // Update CSS variables for global theming
  useEffect(() => {
    const mainRgb = hexToRgb(heroSettings.mainColor);
    document.documentElement.style.setProperty('--main-color', heroSettings.mainColor);
    document.documentElement.style.setProperty('--main-color-rgb', `${mainRgb.r}, ${mainRgb.g}, ${mainRgb.b}`);
    document.documentElement.style.setProperty('--background-color', heroSettings.backgroundColor);
    document.documentElement.style.setProperty('--text-color', heroSettings.textColor);
  }, [heroSettings.mainColor, heroSettings.backgroundColor, heroSettings.textColor]);

  // Scroll indicator animation
  useEffect(() => {
    let scrollTimeout;

    const handleScroll = () => {
      // Calculate scroll offset for gradual movement
      const scrollY = window.scrollY;
      const maxScroll = 300; // Distance to fully hide the indicator
      const offset = Math.min(scrollY * 2, maxScroll); // Multiply by 2 for faster movement
      setScrollOffset(offset);

      // Add scrolling class to body for animated scrollbar
      document.body.classList.add('scrolling');

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        document.body.classList.remove('scrolling');
      }, 1000);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
      document.body.classList.remove('scrolling');
    };
  }, []);

  const fetchData = async () => {
    try {
      // Fetch about data
      const aboutDoc = await getDoc(doc(db, 'content', 'about'));
      const aboutData = aboutDoc.exists() ? aboutDoc.data() : null;



      // Fetch categories
      const categoriesQuery = query(collection(db, 'categories'), orderBy('displayOrder'));
      const categoriesSnapshot = await getDocs(categoriesQuery);
      const categoriesData = categoriesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Fetch projects
      const projectsQuery = collection(db, 'projects');
      const projectsSnapshot = await getDocs(projectsQuery);
      let projectsData = projectsSnapshot.docs.map(doc => {
        const project = {
          id: doc.id,
          ...doc.data()
        };

        // Find matching category
        const category = categoriesData.find(cat => cat.id === project.categoryId);
        if (category) {
          project.category = category;
        }

        // Extract thumbnail from media array
        if (project.media && project.media.length > 0) {
          const firstImage = project.media.find(item => item.type === 'image');
          if (firstImage) {
            project.thumbnail = firstImage.url;
          }
        }

        return project;
      });

      // Sort projects by displayOrder (highest first = top in admin shows first)
      projectsData = projectsData.sort((a, b) => {
        // Projects with displayOrder come first
        if (a.displayOrder !== undefined && b.displayOrder !== undefined) {
          return b.displayOrder - a.displayOrder;
        } else if (a.displayOrder !== undefined) {
          return -1;
        } else if (b.displayOrder !== undefined) {
          return 1;
        } else {
          // Fallback to createdAt for old projects
          const aDate = a.createdAt?.toDate?.() || new Date(a.createdAt || 0);
          const bDate = b.createdAt?.toDate?.() || new Date(b.createdAt || 0);
          return bDate - aDate;
        }
      });

      setAboutData(aboutData);
      setCategories(categoriesData);
      setProjects(projectsData);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const filteredProjects = activeCategory === 'all'
    ? projects
    : projects.filter(project => project.categoryId === activeCategory);

  const scrollToProjects = () => {
    document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
  };

  const openProjectModal = (project) => {
    // Store current scroll position
    sessionStorage.setItem('homeScrollPosition', window.scrollY.toString());

    // Navigate to project detail page
    window.location.href = `/project/${project.id}`;
  };

  const closeProjectModal = () => {
    setIsProjectModalOpen(false);
    setSelectedProject(null);
  };

  const setupSampleData = async () => {
    try {
      const { setupCategories, setupSampleProject } = await import('../utils/setupFirebase.js');
      await setupCategories();
      await setupSampleProject();
      window.location.reload();
    } catch (error) {
      console.error('Error setting up data:', error);
    }
  };


  return (
    <HomeContainer>
      <HeroSection
        backgroundColor={heroSettings.backgroundColor}
        useGradient={heroSettings.useGradient}
        gradientColor2={heroSettings.gradientColor2}
        gradientColor3={heroSettings.gradientColor3}
        gradientRotation={heroSettings.gradientRotation}
        textColor={heroSettings.textColor}
      >
        <RippleBackground
          mainCircleSize={150}
          mainCircleOpacity={heroSettings.lineOpacity}
          lineColor={heroSettings.lineColor}
          numCircles={8}
        />
        <HeroContent
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <HeroTitle
            textColor={heroSettings.textColor}
            data-text={(heroSettings.heroName || 'DAVID RAJALA').toUpperCase()}
          >
            {(heroSettings.heroName || 'DAVID RAJALA').toUpperCase()}
          </HeroTitle>

          <AnimatedRole>
            <AnimatePresence mode="wait">
              <motion.div
                key={heroSettings.heroRoles[currentRole]}
                initial={{
                  opacity: 0,
                  y: 30
                }}
                animate={{
                  opacity: 1,
                  y: 0
                }}
                exit={{
                  opacity: 0
                }}
                transition={{
                  duration: 0.4,
                  ease: [0.4, 0, 0.2, 1]
                }}
                style={{
                  display: 'block',
                  position: 'absolute',
                  width: '100%',
                  textAlign: 'center',
                  color: heroSettings.roleTextColor || heroSettings.mainColor || '#ef4444'
                }}
              >
                {heroSettings.heroRoles[currentRole]}
              </motion.div>
            </AnimatePresence>
          </AnimatedRole>
        </HeroContent>

        <ScrollIndicator
          onClick={scrollToProjects}
          initial={{ opacity: 0 }}
          animate={{
            opacity: scrollOffset > 10 ? 0 : 1
          }}
          transition={{
            duration: 0.5,
            delay: scrollOffset === 0 ? 1.2 : 0,
            ease: "easeInOut"
          }}
        >
          <ScrollText>{t('hero.scroll')}</ScrollText>
          <ScrollArrow />
        </ScrollIndicator>
      </HeroSection>

      <ProjectsSection id="projects">
        <Container>
          <SectionTitle
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
{t('projects.title')}
          </SectionTitle>

          <SectionSubtitle
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
{t('projects.subtitle')}
          </SectionSubtitle>

          <CategoryFilter>
            <CategoryButton
              active={activeCategory === 'all'}
              onClick={() => setActiveCategory('all')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Alla Projekt
            </CategoryButton>
            {categories.map(category => (
              <CategoryButton
                key={category.id}
                active={activeCategory === category.id}
                onClick={() => setActiveCategory(category.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category.name}
              </CategoryButton>
            ))}
          </CategoryFilter>

          <ProjectsGrid>
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                onClick={() => openProjectModal(project)}
              />
            ))}
          </ProjectsGrid>

          {filteredProjects.length === 0 && (
            <EmptyState>
              <h3>Inga projekt hittades</h3>
              <p>
                {activeCategory === 'all'
                  ? 'Inga projekt har lagts till än.'
                  : 'Inga projekt hittades i denna kategori.'
                }
              </p>
              {categories.length === 0 && (
                <button onClick={setupSampleData}>
                  Lägg till exempeldata
                </button>
              )}
            </EmptyState>
          )}
        </Container>
      </ProjectsSection>

      {/* Reviews Section */}
      <ReviewsCarousel />

      {/* Modal Action Buttons */}
      <ActionButtonsSection>
        <Container>
          <ActionButtonsGrid>
            <ActionButton
              onClick={() => setShowAboutModal(true)}
            >
              <ActionButtonIcon>
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </ActionButtonIcon>
              <ActionButtonText>{t('actions.about.title')}</ActionButtonText>
              <ActionButtonSubtext>{t('actions.about.subtitle')}</ActionButtonSubtext>
            </ActionButton>

            <ActionButton
              onClick={() => setShowContactModal(true)}
            >
              <ActionButtonIcon>
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
                </svg>
              </ActionButtonIcon>
              <ActionButtonText>{t('actions.contact.title')}</ActionButtonText>
              <ActionButtonSubtext>{t('actions.contact.subtitle')}</ActionButtonSubtext>
            </ActionButton>
          </ActionButtonsGrid>
        </Container>
      </ActionButtonsSection>

      <Footer />

      {/* About Modal */}
      <AnimatePresence>
        {showAboutModal && (
          <AboutModal
            onClose={() => setShowAboutModal(false)}
          />
        )}
      </AnimatePresence>

      {/* Project Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={isProjectModalOpen}
        onClose={closeProjectModal}
        categories={categories}
      />

      {/* Contact Modal */}
      <AnimatePresence>
        {showContactModal && (
          <ContactModal
            onClose={() => setShowContactModal(false)}
          />
        )}
      </AnimatePresence>
    </HomeContainer>
  );
};

export default Portfolio;