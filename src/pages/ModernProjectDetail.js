import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
import { motion, useScroll, useTransform } from 'framer-motion';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { theme, glassMorphism } from '../styles/theme';
import ModernFooter from '../components/ModernFooter';
import ImageZoomModal from '../components/ImageZoomModal';
import VideoModal from '../components/VideoModal';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: ${theme.colors.background};
    color: ${theme.colors.text};
    overflow-x: hidden;
  }

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.02);
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;

    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }
`;

const gradientShift = keyframes`
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
`;

const PageContainer = styled.div`
  min-height: 100vh;
  background: ${theme.colors.background};
  position: relative;

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

const Navigation = styled(motion.nav)`
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
  justify-content: center;
  width: auto;

  @media (max-width: ${theme.breakpoints.md}) {
    padding: 0.75rem 1.5rem;
    gap: 1.5rem;
    top: 1rem;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    left: 0;
    transform: none;
    padding: 0.5rem 0.75rem;
    gap: 0.5rem;
    top: 0.5rem;
    justify-content: flex-start;
    margin-left: 0.5rem;
    width: auto;
    max-width: calc(100% - 1rem);
  }

  @media (max-width: 480px) {
    left: 0;
    transform: none;
    padding: 0.4rem 0.6rem;
    gap: 0.4rem;
    font-size: 0.85rem;
    margin-left: 0.25rem;
    max-width: calc(100% - 0.5rem);
  }
`;

const BackButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: ${theme.colors.textSecondary};
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: ${theme.transitions.normal};
  white-space: nowrap;

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: 0.85rem;
    gap: 0.4rem;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 0.7rem;
    gap: 0.2rem;
    padding: 0;

    span {
      display: inline;
      font-size: 0.7rem;
    }
  }

  @media (max-width: 480px) {
    font-size: 0.65rem;

    span {
      font-size: 0.65rem;
    }
  }

  &:hover {
    color: ${theme.colors.text};
    transform: translateX(-3px);
  }
`;

const NavTitle = styled.span`
  color: ${theme.colors.text};
  font-weight: 600;
  flex: 1;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: 0.9rem;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 0.75rem;
    max-width: 150px;
  }

  @media (max-width: 480px) {
    font-size: 0.7rem;
    max-width: 120px;
  }
`;

const HeroSection = styled(motion.section)`
  position: relative;
  min-height: 70vh;
  display: flex;
  align-items: center;
  padding: 8rem 0 4rem;
  z-index: 2;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  width: 100%;
`;

const HeroContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: start;
  max-width: 900px;
  margin: 0 auto;
`;

const ProjectInfo = styled(motion.div)``;

const CategoryBadge = styled(motion.span)`
  display: inline-block;
  padding: 0.5rem 1rem;
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: ${theme.radius.full};
  color: ${theme.colors.accent};
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 1.5rem;
`;

const ProjectTitle = styled(motion.h1)`
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 800;
  margin-bottom: 1.5rem;
  background: linear-gradient(
    90deg,
    #667eea 0%,
    #764ba2 25%,
    #f093fb 50%,
    #667eea 75%,
    #764ba2 100%
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${gradientShift} 4s ease-in-out infinite;
`;

const ProjectDescription = styled(motion.p)`
  font-size: 1.25rem;
  color: ${theme.colors.textSecondary};
  line-height: 1.8;
  margin-bottom: 2rem;
`;

const ProjectMeta = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
`;

const MetaItem = styled.div`
  h4 {
    font-size: 0.75rem;
    color: ${theme.colors.textMuted};
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.25rem;
  }

  p {
    font-size: 1rem;
    color: ${theme.colors.text};
    font-weight: 500;
  }
`;

const TechStack = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 2rem;
`;

const TechTag = styled(motion.span)`
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${theme.radius.full};
  font-size: 0.875rem;
  color: ${theme.colors.textSecondary};
  transition: all 0.3s ease;

  &:hover {
    background: rgba(99, 102, 241, 0.1);
    border-color: rgba(99, 102, 241, 0.2);
    color: ${theme.colors.accent};
    transform: translateY(-2px);
  }
`;

