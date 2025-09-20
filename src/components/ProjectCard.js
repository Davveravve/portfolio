// src/components/ProjectCard.js
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const Card = styled(motion.div)`
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  height: 420px;
  width: 100%;
  max-width: 350px;
  display: flex;
  flex-direction: column;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    border-color: var(--main-color, #ef4444);
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  position: relative;
  overflow: hidden;
  height: 220px;
  aspect-ratio: 1;
  background: #f8fafc;
`;

const ProjectImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
  
  ${Card}:hover & {
    transform: scale(1.05);
  }
`;

const ProjectDetails = styled.div`
  padding: 1.5rem;
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ProjectTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: #1e293b;
  font-weight: 600;
  line-height: 1.3;
`;

const ProjectCategory = styled.span`
  font-size: 0.875rem;
  color: var(--main-color, #ef4444);
  font-weight: 600;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const ProjectExcerpt = styled.p`
  font-size: 0.9rem;
  color: #64748b;
  line-height: 1.6;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ProjectCard = ({ project, onClick }) => {
  // Use first media item as thumbnail, with fallback
  const thumbnailUrl = project.media?.[0]?.url || project.thumbnail || project.image || project.imageUrl || '/placeholder-image.jpg';

  return (
    <Card
      onClick={() => onClick && onClick(project)}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <ImageContainer>
        <ProjectImage
          src={thumbnailUrl}
          alt={project.title || 'Project image'}
          onError={(e) => {
            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
          }}
        />
      </ImageContainer>
      <ProjectDetails>
        <ProjectTitle>{project.title || 'Untitled Project'}</ProjectTitle>
        <ProjectCategory>{project.category?.name || 'Uncategorized'}</ProjectCategory>
        <ProjectExcerpt>
          {project.description?.length > 120
            ? `${project.description.substring(0, 120)}...`
            : project.description || 'No description available'}
        </ProjectExcerpt>
      </ProjectDetails>
    </Card>
  );
};

export default ProjectCard;