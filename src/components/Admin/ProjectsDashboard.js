import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  collection,
  getDocs,
  query,
  orderBy,
  updateDoc,
  doc
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import AdminLayout from './AdminLayout';

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const StatCard = styled(motion.div)`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #ef4444;
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const ActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const CreateButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);

  &:hover {
    box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
  }
`;

const CategorySection = styled.div`
  margin-bottom: 3rem;
`;

const CategoryHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 8px;
  margin-bottom: 1rem;
  border: 1px solid #e2e8f0;
`;

const CategoryTitle = styled.h3`
  margin: 0;
  color: #1e293b;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CategoryCount = styled.span`
  background: #ef4444;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
`;

const ProjectsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ProjectCard = styled(motion.div)`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: #cbd5e1;
  }

  &[data-is-dragging="true"] {
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    border-color: #ef4444;
    transform: rotate(1deg);
  }
`;

const ProjectThumbnail = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  background-image: ${props => props.src ? `url(${props.src})` : 'none'};
  background-size: cover;
  background-position: center;
  background-color: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  font-size: 0.75rem;
  border: 1px solid #e2e8f0;
`;

const ProjectInfo = styled.div`
  flex: 1;
`;

const ProjectTitle = styled.h4`
  margin: 0 0 0.25rem 0;
  color: #1e293b;
  font-weight: 600;
`;

const ProjectMeta = styled.div`
  color: #64748b;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ProjectActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled(motion.button)`
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: white;
  color: #64748b;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s ease;

  &:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
  }

  &.edit {
    color: #3b82f6;
    border-color: #3b82f6;

    &:hover {
      background: #eff6ff;
    }
  }
`;

const OrderControls = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.5rem;
`;

const OrderButton = styled(motion.button)`
  width: 24px;
  height: 20px;
  border: 1px solid #e2e8f0;
  border-radius: 3px;
  background: white;
  color: #64748b;
  cursor: pointer;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: #f8fafc;
    border-color: #cbd5e1;
    color: #374151;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Project Item Component with Order Controls
const ProjectItemWithControls = ({ project, index, onMoveUp, onMoveDown, isFirst, isLast }) => {
  const navigate = useNavigate();

  return (
    <ProjectCard
      whileHover={{ y: -2 }}
    >
      <OrderControls>
        <OrderButton
          onClick={() => onMoveUp(project.id)}
          disabled={isFirst}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="Move up"
        >
          ↑
        </OrderButton>
        <OrderButton
          onClick={() => onMoveDown(project.id)}
          disabled={isLast}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="Move down"
        >
          ↓
        </OrderButton>
      </OrderControls>

      <ProjectThumbnail
        src={project.media?.[0]?.url}
      >
        {!project.media?.[0]?.url && 'No Image'}
      </ProjectThumbnail>

      <ProjectInfo>
        <ProjectTitle>{project.title}</ProjectTitle>
        <ProjectMeta>
          <span>{project.technologies?.length || 0} technologies</span>
          <span>{project.media?.length || 0} media files</span>
        </ProjectMeta>
      </ProjectInfo>

      <ProjectActions>
        <ActionButton
          className="edit"
          onClick={() => navigate(`/admin/projects/edit/${project.id}`)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Edit
        </ActionButton>
      </ProjectActions>
    </ProjectCard>
  );
};

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #64748b;

  h3 {
    color: #1e293b;
    margin-bottom: 0.5rem;
  }
`;

