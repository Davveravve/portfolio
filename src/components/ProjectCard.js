// src/components/ProjectCard.js
import React from 'react';
import styled from 'styled-components';

const Card = styled.div`
  background: linear-gradient(135deg, #F2E0DF 0%, rgba(242, 224, 223, 0.9) 100%);
  border-radius: 20px;
  overflow: hidden;
  box-shadow:
    0 4px 20px rgba(3, 76, 54, 0.08),
    0 0 0 1px rgba(3, 76, 54, 0.1);
  cursor: pointer;
  height: auto;
  width: 100%;
  max-width: 380px;
  display: flex;
  flex-direction: column;
  border: none;
  transition: all 0.2s ease;

  &:hover {
    box-shadow:
      0 16px 40px rgba(3, 76, 54, 0.2),
      0 0 0 1px rgba(3, 76, 54, 0.3);
    transform: translateY(-8px);
  }

  @media (max-width: 768px) {
    max-width: 320px;

    &:hover {
      transform: translateY(-4px);
    }
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 260px;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #BDCDCF 0%, #034c36 50%, #003332 100%);

  @media (max-width: 768px) {
    height: 220px;
  }
`;

const ProjectImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
`;

const ProjectDetails = styled.div`
  padding: 1.5rem;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;

  @media (max-width: 768px) {
    padding: 1.25rem;
  }
`;

const ProjectTitle = styled.h3`
  font-size: 1.375rem;
  margin: 0;
  color: #003332;
  font-weight: 700;
  line-height: 1.3;
`;

const ProjectCategory = styled.div`
  background: linear-gradient(135deg, #E3B8B8 0%, #034C36 100%);
  color: #F2E0DF;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border: 1px solid rgba(3, 76, 54, 0.2);

  @media (max-width: 768px) {
    padding: 0.3rem 0.6rem;
    font-size: 0.65rem;
  }
`;

const ProjectExcerpt = styled.p`
  font-size: 0.95rem;
  color: #034C36;
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ProjectCard = ({ project, onClick, index }) => {
  // Use first media item as thumbnail, with fallback
  const thumbnailUrl = project.media?.[0]?.url || project.thumbnail || project.image || project.imageUrl || '/placeholder-image.jpg';

  return (
    <Card
      onClick={() => onClick && onClick(project)}
    >
      <ImageContainer>
        <ProjectImage
          src={thumbnailUrl}
          alt={project.title || 'Project image'}
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      </ImageContainer>
      <ProjectDetails>
        <ProjectTitle>{project.title || 'Untitled Project'}</ProjectTitle>
        <ProjectCategory>{project.category?.name || '3D'}</ProjectCategory>
      </ProjectDetails>
    </Card>
  );
};

export default ProjectCard;