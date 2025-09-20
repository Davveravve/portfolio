import React from 'react';

const BasicTest = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      fontSize: '2rem'
    }}>
      <h1>🎉 TEST FUNGERAR!</h1>
      <p>Portfolio på localhost:3001</p>
      <a href="/admin" style={{
        color: 'white',
        backgroundColor: 'rgba(255,255,255,0.2)',
        padding: '1rem 2rem',
        borderRadius: '25px',
        textDecoration: 'none',
        marginTop: '2rem',
        border: '2px solid white'
      }}>
        Gå till Admin
      </a>
    </div>
  );
};

export default BasicTest;