const ProjectActions = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const ActionButton = styled(motion.a)`
  padding: 1rem 2rem;
  border-radius: ${theme.radius.md};
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;

  &.primary {
    background: ${theme.gradients.primary};
    color: white;
    border: none;

    &:hover {
      transform: translateY(-3px);
      box-shadow: ${theme.shadows.glow};
    }
  }

  &.secondary {
    ${glassMorphism}
    color: ${theme.colors.text};

    &:hover {
      background: rgba(255, 255, 255, 0.08);
      transform: translateY(-2px);
    }
  }
`;

// Removed HeroImage component - no longer needed

const ContentSection = styled.section`
  position: relative;
  padding: 4rem 0;
  z-index: 2;
`;

const SectionTitle = styled(motion.h2)`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  background: ${theme.gradients.text};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;
`;

const MediaGrid = styled.div`
  display: grid;
  gap: 2rem;
  margin-top: 3rem;

  &.single {
    grid-template-columns: 1fr;
  }

  &.double {
    grid-template-columns: repeat(2, 1fr);

    @media (max-width: ${theme.breakpoints.md}) {
      grid-template-columns: 1fr;
    }
  }

  &.triple {
    grid-template-columns: repeat(3, 1fr);

    @media (max-width: ${theme.breakpoints.lg}) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: ${theme.breakpoints.md}) {
      grid-template-columns: 1fr;
    }
  }
`;

const MediaCard = styled(motion.div)`
  ${glassMorphism}
  border-radius: ${theme.radius.xl};
  overflow: hidden;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: ${theme.shadows.xl}, ${theme.shadows.glow};
  }

  img, video, iframe {
    width: 100%;
    height: auto;
    display: block;
  }

  iframe {
    min-height: 400px;

    @media (max-width: ${theme.breakpoints.sm}) {
      min-height: 250px;
    }
  }
`;

const LoadingContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoadingSpinner = styled(motion.div)`
  width: 60px;
  height: 60px;
  border: 3px solid rgba(99, 102, 241, 0.1);
  border-top: 3px solid ${theme.colors.accent};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const DetailCard = styled(motion.div)`
  ${glassMorphism}
  padding: 2rem;
  border-radius: ${theme.radius.xl};

  h3 {
    font-size: 1.25rem;
    margin-bottom: 1rem;
    background: ${theme.gradients.text};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  ul {
    list-style: none;
    padding: 0;

    li {
      padding: 0.75rem 0;
      color: ${theme.colors.textSecondary};
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);

      &:last-child {
        border-bottom: none;
      }

      &::before {
        content: '▸';
        color: ${theme.colors.accent};
        margin-right: 0.75rem;
      }
    }
  }

  p {
    color: ${theme.colors.textSecondary};
    line-height: 1.8;
  }
