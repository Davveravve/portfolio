import React, { useEffect, useState } from 'react';
import supabase from '../utils/supabaseClient';

const Test = () => {
  const [testData, setTestData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function testDatabase() {
      try {
        console.log("Testing Supabase connection...");
        
        // Test query to categories
        const { data, error } = await supabase
          .from('categories')
          .select('*');
        
        console.log("Test query result:", { data, error });
        
        if (error) throw error;
        setTestData(data);
      } catch (err) {
        console.error("Database test error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    testDatabase();
  }, []);

  if (loading) return <div>Testing database connection...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Database Test Results</h2>
      <pre>{JSON.stringify(testData, null, 2)}</pre>
    </div>
  );
};

export default Test;