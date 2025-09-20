import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';

const ReviewsContainer = styled.section`
  padding: 6rem 0;
  background: #f8fafc;
  position: relative;
  margin: 0;
  border: none;

  @media (max-width: 768px) {
    padding: 4rem 0;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const SectionTitle = styled(motion.h2)`
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 800;
  text-align: center;
  margin-bottom: 1rem;
  color: var(--main-color, #0f172a);
  letter-spacing: -0.02em;
`;

const SectionSubtitle = styled(motion.p)`
  text-align: center;
  font-size: 1.25rem;
  color: #64748b;
  margin-bottom: 4rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const ReviewsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const ReviewCard = styled(motion.div)`
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 24px;
  padding: 2.5rem;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.08),
    0 8px 25px rgba(0, 0, 0, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(226, 232, 240, 0.6);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 5px;
    background: linear-gradient(90deg, var(--main-color, #ef4444) 0%, #f59e0b 50%, var(--main-color, #ef4444) 100%);
    border-radius: 24px 24px 0 0;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -50%;
    right: -30%;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, rgba(var(--main-color-rgb, 239, 68, 68), 0.03) 0%, transparent 70%);
    pointer-events: none;
  }
`;

const ReviewHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const Avatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--main-color, #ef4444) 0%, #f59e0b 50%, var(--main-color, #ef4444) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 800;
  font-size: 1.3rem;
  text-transform: uppercase;
  box-shadow: 0 8px 25px rgba(var(--main-color-rgb, 239, 68, 68), 0.4);
  border: 3px solid white;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    inset: -3px;
    border-radius: 50%;
    background: linear-gradient(135deg, transparent 30%, rgba(255, 255, 255, 0.3) 50%, transparent 70%);
    z-index: -1;
  }
`;

const ReviewerInfo = styled.div`
  flex: 1;
`;

const ReviewerName = styled.h4`
  margin: 0 0 0.25rem 0;
  font-weight: 600;
  color: #1e293b;
  font-size: 1.1rem;
`;

const ReviewerCompany = styled.p`
  margin: 0;
  color: #64748b;
  font-size: 0.9rem;
`;

const StarRating = styled.div`
  display: flex;
  gap: 0.3rem;
  margin-bottom: 1.5rem;
  align-items: center;
`;

const Star = styled.span`
  color: #fbbf24;
  font-size: 1.4rem;
  text-shadow: 0 2px 4px rgba(251, 191, 36, 0.3);
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
`;

const ReviewText = styled.p`
  color: #1e293b;
  line-height: 1.8;
  font-size: 1.1rem;
  margin: 0;
  font-style: italic;
  position: relative;
  padding: 1rem 0;

  &::before {
    content: '"';
    font-size: 3rem;
    color: rgba(var(--main-color-rgb, 239, 68, 68), 0.2);
    position: absolute;
    top: -0.5rem;
    left: -0.8rem;
    font-family: 'Georgia', serif;
    font-weight: normal;
    z-index: 0;
    line-height: 1;
  }

  &::after {
    content: '"';
    font-size: 3rem;
    color: rgba(var(--main-color-rgb, 239, 68, 68), 0.2);
    position: absolute;
    bottom: -1.2rem;
    right: -0.3rem;
    font-family: 'Georgia', serif;
    font-weight: normal;
    z-index: 0;
    line-height: 1;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #64748b;

  h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #374151;
  }

  p {
    font-size: 1.1rem;
    line-height: 1.6;
  }
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #64748b;
  font-size: 1.1rem;
`;

const ReviewsSection = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApprovedReviews();
  }, []);

  const fetchApprovedReviews = async () => {
    try {
      const reviewsQuery = query(
        collection(db, 'reviews'),
        where('approved', '==', true)
      );
      const reviewsSnapshot = await getDocs(reviewsQuery);
      let reviewsData = reviewsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Sort in JavaScript instead of Firestore to avoid index issues
      reviewsData = reviewsData.sort((a, b) => {
        const aDate = a.createdAt?.toDate?.() || new Date(a.createdAt || 0);
        const bDate = b.createdAt?.toDate?.() || new Date(b.createdAt || 0);
        return bDate - aDate;
      });

      console.log('Fetched approved reviews:', reviewsData);
      setReviews(reviewsData);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .slice(0, 2);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i}>{i < rating ? '★' : '☆'}</Star>
    ));
  };

  if (loading) {
    return (
      <ReviewsContainer>
        <Container>
          <LoadingState>Laddar recensioner...</LoadingState>
        </Container>
      </ReviewsContainer>
    );
  }

  if (reviews.length === 0) {
    return (
      <ReviewsContainer>
        <Container>
          <SectionTitle
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Vad kunder säger
          </SectionTitle>
          <EmptyState>
            <h3>Inga recensioner ännu</h3>
            <p>Kommer snart att visa vad mina kunder tycker om att arbeta med mig.</p>
          </EmptyState>
        </Container>
      </ReviewsContainer>
    );
  }

  return (
    <ReviewsContainer>
      <Container>
        <SectionTitle
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          Vad kunder säger
        </SectionTitle>

        <SectionSubtitle
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Läs vad mina kunder tycker om att arbeta med mig
        </SectionSubtitle>

        <ReviewsGrid>
          {reviews.map((review, index) => (
            <ReviewCard
              key={review.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <ReviewHeader>
                <Avatar>
                  {getInitials(review.name)}
                </Avatar>
                <ReviewerInfo>
                  <ReviewerName>{review.name}</ReviewerName>
                  {review.company && (
                    <ReviewerCompany>{review.company}</ReviewerCompany>
                  )}
                </ReviewerInfo>
              </ReviewHeader>

              <StarRating>
                {renderStars(review.rating)}
              </StarRating>

              <ReviewText>
                {review.review}
              </ReviewText>
            </ReviewCard>
          ))}
        </ReviewsGrid>
      </Container>
    </ReviewsContainer>
  );
};

export default ReviewsSection;