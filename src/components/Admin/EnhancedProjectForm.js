import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
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
import AdminLayout from './AdminLayout';
import ConfirmationModal from '../ConfirmationModal';

const FormContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 2rem;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const FormSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
`;

const PreviewSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  position: sticky;
  top: 2rem;
  max-height: calc(100vh - 4rem);
  overflow-y: auto;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: #f9fafb;

  &:focus {
    outline: none;
    border-color: #ef4444;
    background: white;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
  }

  &:hover {
    border-color: #d1d5db;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
  transition: all 0.2s ease;
  background: #f9fafb;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #ef4444;
    background: white;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
  }

  &:hover {
    border-color: #d1d5db;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: #f9fafb;

  &:focus {
    outline: none;
    border-color: #ef4444;
    background: white;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
  }

  &:hover {
    border-color: #d1d5db;
  }
`;

const MediaUploadSection = styled.div`
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  transition: all 0.2s ease;
  background: #f9fafb;
  margin-bottom: 1.5rem;

  &:hover {
    border-color: #ef4444;
    background: #fef2f2;
  }

  &.dragover {
    border-color: #ef4444;
    background: #fef2f2;
  }
`;

const UploadButton = styled(motion.label)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;

  &:hover {
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
  }

  input {
    display: none;
  }
`;

const MediaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const MediaItem = styled(motion.div)`
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  background: #f3f4f6;
  border: 2px solid #e5e7eb;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
`;

const MediaPreview = styled.div`
  width: 100%;
  height: 100%;
  background-image: ${props => props.src ? `url(${props.src})` : 'none'};
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  font-size: 0.75rem;
`;

const VideoPreview = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const RemoveButton = styled(motion.button)`
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  background: rgba(239, 68, 68, 0.9);
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
  opacity: 0;
  transition: opacity 0.2s ease;

  ${MediaItem}:hover & {
    opacity: 1;
  }

  &:hover {
    background: rgba(239, 68, 68, 1);
  }
`;

const PreviewCard = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  background: white;
`;

const PreviewImage = styled.div`
  width: 100%;
  height: 200px;
  background-image: ${props => props.src ? `url(${props.src})` : 'none'};
  background-size: cover;
  background-position: center;
  background-color: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
`;

const PreviewContent = styled.div`
  padding: 1.5rem;
`;

const PreviewTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
`;

const PreviewCategory = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: #ef4444;
  color: white;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const PreviewDescription = styled.p`
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
  font-size: 0.875rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding-top: 2rem;
  border-top: 1px solid #e5e7eb;
  margin-top: 2rem;
`;

const Button = styled(motion.button)`
  padding: 0.875rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;

  &.primary {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    color: white;

    &:hover {
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
    }

    &:disabled {
      background: #d1d5db;
      cursor: not-allowed;
    }
  }

  &.secondary {
    background: #f3f4f6;
    color: #374151;
    border: 1px solid #d1d5db;

    &:hover {
      background: #e5e7eb;
    }
  }

  &.danger {
    background: #dc2626;
    color: white;

    &:hover {
      background: #b91c1c;
    }
  }
