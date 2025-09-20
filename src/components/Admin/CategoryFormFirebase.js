import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import useNotification from '../../hooks/useNotification';
import Notifications from '../Notifications';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  font-size: 2rem;
  color: var(--dark-color);
  margin: 0;
`;

const BackButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #6b7280;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: var(--transition);

  &:hover {
    background-color: #4b5563;
  }
`;

const Form = styled.form`
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    gap: 1rem;
  }
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--dark-color);
  min-width: 120px;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;
  flex: 1;
  transition: var(--transition);

  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.2);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;

const SaveButton = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);

  &:hover {
    background-color: #5A52D5;
  }

  &:disabled {
    background-color: #CBD5E0;
    cursor: not-allowed;
  }
`;

const CancelButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #6b7280;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);

  &:hover {
    background-color: #4b5563;
  }
`;

const CategoriesList = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const CategoryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
`;

const CategoryInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const CategoryName = styled.div`
  font-weight: 500;
  color: var(--dark-color);
`;

const CategoryOrder = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

const CategoryActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const EditButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: var(--transition);

  &:hover {
    background-color: #2563eb;
  }
`;

const DeleteButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #dc2626;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: var(--transition);

  &:hover {
    background-color: #b91c1c;
  }
`;

const ErrorMessage = styled.div`
  background-color: #FED7D7;
  color: #9B2C2C;
  padding: 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
`;

const SuccessMessage = styled.div`
  background-color: #C6F6D5;
  color: #2D7D32;
  padding: 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #6b7280;
`;

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  color: var(--dark-color);
  margin-bottom: 1rem;
`;

const CategoryForm = () => {
  const navigate = useNavigate();
  const { notifications, success, error, setNotifications } = useNotification();

  const [formData, setFormData] = useState({
    name_sv: '',
    name_en: '',
    description: '',
    displayOrder: 0
  });

  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const categoriesQuery = query(collection(db, 'categories'), orderBy('displayOrder'));
      const snapshot = await getDocs(categoriesQuery);
      const categoriesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCategories(categoriesData);
    } catch (err) {
      console.error('Error fetching categories:', err);
      error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'displayOrder' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const categoryData = {
        ...formData,
        updatedAt: new Date(),
        ...(editingId ? {} : { createdAt: new Date() })
      };

      if (editingId) {
        await updateDoc(doc(db, 'categories', editingId), categoryData);
        success('Category updated successfully!');
      } else {
        await addDoc(collection(db, 'categories'), categoryData);
        success('Category created successfully!');
      }

      setFormData({ name_sv: '', name_en: '', description: '', displayOrder: 0 });
      setEditingId(null);
      fetchCategories();
    } catch (err) {
      console.error('Error saving category:', err);
      error('Failed to save category');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (category) => {
    setFormData({
      name_sv: category.name_sv || category.name || '',
      name_en: category.name_en || category.name || '',
      description: category.description || '',
      displayOrder: category.displayOrder || 0
    });
    setEditingId(category.id);
  };

  const handleDelete = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'categories', categoryId));
      success('Category deleted successfully!');
      fetchCategories();
    } catch (err) {
      console.error('Error deleting category:', err);
      error('Failed to delete category');
    }
  };

  const handleCancel = () => {
    setFormData({ name_sv: '', name_en: '', description: '', displayOrder: 0 });
    setEditingId(null);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Container>
      <Header>
        <Title>Manage Categories</Title>
        <BackButton onClick={() => navigate('/admin')}>
          ← Back to Dashboard
        </BackButton>
      </Header>

      <Form onSubmit={handleSubmit}>
        <SectionTitle>{editingId ? 'Edit Category' : 'Add New Category'}</SectionTitle>


        <FormGroup>
          <Label htmlFor="name_sv">Category Name (Swedish)</Label>
          <Input
            type="text"
            id="name_sv"
            name="name_sv"
            value={formData.name_sv}
            onChange={handleInputChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="name_en">Category Name (English)</Label>
          <Input
            type="text"
            id="name_en"
            name="name_en"
            value={formData.name_en}
            onChange={handleInputChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="description">Description</Label>
          <Input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Optional description"
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="displayOrder">Display Order</Label>
          <Input
            type="number"
            id="displayOrder"
            name="displayOrder"
            value={formData.displayOrder}
            onChange={handleInputChange}
            min="0"
          />
        </FormGroup>

        <ButtonGroup>
          {editingId && (
            <CancelButton type="button" onClick={handleCancel}>
              Cancel
            </CancelButton>
          )}
          <SaveButton
            type="submit"
            disabled={saving}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            {saving ? 'Saving...' : (editingId ? 'Update Category' : 'Add Category')}
          </SaveButton>
        </ButtonGroup>
      </Form>

      <CategoriesList>
        <SectionTitle>Existing Categories</SectionTitle>
        {categories.length > 0 ? (
          categories.map(category => (
            <CategoryItem key={category.id}>
              <CategoryInfo>
                <CategoryName>
                  {category.name_sv || category.name} / {category.name_en || category.name}
                </CategoryName>
                <CategoryOrder>Order: {category.displayOrder}</CategoryOrder>
                {category.description && (
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    {category.description}
                  </div>
                )}
              </CategoryInfo>
              <CategoryActions>
                <EditButton onClick={() => handleEdit(category)}>
                  Edit
                </EditButton>
                <DeleteButton onClick={() => handleDelete(category.id)}>
                  Delete
                </DeleteButton>
              </CategoryActions>
            </CategoryItem>
          ))
        ) : (
          <EmptyState>No categories yet. Create your first category!</EmptyState>
        )}
      </CategoriesList>

      <Notifications
        notifications={notifications}
        onRemove={(id) => setNotifications(prev => prev.filter(n => n.id !== id))}
      />
    </Container>
  );
};

export default CategoryForm;