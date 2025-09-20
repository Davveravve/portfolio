// src/components/Admin/MessageList.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { formatDate, formatTimeAgo } from '../../utils/dateUtils';
import supabase from '../../utils/supabaseClient';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const Title = styled.h2`
  font-size: 1.75rem;
  color: var(--dark-color);
  margin: 0;
`;

const BackButton = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: #EDF2F7;
  color: #4A5568;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  
  &:hover {
    background-color: #E2E8F0;
  }
`;

const MessageTabs = styled.div`
  display: flex;
  border-bottom: 2px solid #E2E8F0;
  margin-bottom: 1.5rem;
`;

const Tab = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: transparent;
  border: none;
  font-size: 1rem;
  font-weight: ${props => props.active ? 600 : 400};
  color: ${props => props.active ? 'var(--primary-color)' : '#4A5568'};
  cursor: pointer;
  // src/components/Admin/MessageList.js (continued)
  transition: var(--transition);
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    right: 0;
    height: 2px;
    background-color: ${props => props.active ? 'var(--primary-color)' : 'transparent'};
  }
  
  &:hover {
    color: var(--primary-color);
  }
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: var(--primary-color);
  color: white;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.1rem 0.5rem;
  margin-left: 0.5rem;
`;

const CardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MessageCard = styled(motion.div)`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border-left: 4px solid ${props => props.unread ? 'var(--primary-color)' : 'transparent'};
`;

const MessageHeader = styled.div`
  padding: 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${props => props.unread ? '#EBF8FF' : '#F7FAFC'};
  border-bottom: 1px solid #E2E8F0;
`;

const SenderInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const SenderName = styled.h3`
  font-size: 1.1rem;
  margin: 0;
  margin-bottom: 0.25rem;
  color: var(--dark-color);
  display: flex;
  align-items: center;
  
  ${props => props.unread && `
    font-weight: 600;
    
    &:after {
      content: '';
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: var(--primary-color);
      margin-left: 0.5rem;
    }
  `}
`;

const ContactInfo = styled.div`
  font-size: 0.875rem;
  color: #718096;
`;

const MessageDate = styled.div`
  font-size: 0.875rem;
  color: #718096;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const TimeAgo = styled.span`
  font-size: 0.75rem;
`;

const MessageContent = styled.div`
  padding: 1.25rem;
  font-size: 0.938rem;
  line-height: 1.6;
  color: #4A5568;
  white-space: pre-line;
`;

const MessageActions = styled.div`
  padding: 0 1.25rem 1.25rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
`;

const ActionButton = styled(motion.button)`
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  border-radius: 4px;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const MarkReadButton = styled(ActionButton)`
  background-color: ${props => props.unread ? 'var(--primary-color)' : '#EDF2F7'};
  color: ${props => props.unread ? 'white' : '#4A5568'};
  border: none;
  
  &:hover {
    background-color: ${props => props.unread ? '#5A52D5' : '#E2E8F0'};
  }
`;

const DeleteButton = styled(ActionButton)`
  background-color: white;
  color: var(--danger-color);
  border: 1px solid var(--danger-color);
  
  &:hover {
    background-color: #FED7D7;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const EmptyTitle = styled.h3`
  font-size: 1.5rem;
  color: #4A5568;
  margin-bottom: 0.5rem;
`;

const EmptyText = styled.p`
  font-size: 1rem;
  color: #718096;
  margin: 0;
`;

const LoadingIndicator = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #718096;
`;

const ErrorMessage = styled.div`
  background-color: #FED7D7;
  color: #9B2C2C;
  padding: 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  text-align: center;
  margin-bottom: 1rem;
`;

const SuccessMessage = styled.div`
  background-color: #C6F6D5;
  color: #22543D;
  padding: 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  text-align: center;
  margin-bottom: 1rem;
`;

