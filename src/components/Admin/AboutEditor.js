import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  doc,
  getDoc,
  setDoc
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import useNotification from '../../hooks/useNotification';
import Notifications from '../Notifications';
import AdminLayout from './AdminLayout';

const Container = styled.div`
  max-width: 1200px;
`;

const EditorGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const EditorCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
`;

const PreviewCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  position: sticky;
  top: 2rem;
  height: fit-content;
  max-height: 80vh;
  overflow-y: auto;
`;

const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 1.5rem 0;
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
  transition: all 0.2s ease;
  background: #f9fafb;
  min-height: 150px;
  resize: vertical;
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

const FileInput = styled.input`
  display: none;
`;

const FileInputLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  background: #f8fafc;
  border: 2px dashed #cbd5e1;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  color: #475569;
  width: 100%;
  justify-content: center;

  &:hover {
    background: #f1f5f9;
    border-color: #94a3b8;
  }

  &.has-file {
    background: #fef2f2;
    border-color: #ef4444;
    color: #dc2626;
  }
`;

const PreviewContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
`;

const ImagePlaceholder = styled.div`
  width: 100%;
  height: 300px;
  background: #f8fafc;
  border: 2px dashed #cbd5e1;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  font-style: italic;
`;

const PreviewTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
`;

const PreviewSubtitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #64748b;
  margin: 0;
`;

const PreviewDescription = styled.div`
  color: #374151;
  line-height: 1.7;
  font-size: 1rem;
  white-space: pre-line;
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.75rem;
`;

const SkillItem = styled.div`
  background: #f8fafc;
  padding: 0.75rem;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  text-align: center;
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
`;


const SaveButton = styled(motion.button)`
  width: 100%;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1rem;

  &:hover {
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
  }

  &:disabled {
    background: #d1d5db;
    cursor: not-allowed;
  }
`;



