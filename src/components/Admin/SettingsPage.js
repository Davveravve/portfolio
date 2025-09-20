import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import AdminLayout from './AdminLayout';
import BackgroundPaths from '../BackgroundPaths';
import useNotification from '../../hooks/useNotification';
import Notifications from '../Notifications';

const Container = styled.div`
  max-width: 1000px;
`;

const SettingsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SettingsCard = styled.div`
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
  min-height: 120px;
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

const ColorPicker = styled.input`
  width: 100%;
  height: 50px;
  padding: 0;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  background: none;

  &:focus {
    outline: none;
    border-color: #ef4444;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
  }
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

const SliderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SliderWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Slider = styled.input`
  flex: 1;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  outline: none;
  appearance: none;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #ef4444;
    cursor: pointer;
    border: 2px solid white;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  }

  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #ef4444;
    cursor: pointer;
    border: 2px solid white;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  }
`;

const SliderValue = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  min-width: 80px;
  text-align: right;
`;

const PreviewSection = styled.div`
  border-radius: 12px;
  padding: 3rem 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: ${props => {
    if (props.useGradient) {
      return `linear-gradient(${props.gradientRotation || 135}deg, ${props.backgroundColor || '#0f172a'}, ${props.gradientColor2 || '#1e293b'})`;
    }
    return props.backgroundColor || '#0f172a';
  }};
`;

const PreviewName = styled.h1`
  font-size: clamp(2rem, 6vw, 4rem);
  font-weight: 900;
  color: ${props => props.textColor || 'white'};
  margin: 0 0 1rem 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  position: relative;
  z-index: 1;
  line-height: 1.1;
  letter-spacing: -0.02em;
`;


const PreviewRoles = styled.div`
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  justify-content: center;
  position: relative;
  z-index: 1;
  margin-top: 1rem;
