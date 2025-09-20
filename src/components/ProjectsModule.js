import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
`;

const shimmer = keyframes`
  0%, 100% { background-position: 0% center; }
  50% { background-position: 100% center; }
`;

const ModuleContainer = styled(motion.section)`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 3rem;
  margin: 4rem 0;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    animation: ${shimmer} 3s infinite;
  }

  @media (max-width: 768px) {
    padding: 2rem;
    margin: 2rem 0;
  }
`;

const ModuleHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const ModuleTitle = styled(motion.h2)`
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--dark-color, #1e293b);
  margin-bottom: 1rem;
  background: linear-gradient(135deg, var(--main-color, #ef4444), var(--accent-color, #f97316));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const ModuleSubtitle = styled(motion.p)`
  font-size: 1.2rem;
  color: var(--gray-color, #64748b);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const CategoryTabs = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
`;

const CategoryTab = styled(motion.button)`
  padding: 0.875rem 1.5rem;
  border: 2px solid ${props => props.active
    ? 'var(--main-color, #ef4444)'
    : 'rgba(255, 255, 255, 0.2)'};
  background: ${props => props.active
    ? 'linear-gradient(135deg, var(--main-color, #ef4444), var(--accent-color, #f97316))'
    : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.active ? 'white' : 'var(--dark-color, #1e293b)'};
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(var(--main-color-rgb, 239, 68, 68), 0.3);
  }
`;

const ProjectsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const ProjectItem = styled(motion.div)`
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  position: relative;
  backdrop-filter: blur(10px);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }
`;

const ProjectImageContainer = styled.div`
  height: 200px;
  background: linear-gradient(135deg, var(--main-color, #ef4444), var(--accent-color, #f97316));
  position: relative;
  overflow: hidden;
`;

const ProjectImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;

  ${ProjectItem}:hover & {
    transform: scale(1.1);
  }
`;

const ProjectImagePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--main-color, #ef4444), var(--accent-color, #f97316));
  color: white;
  font-size: 1rem;
  font-weight: 600;
`;

const ProjectContent = styled.div`
  padding: 1.5rem;
`;

const ProjectTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--dark-color, #1e293b);
  margin-bottom: 0.5rem;
  line-height: 1.3;
`;

const ProjectDescription = styled.p`
  font-size: 0.9rem;
  color: var(--gray-color, #64748b);
  line-height: 1.6;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ProjectMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1rem;
`;

const ProjectCategory = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--main-color, #ef4444);
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const ProjectTechCount = styled.span`
  font-size: 0.75rem;
  color: var(--gray-color, #64748b);
  background: rgba(var(--main-color-rgb, 239, 68, 68), 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
`;

const ViewAllButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, var(--main-color, #ef4444), var(--accent-color, #f97316));
  color: white;
  border: none;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  margin: 3rem auto 0;
  box-shadow: 0 10px 30px rgba(var(--main-color-rgb, 239, 68, 68), 0.3);
  animation: ${float} 3s ease-in-out infinite;

  &:hover {
    box-shadow: 0 15px 40px rgba(var(--main-color-rgb, 239, 68, 68), 0.4);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: var(--gray-color, #64748b);
  grid-column: 1 / -1;

  h3 {
    color: var(--dark-color, #1e293b);
    margin-bottom: 0.5rem;
  }
`;

const ProjectsModule = ({ projects = [], categories = [], showAll = false }) => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');

  // Filter projects by category
  const filteredProjects = activeCategory === 'all'
    ? projects
    : projects.filter(project => project.categoryId === activeCategory);

  // Limit to 6 projects if not showing all
  const displayProjects = showAll ? filteredProjects : filteredProjects.slice(0, 6);

  const handleProjectClick = (project) => {
    navigate(`/project/${project.id}`);
  };

  return (
    <ModuleContainer
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <ModuleHeader>
        <ModuleTitle
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Mina Projekt
        </ModuleTitle>
        <ModuleSubtitle
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Utforska mitt portfolio av utvecklingsprojekt och kreativa lösningar
        </ModuleSubtitle>
      </ModuleHeader>

      <CategoryTabs>
        <CategoryTab
          active={activeCategory === 'all'}
          onClick={() => setActiveCategory('all')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Alla Projekt
        </CategoryTab>
        {categories.map((category) => (
          <CategoryTab
            key={category.id}
            active={activeCategory === category.id}
            onClick={() => setActiveCategory(category.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {category.name}
          </CategoryTab>
        ))}
      </CategoryTabs>

      <ProjectsContainer>
        <AnimatePresence mode="wait">
          {displayProjects.length === 0 ? (
            <EmptyState>
              <h3>Inga projekt hittades</h3>
              <p>
                {activeCategory === 'all'
                  ? 'Inga projekt har lagts till än.'
                  : 'Inga projekt hittades i denna kategori.'
                }
              </p>
            </EmptyState>
          ) : (
            displayProjects.map((project, index) => (
              <ProjectItem
                key={project.id}
                onClick={() => handleProjectClick(project)}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <ProjectImageContainer>
                  {project.media?.[0]?.url ? (
                    <ProjectImage
                      src={project.media[0].url}
                      alt={project.title || 'Project image'}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <ProjectImagePlaceholder style={{ display: project.media?.[0]?.url ? 'none' : 'flex' }}>
                    {project.title || 'Projekt'}
                  </ProjectImagePlaceholder>
                </ProjectImageContainer>

                <ProjectContent>
                  <ProjectTitle>{project.title || 'Untitled Project'}</ProjectTitle>
                  <ProjectDescription>
                    {project.description?.length > 120
                      ? `${project.description.substring(0, 120)}...`
                      : project.description || 'Ingen beskrivning tillgänglig'}
                  </ProjectDescription>
                  <ProjectMeta>
                    <ProjectCategory>
                      {categories.find(cat => cat.id === project.categoryId)?.name || 'Okategoriserad'}
                    </ProjectCategory>
                    <ProjectTechCount>
                      {project.technologies?.length || 0} teknologier
                    </ProjectTechCount>
                  </ProjectMeta>
                </ProjectContent>
              </ProjectItem>
            ))
          )}
        </AnimatePresence>
      </ProjectsContainer>

      {!showAll && filteredProjects.length > 6 && (
        <ViewAllButton
          onClick={() => {/* TODO: Navigate to projects page or expand */}}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>Visa Alla Projekt</span>
          <span>→</span>
        </ViewAllButton>
      )}
    </ModuleContainer>
  );
};

export default ProjectsModule;