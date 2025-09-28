import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { theme } from '../styles/theme';

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  backdrop-filter: blur(10px);
`;

const ModalContent = styled(motion.div)`
  position: relative;
  width: 90%;
  max-width: 1200px;
  max-height: 90vh;
  background: rgba(255, 255, 255, 0.05);
  border-radius: ${theme.radius.xl};
  overflow: hidden;
  cursor: default;

  @media (max-width: ${theme.breakpoints.md}) {
    width: 95%;
    max-height: 80vh;
  }
`;

const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 56.25%; /* 16:9 Aspect Ratio */

  iframe, video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: none;
    border-radius: ${theme.radius.lg};
  }
`;

const CloseButton = styled(motion.button)`
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: rotate(90deg);
  }
`;

const VideoTitle = styled(motion.h3)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.5rem;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent);
  color: white;
  font-size: 1.25rem;
  font-weight: 600;
  z-index: 5;
`;

const ProgressBar = styled.div`
  position: absolute;
  bottom: 60px;
  left: 2rem;
  right: 2rem;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  z-index: 10;
  cursor: pointer;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: ${props => props.$progress}%;
    background: ${theme.gradients.primary};
    border-radius: 2px;
    transition: width 0.1s linear;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    bottom: 50px;
    left: 1rem;
    right: 1rem;
  }
`;

const VideoModal = ({ videoUrl, isOpen, onClose, title }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const iframeRef = useRef(null);
  const videoRef = useRef(null);
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
      setIsPlaying(true);  // Start playing
      setProgress(0);

      // Autoplay after modal opens
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.play();
        } else if (iframeRef.current) {
          // Autoplay for Vimeo/YouTube
          if (videoUrl?.includes('vimeo')) {
            iframeRef.current.contentWindow.postMessage(
              JSON.stringify({ method: 'play' }),
              '*'
            );
          } else if (videoUrl?.includes('youtube')) {
            iframeRef.current.contentWindow.postMessage(
              JSON.stringify({
                event: 'command',
                func: 'playVideo'
              }),
              '*'
            );
          }
        }
      }, 500);
    } else {
      setIsPlaying(false);
    }

    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } else if (iframeRef.current) {
      // For Vimeo/YouTube, we'll use postMessage API
      if (videoUrl.includes('vimeo')) {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ method: isPlaying ? 'pause' : 'play' }),
          '*'
        );
      } else if (videoUrl.includes('youtube')) {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({
            event: 'command',
            func: isPlaying ? 'pauseVideo' : 'playVideo'
          }),
          '*'
        );
      }
      setIsPlaying(!isPlaying);
    }
  };


  const handleProgressClick = (e) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const percent = ((e.clientX - rect.left) / rect.width) * 100;
      videoRef.current.currentTime = (videoRef.current.duration * percent) / 100;
      setProgress(percent);
    }
  };

  useEffect(() => {
    const updateProgress = () => {
      if (videoRef.current) {
        const percent = (videoRef.current.currentTime / videoRef.current.duration) * 100;
        setProgress(percent);
      }
    };

    if (videoRef.current) {
      videoRef.current.addEventListener('timeupdate', updateProgress);
      return () => {
        if (videoRef.current) {
          videoRef.current.removeEventListener('timeupdate', updateProgress);
        }
      };
    }
  }, [videoUrl]);

  if (!videoUrl) return null;

  const renderVideo = () => {
    // Handle Vimeo
    if (videoUrl.includes('vimeo.com')) {
      let vimeoId = '';
      if (videoUrl.includes('player.vimeo.com')) {
        vimeoId = videoUrl.split('video/')[1]?.split('?')[0];
      } else if (videoUrl.includes('vimeo.com/')) {
        vimeoId = videoUrl.split('vimeo.com/')[1]?.split('/')[0]?.split('?')[0];
      }

      if (vimeoId) {
        return (
          <iframe
            ref={iframeRef}
            src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1&loop=1&background=0&controls=0&badge=0&autopause=0&player_id=0&app_id=58479&byline=0&title=0&portrait=0&api=1&muted=1`}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        );
      }
    }

    // Handle YouTube
    if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
      const videoId = videoUrl.includes('youtu.be')
        ? videoUrl.split('/').pop()
        : videoUrl.split('v=')[1]?.split('&')[0];

      if (videoId) {
        return (
          <iframe
            ref={iframeRef}
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&controls=0&rel=0&modestbranding=1&autohide=1&showinfo=0&enablejsapi=1&mute=1`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        );
      }
    }

    // Handle direct video files
    return (
      <video
        ref={videoRef}
        onClick={handlePlayPause}
        autoPlay
        loop
        muted
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        >
          <ModalContent
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <CloseButton
              onClick={onClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              ×
            </CloseButton>

            <VideoContainer>
              {renderVideo()}

              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  cursor: 'pointer',
                  zIndex: 2
                }}
                onClick={handlePlayPause}
              />

              {videoRef.current && (
                <ProgressBar
                  $progress={progress}
                  onClick={handleProgressClick}
                />
              )}
            </VideoContainer>

            {title && (
              <VideoTitle
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {title}
              </VideoTitle>
            )}
          </ModalContent>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

export default VideoModal;