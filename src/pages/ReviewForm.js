import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 30% 20%, rgba(239, 68, 68, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 70% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const FormCard = styled(motion.div)`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%);
  border-radius: 24px;
  padding: 3rem;
  box-shadow:
    0 32px 80px rgba(0, 0, 0, 0.2),
    0 16px 40px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  max-width: 650px;
  width: 100%;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    padding: 2rem;
    margin: 1rem;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  color: #1e293b;
  text-align: center;
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
`;

const Subtitle = styled.p`
  color: #64748b;
  text-align: center;
  font-size: 1.1rem;
  margin-bottom: 2.5rem;
  line-height: 1.6;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 2.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 600;
  color: #374151;
  font-size: 0.95rem;
`;

const Input = styled.input`
  padding: 1.2rem;
  border: 2px solid rgba(226, 232, 240, 0.6);
  border-radius: 16px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: rgba(248, 250, 252, 0.8);
  backdrop-filter: blur(5px);
  color: #1e293b;

  &:focus {
    outline: none;
    border-color: #667eea;
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1), 0 8px 25px rgba(0, 0, 0, 0.08);
    transform: translateY(-1px);
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

const TextArea = styled.textarea`
  padding: 1.2rem;
  border: 2px solid rgba(226, 232, 240, 0.6);
  border-radius: 16px;
  font-size: 1rem;
  min-height: 140px;
  resize: vertical;
  font-family: inherit;
  transition: all 0.3s ease;
  background: rgba(248, 250, 252, 0.8);
  backdrop-filter: blur(5px);
  color: #1e293b;
  line-height: 1.6;

  &:focus {
    outline: none;
    border-color: #667eea;
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1), 0 8px 25px rgba(0, 0, 0, 0.08);
    transform: translateY(-1px);
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

const RatingGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const StarContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const Star = styled.button`
  background: none;
  border: none;
  font-size: 2.2rem;
  color: ${props => props.filled ? '#fbbf24' : 'rgba(209, 213, 219, 0.7)'};
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: scale(1.15);
    color: #fbbf24;
    background: rgba(251, 191, 36, 0.1);
    text-shadow: 0 0 15px rgba(251, 191, 36, 0.5);
  }

  &:active {
    transform: scale(1.05);
  }
`;

const SubmitButton = styled(motion.button)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1.2rem 2.5rem;
  border-radius: 16px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1.5rem;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3), 0 4px 15px rgba(0, 0, 0, 0.1);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.6s ease;
  }

  &:hover::before {
    left: 100%;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }

  &:not(:disabled):hover {
    box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4), 0 6px 20px rgba(0, 0, 0, 0.15);
  }
`;

const SuccessMessage = styled(motion.div)`
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  padding: 2.5rem;
  border-radius: 24px;
  text-align: center;
  font-weight: 600;
  font-size: 1.1rem;
  line-height: 1.6;
  box-shadow: 0 20px 60px rgba(16, 185, 129, 0.2), 0 8px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const ErrorMessage = styled(motion.div)`
  background: #ef4444;
  color: white;
  padding: 1rem;
  border-radius: 12px;
  text-align: center;
  margin-top: 1rem;
`;

const ReviewForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    rating: 0,
    review: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRatingClick = (rating) => {
    setFormData({
      ...formData,
      rating
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.review || formData.rating === 0) {
      setError('Vänligen fyll i alla obligatoriska fält och välj ett betyg');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await addDoc(collection(db, 'reviews'), {
        ...formData,
        createdAt: new Date(),
        approved: false,
        status: 'pending'
      });

      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting review:', err);
      setError('Något gick fel. Försök igen senare.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Container>
        <SuccessMessage
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          Tack för din recension!
        </SuccessMessage>
      </Container>
    );
  }

  return (
    <Container>
      <FormCard
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Title>Skriv en recension</Title>
        <Subtitle>
          Dela din upplevelse av att arbeta med David
        </Subtitle>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label>Namn *</Label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Ditt fullständiga namn"
              required
            />
          </InputGroup>

          <InputGroup>
            <Label>E-post *</Label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="din@email.com"
              required
            />
          </InputGroup>

          <InputGroup>
            <Label>Företagsnamn</Label>
            <Input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              placeholder="Ditt företag eller organisation (valfritt)"
            />
          </InputGroup>

          <RatingGroup>
            <Label>Betyg *</Label>
            <StarContainer>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  type="button"
                  filled={star <= formData.rating}
                  onClick={() => handleRatingClick(star)}
                >
                  ★
                </Star>
              ))}
              <span style={{ marginLeft: '1rem', color: '#64748b' }}>
                {formData.rating > 0 && `${formData.rating}/5`}
              </span>
            </StarContainer>
          </RatingGroup>

          <InputGroup>
            <Label>Din recension *</Label>
            <TextArea
              name="review"
              value={formData.review}
              onChange={handleInputChange}
              placeholder="Berätta om din upplevelse av att arbeta med David..."
              required
            />
          </InputGroup>

          {error && (
            <ErrorMessage
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </ErrorMessage>
          )}

          <SubmitButton
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isSubmitting ? 'Skickar...' : 'Skicka recension'}
          </SubmitButton>
        </Form>
      </FormCard>
    </Container>
  );
};

export default ReviewForm;