const AboutEditor = () => {
  const { notifications, success, error, setNotifications } = useNotification();
  const [aboutData, setAboutData] = useState({
    title_sv: 'Om Mig',
    title_en: 'About Me',
    subtitle_sv: 'Kreativ utvecklare och designer',
    subtitle_en: 'Creative developer and designer',
    description_sv: 'Jag är en passionerad utvecklare och designer som älskar att skapa digitala upplevelser som kombinerar estetik med funktionalitet. Med flera års erfarenhet inom webbutveckling och design har jag hjälpt företag att förverkliga sina digitala visioner.',
    description_en: 'I am a passionate developer and designer who loves creating digital experiences that combine aesthetics with functionality. With several years of experience in web development and design, I have helped companies realize their digital visions.',
    skills: ['React', 'JavaScript', 'CSS', 'Node.js', 'Design', 'UX/UI'],
    skillsInput: 'React, JavaScript, CSS, Node.js, Design, UX/UI',
    image: '',
    imageFile: null
  });

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const aboutDoc = await getDoc(doc(db, 'content', 'about'));
      if (aboutDoc.exists()) {
        const data = aboutDoc.data();
        setAboutData(prev => ({
          ...prev,
          ...data,
          skillsInput: data.skills ? data.skills.join(', ') : prev.skillsInput
        }));
      }
    } catch (error) {
      console.error('Error fetching about data:', error);
      error('Failed to load about data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setAboutData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSkillsChange = (value) => {
    // Don't split immediately - let user type freely
    setAboutData(prev => ({
      ...prev,
      skillsInput: value, // Store raw input
      skills: value.split(',').map(skill => skill.trim()).filter(skill => skill)
    }));
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

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Compress image to reduce size
        const compressedFile = await compressImage(file);

        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target.result;
          // Check if compressed image is still too large (900KB limit to be safe)
          if (result.length > 900000) {
            error('Image is too large. Please choose a smaller image.');
            return;
          }

          setAboutData(prev => ({
            ...prev,
            image: result,
            imageFile: compressedFile
          }));
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error('Error processing image:', error);
        error('Failed to process image');
      }
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const dataToSave = {
        title_sv: aboutData.title_sv,
        title_en: aboutData.title_en,
        subtitle_sv: aboutData.subtitle_sv,
        subtitle_en: aboutData.subtitle_en,
        description_sv: aboutData.description_sv,
        description_en: aboutData.description_en,
        // Keep backward compatibility for now
        title: aboutData.title_sv,
        subtitle: aboutData.subtitle_sv,
        description: aboutData.description_sv,
        skills: aboutData.skills,
        image: aboutData.image,
        updatedAt: new Date()
      };

      await setDoc(doc(db, 'content', 'about'), dataToSave);
      success('About section saved successfully!');
    } catch (error) {
      console.error('Error saving about data:', error);
      error('Failed to save about data');
    } finally {
      setSaving(false);
    }
  };


  if (loading) {
    return (
      <AdminLayout title="About Me" subtitle="Loading...">
        <div>Loading...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="About Me"
      subtitle="Edit your about section and personal information"
    >
      <Container>
        <EditorGrid>
          <EditorCard>
            <CardTitle>Edit About Section</CardTitle>

            <FormGroup>
              <Label htmlFor="aboutTitleSv">Title (Svenska)</Label>
              <Input
                type="text"
                id="aboutTitleSv"
                value={aboutData.title_sv}
                onChange={(e) => handleInputChange('title_sv', e.target.value)}
                placeholder="Titel på svenska"
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="aboutTitleEn">Title (English)</Label>
              <Input
                type="text"
                id="aboutTitleEn"
                value={aboutData.title_en}
                onChange={(e) => handleInputChange('title_en', e.target.value)}
                placeholder="Title in English"
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="aboutSubtitleSv">Subtitle (Svenska)</Label>
              <Input
                type="text"
                id="aboutSubtitleSv"
                value={aboutData.subtitle_sv}
                onChange={(e) => handleInputChange('subtitle_sv', e.target.value)}
                placeholder="Undertitel på svenska"
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="aboutSubtitleEn">Subtitle (English)</Label>
              <Input
                type="text"
                id="aboutSubtitleEn"
                value={aboutData.subtitle_en}
                onChange={(e) => handleInputChange('subtitle_en', e.target.value)}
                placeholder="Subtitle in English"
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="aboutDescriptionSv">Description (Svenska)</Label>
              <TextArea
                id="aboutDescriptionSv"
                value={aboutData.description_sv}
                onChange={(e) => handleInputChange('description_sv', e.target.value)}
                placeholder="Beskriv dig själv på svenska..."
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="aboutDescriptionEn">Description (English)</Label>
              <TextArea
                id="aboutDescriptionEn"
                value={aboutData.description_en}
                onChange={(e) => handleInputChange('description_en', e.target.value)}
                placeholder="Describe yourself in English..."
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="aboutSkills">Skills (comma-separated)</Label>
              <Input
                type="text"
                id="aboutSkills"
                value={aboutData.skillsInput || aboutData.skills.join(', ')}
                onChange={(e) => handleSkillsChange(e.target.value)}
                placeholder="React, JavaScript, CSS, Design..."
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="aboutImage">Profile Image</Label>
              <FileInput
                type="file"
                id="aboutImage"
                accept="image/*"
                onChange={handleImageUpload}
              />
              <FileInputLabel
                htmlFor="aboutImage"
                className={aboutData.image ? 'has-file' : ''}
              >
                📁 {aboutData.image ? 'Change Image' : 'Upload Image'}
              </FileInputLabel>
            </FormGroup>

            <SaveButton
              onClick={handleSave}
              disabled={saving}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {saving ? 'Saving...' : 'Save About Section'}
            </SaveButton>
          </EditorCard>

          <PreviewCard>
            <CardTitle>Live Preview</CardTitle>
            <PreviewContent>
              {aboutData.image ? (
                <PreviewImage src={aboutData.image} alt="Profile" />
              ) : (
                <ImagePlaceholder>
                  No image selected
                </ImagePlaceholder>
              )}

              <div>
                <PreviewTitle>{aboutData.title_sv} / {aboutData.title_en}</PreviewTitle>
                <PreviewSubtitle>{aboutData.subtitle_sv} / {aboutData.subtitle_en}</PreviewSubtitle>
              </div>

              <PreviewDescription>
                <strong>Svenska:</strong> {aboutData.description_sv}
                <br /><br />
                <strong>English:</strong> {aboutData.description_en}
              </PreviewDescription>

              {aboutData.skills.length > 0 && (
                <div>
                  <h4 style={{ margin: '0 0 1rem 0', color: '#374151' }}>Skills</h4>
                  <SkillsGrid>
                    {aboutData.skills.map((skill, index) => (
                      <SkillItem key={index}>{skill}</SkillItem>
                    ))}
                  </SkillsGrid>
                </div>
              )}
            </PreviewContent>
          </PreviewCard>
        </EditorGrid>
      </Container>

      <Notifications
        notifications={notifications}
        onRemove={(id) => setNotifications(prev => prev.filter(n => n.id !== id))}
      />
    </AdminLayout>
  );
};

export default AboutEditor;