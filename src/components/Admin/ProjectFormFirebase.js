import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../../config/firebase';
import useNotification from '../../hooks/useNotification';
import Notifications from '../Notifications';

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  font-size: 2rem;
  color: var(--dark-color);
  margin: 0;
`;

const BackButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #6b7280;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: var(--transition);

  &:hover {
    background-color: #4b5563;
  }
`;

const Form = styled.form`
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--dark-color);
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;
  transition: var(--transition);

  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.2);
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
  transition: var(--transition);

  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.2);
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;
  transition: var(--transition);

  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.2);
  }
`;

const MediaSection = styled.div`
  border-top: 1px solid #e2e8f0;
  padding-top: 1.5rem;
`;

const MediaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const MediaItem = styled.div`
  position: relative;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  overflow: hidden;
`;

const MediaPreview = styled.div`
  width: 100%;
  height: 150px;
  background-image: ${props => props.src ? `url(${props.src})` : 'none'};
  background-size: cover;
  background-position: center;
  background-color: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  font-size: 0.875rem;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background-color: rgba(239, 68, 68, 0.9);
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: rgba(239, 68, 68, 1);
  }
`;

const FileInput = styled.input`
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;
  transition: var(--transition);

  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.2);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  border-top: 1px solid #e2e8f0;
  padding-top: 1.5rem;
`;

const SaveButton = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);

  &:hover {
    background-color: #5A52D5;
  }

  &:disabled {
    background-color: #CBD5E0;
    cursor: not-allowed;
  }
`;

const DeleteButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #dc2626;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);

  &:hover {
    background-color: #b91c1c;
  }
`;

const CancelButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #6b7280;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);

  &:hover {
    background-color: #4b5563;
  }
`;

const ErrorMessage = styled.div`
  background-color: #FED7D7;
  color: #9B2C2C;
  padding: 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
`;

const SuccessMessage = styled.div`
  background-color: #C6F6D5;
  color: #2D7D32;
  padding: 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
