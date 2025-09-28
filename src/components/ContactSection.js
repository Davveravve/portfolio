import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { theme, glassMorphism } from '../styles/theme';

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(5deg); }
`;

const Section = styled.section`
  padding: ${theme.spacing['3xl']} 0;
  position: relative;
  z-index: 2;
  background: linear-gradient(180deg, transparent 0%, rgba(99, 102, 241, 0.02) 100%);

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

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  margin-top: 3rem;

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  @media (max-width: ${theme.breakpoints.md}) {
    margin-top: 2rem;
  }
`;

const ContactInfo = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const InfoCard = styled(motion.div)`
  ${glassMorphism}
  padding: 1.5rem;
  border-radius: ${theme.radius.lg};
  display: flex;
  align-items: center;
  gap: 1.5rem;
  transition: all 0.3s ease;

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: 1rem;
    gap: 1rem;
  }

  &:hover {
    transform: translateX(10px);
    box-shadow: ${theme.shadows.lg};
    background: rgba(99, 102, 241, 0.05);
  }
`;

const IconWrapper = styled.div`
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${theme.gradients.primary};
  border-radius: ${theme.radius.md};
  animation: ${float} 4s ease-in-out infinite;
  animation-delay: ${props => props.delay || '0s'};
  flex-shrink: 0;

  @media (max-width: ${theme.breakpoints.sm}) {
    width: 40px;
    height: 40px;
  }

  svg {
    width: 24px;
    height: 24px;
    color: white;

    @media (max-width: ${theme.breakpoints.sm}) {
      width: 20px;
      height: 20px;
    }
  }
`;

const InfoContent = styled.div`
  flex: 1;

  h4 {
    font-size: 1rem;
    color: ${theme.colors.textSecondary};
    margin-bottom: 0.25rem;
    font-weight: 500;

    @media (max-width: ${theme.breakpoints.sm}) {
      font-size: 0.875rem;
    }
  }

  p {
    font-size: 1.125rem;
    color: ${theme.colors.text};
    font-weight: 600;

    @media (max-width: ${theme.breakpoints.sm}) {
      font-size: 1rem;
    }
  }

  a {
    color: ${theme.colors.text};
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: ${theme.colors.accent};
    }
  }
`;

const FormContainer = styled(motion.div)`
  ${glassMorphism}
  padding: 2.5rem;
  border-radius: ${theme.radius.xl};
  position: relative;
  overflow: hidden;

  @media (max-width: ${theme.breakpoints.md}) {
    padding: 2rem;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: 1.5rem;
  }

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%);
    animation: rotate 20s linear infinite;
  }

  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const Form = styled.form`
  position: relative;
  z-index: 1;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  color: ${theme.colors.textSecondary};
  margin-bottom: 0.5rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${theme.radius.md};
  color: ${theme.colors.text};
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.05);
    border-color: ${theme.colors.accent};
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }

  &::placeholder {
    color: ${theme.colors.textMuted};
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${theme.radius.md};
  color: ${theme.colors.text};
  font-size: 1rem;
  min-height: 150px;
  resize: vertical;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.05);
    border-color: ${theme.colors.accent};
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }

  &::placeholder {
    color: ${theme.colors.textMuted};
  }
`;

const SubmitButton = styled(motion.button)`
  width: 100%;
  padding: 1.25rem;
  background: ${theme.gradients.primary};
  color: white;
  border: none;
  border-radius: ${theme.radius.md};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.lg}, ${theme.shadows.glow};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
  }

  &:active::after {
    width: 300px;
    height: 300px;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  justify-content: center;
`;

const SocialLink = styled(motion.a)`
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  ${glassMorphism}
  border-radius: ${theme.radius.md};
  color: ${theme.colors.text};
  font-size: 1.25rem;
  transition: all 0.3s ease;

  &:hover {
    background: ${theme.gradients.primary};
    transform: translateY(-5px) rotate(5deg);
    box-shadow: ${theme.shadows.glow};
  }
`;

const SuccessMessage = styled(motion.div)`
  padding: 1rem;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: ${theme.radius.md};
  color: #10b981;
  text-align: center;
  margin-top: 1rem;
`;

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({ name: '', email: '', message: '' });

      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    }, 2000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Section id="contact">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          <p style={{
            color: theme.colors.accent,
            fontSize: '0.875rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: '0.5rem'
          }}>
            Get In Touch
          </p>
          <h2 style={{
            fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
            fontWeight: 800,
            marginBottom: '1rem',
            background: theme.gradients.text,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Let's Create Together
          </h2>
          <p style={{
            fontSize: '1.125rem',
            color: theme.colors.textSecondary,
            maxWidth: '600px',
            margin: '0 auto',
          }}>
            Have a project in mind? Let's discuss how we can work together to bring your ideas to life.
          </p>
        </motion.div>

        <ContactGrid>
          <ContactInfo>
            <InfoCard
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <IconWrapper delay="0s">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="m22 7-10 5L2 7"/>
                </svg>
              </IconWrapper>
              <InfoContent>
                <h4>Email</h4>
                <p><a href="mailto:davidjohanssonrajala@gmail.com">davidjohanssonrajala@gmail.com</a></p>
              </InfoContent>
            </InfoCard>

            <InfoCard
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <IconWrapper delay="1s">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="5" y="2" width="14" height="20" rx="2"/>
                  <path d="M12 18h.01"/>
                </svg>
              </IconWrapper>
              <InfoContent>
                <h4>Phone</h4>
                <p><a href="tel:+46723040296">+46 72 304 02 96</a></p>
              </InfoContent>
            </InfoCard>

            <InfoCard
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <IconWrapper delay="2s">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </IconWrapper>
              <InfoContent>
                <h4>Location</h4>
                <p>Gothenburg, Sweden</p>
              </InfoContent>
            </InfoCard>

            <SocialLinks>
              <SocialLink
                href="https://github.com"
                target="_blank"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <i className="fab fa-github"></i>
              </SocialLink>
              <SocialLink
                href="https://linkedin.com"
                target="_blank"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <i className="fab fa-linkedin"></i>
              </SocialLink>
              <SocialLink
                href="https://twitter.com"
                target="_blank"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <i className="fab fa-twitter"></i>
              </SocialLink>
              <SocialLink
                href="https://dribbble.com"
                target="_blank"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <i className="fab fa-dribbble"></i>
              </SocialLink>
            </SocialLinks>
          </ContactInfo>

          <FormContainer
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label htmlFor="name">Your Name</Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell me about your project..."
                  required
                />
              </FormGroup>

              <SubmitButton
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </SubmitButton>

              {isSuccess && (
                <SuccessMessage
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  ✅ Message sent successfully! I'll get back to you soon.
                </SuccessMessage>
              )}
            </Form>
          </FormContainer>
        </ContactGrid>
      </Container>
    </Section>
  );
};

export default ContactSection;