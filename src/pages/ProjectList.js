// src/pages/ProjectList.js
import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useProjects } from '../hooks/useProjects';

const ProjectList = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const { projects, loading, error } = useProjects(type);
  
  // Om ingen typ anges eller typen inte existerar, omdirigera till startsidan
  useEffect(() => {
    if (error) {
      navigate('/');
    }
  }, [error, navigate]);

  // Definiera animationsvarianter för konsekvent beteende
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };
  
  return (
    <ProjectListContainer>
      <BackLink to="/">← Tillbaka till alla projekt</BackLink>
      
      <TypeTitle>{type}</TypeTitle>
      
      {loading ? (
        <LoadingIndicator>Laddar projekt...</LoadingIndicator>
      ) : projects.length === 0 ? (
        <NoProjects>
          <p>Inga projekt hittades i denna kategori.</p>
          <BackButton onClick={() => navigate('/')}>
            Tillbaka till startsidan
          </BackButton>
        </NoProjects>
      ) : (
        <ProjectsGrid
          initial="hidden"
          animate="visible"
        >
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              variants={cardVariants}
              custom={index}
              layout
            >
              <Link to={`/project/${project.id}`}>
                <ProjectImage 
                  src={`/projects/${project.id}/images/main.jpg`} 
                  alt={project.id}
                  onError={(e) => {
                    e.target.src = '/placeholder-image.jpg';
                  }}
                />
                <ProjectInfo>
                  <ProjectTitle>{project.id}</ProjectTitle>
                  <TechList>
                    {project.info.technologies?.slice(0, 3).map((tech, i) => (
                      <TechItem key={i}>{tech}</TechItem>
                    ))}
                  </TechList>
                </ProjectInfo>
              </Link>
            </ProjectCard>
          ))}
        </ProjectsGrid>
      )}
    </ProjectListContainer>
  );
};

// Styled Components
const ProjectListContainer = styled.div`
  padding: 2rem;
  background-color: #0a0e17;
  min-height: 100vh;
  color: white;
  max-width: 1200px;
  margin: 0 auto;
`;

const TypeTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: 3rem;
  text-align: center;
`;

const LoadingIndicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: white;
  font-size: 1.2rem;
`;

const NoProjects = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  text-align: center;
  font-size: 1.2rem;
  gap: 2rem;
`;

const BackButton = styled.button`
  background-color: #c45b5b;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: #a54b4b;
  }
`;

const ProjectsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  will-change: transform, opacity;
`;

const ProjectCard = styled(motion.div)`
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  overflow: hidden;
  height: auto;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  will-change: transform;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  }
  
  a {
    color: white;
    text-decoration: none;
    display: block;
  }
`;

const ProjectImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const ProjectInfo = styled.div`
  padding: 1.5rem;
`;

const ProjectTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`;

const TechList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const TechItem = styled.span`
  background-color: rgba(255, 255, 255, 0.1);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
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

export default ProjectList;