`;

const ModernProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [zoomedImage, setZoomedImage] = useState(null);
  const [zoomIndex, setZoomIndex] = useState(0);
  const [videoModalUrl, setVideoModalUrl] = useState(null);
  const { scrollY } = useScroll();

  const y = useTransform(scrollY, [0, 300], [0, -50]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.5]);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const projectDoc = await getDoc(doc(db, 'projects', id));
        if (projectDoc.exists()) {
          setProject({ id: projectDoc.id, ...projectDoc.data() });
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching project:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id, navigate]);

  if (loading) {
    return (
      <>
        <GlobalStyle />
        <PageContainer>
          <LoadingContainer>
            <LoadingSpinner />
          </LoadingContainer>
        </PageContainer>
      </>
    );
  }

  if (!project) return null;

  const mediaCount = project.media?.length || 0;
  const gridClass = mediaCount <= 1 ? 'single' : mediaCount === 2 ? 'double' : 'triple';

  return (
    <>
      <GlobalStyle />
      <PageContainer>
        <Navigation
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <BackButton onClick={() => navigate('/')}>
            ← <span>Back</span>
          </BackButton>
          <NavTitle>{project.title}</NavTitle>
        </Navigation>

        <HeroSection style={{ y, opacity }}>
          <Container>
            <HeroContent>
              <ProjectInfo
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <CategoryBadge>
                  {project.category?.name || 'Project'}
                </CategoryBadge>

                <ProjectTitle>
                  {project.title}
                </ProjectTitle>

                <ProjectDescription>
                  {project.description}
                </ProjectDescription>

                <ProjectMeta>
                  <MetaItem>
                    <h4>Role</h4>
                    <p>{project.role || 'Full Stack Developer'}</p>
                  </MetaItem>
                  <MetaItem>
                    <h4>Year</h4>
                    <p>{project.year || new Date().getFullYear()}</p>
                  </MetaItem>
                  <MetaItem>
                    <h4>Duration</h4>
                    <p>{project.duration || '3 months'}</p>
                  </MetaItem>
                </ProjectMeta>

                <TechStack>
                  {(project.technologies || ['React', 'Node.js', 'Firebase']).map((tech, index) => (
                    <TechTag
                      key={tech}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + index * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      {tech}
                    </TechTag>
                  ))}
                </TechStack>

                <ProjectActions>
                  {project.liveUrl && (
                    <ActionButton
                      href={project.liveUrl}
                      target="_blank"
                      className="primary"
                      as={motion.a}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      View Live Project
                    </ActionButton>
                  )}
                  {project.githubUrl && (
                    <ActionButton
                      href={project.githubUrl}
                      target="_blank"
                      className="secondary"
                      as={motion.a}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      View Source Code
                    </ActionButton>
                  )}
                </ProjectActions>
              </ProjectInfo>
            </HeroContent>
          </Container>
        </HeroSection>

        {project.details && (
          <ContentSection>
            <Container>
              <SectionTitle
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                Project Details
              </SectionTitle>

              <DetailsGrid>
                <DetailCard
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                >
                  <h3>Challenge</h3>
                  <p>{project.details.challenge || 'Creating a modern, scalable solution that meets user needs.'}</p>
                </DetailCard>

                <DetailCard
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <h3>Solution</h3>
                  <p>{project.details.solution || 'Implemented a cutting-edge tech stack with focus on performance and UX.'}</p>
                </DetailCard>

                <DetailCard
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  <h3>Key Features</h3>
                  <ul>
                    {(project.details.features || [
                      'Responsive Design',
                      'Real-time Updates',
                      'Cloud Integration',
                      'Modern UI/UX'
                    ]).map(feature => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                </DetailCard>
              </DetailsGrid>
            </Container>
          </ContentSection>
        )}

        {project.media && project.media.length > 0 && (
          <ContentSection>
            <Container>
              <SectionTitle
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                Project Gallery
              </SectionTitle>

              <MediaGrid className={gridClass}>
                {project.media.map((item, index) => (
                  <MediaCard
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -10 }}
                    onClick={() => {
                      if (item.type === 'video') {
                        setVideoModalUrl(item.url);
                      } else {
                        setZoomedImage(item.url);
                        setZoomIndex(index);
                      }
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    {item.type === 'video' ? (
                      // Show video thumbnail or preview
                      <div style={{
                        width: '100%',
                        height: '100%',
                        minHeight: '300px',
                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.05))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative'
                      }}>
                        <div style={{
                          fontSize: '3rem',
                          color: 'rgba(255, 255, 255, 0.8)',
                          background: 'rgba(0, 0, 0, 0.3)',
                          width: '80px',
                          height: '80px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>▶</div>
                        <p style={{
                          position: 'absolute',
                          bottom: '1rem',
                          left: '1rem',
                          color: 'rgba(255, 255, 255, 0.9)',
                          fontSize: '0.9rem',
                          fontWeight: '600'
                        }}>
                          {item.url.includes('vimeo') ? 'Vimeo' : item.url.includes('youtube') ? 'YouTube' : 'Video'}
                        </p>
                      </div>
                    ) : (
                      <img src={item.url} alt={`${project.title} ${index + 1}`} />
                    )}
                  </MediaCard>
                ))}
              </MediaGrid>
            </Container>
          </ContentSection>
        )}

        <ModernFooter />
      </PageContainer>

      <ImageZoomModal
        image={zoomedImage}
        isOpen={!!zoomedImage}
        onClose={() => setZoomedImage(null)}
        title={project?.title}
        currentIndex={zoomIndex}
        totalImages={project?.media?.filter(m => m.type !== 'video').length}
      />

      <VideoModal
        videoUrl={videoModalUrl}
        isOpen={!!videoModalUrl}
        onClose={() => setVideoModalUrl(null)}
        title={project?.title}
      />
    </>
  );
};

export default ModernProjectDetail;