import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useLanguage } from '../context/LanguageContext';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg,
    rgba(15, 23, 42, 1) 0%,
    rgba(30, 41, 59, 1) 25%,
    rgba(30, 41, 59, 0.95) 50%,
    rgba(51, 65, 85, 0.9) 75%,
    rgba(71, 85, 105, 0.85) 100%
  );
  color: white;
  padding: 2rem;
  position: relative;

  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 30% 20%, rgba(var(--main-color-rgb, 239, 68, 68), 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(var(--accent-color-rgb, 249, 115, 22), 0.08) 0%, transparent 50%),
                radial-gradient(circle at 40% 40%, rgba(59, 130, 246, 0.05) 0%, transparent 50%);
    pointer-events: none;
    z-index: 1;
  }

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const BackButton = styled(motion.button)`
  position: fixed;
  top: 2rem;
  left: 2rem;
  z-index: 100;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  cursor: pointer;
  backdrop-filter: blur(10px);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    top: 1rem;
    left: 1rem;
    padding: 0.5rem 1rem;
  }
`;

const ProjectContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding-top: 4rem;
  position: relative;
  z-index: 2;
`;

const ProjectHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 3rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
`;

const ProjectTitle = styled(motion.h1)`
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 900;
  margin: 0 0 1rem 0;
  background: linear-gradient(135deg, var(--main-color, #ef4444) 0%, #f97316 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.1;
`;

const ProjectDescription = styled(motion.p)`
  font-size: 1.25rem;
  color: #cbd5e1;
  line-height: 1.8;
  max-width: 800px;
  margin: 0 auto 2rem auto;
`;

const TechStack = styled(motion.div)`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const TechTag = styled.span`
  background: rgba(var(--main-color-rgb, 239, 68, 68), 0.2);
  border: 1px solid rgba(var(--main-color-rgb, 239, 68, 68), 0.4);
  color: var(--main-color, #ef4444);
  padding: 0.5rem 1rem;
  border-radius: 25px;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const ProjectLinks = styled(motion.div)`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 4rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const ProjectLink = styled(motion.a)`
  background: ${props => props.variant === 'demo' ?
    'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)' :
    'linear-gradient(135deg, rgb(60, 37, 50) 0%, rgba(60, 37, 50, 0.8) 100%)'};
  color: ${props => props.variant === 'demo' ? '#1e293b' : 'white'};
  border: ${props => props.variant === 'demo' ? '2px solid rgba(30, 41, 59, 0.2)' : 'none'};
  padding: 1rem 2rem;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(var(--main-color-rgb, 239, 68, 68), 0.3);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 30px rgba(var(--main-color-rgb, 239, 68, 68), 0.4);
  }
`;

const MediaSection = styled.div`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%);
  backdrop-filter: blur(15px);
  border-radius: 20px;
  padding: 2.5rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 15px 45px rgba(0, 0, 0, 0.1);
  margin-bottom: 4rem;
