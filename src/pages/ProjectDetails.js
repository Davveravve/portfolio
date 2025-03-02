// src/pages/ProjectDetails.js
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useProject } from '../hooks/useProject';

const ProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { project, images, loading, error } = useProject(projectId);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [validImages, setValidImages] = useState([]);
  const [checkedImages, setCheckedImages] = useState(false);

  // När bilderna laddas, kontrollera vilka som faktiskt existerar
  useEffect(() => {
    if (!loading && images.length > 0 && !checkedImages) {
      const checkImages = async () => {
        // Vi håller reda på giltiga bilder
        const validImagesList = [];

        for (const image of images) {
          // Om det är en mp4-fil, lägg till den direkt utan att kontrollera
          if (image.toLowerCase().endsWith('.mp4')) {
            validImagesList.push(image);
            continue;
          }

          try {
            // Skapa ett img-element för att testa om bilden existerar
            const img = new Image();
            
            // Skapa en Promise som löses när bilden laddats eller misslyckats
            const imagePromise = new Promise((resolve) => {
              img.onload = () => resolve({ exists: true, image });
              img.onerror = () => {
                // Försök med alternativt format
                const altImg = new Image();
                const isJpg = image.toLowerCase().endsWith('.jpg');
                const altSrc = isJpg 
                  ? `/projects/${projectId}/images/${image.replace('.jpg', '.png')}`
                  : `/projects/${projectId}/images/${image.replace('.png', '.jpg')}`;
                  
                altImg.onload = () => resolve({ exists: true, image });
                altImg.onerror = () => resolve({ exists: false, image });
                altImg.src = altSrc;
              };
            });
            
            img.src = `/projects/${projectId}/images/${image}`;
            
            // Vänta på resultatet
            const result = await imagePromise;
            if (result.exists) {
              validImagesList.push(image);
            }
          } catch (e) {
            console.error("Fel vid bildkontroll:", e);
          }
        }
        
        setValidImages(validImagesList);
        setCheckedImages(true);
      };
      
      checkImages();
    }
  }, [loading, images, projectId, checkedImages]);

  if (loading) {
    return <LoadingIndicator>Laddar projektdetaljer...</LoadingIndicator>;
  }

  if (error || !project) {
    return (
      <ErrorContainer>
        <ErrorMessage>
          Projektet kunde inte hittas eller laddas.
        </ErrorMessage>
        <BackButton onClick={() => navigate(-1)}>
          Gå tillbaka
        </BackButton>
      </ErrorContainer>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === validImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? validImages.length - 1 : prev - 1
    );
  };

  // Använd den validerade bildlistan istället för alla bilder
  const displayImages = checkedImages ? validImages : [images[0]];
  
  // Kontrollera om nuvarande bild är en video
  const isCurrentVideo = displayImages[currentImageIndex]?.toLowerCase().endsWith('.mp4');

  return (
    <ProjectDetailsContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <BackLink to="/">
        ← Tillbaka till alla projekt
      </BackLink>
      
      <ProjectHeader>
        <ProjectTitle>{projectId}</ProjectTitle>
        <ProjectType>{project.info.type}</ProjectType>
      </ProjectHeader>
      
      {displayImages.length > 0 && (
        <ImagesSection>
          <ImageContainer>
            {displayImages[currentImageIndex]?.toLowerCase().endsWith('.mp4') ? (
              <VideoPlayer 
                src={`/projects/${projectId}/images/${displayImages[currentImageIndex]}`}
                controls
                autoPlay
                loop
                muted
              />
            ) : (
              <CurrentImage 
                src={`/projects/${projectId}/images/${displayImages[currentImageIndex]}`} 
                alt={`${projectId} - ${currentImageIndex + 1}`} 
                onError={(e) => {
                  // Försök med PNG om bilden var JPG, eller JPG om den var PNG
                  const currentPath = e.target.src;
                  let newPath;
                  
                  if (currentPath.endsWith('.jpg')) {
                    newPath = currentPath.replace('.jpg', '.png');
                  } else if (currentPath.endsWith('.png')) {
                    newPath = currentPath.replace('.png', '.jpg');
                  }
                  
                  if (newPath) {
                    e.target.src = newPath;
                    e.target.onerror = () => {
                      e.target.src = "/placeholder-image.jpg";
                      e.target.onerror = null;
                    };
                  }
                }}
              />
            )}
            
            {displayImages.length > 1 && (
              <>
                <NavigationButton left onClick={prevImage}>
                  &lt;
                </NavigationButton>
                <NavigationButton right onClick={nextImage}>
                  &gt;
                </NavigationButton>
                
                <ImageCounter>
                  {currentImageIndex + 1} / {displayImages.length}
                </ImageCounter>
              </>
            )}
          </ImageContainer>
          
          {displayImages.length > 1 && (
            <ThumbnailsContainer>
              {displayImages.map((image, index) => (
                <ThumbnailWrapper key={index}>
                  {image.toLowerCase().endsWith('.mp4') ? (
                    <VideoThumbnail 
                      active={index === currentImageIndex}
                      onClick={() => setCurrentImageIndex(index)}
                    >
                      <PlayIcon>▶</PlayIcon>
                    </VideoThumbnail>
                  ) : (
                    <Thumbnail 
                      src={`/projects/${projectId}/images/${image}`}
                      alt={`${projectId} thumbnail ${index + 1}`}
                      active={index === currentImageIndex}
                      onClick={() => setCurrentImageIndex(index)}
                      onError={(e) => {
                        // Försök med PNG om bilden var JPG, eller JPG om den var PNG
                        const currentPath = e.target.src;
                        let newPath;
                        
                        if (currentPath.endsWith('.jpg')) {
                          newPath = currentPath.replace('.jpg', '.png');
                        } else if (currentPath.endsWith('.png')) {
                          newPath = currentPath.replace('.png', '.jpg');
                        }
                        
                        if (newPath) {
                          e.target.src = newPath;
                          e.target.onerror = () => {
                            // Om bilden fortfarande inte kan laddas, använd placeholder
                            e.target.src = "/placeholder-image.jpg";
                            e.target.onerror = null;
                          };
                        }
                      }}
                    />
                  )}
                </ThumbnailWrapper>
              ))}
            </ThumbnailsContainer>
          )}
        </ImagesSection>
      )}
      
      <DetailsSection>
        <Description>{project.info.description}</Description>
        
        {project.info.technologies && (
          <TechnologiesSection>
            <SectionTitle>Teknologier</SectionTitle>
            <TechnologiesList>
              {project.info.technologies.map((tech, index) => (
                <TechnologyTag key={index}>{tech}</TechnologyTag>
              ))}
            </TechnologiesList>
          </TechnologiesSection>
        )}
        
        {project.info.links && project.info.links.length > 0 && (
          <LinksSection>
            <SectionTitle>Länkar</SectionTitle>
            <LinksList>
              {project.info.links.map((link, index) => (
                <LinkItem key={index}>
                  <ExternalLink 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    {link.title}
                  </ExternalLink>
                </LinkItem>
              ))}
            </LinksList>
          </LinksSection>
        )}
      </DetailsSection>
    </ProjectDetailsContainer>
  );
};

