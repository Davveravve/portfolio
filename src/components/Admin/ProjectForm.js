import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import supabase from '../../utils/supabaseClient';
import { useCategories } from '../../hooks/useSupabase';

const FormContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 2rem;
`;

const FormHeader = styled.div`
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
  font-size: 1.75rem;
  color: var(--dark-color);
  margin: 0;
`;

const BackButton = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: #EDF2F7;
  color: #4A5568;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  
  &:hover {
    background-color: #E2E8F0;
  }
`;

const Form = styled.form`
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
  border: 1px solid #E2E8F0;
  border-radius: 6px;
  font-size: 1rem;
  transition: var(--transition);
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.2);
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #E2E8F0;
  border-radius: 6px;
  font-size: 1rem;
  transition: var(--transition);
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.2);
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #E2E8F0;
  border-radius: 6px;
  font-size: 1rem;
  min-height: 150px;
  resize: vertical;
  transition: var(--transition);
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.2);
  }
`;

const FileInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FileInput = styled.input`
  font-size: 0.875rem;
`;

const MediaPreviewContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
`;

const MediaPreview = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  
  img, video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const MediaDelete = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition);
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }
`;

const VideoLabel = styled.div`
  position: absolute;
  bottom: 5px;
  left: 5px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 0.75rem;
  padding: 2px 5px;
  border-radius: 3px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
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
  
  @media (max-width: 768px) {
    order: 1;
  }
`;

const DeleteButton = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  background-color: white;
  color: var(--danger-color);
  border: 1px solid var(--danger-color);
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  
  &:hover {
    background-color: #FED7D7;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  @media (max-width: 768px) {
    order: 2;
  }
`;

const ErrorMessage = styled.div`
  background-color: #FED7D7;
  color: #9B2C2C;
  padding: 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  text-align: center;
  margin-bottom: 1rem;
`;

const SuccessMessage = styled.div`
  background-color: #C6F6D5;
  color: #22543D;
  padding: 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  text-align: center;
  margin-bottom: 1rem;
`;

const LoadingIndicator = styled.div`
  text-align: center;
  padding: 2rem;
  color: #718096;
