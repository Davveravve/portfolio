import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { doc, getDoc, collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #F2E0DF 0%, #E3B8B8 50%, #FF8128 100%);
  color: #034C36;
`;

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(189, 205, 207, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(3, 76, 54, 0.2);
  padding: 1rem 0;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const BackButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(3, 76, 54, 0.1);
  border: 1px solid rgba(3, 76, 54, 0.3);
  color: #034C36;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(3, 76, 54, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(3, 76, 54, 0.3);
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const ProjectTitle = styled.h1`
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  font-weight: 700;
  color: #034C36;
  margin: 0;
  text-align: center;
  flex: 1;
  margin-left: 2rem;
  margin-right: 2rem;
`;

const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem;

  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`;

const HeroSection = styled.section`
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 3rem;
  margin-bottom: 4rem;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const ProjectInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const CategoryBadge = styled.span`
  display: inline-block;
  background: linear-gradient(135deg, #E3B8B8 0%, #034c36 100%);
  border: 1px solid rgba(3, 76, 54, 0.4);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  width: fit-content;
`;

const Description = styled.p`
  font-size: 1.125rem;
  line-height: 1.8;
  color: #034C36;
  margin: 0;
`;

const TechStack = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const TechTag = styled.span`
  background: rgba(3, 76, 54, 0.1);
  border: 1px solid rgba(3, 76, 54, 0.3);
  color: #034C36;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  backdrop-filter: blur(10px);
`;

const ProjectLinks = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const ProjectLink = styled(motion.a)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: ${props => props.variant === 'demo' ?
    'linear-gradient(135deg, #034C36 0%, #003332 100%)' :
    'rgba(189, 205, 207, 0.2)'};
  color: ${props => props.variant === 'demo' ? 'white' : '#034C36'};
  border: 1px solid ${props => props.variant === 'demo' ? 'transparent' : 'rgba(3, 76, 54, 0.3)'};
  text-decoration: none;
  border-radius: 50px;
  font-weight: 600;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 40px ${props => props.variant === 'demo' ? 'rgba(3, 76, 54, 0.4)' : 'rgba(189, 205, 207, 0.3)'};
  }
`;

const FeaturedImage = styled.div`
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  aspect-ratio: 4/3;
  background: linear-gradient(135deg, #BDCDCF 0%, #034c36 50%, #003332 100%);
  border: 1px solid rgba(3, 76, 54, 0.2);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const MediaGallery = styled.section`
  margin-top: 4rem;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: #034C36;
  margin-bottom: 2rem;
  text-align: center;
`;

const MediaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const MediaItem = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(0, 212, 170, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(0, 212, 170, 0.5);
    box-shadow: 0 20px 60px rgba(0, 212, 170, 0.2);
    transform: translateY(-8px);
  }

  img, video {
    width: 100%;
    height: 250px;
    object-fit: cover;
  }
`;

const VideoPlaceholder = styled.div`
  width: 100%;
  height: 250px;
  background: linear-gradient(135deg, rgba(0, 212, 170, 0.1) 0%, rgba(0, 184, 148, 0.1) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #00d4aa;
  font-size: 3rem;
  position: relative;

  &::after {
    content: 'Click to play';
    position: absolute;
    bottom: 1rem;
    left: 50%;
    transform: translateX(-50%);
    font-size: 0.875rem;
    color: #cbd5e1;
  }
`;

const FullscreenModal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(10px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const FullscreenContent = styled(motion.div)`
  max-width: 90%;
  max-height: 90%;
  position: relative;

  img, video {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 12px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: -3rem;
  right: 0;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
  font-size: 1.2rem;
  color: #00d4aa;
`;

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      // Fetch project
      const projectDoc = await getDoc(doc(db, 'projects', id));
      if (!projectDoc.exists()) {
        navigate('/');
        return;
      }

      const projectData = { id: projectDoc.id, ...projectDoc.data() };

      // Fetch categories
      const categoriesQuery = query(collection(db, 'categories'), orderBy('displayOrder'));
      const categoriesSnapshot = await getDocs(categoriesQuery);
      const categoriesData = categoriesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setProject(projectData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching project:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    // Restore scroll position if stored
    const scrollPosition = sessionStorage.getItem('homeScrollPosition');
    navigate('/', { replace: true });

    // Restore scroll position after a brief delay
    if (scrollPosition) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(scrollPosition, 10));
      }, 100);
    }
  };

  const openMediaModal = (media) => {
    setSelectedMedia(media);
    setIsModalOpen(true);
  };

  const closeMediaModal = () => {
    setIsModalOpen(false);
    setSelectedMedia(null);
  };

  if (loading) {
    return (
      <PageContainer>
        <LoadingSpinner>Loading project...</LoadingSpinner>
      </PageContainer>
    );
  }

  if (!project) {
    return (
      <PageContainer>
        <LoadingSpinner>Project not found</LoadingSpinner>
      </PageContainer>
    );
  }

  const projectCategory = categories.find(cat => cat.id === project.categoryId);
  const featuredImage = project.media?.[0];

  return (
    <PageContainer>
      <Header>
        <HeaderContent>
          <BackButton
            onClick={handleBack}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Tillbaka
          </BackButton>
          <ProjectTitle>{project.title}</ProjectTitle>
          <div style={{ width: '140px' }} /> {/* Spacer for centering */}
        </HeaderContent>
      </Header>

      <MainContent>
        <HeroSection>
          <ProjectInfo>
            {projectCategory && (
              <CategoryBadge>{projectCategory.name}</CategoryBadge>
            )}

            <Description>{project.description}</Description>

            {project.technologies && project.technologies.length > 0 && (
              <div>
                <h3 style={{ color: '#00d4aa', marginBottom: '1rem' }}>Teknologier</h3>
                <TechStack>
                  {project.technologies.map((tech, index) => (
                    <TechTag key={index}>{tech}</TechTag>
                  ))}
                </TechStack>
              </div>
            )}

            <ProjectLinks>
              {project.githubUrl && (
                <ProjectLink
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  Visa kod
                </ProjectLink>
              )}
              {project.liveUrl && (
                <ProjectLink
                  variant="demo"
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Live Demo
                </ProjectLink>
              )}
            </ProjectLinks>
          </ProjectInfo>

          {featuredImage && (
            <FeaturedImage>
              {featuredImage.type === 'video' ? (
                <video
                  src={featuredImage.url}
                  controls
                  poster={featuredImage.thumbnail}
                />
              ) : (
                <img
                  src={featuredImage.url}
                  alt={project.title}
                />
              )}
            </FeaturedImage>
          )}
        </HeroSection>

        {project.media && project.media.length > 1 && (
          <MediaGallery>
            <SectionTitle>Galleri</SectionTitle>
            <MediaGrid>
              {project.media.slice(1).map((media, index) => (
                <MediaItem
                  key={index}
                  onClick={() => openMediaModal(media)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {media.type === 'video' ? (
                    media.url ? (
                      <video src={media.url} />
                    ) : (
                      <VideoPlaceholder>
                        ▶
                      </VideoPlaceholder>
                    )
                  ) : (
                    <img src={media.url} alt={`${project.title} ${index + 2}`} />
                  )}
                </MediaItem>
              ))}
            </MediaGrid>
          </MediaGallery>
        )}
      </MainContent>

      <AnimatePresence>
        {isModalOpen && selectedMedia && (
          <FullscreenModal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMediaModal}
          >
            <FullscreenContent
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <CloseButton onClick={closeMediaModal}>
                ✕
              </CloseButton>
              {selectedMedia.type === 'video' ? (
                <video src={selectedMedia.url} controls autoPlay />
              ) : (
                <img src={selectedMedia.url} alt={selectedMedia.name} />
              )}
            </FullscreenContent>
          </FullscreenModal>
        )}
      </AnimatePresence>
    </PageContainer>
  );
};

export default ProjectDetailPage;