`;

const PreviewRole = styled.span`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.roleTextColor || 'white'};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  transition: all 0.3s ease;
  animation: slideUp 0.8s ease forwards;
  animation-delay: ${props => props.index * 0.2}s;
  opacity: 0;
  transform: translateY(20px);

  @keyframes slideUp {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;


const SettingsPage = () => {
  const { notifications, success, error, setNotifications } = useNotification();

  const [settings, setSettings] = useState({
    heroName: 'David Rajala',
    heroRoles_sv: ['DESIGNER', 'UTVECKLARE', 'SKAPARE'],
    heroRoles_en: ['DESIGNER', 'DEVELOPER', 'CREATOR'],
    heroRolesInput_sv: 'DESIGNER, UTVECKLARE, SKAPARE',
    heroRolesInput_en: 'DESIGNER, DEVELOPER, CREATOR',
    backgroundColor: '#0f172a',
    useGradient: false,
    gradientColor2: '#1e293b',
    gradientRotation: 135,
    lineColor: '#ffffff',
    lineOpacity: 0.15,
    mainColor: '#ef4444',
    textColor: '#ffffff',
    roleTextColor: '#ffffff',
    roleTransitionTime: 3
  });

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const settingsDoc = await getDoc(doc(db, 'settings', 'hero'));
      if (settingsDoc.exists()) {
        const data = settingsDoc.data();
        setSettings(prev => ({
          ...prev,
          ...data,
          heroRolesInput_sv: data.heroRoles_sv?.join(', ') || data.heroRoles?.join(', ') || 'DESIGNER, UTVECKLARE, SKAPARE',
          heroRolesInput_en: data.heroRoles_en?.join(', ') || data.heroRoles?.join(', ') || 'DESIGNER, DEVELOPER, CREATOR'
        }));
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setSettings(prev => {
      const newSettings = {
        ...prev,
        [field]: value
      };

      // Sync accent color with background color 1
      if (field === 'backgroundColor') {
        newSettings.mainColor = value;
      } else if (field === 'mainColor') {
        newSettings.backgroundColor = value;
      }

      return newSettings;
    });
  };

  const handleRolesChange_sv = (value) => {
    setSettings(prev => ({
      ...prev,
      heroRolesInput_sv: value
    }));
  };

  const handleRolesChange_en = (value) => {
    setSettings(prev => ({
      ...prev,
      heroRolesInput_en: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Parse roles from input
      const roles_sv = settings.heroRolesInput_sv.split(',').map(role => role.trim().toUpperCase()).filter(role => role);
      const roles_en = settings.heroRolesInput_en.split(',').map(role => role.trim().toUpperCase()).filter(role => role);

      await setDoc(doc(db, 'settings', 'hero'), {
        ...settings,
        heroRoles_sv: roles_sv,
        heroRoles_en: roles_en,
        updatedAt: new Date()
      });

      // Update local state with parsed roles
      setSettings(prev => ({ ...prev, heroRoles_sv: roles_sv, heroRoles_en: roles_en }));
      success('Settings saved successfully!');
    } catch (err) {
      console.error('Error saving settings:', err);
      error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };


  if (loading) {
    return (
      <AdminLayout title="Settings" subtitle="Loading...">
        <div>Loading...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Settings"
      subtitle="Customize your portfolio's hero section"
    >
      <Container>

        <SettingsGrid>
          <SettingsCard>
            <CardTitle>Hero Section Settings</CardTitle>

            <FormGroup>
              <Label htmlFor="heroName">Name</Label>
              <Input
                type="text"
                id="heroName"
                value={settings.heroName}
                onChange={(e) => handleInputChange('heroName', e.target.value)}
                placeholder="Your name"
              />
            </FormGroup>


            <FormGroup>
              <Label htmlFor="heroRoles_sv">Roles Swedish (comma-separated)</Label>
              <Input
                type="text"
                id="heroRoles_sv"
                value={settings.heroRolesInput_sv}
                onChange={(e) => handleRolesChange_sv(e.target.value)}
                placeholder="DESIGNER, UTVECKLARE, SKAPARE"
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="heroRoles_en">Roles English (comma-separated)</Label>
              <Input
                type="text"
                id="heroRoles_en"
                value={settings.heroRolesInput_en}
                onChange={(e) => handleRolesChange_en(e.target.value)}
                placeholder="DESIGNER, DEVELOPER, CREATOR"
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="roleTransitionTime">Role Transition Time</Label>
              <SliderContainer>
                <SliderWrapper>
                  <Slider
                    type="range"
                    id="roleTransitionTime"
                    value={settings.roleTransitionTime}
                    onChange={(e) => handleInputChange('roleTransitionTime', parseInt(e.target.value))}
                    min="1"
                    max="15"
                    step="0.5"
                  />
                  <SliderValue>{settings.roleTransitionTime}s</SliderValue>
                </SliderWrapper>
              </SliderContainer>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="backgroundColor">Background Color 1</Label>
              <ColorPicker
                type="color"
                id="backgroundColor"
                value={settings.backgroundColor}
                onChange={(e) => handleInputChange('backgroundColor', e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <Label>
                <input
                  type="checkbox"
                  checked={settings.useGradient}
                  onChange={(e) => handleInputChange('useGradient', e.target.checked)}
                  style={{ marginRight: '0.5rem' }}
                />
                Use Gradient Background
              </Label>
            </FormGroup>

            {settings.useGradient && (
              <>
                <FormGroup>
                  <Label htmlFor="gradientColor2">Background Color 2</Label>
                  <ColorPicker
                    type="color"
                    id="gradientColor2"
                    value={settings.gradientColor2}
                    onChange={(e) => handleInputChange('gradientColor2', e.target.value)}
                  />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="gradientRotation">Gradient Rotation (degrees)</Label>
                  <Input
                    type="number"
                    id="gradientRotation"
                    value={settings.gradientRotation}
                    onChange={(e) => handleInputChange('gradientRotation', parseInt(e.target.value) || 0)}
                    min="0"
                    max="360"
                    step="45"
                  />
                </FormGroup>
              </>
            )}

            <FormGroup>
              <Label htmlFor="lineColor">Line Color</Label>
              <ColorPicker
                type="color"
                id="lineColor"
                value={settings.lineColor}
                onChange={(e) => handleInputChange('lineColor', e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="lineOpacity">Line Opacity</Label>
              <Input
                type="range"
                id="lineOpacity"
                value={settings.lineOpacity}
                onChange={(e) => handleInputChange('lineOpacity', parseFloat(e.target.value))}
                min="0"
                max="1"
                step="0.05"
                style={{ marginBottom: '0.5rem' }}
              />
              <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                {Math.round(settings.lineOpacity * 100)}%
              </div>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="mainColor">Main Accent Color</Label>
              <ColorPicker
                type="color"
                id="mainColor"
                value={settings.mainColor}
                onChange={(e) => handleInputChange('mainColor', e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="textColor">Text Color</Label>
              <ColorPicker
                type="color"
                id="textColor"
                value={settings.textColor}
                onChange={(e) => handleInputChange('textColor', e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="roleTextColor">Role Text Color</Label>
              <ColorPicker
                type="color"
                id="roleTextColor"
                value={settings.roleTextColor}
                onChange={(e) => handleInputChange('roleTextColor', e.target.value)}
              />
            </FormGroup>

            <SaveButton
              onClick={handleSave}
              disabled={saving}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </SaveButton>
          </SettingsCard>

          <PreviewCard>
            <CardTitle>Live Preview</CardTitle>
            <PreviewSection
              backgroundColor={settings.backgroundColor}
              useGradient={settings.useGradient}
              gradientColor2={settings.gradientColor2}
              gradientRotation={settings.gradientRotation}
            >
              <BackgroundPaths
                lineColor={settings.lineColor}
                lineOpacity={settings.lineOpacity}
              />
              <PreviewName textColor={settings.textColor}>{settings.heroName}</PreviewName>
              <PreviewRoles>
                <PreviewRole
                  roleTextColor={settings.roleTextColor}
                  index={0}
                >
                  {settings.heroRoles_sv[0] || 'DESIGNER'}
                </PreviewRole>
              </PreviewRoles>
            </PreviewSection>
          </PreviewCard>
        </SettingsGrid>
      </Container>

      <Notifications
        notifications={notifications}
        onRemove={(id) => setNotifications(prev => prev.filter(n => n.id !== id))}
      />
    </AdminLayout>
  );
};

export default SettingsPage;