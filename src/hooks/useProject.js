// src/hooks/useProject.js
import { useState, useEffect } from 'react';

export const useProject = (projectId) => {
  const [project, setProject] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        // Hämta projektdata från sessionStorage eller config
        const storedProjects = sessionStorage.getItem('allProjects');
        let allProjects = [];
        
        if (storedProjects) {
          allProjects = JSON.parse(storedProjects);
        } else {
          // Försök ladda från config om sessionStorage är tom
          const response = await fetch('/projects.json');
          if (response.ok) {
            allProjects = await response.json();
            sessionStorage.setItem('allProjects', JSON.stringify(allProjects));
          }
        }
        
        // Hitta specifikt projekt
        const foundProject = allProjects.find(p => p.id === projectId);
        
        if (!foundProject) {
          throw new Error(`Project "${projectId}" not found`);
        }
        
        setProject(foundProject);
        
        // Använd bildlistan från config om den finns
        if (foundProject.images && Array.isArray(foundProject.images)) {
          setImages(foundProject.images);
        } else {
          // Fallback till bara main.jpg
          setImages(['main.jpg']);
        }
      } catch (err) {
        console.error('Error fetching project:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  return { project, images, loading, error };
};