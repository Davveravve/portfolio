import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { collection, getDocs, query, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  margin-bottom: 2rem;
`;

const StatusBox = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 2rem;
  border-radius: 10px;
  margin-bottom: 2rem;
  max-width: 600px;
`;

const AdminLink = styled.a`
  display: inline-block;
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid white;
  border-radius: 25px;
  color: white;
  text-decoration: none;
  font-weight: bold;
  margin: 1rem;
  transition: all 0.3s ease;

  &:hover {
    background: white;
    color: #667eea;
  }
`;

const SimpleHome = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    projects: [],
    categories: [],
    aboutData: null
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      console.log("Testing Firebase connection...");

      // Test basic Firebase connection
      const aboutDoc = await getDoc(doc(db, 'content', 'about'));
      const aboutData = aboutDoc.exists() ? aboutDoc.data() : null;

      const categoriesQuery = query(collection(db, 'categories'), orderBy('displayOrder'));
      const categoriesSnapshot = await getDocs(categoriesQuery);
      const categoriesData = categoriesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const projectsQuery = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
      const projectsSnapshot = await getDocs(projectsQuery);
      const projectsData = projectsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setData({
        aboutData,
        categories: categoriesData,
        projects: projectsData
      });
    } catch (err) {
      console.error("Firebase error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <Title>Loading...</Title>
        <Subtitle>Testing Firebase connection</Subtitle>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Title>Firebase Error</Title>
        <StatusBox>
          <h3>Error: {error}</h3>
          <p>Din Firebase är inte konfigurerad än. Följ dessa steg:</p>
          <ol style={{ textAlign: 'left', marginTop: '1rem' }}>
            <li>Öppna browser console (F12)</li>
            <li>Kör: <code>import('./src/utils/setupFirebase.js').then(({'{initializeFirebaseData}'}) => initializeFirebaseData('dittLösenord123'))</code></li>
            <li>Ladda om sidan</li>
          </ol>
        </StatusBox>
        <AdminLink href="/admin">Gå till Admin Panel</AdminLink>
      </Container>
    );
  }

  return (
    <Container>
      <Title>🎉 Firebase Portfolio</Title>
      <Subtitle>Firebase fungerar!</Subtitle>

      <StatusBox>
        <h3>Data Status:</h3>
        <p><strong>About Data:</strong> {data.aboutData ? '✅ Finns' : '❌ Saknas'}</p>
        <p><strong>Kategorier:</strong> {data.categories.length} st</p>
        <p><strong>Projekt:</strong> {data.projects.length} st</p>

        {data.aboutData && (
          <div style={{ marginTop: '1rem', textAlign: 'left' }}>
            <h4>About Info:</h4>
            <p><strong>Namn:</strong> {data.aboutData.name || 'Inte satt'}</p>
            <p><strong>Titel:</strong> {data.aboutData.title || 'Inte satt'}</p>
          </div>
        )}
      </StatusBox>

      <div>
        <AdminLink href="/admin">Gå till Admin Panel</AdminLink>
        <AdminLink href="#" onClick={() => window.location.reload()}>Ladda om</AdminLink>
        <AdminLink href="#" onClick={async () => {
          try {
            const { setupAdminConfig } = await import('../utils/setupFirebase.js');
            await setupAdminConfig('mittLösenord123');
            alert('✅ Admin skapad! Gå till /admin och logga in med: mittLösenord123');
            window.location.reload();
          } catch (error) {
            alert('❌ Fel: ' + error.message);
          }
        }}>Skapa Admin</AdminLink>
      </div>

      <p style={{ marginTop: '2rem', opacity: 0.8 }}>
        När allt fungerar kommer den riktiga portfolion att visas här.
      </p>
    </Container>
  );
};

export default SimpleHome;