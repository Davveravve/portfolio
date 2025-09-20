import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import AdminLayout from './AdminLayout';
import ConfirmationModal from '../ConfirmationModal';

const Container = styled.div`
  max-width: 1200px;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 3rem 0 1.5rem 0;

  &:first-child {
    margin-top: 0;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const SectionBadge = styled.span`
  background: ${props => props.variant === 'unread' ? '#ef4444' : '#64748b'};
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
`;

const ActionBar = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
`;

const ActionGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled(motion.button)`
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: white;
  color: #64748b;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
  }

  &.danger {
    color: #dc2626;
    border-color: #dc2626;

    &:hover {
      background: #fef2f2;
    }
  }
`;

const StatsRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled(motion.div)`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  flex: 1;
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #ef4444;
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const MessagesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MessageItem = styled(motion.div)`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;

  ${props => !props.read && `
    border-left: 4px solid #ef4444;
    background: #fefefe;
  `}

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: #cbd5e1;
  }
`;

const MessageHeader = styled.div`
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

const MessageInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const MessageFrom = styled.div`
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
`;

const MessageEmail = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
`;

const MessagePreview = styled.div`
  font-size: 0.875rem;
  color: #4b5563;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const MessageMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;
`;

const MessageDate = styled.div`
  font-size: 0.75rem;
  color: #9ca3af;
  text-align: right;
`;

const StatusBadge = styled.div`
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  ${props => props.read ? `
    background: #e5e7eb;
    color: #6b7280;
  ` : `
    background: #fecaca;
    color: #dc2626;
  `}
`;

const MessageContent = styled.div`
  flex: 1;
  padding: 1rem;
`;

const MessageContentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
`;

const MessageName = styled.div`
  font-weight: 600;
  color: #1f2937;
  font-size: 1rem;
`;

const MessageTime = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

const MessageStatus = styled.div`
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-left: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  min-width: 80px;
  justify-content: center;

  ${props => props.read ? `
    color: #6b7280;
    background: #f8fafc;
  ` : `
    color: #ef4444;
    background: #fef2f2;
  `}
`;

const MessageActions = styled.div`
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  border-left: 1px solid #e2e8f0;
  flex-direction: column;
`;

const MessageActionButton = styled(motion.button)`
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: white;
  color: #64748b;
  cursor: pointer;
  font-size: 0.75rem;
  transition: all 0.2s ease;

  &:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
  }

  &.read {
    color: #10b981;
    border-color: #10b981;

    &:hover {
      background: #f0fdf4;
    }
  }

  &.delete {
    color: #dc2626;
    border-color: #dc2626;

    &:hover {
      background: #fef2f2;
    }
  }
`;

const MessageModal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
`;

const ModalContent = styled(motion.div)`
  background: white;
  border-radius: 12px;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
`;

const ModalHeader = styled.div`
  padding: 2rem;
  border-bottom: 1px solid #e2e8f0;
`;

const ModalTitle = styled.h2`
  margin: 0 0 0.5rem 0;
  color: #1f2937;
  font-size: 1.5rem;
`;

const ModalMeta = styled.div`
  color: #6b7280;
  font-size: 0.875rem;
`;

const ModalBody = styled.div`
  padding: 2rem;
  white-space: pre-wrap;
  line-height: 1.6;
  color: #374151;
`;

const ModalActions = styled.div`
  padding: 1.5rem 2rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;

const CloseButton = styled(motion.button)`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #9ca3af;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;

  &:hover {
    background: #f3f4f6;
    color: #6b7280;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #64748b;

  h3 {
    color: #1f2937;
    margin-bottom: 0.5rem;
  }
`;