const ProjectsDashboard = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    byCategory: {}
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch categories
      const categoriesQuery = query(collection(db, 'categories'), orderBy('displayOrder'));
      const categoriesSnapshot = await getDocs(categoriesQuery);
      const categoriesData = categoriesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Fetch projects (with fallback for projects without displayOrder)
      const projectsSnapshot = await getDocs(collection(db, 'projects'));
      const projectsData = projectsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).sort((a, b) => {
        // Sort by displayOrder if it exists, otherwise by createdAt
        if (a.displayOrder !== undefined && b.displayOrder !== undefined) {
          return b.displayOrder - a.displayOrder;
        } else if (a.displayOrder !== undefined) {
          return -1;
        } else if (b.displayOrder !== undefined) {
          return 1;
        } else {
          // Sort by createdAt if no displayOrder
          const aDate = a.createdAt?.toDate?.() || new Date(a.createdAt || 0);
          const bDate = b.createdAt?.toDate?.() || new Date(b.createdAt || 0);
          return bDate - aDate;
        }
      });

      // Calculate stats
      const statsData = {
        total: projectsData.length,
        byCategory: {}
      };

      categoriesData.forEach(cat => {
        statsData.byCategory[cat.id] = {
          name: cat.name,
          count: projectsData.filter(p => p.categoryId === cat.id).length
        };
      });

      setCategories(categoriesData);
      setProjects(projectsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleMoveUp = async (projectId) => {
    const projectIndex = projects.findIndex(p => p.id === projectId);
    if (projectIndex <= 0) return;

    const newProjects = [...projects];
    [newProjects[projectIndex - 1], newProjects[projectIndex]] =
    [newProjects[projectIndex], newProjects[projectIndex - 1]];

    setProjects(newProjects);

    // Update display order in Firebase
    try {
      const updatePromises = newProjects.map((project, index) =>
        updateDoc(doc(db, 'projects', project.id), {
          displayOrder: newProjects.length - index,
          updatedAt: new Date()
        })
      );
      await Promise.all(updatePromises);
    } catch (error) {
      console.error('Error updating order:', error);
      fetchData(); // Revert on error
    }
  };

  const handleMoveDown = async (projectId) => {
    const projectIndex = projects.findIndex(p => p.id === projectId);
    if (projectIndex >= projects.length - 1) return;

    const newProjects = [...projects];
    [newProjects[projectIndex], newProjects[projectIndex + 1]] =
    [newProjects[projectIndex + 1], newProjects[projectIndex]];

    setProjects(newProjects);

    // Update display order in Firebase
    try {
      const updatePromises = newProjects.map((project, index) =>
        updateDoc(doc(db, 'projects', project.id), {
          displayOrder: newProjects.length - index,
          updatedAt: new Date()
        })
      );
      await Promise.all(updatePromises);
    } catch (error) {
      console.error('Error updating order:', error);
      fetchData(); // Revert on error
    }
  };

  const groupedProjects = categories.reduce((acc, category) => {
    acc[category.id] = projects.filter(project => project.categoryId === category.id);
    return acc;
  }, {});

  // Get all valid category IDs
  const validCategoryIds = categories.map(cat => cat.id);

  // Add uncategorized projects (including orphaned projects with invalid categoryId)
  groupedProjects['uncategorized'] = projects.filter(project =>
    !project.categoryId || !validCategoryIds.includes(project.categoryId)
  );

  if (loading) return <AdminLayout title="Projects" subtitle="Loading..."><div>Loading...</div></AdminLayout>;

  return (
    <AdminLayout
      title="Projects"
      subtitle="Manage your portfolio projects"
    >
      <StatsGrid>
        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatNumber>{stats.total}</StatNumber>
          <StatLabel>Total Projects</StatLabel>
        </StatCard>


        {Object.entries(stats.byCategory).map(([categoryId, data], index) => (
          <StatCard
            key={categoryId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <StatNumber>{data.count}</StatNumber>
            <StatLabel>{data.name}</StatLabel>
          </StatCard>
        ))}
      </StatsGrid>

      <ActionBar>
        <div></div>
        <CreateButton
          onClick={() => navigate('/admin/projects/new')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>+</span>
          Create New Project
        </CreateButton>
      </ActionBar>

      {categories.map((category) => {
        const categoryProjects = groupedProjects[category.id] || [];

        return (
          <CategorySection key={category.id}>
            <CategoryHeader>
              <CategoryTitle>
                {category.name}
                <CategoryCount>{categoryProjects.length}</CategoryCount>
              </CategoryTitle>
            </CategoryHeader>

            <ProjectsList>
              {categoryProjects.length === 0 ? (
                <EmptyState>
                  <h3>No projects in this category</h3>
                  <p>Create your first project to get started</p>
                </EmptyState>
              ) : (
                categoryProjects.map((project, index) => (
                  <ProjectItemWithControls
                    key={project.id}
                    project={project}
                    index={index}
                    onMoveUp={handleMoveUp}
                    onMoveDown={handleMoveDown}
                    isFirst={index === 0}
                    isLast={index === categoryProjects.length - 1}
                  />
                ))
              )}
            </ProjectsList>
          </CategorySection>
        );
      })}

      {/* Show uncategorized projects */}
      {groupedProjects['uncategorized']?.length > 0 && (
        <CategorySection key="uncategorized">
          <CategoryHeader>
            <CategoryTitle>
              Uncategorized Projects
              <CategoryCount>{groupedProjects['uncategorized'].length}</CategoryCount>
            </CategoryTitle>
          </CategoryHeader>

          <ProjectsList>
            {groupedProjects['uncategorized'].map((project, index) => (
              <ProjectItemWithControls
                key={project.id}
                project={project}
                index={index}
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
                isFirst={index === 0}
                isLast={index === groupedProjects['uncategorized'].length - 1}
              />
            ))}
          </ProjectsList>
        </CategorySection>
      )}
    </AdminLayout>
  );
};

export default ProjectsDashboard;