import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import ContactForm from './ContactFormFirebase';
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
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow:
    0 25px 50px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1);

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f5f9;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--main-color, #ef4444);
    border-radius: 4px;
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

const ContactModal = ({ onClose }) => {
  const { t } = useLanguage();

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
          <ModalTitle>{t('contact.title')}</ModalTitle>
          <ModalSubtitle>{t('contact.subtitle')}</ModalSubtitle>
        </ModalHeader>

        <ModalBody>
          <ContactForm />
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ContactModal;