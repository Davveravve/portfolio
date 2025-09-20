import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { collection, getDocs, query, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { formatDate } from '../../utils/dateUtils';

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const Title = styled.h2`
  font-size: 2rem;
  color: var(--dark-color);
  margin: 0;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 768px) {
    width: 100%;
    flex-wrap: wrap;
  }
`;

const AddButton = styled(motion(Link))`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  background-color: var(--primary-color);
  color: white;
  border-radius: 6px;
  font-weight: 500;
  text-decoration: none;
  transition: var(--transition);
  
  &:hover {
    background-color: #5A52D5;
  }
  
  @media (max-width: 768px) {
    flex: 1;
    text-align: center;
  }
`;

const CategoryButton = styled(motion(Link))`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  background-color: var(--secondary-color);
  color: white;
  border-radius: 6px;
  font-weight: 500;
  text-decoration: none;
  transition: var(--transition);
  
  &:hover {
    background-color: #E3596F;
  }
  
  @media (max-width: 768px) {
    flex: 1;
    text-align: center;
  }
`;

const MessagesButton = styled(motion(Link))`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.$hasUnread ? 'var(--warning-color)' : 'var(--success-color)'};
  color: white;
  border-radius: 6px;
  font-weight: 500;
  text-decoration: none;
  transition: var(--transition);

  &:hover {
    filter: brightness(0.9);
  }

  @media (max-width: 768px) {
    flex: 1;
    text-align: center;
  }
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2.5rem;
`;

const StatCard = styled(motion.div)`
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const StatTitle = styled.h3`
  font-size: 1rem;
  color: #4A5568;
  margin-top: 0;
  margin-bottom: 0.5rem;
`;

const StatValue = styled.p`
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-color);
  margin: 0;
`;

const SectionTitle = styled.h3`
  font-size: 1.5rem;
  color: var(--dark-color);
  margin-top: 2rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #E2E8F0;
`;

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const ProjectCard = styled(motion.div)`
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const ProjectImage = styled.div`
  height: 160px;
  background-color: #EDF2F7;
  background-image: ${props => props.image ? `url(${props.image})` : 'none'};
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #A0AEC0;
  font-size: 0.875rem;
`;

const ProjectDetails = styled.div`
  padding: 1rem;
`;

const ProjectTitle = styled.h4`
  font-size: 1.25rem;
  margin-top: 0;
  margin-bottom: 0.5rem;
`;

const ProjectCategory = styled.span`
  display: inline-block;
  background-color: #EDF2F7;
  color: #4A5568;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  margin-bottom: 0.75rem;
`;

const ProjectDate = styled.p`
  font-size: 0.75rem;
  color: #718096;
  margin: 0;
`;

const ProjectActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
  gap: 0.5rem;
`;

const EditButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  background-color: #EDF2F7;
  color: #4A5568;
  border-radius: 4px;
  font-size: 0.875rem;
  text-decoration: none;
  transition: var(--transition);
  
  &:hover {
    background-color: #E2E8F0;
  }
`;

const MessagesList = styled.div`
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const MessageItem = styled(Link)`
  display: block;
  padding: 1rem;
  border-bottom: 1px solid #E2E8F0;
  text-decoration: none;
  transition: var(--transition);
  background-color: ${props => props.unread ? '#EBF8FF' : 'white'};
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: ${props => props.unread ? '#BEE3F8' : '#F7FAFC'};
  }
`;

const MessageSender = styled.div`
  font-weight: 600;
  color: var(--dark-color);
  margin-bottom: 0.25rem;
  display: flex;
  justify-content: space-between;
`;

const MessageDate = styled.span`
  font-weight: 400;
  font-size: 0.75rem;
  color: #718096;
`;

const MessagePreview = styled.p`
  font-size: 0.875rem;
  color: #4A5568;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #718096;
`;

const LoadingIndicator = styled.div`
  text-align: center;
  padding: 2rem;
  color: #718096;
`;

const ErrorDisplay = styled.div`
  background-color: #FED7D7;
  color: #9B2C2C;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
