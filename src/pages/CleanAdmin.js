import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, deleteDoc, doc, updateDoc, addDoc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, storage } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

// Main Container
const AdminContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f5f5f5;
`;

// Sidebar
const Sidebar = styled.aside`
  width: 250px;
  background: #1a1a1a;
  color: white;
  padding: 2rem 0;
  position: fixed;
  height: 100vh;
  left: 0;
  top: 0;
  overflow-y: auto;

  @media (max-width: 768px) {
    transform: translateX(${props => props.$isOpen ? '0' : '-100%'});
    transition: transform 0.3s ease;
    z-index: 100;
  }
`;

const Logo = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 2rem;
  color: #4a90e2;
`;

const NavItem = styled(Link)`
  display: block;
  padding: 1rem 2rem;
  color: white;
  text-decoration: none;
  transition: background 0.3s ease;

  &:hover {
    background: rgba(74, 144, 226, 0.1);
  }

  ${props => props.$active && `
    background: rgba(74, 144, 226, 0.2);
    border-left: 3px solid #4a90e2;
  `}
`;

const LogoutButton = styled.button`
  width: calc(100% - 4rem);
  margin: 2rem;
  padding: 1rem;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s ease;

  &:hover {
    background: #c0392b;
  }
`;

// Main Content
const MainContent = styled.main`
  flex: 1;
  margin-left: 250px;
  padding: 2rem;

  @media (max-width: 768px) {
    margin-left: 0;
    padding: 1rem;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 101;
  background: #1a1a1a;
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 5px;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #333;
`;

