import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useLanguage } from '../context/LanguageContext';

const FormContainer = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 3rem;
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
  border: 2px solid #f3f4f6;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    width: 90%;
    padding: 2rem 1.5rem;
    margin: 0 auto;
  }
`;

const Title = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #0f172a;
  text-align: center;
  font-weight: 700;
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
  font-weight: 600;
  color: #0f172a;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const Input = styled.input`
  padding: 1rem 1.25rem;
  border: 2px solid ${props => props.hasError ? 'var(--main-color, #ef4444)' : '#e5e7eb'};
  border-radius: 10px;
  font-size: 1rem;
  background: #f9fafb;
  color: #0f172a;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: ${props => props.hasError ? 'shake 0.5s ease-in-out' : 'none'};

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? 'var(--main-color, #ef4444)' : 'var(--main-color, #ef4444)'};
    background: white;
    box-shadow: 0 0 0 3px ${props => props.hasError ? 'rgba(var(--main-color-rgb, 239, 68, 68), 0.2)' : 'rgba(var(--main-color-rgb, 239, 68, 68), 0.1)'};
  }

  &:hover {
    border-color: ${props => props.hasError ? 'var(--main-color, #ef4444)' : '#d1d5db'};
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
  }
`;

const TextArea = styled.textarea`
  padding: 1rem 1.25rem;
  border: 2px solid ${props => props.hasError ? 'var(--main-color, #ef4444)' : '#e5e7eb'};
  border-radius: 10px;
  font-size: 1rem;
  min-height: 140px;
  resize: vertical;
  background: #f9fafb;
  color: #0f172a;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: inherit;
  animation: ${props => props.hasError ? 'shake 0.5s ease-in-out' : 'none'};

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? 'var(--main-color, #ef4444)' : 'var(--main-color, #ef4444)'};
    background: white;
    box-shadow: 0 0 0 3px ${props => props.hasError ? 'rgba(var(--main-color-rgb, 239, 68, 68), 0.2)' : 'rgba(var(--main-color-rgb, 239, 68, 68), 0.1)'};
  }

  &:hover {
    border-color: ${props => props.hasError ? 'var(--main-color, #ef4444)' : '#d1d5db'};
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
  }
`;

const SubmitButton = styled(motion.button)`
  padding: 1rem 2rem;
  background: linear-gradient(135deg, var(--main-color, #ef4444) 0%, var(--main-color, #dc2626) 100%);
  color: white;
  border: none;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  box-shadow: 0 4px 20px rgba(var(--main-color-rgb, 239, 68, 68), 0.3);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 30px rgba(var(--main-color-rgb, 239, 68, 68), 0.4);
    background: linear-gradient(135deg, var(--main-color, #dc2626) 0%, var(--main-color, #b91c1c) 100%);
  }

  &:disabled {
    background: rgba(255, 255, 255, 0.2);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

// Toast Notification Styles
const ToastContainer = styled(motion.div)`
  position: fixed;
  bottom: 2rem;
  left: 2rem;
  z-index: 9999;
  pointer-events: none;
`;

const Toast = styled(motion.div)`
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(16, 185, 129, 0.3);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 600;
  font-size: 0.95rem;
  min-width: 280px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);

  @media (max-width: 768px) {
    bottom: 1rem;
    left: 1rem;
    right: 1rem;
    min-width: auto;
  }
`;

const ToastIcon = styled.div`
  background: rgba(255, 255, 255, 0.2);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  flex-shrink: 0;
`;

const ToastContent = styled.div`
  flex: 1;
`;

const ToastTitle = styled.div`
  font-weight: 700;
  font-size: 1rem;
  margin-bottom: 0.25rem;
`;

const ToastMessage = styled.div`
  font-weight: 500;
  opacity: 0.9;
  font-size: 0.875rem;
`;

const ContactForm = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 4000); // Hide after 4 seconds
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log('Sending message to Firebase:', formData);

      const messageData = {
        ...formData,
        read: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const docRef = await addDoc(collection(db, 'messages'), messageData);
      console.log('Message sent successfully with ID:', docRef.id);

      setShowToast(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error('Error sending message:', error);
      // Could add error toast here if needed
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormContainer
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: 0.1
      }}
    >
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="name">{t('contact.form.name')}</Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            disabled={isSubmitting}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="email">{t('contact.form.email')}</Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            disabled={isSubmitting}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="phone">Mobilnummer</Label>
          <Input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            disabled={isSubmitting}
            placeholder="070-123 45 67"
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="message">{t('contact.form.message')}</Label>
          <TextArea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            required
            disabled={isSubmitting}
            placeholder={t('contact.form.placeholder')}
          />
        </FormGroup>

        <SubmitButton
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isSubmitting ? t('contact.form.sending') : t('contact.form.submit')}
        </SubmitButton>
      </Form>

    </FormContainer>
  );
};

// Toast Notification Component
const ToastNotification = ({ show }) => {
  const { t } = useLanguage();

  return (
    <AnimatePresence>
      {show && (
        <ToastContainer>
          <Toast
            initial={{
              x: -100,
              opacity: 0,
              scale: 0.8,
              rotateY: -15
            }}
            animate={{
              x: 0,
              opacity: 1,
              scale: 1,
              rotateY: 0
            }}
            exit={{
              x: -100,
              opacity: 0,
              scale: 0.8,
              rotateY: 15
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              duration: 0.6
            }}
          >
            <ToastIcon>
              ✓
            </ToastIcon>
            <ToastContent>
              <ToastTitle>{t('contact.toast.title')}</ToastTitle>
              <ToastMessage>{t('contact.toast.message')}</ToastMessage>
            </ToastContent>
          </Toast>
        </ToastContainer>
      )}
    </AnimatePresence>
  );
};

// Main component with toast
const ContactFormWithToast = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: false
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = true;
    }

    if (!formData.email.trim()) {
      newErrors.email = true;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = true;
    }

    if (!formData.message.trim()) {
      newErrors.message = true;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Sending message to Firebase:', formData);

      const messageData = {
        ...formData,
        read: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const docRef = await addDoc(collection(db, 'messages'), messageData);
      console.log('Message sent successfully with ID:', docRef.id);

      setShowToast(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <FormContainer
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.8,
          ease: [0.25, 0.46, 0.45, 0.94],
          staggerChildren: 0.1
        }}
      >
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="name">{t('contact.form.name')}</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              hasError={errors.name}
              disabled={isSubmitting}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="email">{t('contact.form.email')}</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              hasError={errors.email}
              disabled={isSubmitting}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="phone">Mobilnummer</Label>
            <Input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              hasError={errors.phone}
              disabled={isSubmitting}
              placeholder="070-123 45 67"
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="message">{t('contact.form.message')}</Label>
            <TextArea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              hasError={errors.message}
              disabled={isSubmitting}
              placeholder={t('contact.form.placeholder')}
            />
          </FormGroup>

          <SubmitButton
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isSubmitting ? t('contact.form.sending') : t('contact.form.submit')}
          </SubmitButton>
        </Form>
      </FormContainer>
      <ToastNotification show={showToast} />
    </>
  );
};

export default ContactFormWithToast;

