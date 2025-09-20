import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';

const ReviewsContainer = styled.section`
  padding: 6rem 0;
  background: #f8fafc;
  position: relative;
  margin: 0;
  border: none;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 4rem 0;
  }
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
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

const CarouselContainer = styled.div`
  position: relative;
  height: 500px;
  perspective: 1200px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    height: 550px;
    perspective: 800px;
  }
`;

const CarouselTrack = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ArrowButton = styled(motion.button)`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%);
  border: 2px solid rgba(226, 232, 240, 0.8);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: var(--main-color, #ef4444);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.12),
    0 4px 12px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  z-index: 20;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);

  &:hover {
    background: linear-gradient(135deg, var(--main-color, #ef4444) 0%, rgba(var(--main-color-rgb, 239, 68, 68), 0.9) 100%);
    color: white;
    border-color: var(--main-color, #ef4444);
    box-shadow:
      0 12px 40px rgba(var(--main-color-rgb, 239, 68, 68), 0.4),
      0 6px 16px rgba(var(--main-color-rgb, 239, 68, 68), 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
    transform: translateY(-50%) scale(1.05);
  }

  &:active {
    transform: translateY(-50%) scale(0.95);
  }

  &.prev {
    left: 80px;
  }

  &.next {
    right: 80px;
  }

  svg {
    width: 24px;
    height: 24px;
    fill: currentColor;
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: scale(1.1);
  }

  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
    font-size: 1.2rem;

    &.prev {
      left: 10px;
    }

    &.next {
      right: 10px;
    }

    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

const ReviewCard = styled(motion.div)`
  position: absolute;
  width: 90%;
  max-width: 450px;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 24px;
  padding: 2.5rem;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.08),
    0 8px 25px rgba(0, 0, 0, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(226, 232, 240, 0.6);
  overflow: hidden;
  backdrop-filter: blur(10px);
  backface-visibility: hidden;
  transform-origin: center;
  user-select: none;

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

  @media (max-width: 768px) {
    max-width: 320px;
    padding: 2rem;
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

const DotsIndicator = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 3rem;
`;

const Dot = styled.button`
  width: ${props => props.active ? '24px' : '8px'};
  height: 8px;
  border-radius: 4px;
  background: ${props => props.active ? 'var(--main-color, #ef4444)' : '#cbd5e1'};
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.active ? 'var(--main-color, #ef4444)' : '#94a3b8'};
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

const ReviewsCarousel = () => {
  const [reviews, setReviews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
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

      // Sort in JavaScript
      reviewsData = reviewsData.sort((a, b) => {
        const aDate = a.createdAt?.toDate?.() || new Date(a.createdAt || 0);
        const bDate = b.createdAt?.toDate?.() || new Date(b.createdAt || 0);
        return bDate - aDate;
      });

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

  const nextReview = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  // Removed drag and click handlers - using only arrow navigation now

  const getCardStyle = (index) => {
    const diff = index - currentIndex;
    const totalReviews = reviews.length;

    // Handle wrapping
    let normalizedDiff = diff;
    if (diff > totalReviews / 2) {
      normalizedDiff = diff - totalReviews;
    } else if (diff < -totalReviews / 2) {
      normalizedDiff = diff + totalReviews;
    }

    // Calculate position and styling
    const translateX = normalizedDiff * 120;
    const translateZ = Math.abs(normalizedDiff) * -200;
    const rotateY = normalizedDiff * -15;
    const opacity = normalizedDiff === 0 ? 1 : Math.max(0.5 - Math.abs(normalizedDiff) * 0.2, 0);
    const scale = normalizedDiff === 0 ? 1 : 1 - Math.abs(normalizedDiff) * 0.15;
    const zIndex = 10 - Math.abs(normalizedDiff);

    // Only show 3 cards at a time (current, prev, next)
    if (Math.abs(normalizedDiff) > 1) {
      return {
        opacity: 0,
        transform: `translateX(${translateX}px) translateZ(-500px) scale(0.5)`,
        zIndex: 0,
        pointerEvents: 'none'
      };
    }

    return {
      opacity,
      transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
      zIndex,
      pointerEvents: 'none' // No card interaction needed
    };
  };

  if (loading) {
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
            <p>Laddar recensioner...</p>
          </EmptyState>
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

        <CarouselContainer>
          {/* Arrow buttons */}
          {reviews.length > 1 && (
            <>
              <ArrowButton
                className="prev"
                onClick={prevReview}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
              >
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                </svg>
              </ArrowButton>
              <ArrowButton
                className="next"
                onClick={nextReview}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
              >
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
                </svg>
              </ArrowButton>
            </>
          )}

          <CarouselTrack>
            <AnimatePresence mode="sync">
              {reviews.map((review, index) => {
                const style = getCardStyle(index);
                const diff = index - currentIndex;
                const totalReviews = reviews.length;

                let normalizedDiff = diff;
                if (diff > totalReviews / 2) {
                  normalizedDiff = diff - totalReviews;
                } else if (diff < -totalReviews / 2) {
                  normalizedDiff = diff + totalReviews;
                }

                return (
                  <ReviewCard
                    key={review.id}
                    style={style}
                    initial={{ opacity: 0 }}
                    animate={style}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30
                    }}
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
                );
              })}
            </AnimatePresence>
          </CarouselTrack>
        </CarouselContainer>

        {reviews.length > 1 && (
          <DotsIndicator>
            {reviews.map((_, index) => (
              <Dot
                key={index}
                active={index === currentIndex}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </DotsIndicator>
        )}
      </Container>
    </ReviewsContainer>
  );
};

export default ReviewsCarousel;