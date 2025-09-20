// src/pages/Admin.js
import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import useAuth from '../hooks/useAuth';
import ProjectsDashboard from '../components/Admin/ProjectsDashboard';
import EnhancedProjectForm from '../components/Admin/EnhancedProjectForm';
import EnhancedCategoryForm from '../components/Admin/EnhancedCategoryForm';
import MessageListFirebase from '../components/Admin/MessageListFirebase';
import SettingsPage from '../components/Admin/SettingsPage';
import Login from '../components/Admin/Login';
import AboutEditor from '../components/Admin/AboutEditor';
import ReviewManager from '../components/Admin/ReviewManager';



const AdminContainer = styled.div`
display: flex;
flex-direction: column;
min-height: 100vh;
`;

const AdminHeader = styled.header`
background-color: var(--dark-color);
color: white;
padding: 1rem 2rem;
display: flex;
justify-content: space-between;
align-items: center;
`;

const AdminTitle = styled.h1`
font-size: 1.5rem;
margin: 0;
`;

const LogoutButton = styled.button`
background-color: transparent;
color: white;
border: 1px solid white;
padding: 0.5rem 1rem;
border-radius: 4px;
cursor: pointer;
transition: var(--transition);

&:hover {
    background-color: rgba(255, 255, 255, 0.1);
}
`;

const AdminContent = styled.main`
padding: 2rem;
flex-grow: 1;
background-color: #f8fafc;
`;

const Admin = () => {
    const { user, loading, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    
    useEffect(() => {
        // Redirect to login if not authenticated
        if (!loading && !isAuthenticated) {
        navigate('/admin/login');
        }
    }, [loading, isAuthenticated, navigate]);
    
    const handleLogout = async () => {
        try {
        await logout();
        navigate('/admin/login');
        } catch (error) {
        console.error('Logout failed:', error);
        }
    };
    
    // Protected route component
    const ProtectedRoute = ({ children }) => {
        if (loading) return <div>Loading...</div>;
        return isAuthenticated ? children : <Navigate to="/admin/login" />;
    };
    
    return (
        <Routes>
            <Route path="login" element={<Login />} />
            <Route path="/" element={
                <ProtectedRoute>
                <ProjectsDashboard />
                </ProtectedRoute>
            } />
            <Route path="projects/new" element={
                <ProtectedRoute>
                <EnhancedProjectForm />
                </ProtectedRoute>
            } />
            <Route path="projects/edit/:id" element={
                <ProtectedRoute>
                <EnhancedProjectForm />
                </ProtectedRoute>
            } />
            <Route path="categories" element={
                <ProtectedRoute>
                <EnhancedCategoryForm />
                </ProtectedRoute>
            } />
            <Route path="messages" element={
                <ProtectedRoute>
                <MessageListFirebase />
                </ProtectedRoute>
            } />
            <Route path="settings" element={
                <ProtectedRoute>
                <SettingsPage />
                </ProtectedRoute>
            } />
            <Route path="about" element={
                <ProtectedRoute>
                <AboutEditor />
                </ProtectedRoute>
            } />
            <Route path="reviews" element={
                <ProtectedRoute>
                <ReviewManager />
                </ProtectedRoute>
            } />
        </Routes>
    );
    };

export default Admin;