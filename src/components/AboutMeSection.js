import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { theme, glassMorphism } from '../styles/theme';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const gradientAnimation = keyframes`
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
`;

const Section = styled.section`
  padding: ${theme.spacing['3xl']} 0;
  position: relative;
  z-index: 2;

  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing['2xl']} 0;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;

  @media (max-width: ${theme.breakpoints.md}) {
    padding: 0 1rem;
  }
`;

const AboutGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 4rem;
  align-items: flex-start;
  margin-top: 3rem;

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  @media (max-width: ${theme.breakpoints.md}) {
    gap: 2rem;
    margin-top: 2rem;
  }
`;

const ProfileSection = styled(motion.div)`
  position: relative;
`;

const ProfileCard = styled.div`
  ${glassMorphism}
  padding: 2rem;
  border-radius: ${theme.radius.xl};
  position: relative;
  overflow: hidden;

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: 1.5rem;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${theme.gradients.primary};
    background-size: 200% auto;
    animation: ${gradientAnimation} 3s ease infinite;
  }
`;

const ProfileImage = styled.div`
  width: 200px;
  height: 200px;
  margin: 0 auto 2rem;
  border-radius: ${theme.radius.xl};
  background: ${theme.gradients.primary};
  position: relative;
  overflow: hidden;
  padding: 4px;

  @media (max-width: ${theme.breakpoints.sm}) {
    width: 150px;
    height: 150px;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: ${theme.radius.lg};
    display: block;
    background: ${theme.colors.background};
  }
`;

const ProfileInfo = styled.div`
  text-align: center;

  h3 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    background: ${theme.gradients.text};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;

    @media (max-width: ${theme.breakpoints.sm}) {
      font-size: 1.25rem;
    }
  }

  p {
    color: ${theme.colors.textSecondary};
    font-size: 1rem;
    margin-bottom: 1.5rem;

    @media (max-width: ${theme.breakpoints.sm}) {
      font-size: 0.9rem;
    }
  }
`;

const ProfileStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const Stat = styled.div`
  text-align: center;

  strong {
    display: block;
    font-size: 1.5rem;
    color: ${theme.colors.accent};
    margin-bottom: 0.25rem;

    @media (max-width: ${theme.breakpoints.sm}) {
      font-size: 1.25rem;
    }
  }

  span {
    font-size: 0.75rem;
    color: ${theme.colors.textMuted};
    text-transform: uppercase;
    letter-spacing: 0.05em;

    @media (max-width: ${theme.breakpoints.sm}) {
      font-size: 0.7rem;
    }
  }
`;

const ContentSection = styled(motion.div)``;

const ContentCard = styled.div`
  ${glassMorphism}
  padding: 2rem;
  border-radius: ${theme.radius.xl};
  height: auto;

  @media (max-width: ${theme.breakpoints.md}) {
    padding: 2rem;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: 1.5rem;
  }
`;

const SectionHeader = styled.div`
  margin-bottom: 2rem;

  h2 {
    font-size: 2.5rem;
    font-weight: 800;
    margin-bottom: 1rem;
    background: ${theme.gradients.text};
    -webkit-background-clip: text;

    @media (max-width: ${theme.breakpoints.md}) {
      font-size: 2rem;
    }

    @media (max-width: ${theme.breakpoints.sm}) {
      font-size: 1.75rem;
    }
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .subtitle {
    color: ${theme.colors.accent};
    font-size: 0.875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 0.5rem;
  }
`;

const AboutText = styled.div`
  color: ${theme.colors.textSecondary};
  line-height: 1.8;
  font-size: 1.05rem;

  p {
    margin-bottom: 1.5rem;

    &:last-child {
      margin-bottom: 0;
    }
  }

  strong {
    color: ${theme.colors.text};
    font-weight: 600;
  }
`;

const SkillsContainer = styled.div`
  margin-top: 2rem;
`;

const SkillsGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

const SkillBadge = styled.div`
  padding: 0.5rem 1rem;
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: ${theme.radius.full};
  color: ${theme.colors.text};
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(99, 102, 241, 0.2);
    transform: translateY(-2px);
  }
`;

const AboutMeSection = () => {
  const [aboutData, setAboutData] = useState({
    name: 'David Rajala',
    title: 'Full Stack Developer',
    description: 'Passionate developer with expertise in creating modern web applications.',
    yearsExperience: '5',
    projectsCompleted: '50',
    happyClients: '30',
    skills: ['React', 'Node.js', 'Firebase', 'MongoDB']
  });

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const docRef = doc(db, 'about', 'info');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setAboutData({
            ...aboutData,
            ...docSnap.data()
          });
        }
      } catch (error) {
        console.error('Error fetching about data:', error);
      }
    };
    fetchAboutData();
  }, []);

  return (
    <Section id="about">
      <Container>
        <AboutGrid>
          <ProfileSection
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <ProfileCard>
              <ProfileImage>
                {aboutData.profileImage && <img src={aboutData.profileImage} alt={aboutData.name} />}
              </ProfileImage>
              <ProfileInfo>
                <h3>{aboutData.name}</h3>
                <p>{aboutData.title}</p>
                <ProfileStats>
                  <Stat>
                    <strong>{aboutData.yearsExperience}+</strong>
                    <span>År</span>
                  </Stat>
                  <Stat>
                    <strong>{aboutData.projectsCompleted}+</strong>
                    <span>Projekt</span>
                  </Stat>
                  <Stat>
                    <strong>{aboutData.happyClients}+</strong>
                    <span>Kunder</span>
                  </Stat>
                </ProfileStats>
              </ProfileInfo>
            </ProfileCard>
          </ProfileSection>

          <ContentSection
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <ContentCard>
              <SectionHeader>
                <p className="subtitle">Lär känna mig</p>
                <h2>Om mig</h2>
              </SectionHeader>

              <AboutText>
                <p>{aboutData.description || `Jag är en Full Stack-utvecklare baserad i Göteborg. Med över ${aboutData.yearsExperience} års erfarenhet av att skapa digitala lösningar fokuserar jag på att bygga moderna webbapplikationer som är både funktionella och användarvänliga.`}</p>
              </AboutText>

              {aboutData.skills && aboutData.skills.length > 0 && (
                <SkillsContainer>
                  <h4 style={{ marginBottom: '1rem', color: theme.colors.text }}>Kompetenser</h4>
                  <SkillsGrid>
                    {aboutData.skills.map((skill, index) => (
                      <SkillBadge key={index}>
                        {skill}
                      </SkillBadge>
                    ))}
                  </SkillsGrid>
                </SkillsContainer>
              )}
            </ContentCard>
          </ContentSection>
        </AboutGrid>
      </Container>
    </Section>
  );
};

export default AboutMeSection;