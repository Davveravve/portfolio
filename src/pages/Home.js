// src/pages/Home.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchAllProjects = async () => {
      try {
        setLoading(true);
        
        // Läs projektkonfigurationsfilen
        const response = await fetch('/projects.json');
        if (!response.ok) {
          throw new Error('Kunde inte ladda projektkonfiguration');
        }
        
        const projectsConfig = await response.json();
        setProjects(projectsConfig);
        
        // Spara för användning i andra komponenter
        sessionStorage.setItem('allProjects', JSON.stringify(projectsConfig));
      } catch (error) {
        console.error('Error fetching projects:', error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllProjects();
  }, []);
  
  return (
    <HomeContainer>
      <ProjectsSection>
        <SectionTitle>Mina Projekt</SectionTitle>
        
        {loading ? (
          <LoadingText>Laddar projekt...</LoadingText>
        ) : (
          <ProjectsGrid>
            {projects.map((project, index) => (
              <ProjectCard
                key={project.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Link to={`/project/${project.id}`}>
                  <ProjectImage 
                    src={`/projects/${project.id}/images/main.jpg`} 
                    onError={(e) => {
                      // Försök med PNG om JPG misslyckas
                      const jpgPath = e.target.src;
                      const pngPath = jpgPath.replace('.jpg', '.png');
                      console.log("Försöker ladda PNG istället:", pngPath);
                      e.target.src = pngPath;
                      
                      // Om även PNG misslyckas, använd placeholder
                      e.target.onerror = () => {
                        console.log("Även PNG misslyckades, använder placeholder");
                        e.target.src = "/placeholder-image.jpg";
                        e.target.onerror = null;
                      };
                    }}
                    alt={project.id}
                  />
                  <ProjectInfo>
                    <ProjectTitle>{project.id}</ProjectTitle>
                    <ProjectType>{project.info.type}</ProjectType>
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
      </ProjectsSection>
    </HomeContainer>
  );
};

// Styled Components
const HomeContainer = styled.div`
  padding: 0 2rem;
  background-color: #0a0e17;
  min-height: 100vh;
  color: white;
`;

const ProjectsSection = styled.section`
  padding-top: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  color: white;
  font-size: 1rem;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const LoadingText = styled.p`
  text-align: center;
  font-size: 1.2rem;
  opacity: 0.7;
`;

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

const ProjectCard = styled(motion.div)`
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  }
  
  a {
    color: white;
    text-decoration: none;
  }
`;

const ProjectImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  background-color: #1a1a1a; /* Bakgrund om bild inte laddar */
`;

const ProjectInfo = styled.div`
  padding: 1.5rem;
`;

const ProjectTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`;

const ProjectType = styled.span`
  display: inline-block;
  background-color: #c45b5b;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  margin: 0.5rem 0;
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

export default Home;