// Styled Components
const ProjectDetailsContainer = styled(motion.div)`
  padding: 2rem;
  background-color: #0a0e17;
  min-height: 100vh;
  color: white;
  max-width: 1200px;
  margin: 0 auto;
`;

const LoadingIndicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  color: white;
  font-size: 1.2rem;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 50vh;
  color: white;
`;

const ErrorMessage = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
`;

const BackButton = styled.button`
  background-color: #c45b5b;
  color: white;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
`;

const BackLink = styled(Link)`
  display: inline-block;
  margin-bottom: 2rem;
  color: white;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ProjectHeader = styled.div`
  margin-bottom: 2rem;
`;

const ProjectTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: 0.5rem;
`;

const ProjectType = styled.span`
  display: inline-block;
  background-color: #c45b5b;
  padding: 0.25rem 1rem;
  border-radius: 20px;
  font-size: 1rem;
`;

const ImagesSection = styled.section`
  margin-bottom: 3rem;
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  background-color: rgba(255, 255, 255, 0.05);
`;

const CurrentImage = styled.img`
  width: 100%;
  max-height: 600px;
  object-fit: contain;
  display: block;
`;

const VideoPlayer = styled.video`
  width: 100%;
  max-height: 600px;
  object-fit: contain;
  display: block;
  background-color: black;
`;

const NavigationButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  ${({ left }) => left && `
    left: 10px;
  `}
  
  ${({ right }) => right && `
    right: 10px;
  `}
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }
`;

const ImageCounter = styled.div`
  position: absolute;
  bottom: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
`;

const ThumbnailsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    height: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
  }
`;

const ThumbnailWrapper = styled.div`
  width: 80px;
  height: 60px;
  border-radius: 4px;
  overflow: hidden;
`;

const Thumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.2s ease;
  border: 2px solid ${({ active }) => active ? '#c45b5b' : 'transparent'};
  
  &:hover {
    transform: scale(1.05);
  }
`;

const VideoThumbnail = styled.div`
  width: 100%;
  height: 100%;
  background-color: #222;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 4px;
  border: 2px solid ${({ active }) => active ? '#c45b5b' : 'transparent'};
  transition: transform 0.2s ease, background-color 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
    background-color: #333;
  }
`;

const PlayIcon = styled.div`
  color: #c45b5b;
  font-size: 24px;
`;

const DetailsSection = styled.section`
  padding: 2rem;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
`;

const Description = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const TechnologiesSection = styled.div`
  margin-bottom: 2rem;
`;

const TechnologiesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const TechnologyTag = styled.span`
  background-color: rgba(255, 255, 255, 0.1);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.9rem;
`;

const LinksSection = styled.div`
  margin-top: 2rem;
`;

const LinksList = styled.ul`
  list-style: none;
  padding: 0;
`;

const LinkItem = styled.li`
  margin-bottom: 0.5rem;
`;

const ExternalLink = styled.a`
  color: #c45b5b;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  
  &:hover {
    text-decoration: underline;
  }
  
  &::after {
    content: '↗';
    margin-left: 0.25rem;
  }
`;

export default ProjectDetails;