// src/hooks/useProjects.js
import { useState, useEffect } from 'react';

export const useProjects = (type) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!type) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        // Simulera ett API-anrop för att hämta projekt av en specifik typ
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Hämta lagrade projekt från sessionStorage (som satts i useProjectTypes)
        const storedProjects = sessionStorage.getItem('allProjects');
        let allProjects = [];
        
        if (storedProjects) {
          // Om det finns projekt lagrade, använd dem
          allProjects = JSON.parse(storedProjects);
        } else {
          // Annars, simulera hämtning av alla projekt (backup)
          allProjects = [
            {
              id: 'GameProject1',
              info: { 
                type: 'Game', 
                description: 'A sample game project',
                technologies: ['Unity', 'C#', 'Blender'],
                links: [
                  { title: 'GitHub', url: 'https://github.com' },
                  { title: 'Play Game', url: 'https://example.com' }
                ]
              }
            },
            {
              id: 'WebsiteProject1',
              info: { 
                type: 'Website', 
                description: 'A sample website project',
                technologies: ['React', 'CSS', 'Firebase'],
                links: [
                  { title: 'GitHub', url: 'https://github.com' },
                  { title: 'Live Site', url: 'https://example.com' }
                ]
              }
            },
            {
              id: 'Axento',
              info: { 
                type: 'Axento', 
                description: 'Ett litet sidoprojekt jag hade för att underlätta hantering av material i min servicebil.',
                technologies: ['Javascript', 'React', 'Supabase', 'Vercel'],
                links: [
                  { title: 'GitHub Repository', url: 'https://github.com/yourusername/projectname' },
                  { title: 'Live Demo', url: 'https://www.axento.se' }
                ]
              }
            }
          ];
        }
        
        // Filtrera projekt baserat på typ (icke skiftlägeskänslig)
        const filteredProjects = allProjects.filter(project => {
          const projectType = project.info.type.toLowerCase();
          const searchType = type.toLowerCase();
          
          // Matcha både singular och plural versioner
          // t.ex. om typ är "websites" matchar det ett projekt med typ "website"
          return projectType === searchType || 
                 projectType + 's' === searchType || 
                 projectType === searchType + 's';
        });
        
        console.log(`Hittade ${filteredProjects.length} projekt av typen "${type}"`);
        setProjects(filteredProjects);
        
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [type]);

  return { projects, loading, error };
};