import React, { useEffect, useState } from 'react';
import supabase from '../utils/supabaseClient';

const TestPage = () => {
  const [categories, setCategories] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        console.log("Fetching test data...");
        
        // Test categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*');
        
        console.log("Categories result:", { categoriesData, categoriesError });
        
        if (categoriesError) throw categoriesError;
        setCategories(categoriesData || []);
        
        // Test messages
        const { data: messagesData, error: messagesError } = await supabase
          .from('messages')
          .select('*');
        
        console.log("Messages result:", { messagesData, messagesError });
        
        if (messagesError) throw messagesError;
        setMessages(messagesData || []);
        
      } catch (err) {
        console.error("Error fetching test data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    
    try {
      console.log("Adding test category:", newCategory);
      
      const { data, error } = await supabase
        .from('categories')
        .insert({
          name: newCategory,
          display_order: categories.length + 1
        })
        .select();
      
      console.log("Add category result:", { data, error });
      
      if (error) throw error;
      
      setCategories([...categories, data[0]]);
      setNewCategory('');
    } catch (err) {
      console.error("Error adding category:", err);
      setError(err.message);
    }
  };

  if (loading) return <div>Loading test data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Supabase Test Page</h1>
      
      <div style={{ marginBottom: '30px' }}>
        <h2>Add Category Test</h2>
        <input 
          type="text" 
          value={newCategory} 
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="New category name"
          style={{ padding: '8px', marginRight: '10px' }}
        />
        <button 
          onClick={handleAddCategory}
          style={{ padding: '8px 16px', background: '#6C63FF', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Add Category
        </button>
      </div>
      
      <div style={{ display: 'flex', gap: '40px' }}>
        <div style={{ flexBasis: '50%' }}>
          <h2>Categories ({categories.length})</h2>
          {categories.length > 0 ? (
            <ul>
              {categories.map(category => (
                <li key={category.id}>{category.name} (Order: {category.display_order})</li>
              ))}
            </ul>
          ) : (
            <p>No categories found</p>
          )}
        </div>
        
        <div style={{ flexBasis: '50%' }}>
          <h2>Messages ({messages.length})</h2>
          {messages.length > 0 ? (
            <ul>
              {messages.map(message => (
                <li key={message.id}>
                  <strong>{message.name}</strong>: {message.message?.substring(0, 50)}
                  {message.message?.length > 50 ? '...' : ''}
                </li>
              ))}
            </ul>
          ) : (
            <p>No messages found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestPage;