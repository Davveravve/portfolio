import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { LanguageProvider } from './context/LanguageContext';
import Home from './pages/PortfolioDesign';
import Admin from './pages/Admin';
import ProjectView from './components/ProjectView';
import ReviewForm from './pages/ReviewForm';
import './styles/global.css';
import './styles/animations.css';

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/project/:id" element={<ProjectView />} />
            <Route path="/review" element={<ReviewForm />} />
            <Route path="/admin/*" element={<Admin />} />
          </Routes>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;