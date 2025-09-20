// src/hooks/useSupabase.js
import { useState, useEffect } from 'react';
import supabase from '../utils/supabaseClient';

// Projects hooks
export const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      console.log("Fetching projects...");
      
      // Fetch projects with their categories and media
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          categories:category_id(id, name),
          project_media(id, file_url, media_type, display_order)
        `)
        .order('updated_at', { ascending: false });
      
      console.log("Projects fetch result:", { data, error });
      
      if (error) throw error;
      
      // Process the data to have a cleaner structure
      const processedProjects = data.map(project => ({
        ...project,
        category: project.categories,
        media: project.project_media.sort((a, b) => a.display_order - b.display_order),
        thumbnail: project.project_media.find(media => media.media_type === 'image')?.file_url || null
      }));
      
      setProjects(processedProjects);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return { 
    projects, 
    loading, 
    error, 
    fetchProjects
  };
};

// Categories hook
export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      console.log("Fetching categories directly...");
      
      // Simple direct database access
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('display_order');
      
      console.log("Categories fetch result:", { data, error });
      
      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return { 
    categories, 
    loading, 
    error,
    fetchCategories
  };
};

// Messages hook
export const useMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      
      console.log("Fetching messages directly...");
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });
      
      console.log("Messages fetch result:", { data, error });
      
      if (error) throw error;
      
      setMessages(data || []);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (messageId) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ read: true })
        .eq('id', messageId);
      
      if (error) throw error;
      
      // Update local state
      setMessages(messages.map(msg => 
        msg.id === messageId ? { ...msg, read: true } : msg
      ));
    } catch (err) {
      console.error('Error marking message as read:', err);
      throw err;
    }
  };

  const deleteMessage = async (messageId) => {
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId);
      
      if (error) throw error;
      
      // Update local state
      setMessages(messages.filter(msg => msg.id !== messageId));
    } catch (err) {
      console.error('Error deleting message:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return { 
    messages, 
    loading, 
    error, 
    fetchMessages,
    markAsRead,
    deleteMessage
  };
};