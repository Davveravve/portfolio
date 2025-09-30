import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useLanguage } from '../context/LanguageContext';

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const ModalContent = styled(motion.div)`
  background: white;
  border-radius: 24px;
  max-width: 700px;
  width: 100%;
  max-height: 85vh;
  overflow-y: auto;
  position: relative;
  box-shadow:
    0 25px 50px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1);

  /* Hide scrollbar completely */
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const ModalHeader = styled.div`
  padding: 2rem 2rem 1rem 2rem;
  border-bottom: 1px solid #e2e8f0;
  position: relative;

  @media (max-width: 768px) {
    padding: 1.5rem 1.5rem 1rem 1.5rem;
  }
`;

const ModalTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: var(--main-color, #ef4444);
  margin: 0 0 0.5rem 0;
  text-align: center;
`;

const ModalSubtitle = styled.p`
  font-size: 1rem;
  color: #64748b;
  margin: 0;
  text-align: center;
`;

const CloseButton = styled(motion.button)`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.1);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.5rem;
  color: #64748b;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(var(--main-color-rgb, 239, 68, 68), 0.1);
    color: var(--main-color, #ef4444);
  }
`;

const ModalBody = styled.div`
  padding: 1rem 2rem 2rem 2rem;

  @media (max-width: 768px) {
    padding: 1rem 1.5rem 1.5rem 1.5rem;
  }
`;

const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const ProfileImageContainer = styled.div`
  position: relative;
  flex-shrink: 0;
`;

const ProfileImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #6366f1;
  box-shadow: 0 10px 30px rgba(99, 102, 241, 0.3);
  background: #f0f0f0;
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const ProfileName = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.5rem 0;
`;

const ProfileRole = styled.p`
  font-size: 1rem;
  color: var(--main-color, #ef4444);
  font-weight: 600;
  margin: 0 0 1rem 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const ProfileDescription = styled.p`
  font-size: 1rem;
  color: #64748b;
  line-height: 1.6;
  margin: 0;
`;

const SkillsSection = styled.div`
  margin-bottom: 1rem;
`;

const SectionTitle = styled.h4`
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 1rem 0;
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.75rem;
`;

const SkillTag = styled.div`
  background: rgba(var(--main-color-rgb, 239, 68, 68), 0.1);
  color: var(--main-color, #ef4444);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  text-align: center;
  border: 1px solid rgba(var(--main-color-rgb, 239, 68, 68), 0.2);
`;

const AboutModal = ({ onClose }) => {
  const { t, currentLanguage } = useLanguage();
  const [aboutData, setAboutData] = useState({
    name: 'David Rajala',
    title: 'Full Stack Developer',
    description: 'Jag är en passionerad utvecklare med fokus på att skapa användarvänliga och visuellt tilltalande digitala upplevelser.',
    skills: [],
    profileImage: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    setLoading(true);
    try {
      const aboutDoc = await getDoc(doc(db, 'about', 'info'));
      if (aboutDoc.exists()) {
        const data = aboutDoc.data();
        console.log('About Modal - Fetched data:', data);
        console.log('About Modal - Profile image URL:', data.profileImage);
        setAboutData(data);
      } else {
        console.log('About Modal - No document found');
      }
    } catch (error) {
      console.error('Error fetching about data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalOverlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      <ModalContent
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 50 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
      >
        <ModalHeader>
          <CloseButton
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            ×
          </CloseButton>
          <ModalTitle>{t('about.title')}</ModalTitle>
          <ModalSubtitle>{aboutData.title || 'Full Stack Developer'}</ModalSubtitle>
        </ModalHeader>

        <ModalBody>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              {t('about.loading')}
            </div>
          ) : (
            <>
              <ProfileSection>
                <ProfileImageContainer>
                  {console.log('Rendering profile image, URL:', aboutData.profileImage)}
                  {console.log('Full aboutData:', aboutData)}
                  <ProfileImage
                    src={aboutData.profileImage || 'https://via.placeholder.com/150/6366f1/ffffff?text=DR'}
                    alt="Profile"
                    onError={(e) => {
                      console.error('Image failed to load, URL was:', e.target.src);
                      e.target.src = 'https://via.placeholder.com/150/6366f1/ffffff?text=DR';
                    }}
                    onLoad={() => console.log('Image loaded successfully from:', aboutData.profileImage)}
                </ProfileImageContainer>
                <ProfileInfo>
                  <ProfileName>{aboutData.name || 'David Rajala'}</ProfileName>
                  <ProfileRole>{aboutData.title || 'Full Stack Developer'}</ProfileRole>
                  <ProfileDescription>
                    {aboutData.description || 'Passionerad utvecklare med fokus på moderna webbapplikationer.'}
                  </ProfileDescription>
                </ProfileInfo>
              </ProfileSection>

              {aboutData.skills && aboutData.skills.length > 0 && (
                <SkillsSection>
                  <SectionTitle>{t('about.skills.title')}</SectionTitle>
                  <SkillsGrid>
                    {aboutData.skills.map((skill, index) => (
                      <SkillTag key={index}>{skill}</SkillTag>
                    ))}
                  </SkillsGrid>
                </SkillsSection>
              )}
            </>
          )}
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};

export default AboutModal;