const MessageList = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  const navigate = useNavigate();
  
  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        setMessages(data);
      } catch (err) {
        console.error('Error fetching messages:', err);
        setError('Failed to load messages');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMessages();
  }, []);
  
  // Filter messages based on active tab
  const filteredMessages = activeTab === 'unread'
    ? messages.filter(msg => !msg.read)
    : messages;
  
  const unreadCount = messages.filter(msg => !msg.read).length;
  
  const markAsRead = async (messageId) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ read: true })
        .eq('id', messageId);
        
      if (error) throw error;
      
      // Update local state
      setMessages(messages.map(message => 
        message.id === messageId ? { ...message, read: true } : message
      ));
      
      setSuccess('Message marked as read');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      console.error('Error marking message as read:', err);
      setError('Failed to update message');
      
      // Clear error message after 3 seconds
      setTimeout(() => {
        setError('');
      }, 3000);
    }
  };
  
  const markAsUnread = async (messageId) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ read: false })
        .eq('id', messageId);
        
      if (error) throw error;
      
      // Update local state
      setMessages(messages.map(message => 
        message.id === messageId ? { ...message, read: false } : message
      ));
      
      setSuccess('Message marked as unread');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      console.error('Error marking message as unread:', err);
      setError('Failed to update message');
      
      // Clear error message after 3 seconds
      setTimeout(() => {
        setError('');
      }, 3000);
    }
  };
  
  const deleteMessage = async (messageId) => {
    if (!window.confirm('Are you sure you want to delete this message?')) {
        return;
      }
    
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId);
        
      if (error) throw error;
      
      // Update local state
      setMessages(messages.filter(message => message.id !== messageId));
      
      setSuccess('Message deleted successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      console.error('Error deleting message:', err);
      setError('Failed to delete message');
      
      // Clear error message after 3 seconds
      setTimeout(() => {
        setError('');
      }, 3000);
    }
  };
  
  if (loading) {
    return <LoadingIndicator>Loading messages...</LoadingIndicator>;
  }
  
  return (
    <Container>
      <Header>
        <Title>Messages</Title>
        <BackButton 
          onClick={() => navigate('/admin')}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          ← Back to Dashboard
        </BackButton>
      </Header>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}
      
      <MessageTabs>
        <Tab 
          active={activeTab === 'all'} 
          onClick={() => setActiveTab('all')}
        >
          All Messages
        </Tab>
        <Tab 
          active={activeTab === 'unread'} 
          onClick={() => setActiveTab('unread')}
        >
          Unread
          {unreadCount > 0 && <Badge>{unreadCount}</Badge>}
        </Tab>
      </MessageTabs>
      
      {filteredMessages.length > 0 ? (
        <CardList>
          {filteredMessages.map((message, index) => (
            <MessageCard 
              key={message.id}
              unread={!message.read}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <MessageHeader unread={!message.read}>
                <SenderInfo>
                  <SenderName unread={!message.read}>
                    {message.name}
                  </SenderName>
                  <ContactInfo>
                    {message.email && (
                      <a href={`mailto:${message.email}`}>{message.email}</a>
                    )}
                    {message.phone && message.email && ' • '}
                    {message.phone && (
                      <a href={`tel:${message.phone}`}>{message.phone}</a>
                    )}
                  </ContactInfo>
                </SenderInfo>
                <MessageDate>
                  {formatDate(message.created_at)}
                  <TimeAgo>{formatTimeAgo(message.created_at)}</TimeAgo>
                </MessageDate>
              </MessageHeader>
              
              <MessageContent>
                {message.message}
              </MessageContent>
              
              <MessageActions>
                {message.read ? (
                  <MarkReadButton 
                    onClick={() => markAsUnread(message.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Mark as Unread
                  </MarkReadButton>
                ) : (
                  <MarkReadButton 
                    unread
                    onClick={() => markAsRead(message.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Mark as Read
                  </MarkReadButton>
                )}
                <DeleteButton 
                  onClick={() => deleteMessage(message.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Delete
                </DeleteButton>
              </MessageActions>
            </MessageCard>
          ))}
        </CardList>
      ) : (
        <EmptyState>
          <EmptyTitle>
            {activeTab === 'all' ? 'No Messages Yet' : 'No Unread Messages'}
          </EmptyTitle>
          <EmptyText>
            {activeTab === 'all' 
              ? 'When visitors submit the contact form, messages will appear here.'
              : 'All caught up! Check "All Messages" to see your message history.'
            }
          </EmptyText>
        </EmptyState>
      )}
    </Container>
  );
};

export default MessageList;