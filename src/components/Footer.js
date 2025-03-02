// src/components/Footer.js
import React from 'react';
import styled from 'styled-components';

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <ProfileSection>
          <ProfileImage src="/profile-image.jpg" alt="David Rajala" />
          <ProfileInfo>
            <h3>David Rajala</h3>
            <p>
            Jag har jobbat med olika projekt och uppdrag för både företag och privatpersoner. Med mitt intresse för utveckling och design strävar jag efter att skapa genomtänkta och funktionella lösningar. Jag tar gärna mig an nya utmaningar och hjälper till där det behövs!
            </p>
          </ProfileInfo>
        </ProfileSection>
        
        <ContactSection>
          <ContactTitle>Kontakta mig</ContactTitle>
          <ContactLinks>
            <ContactItem>
              <ContactIcon></ContactIcon>
              <ContactLink href="tel:+46723040296">072 304 02 96</ContactLink>
            </ContactItem>
            <ContactItem>
              <ContactIcon></ContactIcon>
              <ContactLink href="mailto:davidrajala01@gmail.com">davidrajala01@gmail.com</ContactLink>
            </ContactItem>
            <ContactItem>
              <ContactIcon></ContactIcon>
              <ContactLink href="https://www.linkedin.com/in/david-johansson-6027b4187/" target="_blank" rel="noopener noreferrer">
                LinkedIn
              </ContactLink>
            </ContactItem>
            <ContactItem>
              <ContactIcon></ContactIcon>
              <ContactLink href="https://www.instagram.com/rajala_david/" target="_blank" rel="noopener noreferrer">
                Instagram
              </ContactLink>
            </ContactItem>
          </ContactLinks>
        </ContactSection>
      </FooterContent>
      
      <Copyright>
        © {new Date().getFullYear()} D.R
      </Copyright>
    </FooterContainer>
  );
};

// Styled Components
const FooterContainer = styled.footer`
  background-color: #0a0e17;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 3rem 2rem 1.5rem;
  margin-top: 4rem;
`;

const FooterContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ProfileSection = styled.div`
  flex: 1;
  min-width: 300px;
  display: flex;
  gap: 1.5rem;
  
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`;

const ProfileImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #c45b5b;
`;

const ProfileInfo = styled.div`
  h3 {
    margin-top: 0;
    margin-bottom: 0.5rem;
    font-size: 1.5rem;
  }
  
  p {
    margin: 0;
    opacity: 0.8;
    line-height: 1.6;
    font-size: 0.95rem;
  }
`;

const ContactSection = styled.div`
  flex: 1;
  min-width: 300px;
`;

const ContactTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.5rem;
`;

const ContactLinks = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ContactIcon = styled.span`
  font-size: 1.25rem;
`;

const ContactLink = styled.a`
  color: white;
  text-decoration: none;
  transition: color 0.2s ease;
  
  &:hover {
    color: #c45b5b;
    text-decoration: underline;
  }
`;

const Copyright = styled.div`
  margin-top: 3rem;
  text-align: center;
  font-size: 0.85rem;
  opacity: 0.6;
`;

export default Footer;