`;

const ProjectForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const { notifications, success, error, setNotifications } = useNotification();

  const [formData, setFormData] = useState({
    title_sv: '',
    title_en: '',
    description_sv: '',
    description_en: '',
    categoryId: '',
    technologies: '',
    githubUrl: '',
    liveUrl: '',
  });

  const [categories, setCategories] = useState([]);
  const [media, setMedia] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCategories();
    if (isEditing) {
      fetchProject();
    } else {
      setLoading(false);
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const categoriesQuery = query(collection(db, 'categories'), orderBy('displayOrder'));
      const snapshot = await getDocs(categoriesQuery);
      const categoriesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCategories(categoriesData);
    } catch (err) {
      console.error('Error fetching categories:', err);
      error('Failed to load categories');
    }
  };

  const fetchProject = async () => {
    try {
      const projectDoc = await getDoc(doc(db, 'projects', id));
      if (projectDoc.exists()) {
        const projectData = projectDoc.data();
        setFormData({
          title_sv: projectData.title_sv || projectData.title || '',
          title_en: projectData.title_en || projectData.title || '',
          description_sv: projectData.description_sv || projectData.description || '',
          description_en: projectData.description_en || projectData.description || '',
          categoryId: projectData.categoryId || '',
          technologies: Array.isArray(projectData.technologies)
            ? projectData.technologies.join(', ')
            : projectData.technologies || '',
          githubUrl: projectData.githubUrl || '',
          liveUrl: projectData.liveUrl || '',
        });
        setMedia(projectData.media || []);
      }
    } catch (err) {
      console.error('Error fetching project:', err);
      error('Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  const compressImage = (file, maxWidth = 800, quality = 0.8) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(resolve, 'image/jpeg', quality);
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const uploadMedia = async (files) => {
    const uploadPromises = files.map(async (file) => {
      try {
        let processedFile = file;

        // Compress images to avoid Firebase Storage CORS issues in development
        if (file.type.startsWith('image/')) {
          processedFile = await compressImage(file);
        }

        // Convert to base64 for development (avoid CORS issues)
        const reader = new FileReader();
        const base64Url = await new Promise((resolve) => {
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsDataURL(processedFile);
        });

        return {
          url: base64Url,
          type: file.type.startsWith('image/') ? 'image' : 'video',
          name: file.name
        };
      } catch (error) {
        console.error('Error processing file:', file.name, error);
        return null;
      }
    });

    const results = await Promise.all(uploadPromises);
    return results.filter(result => result !== null);
  };

  const removeMedia = (index) => {
    setMedia(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      let uploadedMedia = [];
      if (selectedFiles.length > 0) {
        uploadedMedia = await uploadMedia(selectedFiles);
      }

      const projectData = {
        ...formData,
        technologies: formData.technologies.split(',').map(tech => tech.trim()),
        media: [...media, ...uploadedMedia],
        updatedAt: new Date(),
        ...(isEditing ? {} : { createdAt: new Date() })
      };

      if (isEditing) {
        await updateDoc(doc(db, 'projects', id), projectData);
        success('Project updated successfully!');
      } else {
        await addDoc(collection(db, 'projects'), projectData);
        success('Project created successfully!');
      }

      setTimeout(() => {
        navigate('/admin');
      }, 2000);
    } catch (err) {
      console.error('Error saving project:', err);
      error('Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    setSaving(true);
    try {
      await deleteDoc(doc(db, 'projects', id));
      success('Project deleted successfully!');
      setTimeout(() => {
        navigate('/admin');
      }, 1000);
    } catch (err) {
      console.error('Error deleting project:', err);
      error('Failed to delete project');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Container>
      <Header>
        <Title>{isEditing ? 'Edit Project' : 'Create New Project'}</Title>
        <BackButton onClick={() => navigate('/admin')}>
          ← Back to Dashboard
        </BackButton>
      </Header>

      <Form onSubmit={handleSubmit}>

        <FormGroup>
          <Label htmlFor="title_sv">Project Title (Swedish)</Label>
          <Input
            type="text"
            id="title_sv"
            name="title_sv"
            value={formData.title_sv}
            onChange={handleInputChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="title_en">Project Title (English)</Label>
          <Input
            type="text"
            id="title_en"
            name="title_en"
            value={formData.title_en}
            onChange={handleInputChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="description_sv">Description (Swedish)</Label>
          <TextArea
            id="description_sv"
            name="description_sv"
            value={formData.description_sv}
            onChange={handleInputChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="description_en">Description (English)</Label>
          <TextArea
            id="description_en"
            name="description_en"
            value={formData.description_en}
            onChange={handleInputChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="categoryId">Category</Label>
          <Select
            id="categoryId"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleInputChange}
            required
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name_sv || category.name} / {category.name_en || category.name}
              </option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="technologies">Technologies (comma-separated)</Label>
          <Input
            type="text"
            id="technologies"
            name="technologies"
            value={formData.technologies}
            onChange={handleInputChange}
            placeholder="React, Node.js, MongoDB"
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="githubUrl">GitHub URL</Label>
          <Input
            type="url"
            id="githubUrl"
            name="githubUrl"
            value={formData.githubUrl}
            onChange={handleInputChange}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="liveUrl">Live Demo URL</Label>
          <Input
            type="url"
            id="liveUrl"
            name="liveUrl"
            value={formData.liveUrl}
            onChange={handleInputChange}
          />
        </FormGroup>


        <MediaSection>
          <Label>Project Media</Label>

          {media.length > 0 && (
            <MediaGrid>
              {media.map((item, index) => (
                <MediaItem key={index}>
                  <MediaPreview src={item.url}>
                    {!item.url && 'Media'}
                  </MediaPreview>
                  <RemoveButton onClick={() => removeMedia(index)}>
                    ×
                  </RemoveButton>
                </MediaItem>
              ))}
            </MediaGrid>
          )}

          <FormGroup style={{ marginTop: '1rem' }}>
            <Label htmlFor="media">Add New Media</Label>
            <FileInput
              type="file"
              id="media"
              multiple
              accept="image/*,video/*"
              onChange={handleFileChange}
            />
          </FormGroup>
        </MediaSection>

        <ButtonGroup>
          <CancelButton type="button" onClick={() => navigate('/admin')}>
            Cancel
          </CancelButton>
          {isEditing && (
            <DeleteButton type="button" onClick={handleDelete} disabled={saving}>
              Delete Project
            </DeleteButton>
          )}
          <SaveButton
            type="submit"
            disabled={saving}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            {saving ? 'Saving...' : (isEditing ? 'Update Project' : 'Create Project')}
          </SaveButton>
        </ButtonGroup>
      </Form>

      <Notifications
        notifications={notifications}
        onRemove={(id) => setNotifications(prev => prev.filter(n => n.id !== id))}
      />
    </Container>
  );
};

export default ProjectForm;