// Dashboard Component
const Dashboard = () => {
  const [stats, setStats] = useState({
    projects: 0,
    categories: 0,
    reviews: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const projectsSnap = await getDocs(collection(db, 'projects'));
      const categoriesSnap = await getDocs(collection(db, 'categories'));
      const reviewsSnap = await getDocs(collection(db, 'reviews'));

      setStats({
        projects: projectsSnap.size,
        categories: categoriesSnap.size,
        reviews: reviewsSnap.size
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div>
      <PageTitle>Dashboard</PageTitle>
      <StatsGrid>
        <StatCard>
          <h2>{stats.projects}</h2>
          <p>Projekt</p>
        </StatCard>
        <StatCard>
          <h2>{stats.categories}</h2>
          <p>Kategorier</p>
        </StatCard>
        <StatCard>
          <h2>{stats.reviews}</h2>
          <p>Recensioner</p>
        </StatCard>
      </StatsGrid>
    </div>
  );
};

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);

  h2 {
    font-size: 3rem;
    color: #4a90e2;
    margin-bottom: 0.5rem;
  }

  p {
    color: #666;
    text-transform: uppercase;
    font-size: 0.9rem;
  }
`;

// Projects Manager
const ProjectsManager = () => {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '',
    github: '',
    demo: '',
    displayOrder: 0,
    categoryId: '',
    type: 'WEB DESIGN'
  });
  const [uploading, setUploading] = useState(false);
  const [mediaFiles, setMediaFiles] = useState([]);

  useEffect(() => {
    fetchProjects();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'categories'));
      const categoriesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'projects'));
      const projectsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProjects(projectsData.sort((a, b) => b.displayOrder - a.displayOrder));
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const projectData = {
        ...formData,
        technologies: formData.technologies.split(',').map(t => t.trim()),
        media: mediaFiles,
        updatedAt: new Date().toISOString()
      };

      if (editingProject) {
        await updateDoc(doc(db, 'projects', editingProject.id), projectData);
      } else {
        projectData.createdAt = new Date().toISOString();
        await addDoc(collection(db, 'projects'), projectData);
      }

      setShowForm(false);
      setEditingProject(null);
      setFormData({
        title: '',
        description: '',
        technologies: '',
        github: '',
        demo: '',
        displayOrder: 0,
        categoryId: '',
        type: 'WEB DESIGN'
      });
      setMediaFiles([]);
      fetchProjects();
    } catch (error) {
      console.error('Error saving project:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (projectId) => {
    if (window.confirm('Vill du verkligen ta bort detta projekt?')) {
      try {
        await deleteDoc(doc(db, 'projects', projectId));
        fetchProjects();
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title || '',
      description: project.description || '',
      technologies: project.technologies?.join(', ') || '',
      github: project.github || '',
      demo: project.demo || '',
      displayOrder: project.displayOrder || 0,
      categoryId: project.categoryId || '',
      type: project.type || 'WEB DESIGN'
    });
    setMediaFiles(project.media || []);
    setShowForm(true);
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);

    try {
      const uploadedFiles = await Promise.all(
        files.map(async (file) => {
          try {
            // Add unique prefix to avoid naming conflicts
            const timestamp = Date.now();
            const randomId = Math.random().toString(36).substr(2, 9);
            const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
            const fileName = `${timestamp}_${randomId}_${sanitizedFileName}`;

            const storageRef = ref(storage, `projects/${fileName}`);

            // Add metadata to help with CORS handling
            const metadata = {
              contentType: file.type,
              customMetadata: {
                'uploadedBy': 'admin',
                'uploadedAt': new Date().toISOString()
              }
            };

            console.log(`Uploading ${file.name} to Firebase Storage...`);
            const snapshot = await uploadBytes(storageRef, file, metadata);
            const url = await getDownloadURL(snapshot.ref);

            return {
              url,
              type: file.type.startsWith('image/') ? 'image' : 'video',
              name: file.name,
              storagePath: snapshot.ref.fullPath
            };
          } catch (uploadError) {
            console.error(`Error uploading ${file.name}:`, uploadError);

            // For CORS errors, fall back to base64 encoding for both images and videos
            const maxSize = file.type.startsWith('video/') ? 15 * 1024 * 1024 : 5 * 1024 * 1024; // 15MB för video, 5MB för bilder

            if (file.size < maxSize) {
              try {
                const reader = new FileReader();
                const base64Url = await new Promise((resolve, reject) => {
                  reader.onload = (e) => resolve(e.target.result);
                  reader.onerror = reject;
                  reader.readAsDataURL(file);
                });

                console.log(`Fallback: Sparar ${file.name} lokalt (${(file.size / 1024 / 1024).toFixed(1)}MB)`);
                return {
                  url: base64Url,
                  type: file.type.startsWith('image/') ? 'image' : 'video',
                  name: file.name,
                  fallback: true
                };
              } catch (base64Error) {
                console.error(`Base64 fallback failed for ${file.name}:`, base64Error);
                alert(`Kunde inte spara ${file.name}. Använd "Lägg till video via URL" istället.`);
                return null;
              }
            } else {
              alert(`${file.name} är för stor (${(file.size / 1024 / 1024).toFixed(1)}MB). Max storlek är ${(maxSize / 1024 / 1024).toFixed(0)}MB. Använd "Lägg till video via URL" för stora videor.`);
              return null;
            }
          }
        })
      );

      setMediaFiles([...mediaFiles, ...uploadedFiles]);
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Error uploading files. Please check the console for details.');
    } finally {
      setUploading(false);
    }
  };

  const removeMedia = (index) => {
    setMediaFiles(mediaFiles.filter((_, i) => i !== index));
  };

  const addMediaUrl = () => {
    const url = prompt('Ange URL till video (t.ex. YouTube, Vimeo, eller direkt video-URL):');
    if (url) {
      // Automatically detect if it's a video based on URL
      const isVideo = url.includes('youtube') || url.includes('youtu.be') ||
                     url.includes('vimeo') || url.includes('.mp4') ||
                     url.includes('.webm') || url.includes('.mov') ||
                     url.includes('video');

      // Extract platform name for display
      let platform = 'Extern media';
      if (url.includes('vimeo')) platform = 'Vimeo';
      else if (url.includes('youtube') || url.includes('youtu.be')) platform = 'YouTube';

      setMediaFiles([
        ...mediaFiles,
        {
          url: url,
          type: isVideo ? 'video' : 'image',
          name: platform,
          external: true
        }
      ]);
    }
  };

  return (
    <div>
      <PageTitle>Projekt</PageTitle>
      <Button onClick={() => setShowForm(true)}>Lägg till projekt</Button>

      {showForm && (
        <FormOverlay>
          <FormContainer>
            <h2>{editingProject ? 'Redigera projekt' : 'Nytt projekt'}</h2>
            <Form onSubmit={handleSubmit}>
              <Input
                type="text"
                placeholder="Titel"
                value={formData.title || ''}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />
              <Textarea
                placeholder="Beskrivning"
                value={formData.description || ''}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
                rows="4"
              />
              <Input
                type="text"
                placeholder="Teknologier (separera med komma)"
                value={formData.technologies || ''}
                onChange={(e) => setFormData({...formData, technologies: e.target.value})}
              />
              <Input
                type="url"
                placeholder="GitHub URL"
                value={formData.github || ''}
                onChange={(e) => setFormData({...formData, github: e.target.value})}
              />
              <Input
                type="url"
                placeholder="Demo URL"
                value={formData.demo || ''}
                onChange={(e) => setFormData({...formData, demo: e.target.value})}
              />
              <Input
                type="number"
                placeholder="Visningsordning"
                value={formData.displayOrder || ''}
                onChange={(e) => setFormData({...formData, displayOrder: parseInt(e.target.value) || 0})}
              />

              <Label>Kategori</Label>
              <Select
                value={formData.categoryId || ''}
                onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
              >
                <option value="">Välj kategori</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </Select>

              <Label>Typ</Label>
              <Select
                value={formData.type || ''}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
              >
                <option value="WEB DESIGN">Web Design</option>
                <option value="MOBILE APP">Mobile App</option>
                <option value="BRANDING">Branding</option>
                <option value="UI/UX">UI/UX</option>
              </Select>

              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'stretch' }}>
                <FileUpload style={{ flex: 1 }}>
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                  />
                  <p>{uploading ? 'Laddar upp...' : 'Välj filer'}</p>
                </FileUpload>
                <Button type="button" onClick={addMediaUrl} style={{ padding: '1rem', height: 'auto' }}>
                  Lägg till video via URL
                </Button>
              </div>

              {mediaFiles.length > 0 && (
                <MediaPreview>
                  {mediaFiles.map((media, index) => (
                    <MediaItem key={index}>
                      {media.type === 'image' ? (
                        <img src={media.url} alt="" />
                      ) : (
                        <video src={media.url} controls />
                      )}
                      <RemoveButton type="button" onClick={() => removeMedia(index)}>X</RemoveButton>
                    </MediaItem>
                  ))}
                </MediaPreview>
              )}

              <ButtonGroup>
                <Button type="submit" disabled={uploading}>
                  {editingProject ? 'Uppdatera' : 'Skapa'}
                </Button>
                <Button type="button" onClick={() => {
                  setShowForm(false);
                  setEditingProject(null);
                  setMediaFiles([]);
                }}>
                  Avbryt
                </Button>
              </ButtonGroup>
            </Form>
          </FormContainer>
        </FormOverlay>
      )}

      <ProjectsGrid>
        {projects.map(project => (
          <ProjectCard key={project.id}>
            {project.media?.[0] && (
              <ProjectImage src={project.media[0].url} alt={project.title} />
            )}
            <ProjectContent>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <ProjectActions>
                <EditButton onClick={() => handleEdit(project)}>Redigera</EditButton>
                <DeleteButton onClick={() => handleDelete(project.id)}>Ta bort</DeleteButton>
              </ProjectActions>
            </ProjectContent>
          </ProjectCard>
        ))}
      </ProjectsGrid>
    </div>
  );
};

// Categories Manager
const CategoriesManager = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'categories'));
      const categoriesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;

    setLoading(true);
    try {
      await addDoc(collection(db, 'categories'), {
        name: newCategory,
        createdAt: new Date()
      });
      setNewCategory('');
      fetchCategories();
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Fel vid tillägg av kategori');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCategory = async (id, newName) => {
    if (!newName.trim()) return;

    try {
      await updateDoc(doc(db, 'categories', id), {
        name: newName,
        updatedAt: new Date()
      });
      setEditingCategory(null);
      fetchCategories();
    } catch (error) {
      console.error('Error updating category:', error);
      alert('Fel vid uppdatering av kategori');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Är du säker på att du vill ta bort denna kategori?')) return;

    try {
      await deleteDoc(doc(db, 'categories', id));
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Fel vid borttagning av kategori');
    }
  };

  return (
    <div>
      <PageTitle>Kategorier</PageTitle>

      <Form onSubmit={(e) => { e.preventDefault(); handleAddCategory(); }}>
        <SectionTitle>Lägg till ny kategori</SectionTitle>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <Input
            type="text"
            placeholder="Kategorinamn (t.ex. Web Design, Mobile App)"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            style={{ flex: 1, marginBottom: 0 }}
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Lägger till...' : 'Lägg till'}
          </Button>
        </div>
      </Form>

      <Form as="div" style={{ marginTop: '2rem' }}>
        <SectionTitle>Befintliga kategorier</SectionTitle>
        {categories.length === 0 ? (
          <p style={{ color: '#666', textAlign: 'center' }}>Inga kategorier ännu</p>
        ) : (
          <div>
            {categories.map(category => (
              <div key={category.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem',
                background: '#f9f9f9',
                borderRadius: '8px',
                marginBottom: '0.5rem'
              }}>
                {editingCategory === category.id ? (
                  <>
                    <Input
                      type="text"
                      defaultValue={category.name}
                      onBlur={(e) => handleUpdateCategory(category.id, e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleUpdateCategory(category.id, e.target.value);
                        }
                      }}
                      style={{ flex: 1, marginBottom: 0 }}
                      autoFocus
                    />
                    <Button
                      type="button"
                      onClick={() => setEditingCategory(null)}
                      style={{ background: '#666' }}
                    >
                      Avbryt
                    </Button>
                  </>
                ) : (
                  <>
                    <span style={{ flex: 1, fontSize: '1.1rem' }}>{category.name}</span>
                    <Button
                      type="button"
                      onClick={() => setEditingCategory(category.id)}
                      style={{ background: '#4a90e2' }}
                    >
                      Redigera
                    </Button>
                    <Button
                      type="button"
                      onClick={() => handleDeleteCategory(category.id)}
                      style={{ background: '#e74c3c' }}
                    >
                      Ta bort
                    </Button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </Form>
    </div>
  );
};

// About Me Section
const AboutMeManager = () => {
  const [aboutData, setAboutData] = useState({
    name: '',
    title: '',
    description: '',
    yearsExperience: '',
    projectsCompleted: '',
    happyClients: '',
    skills: [],
    profileImage: ''
  });
  const [newSkill, setNewSkill] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const docRef = doc(db, 'about', 'info');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setAboutData({
          ...docSnap.data(),
          skills: docSnap.data().skills || []
        });
      }
    } catch (error) {
      console.error('Error fetching about data:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await setDoc(doc(db, 'about', 'info'), {
        ...aboutData,
        updatedAt: new Date().toISOString()
      });
      alert('Om mig uppdaterad!');
    } catch (error) {
      console.error('Error updating about data:', error);
      alert('Fel vid uppdatering');
    } finally {
      setLoading(false);
    }
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setAboutData({
        ...aboutData,
        skills: [...aboutData.skills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const removeSkill = (index) => {
    setAboutData({
      ...aboutData,
      skills: aboutData.skills.filter((_, i) => i !== index)
    });
  };

  return (
    <div>
      <PageTitle>Om Mig</PageTitle>
      <Form onSubmit={handleSubmit}>
        <Label>Namn</Label>
        <Input
          type="text"
          placeholder="David Rajala"
          value={aboutData.name || ''}
          onChange={(e) => setAboutData({...aboutData, name: e.target.value})}
        />

        <Label>Titel/Roll</Label>
        <Input
          type="text"
          placeholder="Full Stack Developer"
          value={aboutData.title || ''}
          onChange={(e) => setAboutData({...aboutData, title: e.target.value})}
        />

        <Label>Profilbild URL</Label>
        <Input
          type="url"
          placeholder="https://example.com/profile.jpg"
          value={aboutData.profileImage || ''}
          onChange={(e) => setAboutData({...aboutData, profileImage: e.target.value})}
        />
        {aboutData.profileImage && (
          <div style={{ marginTop: '10px', marginBottom: '10px' }}>
            <img
              src={aboutData.profileImage}
              alt="Profile preview"
              style={{
                width: '150px',
                height: '150px',
                objectFit: 'cover',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}

        <Label>Beskrivning</Label>
        <Textarea
          placeholder="Berätta om dig själv..."
          value={aboutData.description || ''}
          onChange={(e) => setAboutData({...aboutData, description: e.target.value})}
          rows="6"
        />

        <SectionTitle>Statistik</SectionTitle>

        <StatsRow>
          <StatInput>
            <Label>År av erfarenhet</Label>
            <Input
              type="number"
              placeholder="5"
              value={aboutData.yearsExperience || ''}
              onChange={(e) => setAboutData({...aboutData, yearsExperience: e.target.value})}
            />
          </StatInput>

          <StatInput>
            <Label>Slutförda projekt</Label>
            <Input
              type="number"
              placeholder="50"
              value={aboutData.projectsCompleted || ''}
              onChange={(e) => setAboutData({...aboutData, projectsCompleted: e.target.value})}
            />
          </StatInput>

          <StatInput>
            <Label>Nöjda kunder</Label>
            <Input
              type="number"
              placeholder="30"
              value={aboutData.happyClients || ''}
              onChange={(e) => setAboutData({...aboutData, happyClients: e.target.value})}
            />
          </StatInput>
        </StatsRow>

        <SectionTitle>Färdigheter</SectionTitle>

        <SkillInputRow>
          <Input
            type="text"
            placeholder="Lägg till färdighet (t.ex. React, Node.js)"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
          />
          <AddButton type="button" onClick={addSkill}>+</AddButton>
        </SkillInputRow>

        <SkillsList>
          {aboutData.skills.map((skill, index) => (
            <SkillTag key={index}>
              {skill}
              <RemoveSkill onClick={() => removeSkill(index)}>×</RemoveSkill>
            </SkillTag>
          ))}
        </SkillsList>

        <Button type="submit" disabled={loading}>
          {loading ? 'Sparar...' : 'Spara ändringar'}
        </Button>
      </Form>
    </div>
  );
};

// Styled Components
const Form = styled.form`
  max-width: 600px;
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #4a90e2;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  background: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #4a90e2;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #4a90e2;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
`;

const SectionTitle = styled.h3`
  font-size: 1.2rem;
  color: #333;
  margin: 2rem 0 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e0e0e0;
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatInput = styled.div`
  flex: 1;
`;

const SkillInputRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const AddButton = styled.button`
  padding: 1rem;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1.5rem;
  cursor: pointer;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #357abd;
  }
`;

const SkillsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 2rem;
`;

const SkillTag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #f0f0f0;
  border-radius: 20px;
  font-size: 0.9rem;
`;

const RemoveSkill = styled.button`
  background: none;
  border: none;
  color: #e74c3c;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;

  &:hover {
    color: #c0392b;
  }
`;

const Button = styled.button`
  padding: 1rem 2rem;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #357abd;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const ProjectCard = styled.div`
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
`;

const ProjectImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const ProjectContent = styled.div`
  padding: 1.5rem;

  h3 {
    margin-bottom: 0.5rem;
    color: #333;
  }

  p {
    color: #666;
    margin-bottom: 1rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

const ProjectActions = styled.div`
  display: flex;
  gap: 1rem;
`;

const EditButton = styled.button`
  padding: 0.5rem 1rem;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background: #357abd;
  }
`;

const DeleteButton = styled.button`
  padding: 0.5rem 1rem;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background: #c0392b;
  }
`;

const FormOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const FormContainer = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 10px;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;

  h2 {
    margin-bottom: 1.5rem;
    color: #333;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;

const FileUpload = styled.label`
  display: block;
  padding: 1rem;
  border: 2px dashed #ddd;
  border-radius: 5px;
  text-align: center;
  cursor: pointer;
  margin-bottom: 1rem;

  input {
    display: none;
  }

  &:hover {
    border-color: #4a90e2;
  }
`;

const MediaPreview = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`;

const MediaItem = styled.div`
  position: relative;

  img, video {
    width: 100%;
    height: 100px;
    object-fit: cover;
    border-radius: 5px;
  }
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 50%;
  width: 25px;
  height: 25px;
  cursor: pointer;
`;

// Main Component
const CleanAdmin = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      if (!user) {
        navigate('/admin-login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return <LoadingScreen>Laddar...</LoadingScreen>;
  }

  if (!user) {
    navigate('/admin-login');
    return null;
  }

  const isActive = (path) => location.pathname === path;

  return (
    <AdminContainer>
      <MobileMenuButton onClick={() => setSidebarOpen(!sidebarOpen)}>
        ☰
      </MobileMenuButton>

      <Sidebar $isOpen={sidebarOpen}>
        <Logo>Admin Panel</Logo>

        <NavItem to="/admin" $active={isActive('/admin')} onClick={() => setSidebarOpen(false)}>
          Dashboard
        </NavItem>
        <NavItem to="/admin/projects" $active={isActive('/admin/projects')} onClick={() => setSidebarOpen(false)}>
          Projekt
        </NavItem>
        <NavItem to="/admin/categories" $active={isActive('/admin/categories')} onClick={() => setSidebarOpen(false)}>
          Kategorier
        </NavItem>
        <NavItem to="/admin/about" $active={isActive('/admin/about')} onClick={() => setSidebarOpen(false)}>
          Om Mig
        </NavItem>

        <LogoutButton onClick={handleLogout}>
          Logga ut
        </LogoutButton>
      </Sidebar>

      <MainContent>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/projects" element={<ProjectsManager />} />
          <Route path="/categories" element={<CategoriesManager />} />
          <Route path="/about" element={<AboutMeManager />} />
        </Routes>
      </MainContent>
    </AdminContainer>
  );
};

const LoadingScreen = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-size: 1.5rem;
  color: #666;
`;

export default CleanAdmin;