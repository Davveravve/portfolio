// src/hooks/useProjectTypes.js
import { useState, useEffect } from 'react';

export const useProjectTypes = () => {
  const [projectTypes, setProjectTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjectTypes = async () => {
      try {
        setLoading(true);
        
        // I en riktig implementering skulle detta vara ett API-anrop
        // För utvecklingsändamål simulerar vi detta beteende
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Simulera hämtning av alla projekt från filsystemet
        // Detta är vad en verklig backend skulle göra
        const mockFetchAllProjects = async () => {
          // Detta skulle normalt läsa projektmappar från filsystemet
          // och parsa info.json-filer
          return [
            {
              id: 'GameProject1',
              info: { type: 'Game', description: '...', technologies: ['Unity', 'C#'] }
            },
            {
              id: 'WebsiteProject1',
              info: { type: 'Website', description: '...', technologies: ['React', 'CSS'] }
            },
            {
              id: 'Axento',
              info: { 
                type: 'Axento', 
                description: 'Ett litet sidoprojekt jag hade för att underlätta hantering av material i min servicebil.',
                technologies: ['Javascript', 'React', 'Supabase', 'Vercel']
              }
            }
            // När du lägger till nya projekt i filsystemet, 
            // skulle backend-API:et automatiskt hitta dem här
          ];
        };
        
        // Hämta alla projekt och extrahera unika typer
        const allProjects = await mockFetchAllProjects();
        const uniqueTypes = [...new Set(allProjects.map(project => project.info.type))];
        setProjectTypes(uniqueTypes);
        
        // Spara alla projekt i sessionStorage så att useProjects.js kan använda dem
        // Detta simulerar en gemensam datakälla för båda hooks
        sessionStorage.setItem('allProjects', JSON.stringify(allProjects));
        
      } catch (err) {
        console.error('Error fetching project types:', err);
        setError(err.message);
        setProjectTypes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectTypes();
  }, []);

  return { projectTypes, loading, error };
};