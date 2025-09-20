// src/pages/Home.js (simplified)
import React, { useState, useEffect } from 'react';
import supabase from '../utils/supabaseClient';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        console.log("Fetching categories...");
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('display_order');
        
        console.log("Categories result:", { data, error });
        
        if (error) throw error;
        setCategories(data || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchCategories();
  }, []);

  if (loading) return <div>Loading categories...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Categories Test</h1>
      <ul>
        {categories.map(category => (
          <li key={category.id}>{category.name} (Order: {category.display_order})</li>
        ))}
      </ul>
    </div>
  );
};

export default Home;