`;


const EnhancedProjectForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const { notifications, success, error, setNotifications } = useNotification();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    technologies: '',
    githubUrl: '',
    liveUrl: '',
  });

  const [categories, setCategories] = useState([]);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
          title: projectData.title || '',
          description: projectData.description || '',
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

  const uploadToStorage = async (file, projectId) => {
    try {
      const timestamp = Date.now();
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `${timestamp}_${sanitizedFileName}`;
      const storageRef = ref(storage, `projects/${projectId}/media/${fileName}`);

      console.log(`Uploading ${file.name} to Firebase Storage...`);
      console.log(`Storage path: projects/${projectId}/media/${fileName}`);

      const snapshot = await uploadBytes(storageRef, file);
      console.log('Upload completed, getting download URL...');

      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log(`File uploaded successfully: ${downloadURL}`);

      return {
        url: downloadURL,
        name: file.name,
        type: file.type.startsWith('image/') ? 'image' : 'video',
        size: Math.round(file.size / 1024),
        storagePath: snapshot.ref.fullPath
      };
    } catch (error) {
      console.error('Error uploading file to Storage:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        serverResponse: error.serverResponse
      });
      throw error;
    }
  };

  const compressImage = (file, maxWidth = 800, quality = 0.7) => {
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

  const handleFileUpload = async (files) => {
    const newMedia = [];

    for (const file of files) {
      try {
        const fileSizeKB = Math.round(file.size / 1024);
        console.log(`Processing file ${file.name} (${fileSizeKB}KB)`);

        // Use Firebase Storage for videos or large files (>500KB)
        if (file.type.startsWith('video/') || file.size > 500000) {
          console.log(`Uploading ${file.name} to Firebase Storage...`);

          // Generate a temporary project ID if we're creating a new project
          const projectId = id || `temp_${Date.now()}`;

          try {
            const uploadedFile = await uploadToStorage(file, projectId);
            newMedia.push(uploadedFile);
            console.log(`Successfully uploaded ${file.name} to Storage`);
          } catch (uploadError) {
            console.error(`Failed to upload ${file.name}:`, uploadError);

            // Show a more specific error message
            console.log(`Storage upload failed for ${file.name}. File size: ${fileSizeKB}KB`);

            let errorMessage = 'Firebase Storage not available';
            if (uploadError.code === 'storage/unauthorized') {
              errorMessage = 'Storage access denied';
            } else if (uploadError.message?.includes('CORS')) {
              errorMessage = 'CORS error - Storage config needed';
            }

            newMedia.push({
              url: '',
              type: file.type.startsWith('image/') ? 'image' : 'video',
              name: file.name,
              size: fileSizeKB,
              error: errorMessage,
              canRetry: true
            });
          }
        } else {
          // Use base64 for small images (as before)
          let processedFile = file;

          // Compress images to reduce Firestore document size
          if (file.type.startsWith('image/')) {
            processedFile = await compressImage(file);
          }

          const reader = new FileReader();
          const mediaUrl = await new Promise((resolve) => {
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(processedFile);
          });

          // Check if the resulting data is too large (aim for <400KB per file)
          let finalMediaUrl = mediaUrl;
          if (mediaUrl.length > 400000) {
            console.warn(`File ${file.name} is still large after compression (${Math.round(mediaUrl.length/1000)}KB)`);

            // Try even more compression for images
            if (file.type.startsWith('image/')) {
              const moreCompressedFile = await compressImage(file, 600, 0.5);
              const reader2 = new FileReader();
              const smallerUrl = await new Promise((resolve) => {
                reader2.onload = (e) => resolve(e.target.result);
                reader2.readAsDataURL(moreCompressedFile);
              });
              if (smallerUrl.length < mediaUrl.length) {
                finalMediaUrl = smallerUrl;
              }
            } else {
              // For non-images that are still too large, don't store the data
              newMedia.push({
                url: '',
                type: file.type.startsWith('image/') ? 'image' : 'video',
                name: file.name,
                size: Math.round(file.size / 1024),
                error: 'File too large for direct storage'
              });
              continue;
            }
          }

          newMedia.push({
            url: finalMediaUrl,
            type: file.type.startsWith('image/') ? 'image' : 'video',
            name: file.name,
            size: fileSizeKB
          });
        }
      } catch (error) {
        console.error('Error processing file:', file.name, error);
      }
    }

    setMedia(prev => [...prev, ...newMedia]);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    handleFileUpload(files);
    e.target.value = ''; // Reset input
  };

  const removeMedia = async (index) => {
    const mediaItem = media[index];

    // If the media item has a storagePath, delete it from Firebase Storage
    if (mediaItem.storagePath) {
      try {
        const storageRef = ref(storage, mediaItem.storagePath);
        await deleteObject(storageRef);
        console.log(`Deleted ${mediaItem.name} from Firebase Storage`);
      } catch (error) {
        console.error(`Failed to delete ${mediaItem.name} from Storage:`, error);
      }
    }

    setMedia(prev => prev.filter((_, i) => i !== index));
  };

  const moveMedia = (fromIndex, toIndex) => {
    setMedia(prev => {
      const newMedia = [...prev];
      const [movedItem] = newMedia.splice(fromIndex, 1);
      newMedia.splice(toIndex, 0, movedItem);
      return newMedia;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Clean media array to ensure Firestore compatibility
      const cleanMedia = media.map(item => ({
        url: item.url || '',
        type: item.type || 'image',
        name: item.name || '',
        ...(item.size && { size: item.size }),
        ...(item.error && { error: item.error })
      }));

      const projectData = {
        ...formData,
        technologies: formData.technologies.split(',').map(tech => tech.trim()).filter(tech => tech),
        media: cleanMedia,
        updatedAt: new Date(),
        displayOrder: Date.now(),
        ...(isEditing ? {} : { createdAt: new Date() })
      };

      // Debug log to check data before saving
      console.log('Saving project data:', JSON.stringify(projectData, null, 2));

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

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    setShowDeleteConfirm(false);
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

  const selectedCategory = categories.find(cat => cat.id === formData.categoryId);
  const previewImage = media.find(item => item.type === 'image');

  if (loading) {
    return (
      <AdminLayout title={isEditing ? 'Edit Project' : 'Create Project'}>
        <div>Loading...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title={isEditing ? 'Edit Project' : 'Create Project'}
      subtitle={isEditing ? `Editing ${formData.title}` : 'Create a new portfolio project'}
    >
      <FormContainer>
        <FormSection>
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="title">Project Title</Label>
              <Input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter project title"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="description">Description</Label>
              <TextArea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your project"
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
                    {category.name}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="technologies">Technologies</Label>
              <Input
                type="text"
                id="technologies"
                name="technologies"
                value={formData.technologies}
                onChange={handleInputChange}
                placeholder="React, Node.js, MongoDB (comma-separated)"
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
                placeholder="https://github.com/username/repo"
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
                placeholder="https://yourproject.com"
              />
            </FormGroup>


            <FormGroup>
              <Label>Media Files</Label>
              <MediaUploadSection>
                <h3 style={{ margin: '0 0 1rem 0', color: '#374151' }}>Upload Images & Videos</h3>
                <p style={{ margin: '0 0 1.5rem 0', color: '#6b7280' }}>
                  Drag and drop files here, or click to select
                </p>
                <UploadButton
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>+</span>
                  Choose Files
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                  />
                </UploadButton>
              </MediaUploadSection>

              {media.length > 0 && (
                <MediaGrid>
                  {media.map((item, index) => (
                    <MediaItem
                      key={index}
                      draggable
                      onDragStart={(e) => e.dataTransfer.setData('text/plain', index)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
                        moveMedia(fromIndex, index);
                      }}
                      whileHover={{ scale: 1.05 }}
                    >
                      {item.type === 'video' ? (
                        item.url ? (
                          <VideoPreview
                            src={item.url}
                            muted
                            preload="metadata"
                          />
                        ) : (
                          <MediaPreview style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: item.error ? '#fef2f2' : '#f3f4f6',
                            color: item.error ? '#dc2626' : '#6b7280',
                            padding: '0.5rem',
                            textAlign: 'center',
                            fontSize: '0.75rem'
                          }}>
                            {item.error ? (
                              <>
                                <div>⚠️ {item.error}</div>
                                <div style={{ fontSize: '0.6rem', marginTop: '0.25rem', opacity: 0.8 }}>
                                  {item.name} ({item.size}KB)
                                </div>
                              </>
                            ) : (
                              '🎥 Video'
                            )}
                          </MediaPreview>
                        )
                      ) : (
                        <MediaPreview src={item.url}>
                          {!item.url && (item.error ? `⚠️ ${item.error}` : 'Image')}
                        </MediaPreview>
                      )}
                      <RemoveButton
                        onClick={() => removeMedia(index)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        ×
                      </RemoveButton>
                    </MediaItem>
                  ))}
                </MediaGrid>
              )}
            </FormGroup>

            <ButtonGroup>
              <Button
                type="button"
                className="secondary"
                onClick={() => navigate('/admin')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </Button>

              {isEditing && (
                <Button
                  type="button"
                  className="danger"
                  onClick={handleDelete}
                  disabled={saving}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Delete
                </Button>
              )}

              <Button
                type="submit"
                className="primary"
                disabled={saving}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {saving ? 'Saving...' : (isEditing ? 'Update Project' : 'Create Project')}
              </Button>
            </ButtonGroup>
          </form>
        </FormSection>

        <PreviewSection>
          <h3 style={{ margin: '0 0 1.5rem 0', color: '#1f2937' }}>Live Preview</h3>
          <PreviewCard>
            <PreviewImage src={previewImage?.url}>
              {!previewImage?.url && 'No image uploaded'}
            </PreviewImage>
            <PreviewContent>
              <PreviewTitle>
                {formData.title || 'Project Title'}
              </PreviewTitle>
              {selectedCategory && (
                <PreviewCategory>
                  {selectedCategory.name}
                </PreviewCategory>
              )}
              <PreviewDescription>
                {formData.description || 'Project description will appear here...'}
              </PreviewDescription>
            </PreviewContent>
          </PreviewCard>

          {media.length > 1 && (
            <div style={{ marginTop: '1.5rem' }}>
              <h4 style={{ margin: '0 0 1rem 0', color: '#374151' }}>
                Media Gallery ({media.length} files)
              </h4>
              <MediaGrid>
                {media.slice(1, 5).map((item, index) => (
                  <div
                    key={index + 1}
                    style={{
                      aspectRatio: '1',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      background: '#f3f4f6'
                    }}
                  >
                    {item.type === 'video' ? (
                      item.url ? (
                        <video
                          src={item.url}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          muted
                        />
                      ) : (
                        <div
                          style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: '#f3f4f6',
                            color: '#6b7280',
                            fontSize: '0.875rem'
                          }}
                        >
                          {item.error ? `⚠️ ${item.error}` : '🎥 Video uploading...'}
                        </div>
                      )
                    ) : (
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          backgroundImage: `url(${item.url})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      />
                    )}
                  </div>
                ))}
              </MediaGrid>
              {media.length > 5 && (
                <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>
                  +{media.length - 5} more files
                </p>
              )}
            </div>
          )}
        </PreviewSection>
      </FormContainer>

      <Notifications
        notifications={notifications}
        onRemove={(id) => setNotifications(prev => prev.filter(n => n.id !== id))}
      />

      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        title="Ta bort projekt"
        message="Är du säker på att du vill ta bort detta projekt? Denna åtgärd kan inte ångras."
        confirmText="Ta bort"
        cancelText="Avbryt"
        type="danger"
        isLoading={saving}
      />
    </AdminLayout>
  );
};

export default EnhancedProjectForm;