`;

const MediaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const SectionTitle = styled(motion.h3)`
  font-size: 1.75rem;
  font-weight: 700;
  color: white;
  margin: 0 0 2rem 0;
  text-align: center;
  background: linear-gradient(135deg, var(--main-color, #ef4444) 0%, #f97316 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const MediaItem = styled(motion.div)`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-8px);
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%);
    border-color: rgba(var(--main-color-rgb, 239, 68, 68), 0.4);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 250px;
  overflow: hidden;
  cursor: pointer;
`;

const MediaImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  height: 250px;
  background: black;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const CustomVideoPlayer = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const PlayButton = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, var(--main-color, #ef4444) 0%, #dc2626 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 8px 32px rgba(var(--main-color-rgb, 239, 68, 68), 0.4);
  z-index: 10;

  &::before {
    content: '';
    width: 0;
    height: 0;
    border-left: 25px solid white;
    border-top: 15px solid transparent;
    border-bottom: 15px solid transparent;
    margin-left: 5px;
  }
`;

const VideoControls = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  padding: 1rem;
  transform: translateY(100%);
  transition: transform 0.3s ease;

  ${VideoContainer}:hover & {
    transform: translateY(0);
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  margin-bottom: 0.5rem;
  cursor: pointer;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(135deg, var(--main-color, #ef4444) 0%, #dc2626 100%);
  border-radius: 2px;
  width: ${props => props.progress}%;
  transition: width 0.1s ease;
`;

const ControlButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ControlButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const TimeDisplay = styled.span`
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
`;

const FullscreenModal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(10px);
`;

const FullscreenContent = styled(motion.div)`
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  border-radius: 16px;
  overflow: hidden;
`;

const CloseButton = styled(motion.button)`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.7);
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  z-index: 10;

  &:hover {
    background: rgba(0, 0, 0, 0.9);
  }
`;

const FullscreenImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

const LoadingSpinner = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;

  &::after {
    content: '';
    width: 50px;
    height: 50px;
    border: 3px solid rgba(var(--main-color-rgb, 239, 68, 68), 0.3);
    border-top: 3px solid var(--main-color, #ef4444);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #ef4444;
  font-size: 1.2rem;
`;

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const VideoPlayer = ({ src, poster }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(false);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleProgressClick = (e) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = pos * duration;
    }
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <VideoContainer
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <CustomVideoPlayer
        ref={videoRef}
        src={src}
        poster={poster}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onClick={togglePlay}
      />

      {!isPlaying && (
        <PlayButton
          onClick={togglePlay}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        />
      )}

      <AnimatePresence>
        {showControls && (
          <VideoControls
            as={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <ProgressBar onClick={handleProgressClick}>
              <ProgressFill progress={progress} />
            </ProgressBar>
            <ControlButtons>
              <ControlButton onClick={togglePlay}>
                {isPlaying ? '⏸️' : '▶️'}
              </ControlButton>
              <TimeDisplay>
                {formatTime(currentTime)} / {formatTime(duration)}
              </TimeDisplay>
            </ControlButtons>
          </VideoControls>
        )}
      </AnimatePresence>
    </VideoContainer>
  );
};

const ProjectView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fullscreenMedia, setFullscreenMedia] = useState(null);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const projectDoc = await getDoc(doc(db, 'projects', id));
      if (projectDoc.exists()) {
        setProject({ id: projectDoc.id, ...projectDoc.data() });
      } else {
        setError('Project not found');
      }
    } catch (err) {
      console.error('Error fetching project:', err);
      setError('Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const openFullscreen = (media) => {
    setFullscreenMedia(media);
  };

  const closeFullscreen = () => {
    setFullscreenMedia(null);
  };

  if (loading) {
    return (
      <Container>
        <LoadingSpinner />
      </Container>
    );
  }

  if (error || !project) {
    return (
      <Container>
        <BackButton
          onClick={() => navigate('/')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ← {t('common.back', 'Back')}
        </BackButton>
        <ErrorMessage>{error || 'Project not found'}</ErrorMessage>
      </Container>
    );
  }

  return (
    <Container>
      <BackButton
        onClick={() => navigate('/')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        ← {t('common.back', 'Back')}
      </BackButton>

      <ProjectContainer>
        <ProjectHeader>
          <ProjectTitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {project.title}
          </ProjectTitle>

          <ProjectDescription
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {project.description}
          </ProjectDescription>

          {project.technologies && project.technologies.length > 0 && (
            <TechStack
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {project.technologies.map((tech, index) => (
                <TechTag key={index}>{tech}</TechTag>
              ))}
            </TechStack>
          )}

          <ProjectLinks
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
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
        </ProjectHeader>

        {project.media && project.media.length > 0 && (
          <MediaSection>
            <SectionTitle
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              📸 Projektmedia
            </SectionTitle>
            <MediaGrid>
              {project.media.map((media, index) => (
                <MediaItem
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  {media.type === 'video' ? (
                    <VideoPlayer
                      src={media.url}
                      poster={project.media.find(m => m.type === 'image')?.url}
                    />
                  ) : (
                    <ImageContainer onClick={() => openFullscreen(media)}>
                      <MediaImage src={media.url} alt={`${project.title} ${index + 1}`} />
                    </ImageContainer>
                  )}
                </MediaItem>
              ))}
            </MediaGrid>
          </MediaSection>
        )}
      </ProjectContainer>

      <AnimatePresence>
        {fullscreenMedia && (
          <FullscreenModal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeFullscreen}
          >
            <FullscreenContent
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <CloseButton
                onClick={closeFullscreen}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                ×
              </CloseButton>
              <FullscreenImage src={fullscreenMedia.url} alt={project.title} />
            </FullscreenContent>
          </FullscreenModal>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default ProjectView;