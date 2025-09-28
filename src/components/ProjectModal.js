import React, { useState, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { transform: translateY(100px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const ModalContainer = styled(motion.div)`
  background: white;
  border-radius: 24px;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow:
    0 25px 50px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 768px) {
    max-width: 95vw;
    max-height: 95vh;
    border-radius: 16px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.1);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.5rem;
  color: #64748b;
  transition: all 0.2s ease;
  z-index: 10;

  &:hover {
    background: rgba(var(--main-color-rgb, 239, 68, 68), 0.1);
    color: var(--main-color, #ef4444);
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const ModalHeader = styled.div`
  padding: 2rem 2rem 1rem 2rem;
  border-bottom: 1px solid #e2e8f0;
  position: relative;
  background: linear-gradient(135deg, rgba(0, 212, 170, 0.05) 0%, rgba(255, 255, 255, 1) 100%);
  border-radius: 24px 24px 0 0;

  @media (max-width: 768px) {
    padding: 1.5rem 1.5rem 1rem 1.5rem;
    border-radius: 16px 16px 0 0;
  }
`;

const ModalBody = styled.div`
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const ProjectHeader = styled.div`
  text-align: center;
`;

const ProjectTitle = styled(motion.h2)`
  font-size: 2rem;
  font-weight: 700;
  color: var(--main-color, #00d4aa);
  margin: 0 0 0.5rem 0;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const ProjectSubtitle = styled.p`
  font-size: 1rem;
  color: #64748b;
  margin: 0;
  text-align: center;
`;

const ProjectDescription = styled(motion.p)`
  font-size: 1rem;
  color: var(--gray-color, #64748b);
  line-height: 1.6;
  margin: 1.5rem 0;
`;

const CategoryBadge = styled.span`
  display: inline-block;
  background: rgba(var(--main-color-rgb, 239, 68, 68), 0.2);
  border: 1px solid rgba(var(--main-color-rgb, 239, 68, 68), 0.4);
  color: var(--main-color, #ef4444);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
`;

const TechStack = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 2rem;
`;

const TechTag = styled.span`
  background: rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: var(--gray-color, #64748b);
  padding: 0.4rem 0.8rem;
  border-radius: 16px;
  font-size: 0.85rem;
  font-weight: 500;
  backdrop-filter: blur(10px);
`;

const ProjectLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
`;

const ProjectLink = styled(motion.a)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: ${props => props.variant === 'demo' ?
    'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)' :
    'linear-gradient(135deg, rgb(60, 37, 50) 0%, rgba(60, 37, 50, 0.8) 100%)'};
  color: ${props => props.variant === 'demo' ? '#1e293b' : 'white'};
  border: ${props => props.variant === 'demo' ? '2px solid rgba(30, 41, 59, 0.2)' : 'none'};
  text-decoration: none;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const MediaSection = styled.div`
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.03) 0%, rgba(0, 0, 0, 0.01) 100%);
  backdrop-filter: blur(15px);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid rgba(0, 0, 0, 0.08);
  margin-top: 2rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--dark-color, #1e293b);
  margin: 0 0 1.5rem 0;
  text-align: center;
  background: linear-gradient(135deg, var(--main-color, #ef4444) 0%, var(--accent-color, #f97316) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const MediaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) {
    display: flex;
    overflow-x: auto;
    gap: 1rem;
    padding-bottom: 0.5rem;
    scrollbar-width: none;
    -ms-overflow-style: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

const MediaThumbnail = styled(motion.div)`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.6) 100%);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  cursor: pointer;
  aspect-ratio: 1;
  position: relative;

  &:hover {
    transform: translateY(-3px);
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%);
    border-color: rgba(var(--main-color-rgb, 239, 68, 68), 0.3);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 768px) {
    min-width: 100px;
    width: 100px;
    height: 100px;
    flex-shrink: 0;
  }
`;

const ThumbnailImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const VideoThumbnail = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(var(--main-color-rgb, 239, 68, 68), 0.1) 0%, rgba(var(--accent-color-rgb, 249, 115, 22), 0.1) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--main-color, #ef4444);

  &::before {
    content: '▶';
    font-size: 2rem;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  &::after {
    content: '${props => props.name || 'Video'}';
    position: absolute;
    bottom: 0.5rem;
    left: 50%;
    transform: translateX(-50%);
    font-size: 0.7rem;
    color: var(--gray-color, #64748b);
    background: rgba(255, 255, 255, 0.9);
    padding: 0.2rem 0.5rem;
    border-radius: 8px;
    white-space: nowrap;
    max-width: 90%;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const MediaPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.05) 0%, rgba(0, 0, 0, 0.02) 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--gray-color, #64748b);
  font-size: 0.8rem;
  text-align: center;

  &::before {
    content: '📷';
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }
`;

const MediaModalOverlay = styled(motion.div)`
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

const MediaModalContent = styled(motion.div)`
  max-width: 90%;
  max-height: 90%;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  position: relative;
  cursor: zoom-out;

  img, video {
    transition: transform 0.3s ease;
  }

  &:hover img {
    transform: scale(1.02);
  }
`;

const FullscreenImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 12px;
`;

const FullscreenVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 12px;
`;

const MediaModalCloseButton = styled.button`
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
  z-index: 10;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const ProjectModal = ({ project, isOpen, onClose, categories = [] }) => {
  const { t } = useLanguage();
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);

  if (!project || !isOpen) return null;

  const projectCategory = categories.find(cat => cat.id === project.categoryId);
  const technologies = project.technologies || [];

  const openMediaModal = (media) => {
    setSelectedMedia(media);
    setIsMediaModalOpen(true);
  };

  const closeMediaModal = () => {
    setIsMediaModalOpen(false);
    setSelectedMedia(null);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <Overlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleOverlayClick}
          >
            <ModalContainer
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <CloseButton
                onClick={onClose}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </CloseButton>

              <ModalHeader>
                <ProjectHeader>
                  <ProjectTitle
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    {project.title}
                  </ProjectTitle>

                  {projectCategory && (
                    <ProjectSubtitle>{projectCategory.name}</ProjectSubtitle>
                  )}
                </ProjectHeader>
              </ModalHeader>

              <ModalBody>
                <ProjectDescription
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {project.description}
                </ProjectDescription>

                {technologies.length > 0 && (
                  <TechStack>
                    {technologies.map((tech, index) => (
                      <TechTag key={index}>{tech}</TechTag>
                    ))}
                  </TechStack>
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
                      {t('project.github', 'View Code')}
                    </ProjectLink>
                  )}
                  {project.liveUrl && (
                    <ProjectLink
                      variant="demo"
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {t('project.demo', 'Live Demo')}
                    </ProjectLink>
                  )}
                </ProjectLinks>

                {project.media && project.media.length > 0 && (
                  <MediaSection>
                    <MediaGrid>
                      {project.media.map((media, index) => (
                        <MediaThumbnail
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => openMediaModal(media)}
                        >
                          {media.type === 'video' ? (
                            <VideoThumbnail name={media.name} />
                          ) : media.url ? (
                            <ThumbnailImage
                              src={media.url}
                              alt={`${project.title} ${index + 1}`}
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : (
                            <MediaPlaceholder>
                              {media.name || 'Media'}
                            </MediaPlaceholder>
                          )}
                        </MediaThumbnail>
                      ))}
                    </MediaGrid>
                  </MediaSection>
                )}
              </ModalBody>
            </ModalContainer>
          </Overlay>
        )}
      </AnimatePresence>

      {/* Media Modal */}
      <AnimatePresence>
        {isMediaModalOpen && selectedMedia && (
          <MediaModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMediaModal}
          >
            <MediaModalContent
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <MediaModalCloseButton
                onClick={closeMediaModal}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </MediaModalCloseButton>

              {selectedMedia.type === 'video' && selectedMedia.url ? (
                <FullscreenVideo
                  src={selectedMedia.url}
                  controls
                  autoPlay
                />
              ) : selectedMedia.url ? (
                <FullscreenImage
                  src={selectedMedia.url}
                  alt={selectedMedia.name}
                />
              ) : (
                <div style={{
                  padding: '2rem',
                  textAlign: 'center',
                  color: 'white',
                  background: 'rgba(0,0,0,0.8)',
                  borderRadius: '12px'
                }}>
                  <h3>{selectedMedia.name}</h3>
                  <p>Fil för stor att visa</p>
                </div>
              )}
            </MediaModalContent>
          </MediaModalOverlay>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProjectModal;