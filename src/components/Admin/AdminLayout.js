import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import useAuth from '../../hooks/useAuth';

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f8fafc;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Sidebar = styled.div`
  width: 280px;
  background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
  color: white;
  display: flex;
  flex-direction: column;
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.1);
  position: fixed;
  height: 100vh;
  z-index: 1000;

  @media (max-width: 768px) {
    width: 100%;
    height: auto;
    position: relative;
  }
`;

const UserSection = styled.div`
  padding: 2rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;

  @media (max-width: 768px) {
    padding: 1rem;
    border-bottom: none;
    border-right: 1px solid rgba(255, 255, 255, 0.1);
    flex-shrink: 0;
  }
`;

const UserName = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  color: white;
`;

const UserRole = styled.p`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const Navigation = styled.nav`
  flex: 1;
  padding: 1rem 0;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: row;
    overflow-x: auto;
    padding: 0.5rem 0;
    gap: 0.5rem;
  }
`;

const NavItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.5rem;
  color: ${props => props.$active ? '#ef4444' : 'rgba(255, 255, 255, 0.8)'};
  text-decoration: none;
  transition: all 0.2s ease;
  position: relative;
  font-weight: ${props => props.$active ? '600' : '500'};
  white-space: nowrap;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: white;
  }

  ${props => props.$active && `
    background: rgba(239, 68, 68, 0.1);
    border-right: 3px solid #ef4444;
  `}

  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    min-width: fit-content;
    border-right: none;
    border-radius: 6px;
    margin: 0 0.25rem;

    ${props => props.$active && `
      background: rgba(239, 68, 68, 0.2);
      border-right: none;
      border: 2px solid #ef4444;
    `}
  }
`;

const NavIcon = styled.span`
  font-size: 1.125rem;
  width: 20px;
  text-align: center;
`;

const HomeSection = styled.div`
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: 768px) {
    padding: 1rem;
    border-top: none;
    border-left: 1px solid rgba(255, 255, 255, 0.1);
    flex-shrink: 0;
  }
`;

const HomeButton = styled(motion.button)`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(59, 130, 246, 0.2);
    border-color: rgba(59, 130, 246, 0.5);
  }
`;

const MainContent = styled.div`
  flex: 1;
  margin-left: 280px;
  padding: 2rem;
  min-height: 100vh;

  @media (max-width: 768px) {
    margin-left: 0;
    padding: 1rem;
  }
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.5rem 0;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const PageSubtitle = styled.p`
  color: #64748b;
  margin: 0;
  font-size: 1rem;
`;

const navItems = [
  { path: '/admin', label: 'Projects', icon: '▣', exact: true },
  { path: '/admin/categories', label: 'Categories', icon: '▤', },
  { path: '/admin/messages', label: 'Messages', icon: '⌂', },
  { path: '/admin/reviews', label: 'Reviews', icon: '★', },
  { path: '/admin/settings', label: 'Settings', icon: '◈', },
  { path: '/admin/about', label: 'About Me', icon: '◯', },
];

const AdminLayout = ({ children, title, subtitle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleGoHome = () => {
    navigate('/');
  };

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <LayoutContainer>
      <Sidebar>
        <UserSection>
          <UserName>David Rajala</UserName>
          <UserRole>Admin</UserRole>
        </UserSection>

        <Navigation>
          {navItems.map((item) => (
            <NavItem
              key={item.path}
              to={item.path}
              $active={isActive(item.path, item.exact)}
            >
              <NavIcon>{item.icon}</NavIcon>
              {item.label}
            </NavItem>
          ))}
        </Navigation>

        <HomeSection>
          <HomeButton
            onClick={handleGoHome}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <NavIcon>🏠</NavIcon>
            Hem
          </HomeButton>
        </HomeSection>
      </Sidebar>

      <MainContent>
        <PageHeader>
          <PageTitle>{title}</PageTitle>
          {subtitle && <PageSubtitle>{subtitle}</PageSubtitle>}
        </PageHeader>
        {children}
      </MainContent>
    </LayoutContainer>
  );
};

export default AdminLayout;