import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../../config/firebase';
import AdminLayout from './AdminLayout';

const Content = styled.div`
  /* Remove padding since AdminLayout handles it */
`;

const LinkSection = styled.div`
  background: #f8fafc;
  border: 2px dashed #cbd5e1;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const LinkTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1rem;
`;

const LinkContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
`;

const LinkInput = styled.input`
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: white;
  font-family: monospace;
  min-width: 300px;
`;

const CopyButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #2563eb;
  }
`;

const ReviewsGrid = styled.div`
  display: grid;
  gap: 1.5rem;
`;

const ReviewCard = styled(motion.div)`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: ${props => props.status === 'pending' ? '2px solid #f59e0b' : props.status === 'approved' ? '2px solid #10b981' : '2px solid #e5e7eb'};
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const ReviewerInfo = styled.div`
  h4 {
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 0.25rem;
  }

  p {
    color: #64748b;
    font-size: 0.9rem;
    margin: 0;
  }
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  background: ${props =>
    props.status === 'pending' ? '#fef3c7' :
    props.status === 'approved' ? '#d1fae5' : '#fee2e2'
  };
  color: ${props =>
    props.status === 'pending' ? '#d97706' :
    props.status === 'approved' ? '#065f46' : '#dc2626'
  };
`;

const StarRating = styled.div`
  display: flex;
  gap: 0.25rem;
  margin: 0.5rem 0;

  span {
    color: #fbbf24;
    font-size: 1.2rem;
  }
`;

const ReviewText = styled.p`
  color: #374151;
  line-height: 1.6;
  margin: 1rem 0;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
`;

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &.approve {
    background: #10b981;
    color: white;

    &:hover {
      background: #059669;
    }
  }

  &.reject {
    background: #ef4444;
    color: white;

    &:hover {
      background: #dc2626;
    }
  }

  &.delete {
    background: #6b7280;
    color: white;

    &:hover {
      background: #4b5563;
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #64748b;

  h3 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    color: #374151;
  }
`;

const ReviewManager = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const reviewLink = `${window.location.origin}/review`;

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const reviewsQuery = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
      const reviewsSnapshot = await getDocs(reviewsQuery);
      const reviewsData = reviewsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setReviews(reviewsData);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateReviewStatus = async (reviewId, status) => {
    try {
      await updateDoc(doc(db, 'reviews', reviewId), {
        status,
        approved: status === 'approved',
        updatedAt: new Date()
      });
      fetchReviews();
    } catch (error) {
      console.error('Error updating review:', error);
    }
  };

  const deleteReview = async (reviewId) => {
    if (window.confirm('Är du säker på att du vill ta bort denna recension?')) {
      try {
        await deleteDoc(doc(db, 'reviews', reviewId));
        fetchReviews();
      } catch (error) {
        console.error('Error deleting review:', error);
      }
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(reviewLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying link:', error);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i}>{i < rating ? '★' : '☆'}</span>
    ));
  };

  if (loading) {
    return (
      <AdminLayout title="Recensioner" subtitle="Hantera kundrecensioner">
        <Content>Laddar recensioner...</Content>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Recensioner" subtitle="Hantera kundrecensioner">
      <Content>

      <LinkSection>
        <LinkTitle>Recensionslänk</LinkTitle>
        <p style={{ color: '#64748b', marginBottom: '1rem', fontSize: '0.9rem' }}>
          Skicka denna länk till kunder som ska lämna recensioner:
        </p>
        <LinkContainer>
          <LinkInput
            type="text"
            value={reviewLink}
            readOnly
          />
          <CopyButton onClick={copyLink}>
            {copied ? '✓ Kopierad!' : 'Kopiera länk'}
          </CopyButton>
        </LinkContainer>
      </LinkSection>

      {reviews.length === 0 ? (
        <EmptyState>
          <h3>Inga recensioner än</h3>
          <p>Skicka recensionslänken till dina kunder för att få recensioner.</p>
        </EmptyState>
      ) : (
        <ReviewsGrid>
          <AnimatePresence>
            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                status={review.status}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ReviewHeader>
                  <ReviewerInfo>
                    <h4>{review.name}</h4>
                    <p>{review.email}</p>
                    {review.company && <p>{review.company}</p>}
                  </ReviewerInfo>
                  <StatusBadge status={review.status}>
                    {review.status === 'pending' ? 'Väntar' :
                     review.status === 'approved' ? 'Godkänd' : 'Avvisad'}
                  </StatusBadge>
                </ReviewHeader>

                <StarRating>
                  {renderStars(review.rating)}
                  <span style={{ marginLeft: '0.5rem', color: '#64748b', fontSize: '0.9rem' }}>
                    {review.rating}/5
                  </span>
                </StarRating>

                <ReviewText>{review.review}</ReviewText>

                <p style={{ color: '#64748b', fontSize: '0.8rem', margin: '0.5rem 0' }}>
                  Skickat: {review.createdAt?.toDate?.()?.toLocaleDateString('sv-SE') || 'Okänt datum'}
                </p>

                <ActionButtons>
                  {review.status !== 'approved' && (
                    <ActionButton
                      className="approve"
                      onClick={() => updateReviewStatus(review.id, 'approved')}
                    >
                      Godkänn
                    </ActionButton>
                  )}
                  {review.status !== 'rejected' && (
                    <ActionButton
                      className="reject"
                      onClick={() => updateReviewStatus(review.id, 'rejected')}
                    >
                      Avvisa
                    </ActionButton>
                  )}
                  <ActionButton
                    className="delete"
                    onClick={() => deleteReview(review.id)}
                  >
                    Ta bort
                  </ActionButton>
                </ActionButtons>
              </ReviewCard>
            ))}
          </AnimatePresence>
        </ReviewsGrid>
      )}
      </Content>
    </AdminLayout>
  );
};

export default ReviewManager;