const EnhancedMessageList = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

  const unreadMessages = messages.filter(msg => !msg.read);
  const readMessages = messages.filter(msg => msg.read);

  const stats = {
    total: messages.length,
    unread: unreadMessages.length,
    read: readMessages.length
  };

  const fetchMessages = async () => {
    try {
      const messagesQuery = query(
        collection(db, 'messages'),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(messagesQuery);
      const messagesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(messagesData);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };


  const handleMarkAsRead = async (messageId, isRead = true) => {
    try {
      await updateDoc(doc(db, 'messages', messageId), {
        read: isRead,
        updatedAt: new Date()
      });

      setMessages(prev => prev.map(msg =>
        msg.id === messageId ? { ...msg, read: isRead } : msg
      ));

      setSuccess(`Message marked as ${isRead ? 'read' : 'unread'}!`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error updating message:', err);
      setError('Failed to update message');
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm('Are you sure you want to delete this message?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'messages', messageId));
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      setSelectedMessage(null);
      setSuccess('Message deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error deleting message:', err);
      setError('Failed to delete message');
    }
  };

  const handleBulkMarkAsRead = async () => {
    try {
      const updatePromises = unreadMessages.map(message =>
        updateDoc(doc(db, 'messages', message.id), {
          read: true,
          updatedAt: new Date()
        })
      );

      await Promise.all(updatePromises);

      setMessages(prev => prev.map(msg => ({ ...msg, read: true })));
      setSuccess('All messages marked as read!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error marking messages as read:', err);
      setError('Failed to mark messages as read');
    }
  };

  const handleBulkDelete = async (type) => {
    const messagesToDelete = type === 'read' ? readMessages : messages;

    if (!window.confirm(`Are you sure you want to delete all ${type} messages? This action cannot be undone.`)) {
      return;
    }

    try {
      const deletePromises = messagesToDelete.map(message =>
        deleteDoc(doc(db, 'messages', message.id))
      );

      await Promise.all(deletePromises);

      setMessages(prev =>
        type === 'read'
          ? prev.filter(msg => !msg.read)
          : []
      );
      setSuccess(`All ${type} messages deleted successfully!`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error deleting messages:', err);
      setError('Failed to delete messages');
    }
  };

  const handleOpenMessage = async (message) => {
    setSelectedMessage(message);

    // Mark as read if not already read
    if (!message.read) {
      await handleMarkAsRead(message.id, true);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Unknown date';

    try {
      const messageDate = date.toDate ? date.toDate() : new Date(date);
      const now = new Date();
      const diffTime = Math.abs(now - messageDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        return 'Today';
      } else if (diffDays === 2) {
        return 'Yesterday';
      } else if (diffDays <= 7) {
        return `${diffDays - 1} days ago`;
      } else {
        return messageDate.toLocaleDateString();
      }
    } catch (error) {
      return 'Invalid date';
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Messages" subtitle="Loading...">
        <div>Loading...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Messages"
      subtitle="Manage contact form submissions"
    >
      <Container>
        {error && (
          <div style={{
            background: '#fef2f2',
            color: '#dc2626',
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid #fecaca',
            marginBottom: '1rem'
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            background: '#f0fdf4',
            color: '#166534',
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid #bbf7d0',
            marginBottom: '1rem'
          }}>
            {success}
          </div>
        )}

        <StatsRow>
          <StatCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <StatNumber>{stats.total}</StatNumber>
            <StatLabel>Total Messages</StatLabel>
          </StatCard>

          <StatCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <StatNumber>{stats.unread}</StatNumber>
            <StatLabel>Unread Messages</StatLabel>
          </StatCard>

          <StatCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <StatNumber>{stats.read}</StatNumber>
            <StatLabel>Read Messages</StatLabel>
          </StatCard>
        </StatsRow>

        <ActionBar>
          <div></div>
          <ActionGroup>
            <ActionButton
              onClick={() => handleBulkMarkAsRead()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Mark All as Read
            </ActionButton>
            <ActionButton
              className="danger"
              onClick={() => handleBulkDelete('read')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Delete Read Messages
            </ActionButton>
          </ActionGroup>
        </ActionBar>

        {/* Unread Messages Section */}
        <SectionHeader>
          <SectionTitle>
            Unread Messages
            <SectionBadge variant="unread">{stats.unread}</SectionBadge>
          </SectionTitle>
        </SectionHeader>

        {unreadMessages.length === 0 ? (
          <EmptyState>
            <h3>No unread messages</h3>
            <p>All caught up! No new messages to read.</p>
          </EmptyState>
        ) : (
          <MessagesList>
            <AnimatePresence>
              {unreadMessages.map((message, index) => (
                <MessageItem
                  key={message.id}
                  read={message.read}
                  onClick={() => handleOpenMessage(message)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -2 }}
                >
                  <MessageContent>
                    <MessageContentHeader>
                      <MessageName>{message.name}</MessageName>
                      <MessageTime>
                        {new Date(message.createdAt?.toDate?.() || message.createdAt).toLocaleDateString()}
                      </MessageTime>
                    </MessageContentHeader>
                    <MessageEmail>{message.email}</MessageEmail>
                    <MessagePreview>{message.message.substring(0, 100)}...</MessagePreview>
                  </MessageContent>
                  <MessageStatus read={message.read}>
                    {message.read ? 'Read' : 'New'}
                  </MessageStatus>
                  <MessageActions onClick={(e) => e.stopPropagation()}>
                    <MessageActionButton
                      className="read"
                      onClick={() => handleMarkAsRead(message.id, true)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Mark as Read
                    </MessageActionButton>
                    <MessageActionButton
                      className="delete"
                      onClick={() => handleDeleteMessage(message.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Delete
                    </MessageActionButton>
                  </MessageActions>
                </MessageItem>
              ))}
            </AnimatePresence>
          </MessagesList>
        )}

        {/* Read Messages Section */}
        <SectionHeader>
          <SectionTitle>
            Read Messages
            <SectionBadge variant="read">{stats.read}</SectionBadge>
          </SectionTitle>
        </SectionHeader>

        {readMessages.length === 0 ? (
          <EmptyState>
            <h3>No read messages</h3>
            <p>No messages have been read yet.</p>
          </EmptyState>
        ) : (
          <MessagesList>
            <AnimatePresence>
              {readMessages.map((message, index) => (
                <MessageItem
                  key={message.id}
                  read={message.read}
                  onClick={() => handleOpenMessage(message)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -2 }}
                >
                  <MessageContent>
                    <MessageContentHeader>
                      <MessageName>{message.name}</MessageName>
                      <MessageTime>
                        {new Date(message.createdAt?.toDate?.() || message.createdAt).toLocaleDateString()}
                      </MessageTime>
                    </MessageContentHeader>
                    <MessageEmail>{message.email}</MessageEmail>
                    <MessagePreview>{message.message.substring(0, 100)}...</MessagePreview>
                  </MessageContent>
                  <MessageStatus read={message.read}>
                    {message.read ? 'Read' : 'New'}
                  </MessageStatus>
                  <MessageActions onClick={(e) => e.stopPropagation()}>
                    <MessageActionButton
                      className="read"
                      onClick={() => handleMarkAsRead(message.id, false)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Mark as Unread
                    </MessageActionButton>
                    <MessageActionButton
                      className="delete"
                      onClick={() => handleDeleteMessage(message.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Delete
                    </MessageActionButton>
                  </MessageActions>
                </MessageItem>
              ))}
            </AnimatePresence>
          </MessagesList>
        )}

        <AnimatePresence>
          {selectedMessage && (
            <MessageModal
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMessage(null)}
            >
              <ModalContent
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <CloseButton
                  onClick={() => setSelectedMessage(null)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  ×
                </CloseButton>

                <ModalHeader>
                  <ModalTitle>Message from {selectedMessage.name}</ModalTitle>
                  <ModalMeta>
                    {selectedMessage.email} • {formatDate(selectedMessage.createdAt)}
                  </ModalMeta>
                </ModalHeader>

                <ModalBody>
                  {selectedMessage.message}
                </ModalBody>

                <ModalActions>
                  <MessageActionButton
                    className="read"
                    onClick={() => handleMarkAsRead(selectedMessage.id, !selectedMessage.read)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {selectedMessage.read ? 'Mark as Unread' : 'Mark as Read'}
                  </MessageActionButton>
                  <MessageActionButton
                    className="delete"
                    onClick={() => handleDeleteMessage(selectedMessage.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Delete Message
                  </MessageActionButton>
                </ModalActions>
              </ModalContent>
            </MessageModal>
          )}
        </AnimatePresence>
      </Container>
    </AdminLayout>
  );
};

export default EnhancedMessageList;