`;

const ProjectForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: ''
  });
  
  const [existingMedia, setExistingMedia] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [mediaToDelete, setMediaToDelete] = useState([]);
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  
  const { categories, loading: loadingCategories } = useCategories();
  
  // Fetch project data if in edit mode
  useEffect(() => {
    const fetchProject = async () => {
      if (!isEditMode) return;
      
      try {
        const { data, error } = await supabase
          .from('projects')
          .select(`
            *,
            project_media(id, file_url, media_type, display_order)
          `)
          .eq('id', id)
          .single();
        
        if (error) throw error;
        
        setFormData({
          title: data.title,
          description: data.description,
          category_id: data.category_id
        });
        
        setExistingMedia(data.project_media.sort((a, b) => a.display_order - b.display_order));
      } catch (err) {
        console.error('Error fetching project:', err);
        setError('Failed to load project data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProject();
  }, [id, isEditMode]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setNewFiles([...newFiles, ...files]);
  };
  
  const removeNewFile = (index) => {
    setNewFiles(newFiles.filter((_, i) => i !== index));
  };
  
  const removeExistingMedia = (mediaId) => {
    setExistingMedia(existingMedia.filter(media => media.id !== mediaId));
    setMediaToDelete([...mediaToDelete, mediaId]);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!formData.title || !formData.category_id) {
      setError('Please fill in title and select a category');
      return;
    }
    
    setSaving(true);
    
    try {
      if (isEditMode) {
        // Update project
        const { error: updateError } = await supabase
          .from('projects')
          .update({
            title: formData.title,
            description: formData.description,
            category_id: formData.category_id
          })
          .eq('id', id);
        
        if (updateError) throw updateError;
        
        // Delete removed media
        if (mediaToDelete.length > 0) {
          const { error: deleteError } = await supabase
            .from('project_media')
            .delete()
            .in('id', mediaToDelete);
            
          if (deleteError) throw deleteError;
        }
        
        // Upload new files
        await Promise.all(
          newFiles.map(async (file, index) => {
            // Create a unique file name
            const fileExt = file.name.split('.').pop();
            const fileName = `${id}/${Date.now()}-${index}.${fileExt}`;
            const filePath = `project-media/${fileName}`;
            
            // Upload file to storage
            const { error: uploadError } = await supabase.storage
              .from('portfolio')
              .upload(filePath, file);
              
            if (uploadError) throw uploadError;
            
            // Get the public URL
            const { data: { publicUrl } } = supabase.storage
              .from('portfolio')
              .getPublicUrl(filePath);
              
            // Insert media record
            const { error: insertError } = await supabase
              .from('project_media')
              .insert({
                project_id: id,
                file_url: publicUrl,
                media_type: file.type.startsWith('image/') ? 'image' : 'video',
                display_order: existingMedia.length + index
              });
              
            if (insertError) throw insertError;
          })
        );
        
        setSuccess('Project updated successfully');
        
        // Navigate back to dashboard after a short delay
        setTimeout(() => {
          navigate('/admin');
        }, 1500);
      } else {
        // Create new project
        const { data: project, error: insertError } = await supabase
          .from('projects')
          .insert({
            title: formData.title,
            description: formData.description,
            category_id: formData.category_id
          })
          .select();
          
        if (insertError) throw insertError;
        
        // Upload files
        await Promise.all(
          newFiles.map(async (file, index) => {
            const fileExt = file.name.split('.').pop();
            const fileName = `${project[0].id}/${Date.now()}-${index}.${fileExt}`;
            const filePath = `project-media/${fileName}`;
            
            const { error: uploadError } = await supabase.storage
              .from('portfolio')
              .upload(filePath, file);
              
            if (uploadError) throw uploadError;
            
            const { data: { publicUrl } } = supabase.storage
              .from('portfolio')
              .getPublicUrl(filePath);
              
            const { error: insertError } = await supabase
              .from('project_media')
              .insert({
                project_id: project[0].id,
                file_url: publicUrl,
                media_type: file.type.startsWith('image/') ? 'image' : 'video',
                display_order: index
              });
              
            if (insertError) throw insertError;
          })
        );
        
        setSuccess('Project created successfully');
        
        // Navigate back to dashboard after a short delay
        setTimeout(() => {
          navigate('/admin');
        }, 1500);
      }
    } catch (err) {
      console.error('Error saving project:', err);
      setError('Failed to save project: ' + err.message);
    } finally {
      setSaving(false);
    }
  };
  
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    
    try {
      setSaving(true);
      
      // Delete all media records
      const { error: mediaError } = await supabase
        .from('project_media')
        .delete()
        .eq('project_id', id);
        
      if (mediaError) throw mediaError;
      
      // Delete project
      const { error: projectError } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
        
      if (projectError) throw projectError;
      
      navigate('/admin');
    } catch (err) {
      console.error('Error deleting project:', err);
      setError('Failed to delete project: ' + err.message);
      setSaving(false);
    }
  };
  
  if (loading || loadingCategories) {
    return <LoadingIndicator>Loading...</LoadingIndicator>;
  }
  
  return (
    <FormContainer>
      <FormHeader>
        <Title>{isEditMode ? 'Edit Project' : 'New Project'}</Title>
        <BackButton 
          onClick={() => navigate('/admin')}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          ← Back to Dashboard
        </BackButton>
      </FormHeader>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="title">Project Title</Label>
          <Input 
            type="text" 
            id="title" 
            name="title" 
            value={formData.title}
            onChange={handleChange}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="category_id">Category</Label>
          <Select 
            id="category_id" 
            name="category_id" 
            value={formData.category_id}
            onChange={handleChange}
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
          <Label htmlFor="description">Description</Label>
          <TextArea 
            id="description" 
            name="description" 
            value={formData.description}
            onChange={handleChange}
          />
        </FormGroup>
        
        <FileInputContainer>
          <Label>Project Media (Images & Videos)</Label>
          <FileInput 
            type="file" 
            multiple 
            accept="image/*,video/*" 
            onChange={handleFileChange}
          />
          
          {/* Existing Media Previews */}
          {existingMedia.length > 0 && (
            <>
              <Label>Current Media:</Label>
              <MediaPreviewContainer>
                {existingMedia.map(media => (
                  <MediaPreview key={media.id}>
                    {media.media_type === 'image' ? (
                      <img src={media.file_url} alt="Project media" />
                    ) : (
                      <>
                        <video src={media.file_url} />
                        <VideoLabel>Video</VideoLabel>
                      </>
                    )}
                    <MediaDelete 
                      onClick={() => removeExistingMedia(media.id)}
                      title="Remove"
                    >
                      ✕
                    </MediaDelete>
                  </MediaPreview>
                ))}
              </MediaPreviewContainer>
            </>
          )}
          
          {/* New File Previews */}
          {newFiles.length > 0 && (
            <>
              <Label>New Uploads:</Label>
              <MediaPreviewContainer>
                {newFiles.map((file, index) => (
                  <MediaPreview key={index}>
                    {file.type.startsWith('image/') ? (
                      <img src={URL.createObjectURL(file)} alt="New upload" />
                    ) : (
                      <>
                        <video src={URL.createObjectURL(file)} />
                        <VideoLabel>Video</VideoLabel>
                      </>
                    )}
                    <MediaDelete 
                      onClick={() => removeNewFile(index)}
                      title="Remove"
                    >
                      ✕
                    </MediaDelete>
                  </MediaPreview>
                ))}
              </MediaPreviewContainer>
            </>
          )}
        </FileInputContainer>
        
        <ButtonGroup>
          {isEditMode && (
            <DeleteButton 
              type="button"
              onClick={handleDelete}
              disabled={saving}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Delete Project
            </DeleteButton>
          )}
          <SaveButton 
            type="submit"
            disabled={saving}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {saving ? 'Saving...' : (isEditMode ? 'Update Project' : 'Create Project')}
          </SaveButton>
        </ButtonGroup>
      </Form>
    </FormContainer>
  );
};

export default ProjectForm;