`;

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [messages, setMessages] = useState([]);
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log("Fetching dashboard data from Firebase...");

        // Fetch categories
        const categoriesQuery = query(collection(db, 'categories'), orderBy('displayOrder'));
        const categoriesSnapshot = await getDocs(categoriesQuery);
        const categoriesData = categoriesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Fetch projects
        const projectsQuery = query(collection(db, 'projects'), orderBy('updatedAt', 'desc'));
        const projectsSnapshot = await getDocs(projectsQuery);
        const projectsData = projectsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Fetch messages
        const messagesQuery = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
        const messagesSnapshot = await getDocs(messagesQuery);
        const messagesData = messagesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Fetch about data
        const aboutDoc = await getDoc(doc(db, 'content', 'about'));
        const aboutData = aboutDoc.exists() ? aboutDoc.data() : null;

        setCategories(categoriesData);
        setProjects(projectsData);
        setMessages(messagesData);
        setAboutData(aboutData);
      } catch (err) {
        console.error("Dashboard data fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);
  
  // Calculate unread messages
  const unreadMessages = messages.filter(msg => !msg.read);
  const hasUnreadMessages = unreadMessages.length > 0;
  
  // Get recent projects (last 4)
  const recentProjects = projects.slice(0, 4);
  
  // Get recent messages (last 3)
  const recentMessages = messages.slice(0, 3);
  
  if (loading) {
    return <LoadingIndicator>Loading dashboard data...</LoadingIndicator>;
  }
  
  if (error) {
    return (
      <DashboardContainer>
        <ErrorDisplay>Error loading dashboard: {error}</ErrorDisplay>
        <ButtonContainer>
          <AddButton 
            to="/admin/projects/new"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Add New Project
          </AddButton>
          <CategoryButton 
            to="/admin/categories"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Manage Categories
          </CategoryButton>
          <MessagesButton 
            to="/admin/messages"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Messages
          </MessagesButton>
        </ButtonContainer>
      </DashboardContainer>
    );
  }
  
  return (
    <DashboardContainer>
      <DashboardHeader>
        <Title>Dashboard</Title>
        <ButtonContainer>
          <AddButton 
            to="/admin/projects/new"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Add New Project
          </AddButton>
          <CategoryButton 
            to="/admin/categories"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Manage Categories
          </CategoryButton>
          <MessagesButton
            to="/admin/messages"
            $hasUnread={hasUnreadMessages}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Messages {hasUnreadMessages ? `(${unreadMessages.length})` : ''}
          </MessagesButton>
          <CategoryButton
            to="/admin/about"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Edit About Me
          </CategoryButton>
        </ButtonContainer>
      </DashboardHeader>
      
      <StatsContainer>
        <StatCard 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <StatTitle>Total Projects</StatTitle>
          <StatValue>{projects.length}</StatValue>
        </StatCard>
        
        <StatCard 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <StatTitle>Categories</StatTitle>
          <StatValue>{categories.length}</StatValue>
        </StatCard>
        
        <StatCard 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <StatTitle>Messages</StatTitle>
          <StatValue>{messages.length}</StatValue>
        </StatCard>
        
        <StatCard 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <StatTitle>Unread Messages</StatTitle>
          <StatValue>{unreadMessages.length}</StatValue>
        </StatCard>
      </StatsContainer>
      
      <SectionTitle>Recent Projects</SectionTitle>
      {recentProjects.length > 0 ? (
        <ProjectsGrid>
          {recentProjects.map((project, index) => (
            <ProjectCard 
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <ProjectImage image={project.thumbnail}>
                {!project.thumbnail && 'No Image Available'}
              </ProjectImage>
              <ProjectDetails>
                <ProjectTitle>{project.title}</ProjectTitle>
                <ProjectCategory>
                  {project.category?.name || 'Uncategorized'}
                </ProjectCategory>
                <ProjectDate>
                  Created: {formatDate(project.created_at)}
                </ProjectDate>
                <ProjectActions>
                  <EditButton to={`/admin/projects/edit/${project.id}`}>
                    Edit
                  </EditButton>
                </ProjectActions>
              </ProjectDetails>
            </ProjectCard>
          ))}
        </ProjectsGrid>
      ) : (
        <EmptyState>No projects yet. Create your first project!</EmptyState>
      )}
      
      <SectionTitle>Recent Messages</SectionTitle>
      {recentMessages.length > 0 ? (
        <MessagesList>
          {recentMessages.map((message, index) => (
            <MessageItem 
              key={message.id}
              to="/admin/messages"
              unread={!message.read}
            >
              <MessageSender>
                {message.name}
                <MessageDate>{formatDate(message.created_at)}</MessageDate>
              </MessageSender>
              <MessagePreview>{message.message}</MessagePreview>
            </MessageItem>
          ))}
        </MessagesList>
      ) : (
        <EmptyState>No messages yet.</EmptyState>
      )}
    </DashboardContainer>
  );
};

export default Dashboard;