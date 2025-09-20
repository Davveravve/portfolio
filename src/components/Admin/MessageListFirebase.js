import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  collection,
  doc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import useNotification from '../../hooks/useNotification';
import Notifications from '../Notifications';
import AdminLayout from './AdminLayout';

const Container = styled.div`
  max-width: 1200px;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
`;

const MessagesList = styled.div`
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const MessageItem = styled(motion.div)`
  padding: 1.25rem;
  padding-right: 10rem;
  border-bottom: 1px solid #e2e8f0;
  background-color: ${props => props.unread ? '#ebf8ff' : 'white'};
  transition: var(--transition);
  position: relative;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: ${props => props.unread ? '#bee3f8' : '#f7fafc'};
  }
`;

const MessageHeader = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  margin-bottom: 0.75rem;
`;

const MessageInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const SenderName = styled.div`
  font-weight: 600;
  color: var(--dark-color);
  font-size: 1.1rem;
`;

const SenderEmail = styled.a`
  color: var(--primary-color);
  text-decoration: none;
  font-size: 0.875rem;

  &:hover {
    text-decoration: underline;
  }
`;

const MessageDate = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
`;

const MessageActions = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
  align-items: flex-start;
  position: absolute;
  top: 1rem;
  right: 1rem;
`;

const ActionButton = styled.button`
  padding: 0.25rem 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background: white;
  color: #64748b;
  font-weight: 500;
  min-width: 60px;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const MarkReadButton = styled(ActionButton)`
  background-color: ${props => props.isRead ? '#6b7280' : '#10b981'};
  color: white;
  border-color: ${props => props.isRead ? '#6b7280' : '#10b981'};

  &:hover:not(:disabled) {
    background-color: ${props => props.isRead ? '#4b5563' : '#059669'};
    border-color: ${props => props.isRead ? '#4b5563' : '#059669'};
  }
`;

const DeleteButton = styled(ActionButton)`
  background-color: #dc2626;
  color: white;
  border-color: #dc2626;

  &:hover:not(:disabled) {
    background-color: #b91c1c;
    border-color: #b91c1c;
  }
`;

const MessageContent = styled.div`
  color: var(--dark-color);
  line-height: 1.6;
  white-space: pre-wrap;
  background-color: #f8fafc;
  padding: 1rem;
  border-radius: 6px;
  border-left: 4px solid ${props => props.unread ? 'var(--primary-color)' : '#e2e8f0'};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #6b7280;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const LoadingIndicator = styled.div`
  text-align: center;
  padding: 2rem;
  color: #6b7280;
`;


const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
`;

const formatDate = (date) => {
  if (!date) return '';

  const d = date.toDate ? date.toDate() : new Date(date);
  return d.toLocaleDateString('sv-SE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const MessageList = () => {
  const { notifications, success, error, setNotifications } = useNotification();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      console.log('Fetching messages from Firebase...');
      const messagesQuery = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(messagesQuery);
      const messagesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log('Messages fetched:', messagesData);
      setMessages(messagesData);
    } catch (err) {
      console.error('Error fetching messages:', err);
      error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const toggleReadStatus = async (messageId, currentReadStatus) => {
    try {
      await updateDoc(doc(db, 'messages', messageId), {
        read: !currentReadStatus,
        updatedAt: new Date()
      });

      setMessages(prev => prev.map(msg =>
        msg.id === messageId
          ? { ...msg, read: !currentReadStatus }
          : msg
      ));

      success(`Message marked as ${!currentReadStatus ? 'read' : 'unread'}`);
    } catch (err) {
      console.error('Error updating message:', err);
      error('Failed to update message');
    }
  };

  const deleteMessage = async (messageId) => {
    if (!window.confirm('Are you sure you want to delete this message?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'messages', messageId));
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      success('Message deleted successfully');
    } catch (err) {
      console.error('Error deleting message:', err);
      error('Failed to delete message');
    }
  };

  const unreadCount = messages.filter(msg => !msg.read).length;
  const totalCount = messages.length;

  if (loading) {
    return (
      <AdminLayout>
        <LoadingIndicator>Loading messages...</LoadingIndicator>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Container>
        <Header>
          <Title>Messages</Title>
        </Header>


      <StatsContainer>
        <StatCard>
          <StatValue>{totalCount}</StatValue>
          <StatLabel>Total Messages</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{unreadCount}</StatValue>
          <StatLabel>Unread Messages</StatLabel>
        </StatCard>
      </StatsContainer>

      {messages.length > 0 ? (
        <MessagesList>
          {messages.map((message, index) => (
            <MessageItem
              key={message.id}
              unread={!message.read}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <MessageActions>
                <MarkReadButton
                  isRead={message.read}
                  onClick={() => toggleReadStatus(message.id, message.read)}
                  title={message.read ? 'Mark as unread' : 'Mark as read'}
                >
                  {message.read ? 'Unread' : 'Read'}
                </MarkReadButton>
                <DeleteButton
                  onClick={() => deleteMessage(message.id)}
                  title="Delete message"
                >
                  Delete
                </DeleteButton>
              </MessageActions>
              <MessageHeader>
                <MessageInfo>
                  <SenderName>{message.name}</SenderName>
                  <SenderEmail href={`mailto:${message.email}`}>
                    {message.email}
                  </SenderEmail>
                  <MessageDate>
                    {formatDate(message.createdAt)}
                  </MessageDate>
                </MessageInfo>
              </MessageHeader>
              <MessageContent unread={!message.read}>
                {message.message}
              </MessageContent>
            </MessageItem>
          ))}
        </MessagesList>
      ) : (
        <EmptyState>
          <h3>No messages yet</h3>
          <p>When visitors send messages through your contact form, they'll appear here.</p>
        </EmptyState>
      )}

        <Notifications
          notifications={notifications}
          onRemove={(id) => setNotifications(prev => prev.filter(n => n.id !== id))}
        />
      </Container>
    </AdminLayout>
  );
};

export default MessageList;