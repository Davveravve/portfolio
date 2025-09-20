import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  z-index: 2000;
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
  border-radius: 16px;
  max-width: 400px;
  width: 100%;
  overflow: hidden;
  position: relative;
  box-shadow:
    0 25px 50px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1);
`;

const ModalHeader = styled.div`
  padding: 1.5rem 1.5rem 1rem 1.5rem;
  text-align: center;
  border-bottom: 1px solid #e2e8f0;
`;

const ModalIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${props => {
    switch(props.type) {
      case 'danger': return 'rgba(239, 68, 68, 0.1)';
      case 'warning': return 'rgba(245, 158, 11, 0.1)';
      case 'info': return 'rgba(59, 130, 246, 0.1)';
      default: return 'rgba(239, 68, 68, 0.1)';
    }
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  font-size: 1.5rem;
`;

const ModalTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
`;

const ModalMessage = styled.p`
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
  line-height: 1.5;
`;

const ModalFooter = styled.div`
  padding: 1rem 1.5rem 1.5rem 1.5rem;
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
`;

const Button = styled(motion.button)`
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid;
  transition: all 0.2s ease;
  min-width: 80px;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CancelButton = styled(Button)`
  background: white;
  color: #64748b;
  border-color: #e2e8f0;

  &:hover:not(:disabled) {
    background: #f8fafc;
    border-color: #cbd5e1;
  }
`;

const ConfirmButton = styled(Button)`
  background: ${props => {
    switch(props.type) {
      case 'danger': return '#ef4444';
      case 'warning': return '#f59e0b';
      case 'info': return '#3b82f6';
      default: return '#ef4444';
    }
  }};
  color: white;
  border-color: ${props => {
    switch(props.type) {
      case 'danger': return '#ef4444';
      case 'warning': return '#f59e0b';
      case 'info': return '#3b82f6';
      default: return '#ef4444';
    }
  }};

  &:hover:not(:disabled) {
    background: ${props => {
      switch(props.type) {
        case 'danger': return '#dc2626';
        case 'warning': return '#d97706';
        case 'info': return '#2563eb';
        default: return '#dc2626';
      }
    }};
  }
`;

const getIcon = (type) => {
  switch(type) {
    case 'danger': return '⚠️';
    case 'warning': return '⚠️';
    case 'info': return 'ℹ️';
    default: return '⚠️';
  }
};

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Bekräfta åtgärd",
  message = "Är du säker på att du vill fortsätta?",
  confirmText = "Bekräfta",
  cancelText = "Avbryt",
  type = "danger", // danger, warning, info
  isLoading = false
}) => {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  };

  const handleConfirm = () => {
    if (!isLoading) {
      onConfirm();
    }
  };

  const handleCancel = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleOverlayClick}
        >
          <ModalContent
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalHeader>
              <ModalIcon type={type}>
                {getIcon(type)}
              </ModalIcon>
              <ModalTitle>{title}</ModalTitle>
              <ModalMessage>{message}</ModalMessage>
            </ModalHeader>

            <ModalFooter>
              <CancelButton
                onClick={handleCancel}
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {cancelText}
              </CancelButton>
              <ConfirmButton
                type={type}
                onClick={handleConfirm}
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? '...' : confirmText}
              </ConfirmButton>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationModal;