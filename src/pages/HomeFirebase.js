import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { collection, getDocs, query, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import Header from '../components/Header';
import ProjectCard from '../components/ProjectCard';
import ContactForm from '../components/ContactFormFirebase';
import Footer from '../components/Footer';
import AboutModal from '../components/AboutModal';

const HomeContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const HeroSection = styled.section`
  padding: 4rem 2rem;
  text-align: center;
  color: white;
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ProfileImage = styled(motion.div)`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background-image: ${props => props.src ? `url(${props.src})` : 'none'};
  background-size: cover;
  background-position: center;
  background-color: rgba(255, 255, 255, 0.1);
  margin: 0 auto 2rem;
  border: 4px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
  text-align: center;
  flex-shrink: 0;
  aspect-ratio: 1 / 1;
  overflow: hidden;

  @media (max-width: 768px) {
    width: 150px;
    height: 150px;
  }

  @media (max-width: 480px) {
    width: 120px;
    height: 120px;
  }
`;

const HeroTitle = styled(motion.h1)`
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-size: 1.5rem;
  opacity: 0.9;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const HeroBio = styled(motion.p)`
  font-size: 1.1rem;
  opacity: 0.8;
  max-width: 600px;
  line-height: 1.6;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const ProjectsSection = styled.section`
  padding: 4rem 2rem;
  background-color: #f8fafc;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 3rem;
  color: var(--dark-color);
`;

const CategoryTabs = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 3rem;
`;

const CategoryTab = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 25px;
  background-color: ${props => props.active ? 'var(--primary-color)' : 'white'};
  color: ${props => props.active ? 'white' : 'var(--dark-color)'};
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const ContactSection = styled.section`
  padding: 4rem 2rem;
  background-color: var(--dark-color);
  color: white;
`;

const LoadingIndicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
  font-size: 1.2rem;
  color: white;
`;

const ErrorDisplay = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
  font-size: 1.2rem;
  color: #ff6b6b;
  text-align: center;
`;

const Home = () => {
  const [aboutData, setAboutData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [projects, setProjects] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAboutModal, setShowAboutModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      console.log("Fetching portfolio data from Firebase...");

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
      const projectsQuery = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
      const projectsSnapshot = await getDocs(projectsQuery);
      const projectsData = projectsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setAboutData(aboutData);
      setCategories(categoriesData);
      setProjects(projectsData);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = activeCategory === 'all'
    ? projects
    : projects.filter(project => project.categoryId === activeCategory);

  if (loading) {
    return (
      <HomeContainer>
        <LoadingIndicator>Loading portfolio...</LoadingIndicator>
      </HomeContainer>
    );
  }

  if (error) {
    return (
      <HomeContainer>
        <ErrorDisplay>
          <div>
            <h2>Oops! Something went wrong</h2>
            <p>{error}</p>
          </div>
        </ErrorDisplay>
      </HomeContainer>
    );
  }

  return (
    <HomeContainer>
      <Header onAboutClick={() => setShowAboutModal(true)} />

      <HeroSection>
        <ProfileImage
          src={aboutData?.profileImage}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: 'spring' }}
        >
          {!aboutData?.profileImage && 'No Profile Image'}
        </ProfileImage>

        <HeroTitle
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {aboutData?.name || 'Your Name'}
        </HeroTitle>

        <HeroSubtitle
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {aboutData?.title || 'Your Title'}
        </HeroSubtitle>

        <HeroBio
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          {aboutData?.bio || 'Welcome to my portfolio! Please set up your about information in the admin panel.'}
        </HeroBio>
      </HeroSection>

      <ProjectsSection>
        <Container>
          <SectionTitle>My Projects</SectionTitle>

          <CategoryTabs>
            <CategoryTab
              active={activeCategory === 'all'}
              onClick={() => setActiveCategory('all')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              All Projects
            </CategoryTab>
            {categories.map(category => (
              <CategoryTab
                key={category.id}
                active={activeCategory === category.id}
                onClick={() => setActiveCategory(category.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category.name}
              </CategoryTab>
            ))}
          </CategoryTabs>

          <ProjectsGrid>
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
              />
            ))}
          </ProjectsGrid>

          {filteredProjects.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
              <h3>No projects found</h3>
              <p>
                {activeCategory === 'all'
                  ? 'No projects have been added yet.'
                  : 'No projects found in this category.'
                }
              </p>
              {categories.length === 0 && (
                <button
                  onClick={async () => {
                    try {
                      const { setupCategories, setupSampleProject } = await import('../utils/setupFirebase.js');
                      await setupCategories();
                      await setupSampleProject();
                      window.location.reload();
                    } catch (error) {
                      console.error('Error setting up data:', error);
                    }
                  }}
                  style={{
                    marginTop: '1rem',
                    padding: '0.75rem 1.5rem',
                    backgroundColor: 'var(--primary-color)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  Add Sample Data
                </button>
              )}
            </div>
          )}
        </Container>
      </ProjectsSection>

      <ContactSection>
        <Container>
          <SectionTitle style={{ color: 'white' }}>Get In Touch</SectionTitle>
          <ContactForm />
        </Container>
      </ContactSection>

      <Footer />

      {showAboutModal && (
        <AboutModal
          aboutData={aboutData}
          onClose={() => setShowAboutModal(false)}
        />
      )}
    </HomeContainer>
  );
};

export default Home;