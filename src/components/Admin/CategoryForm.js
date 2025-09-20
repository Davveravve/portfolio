// src/components/Admin/CategoryForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
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

const Card = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  overflow: hidden;
`;

const CardHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #E2E8F0;
`;

const CardTitle = styled.h3`
  font-size: 1.25rem;
  margin: 0;
  color: var(--dark-color);
`;

const CardBody = styled.div`
  padding: 1.5rem;
`;

const Form = styled.form`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #E2E8F0;
  border-radius: 6px;
  font-size: 1rem;
  flex-grow: 1;
  transition: var(--transition);
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.2);
  }
`;

const Button = styled(motion.button)`
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

const CategoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const CategoryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background-color: #F7FAFC;
  border-radius: 4px;
  transition: var(--transition);
  
  &:hover {
    background-color: #EDF2F7;
  }
`;

const CategoryName = styled.span`
  font-size: 1rem;
  color: var(--dark-color);
`;

const CategoryActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const EditButton = styled(motion.button)`
  padding: 0.5rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: var(--transition);
  
  &:hover {
    background-color: #5A52D5;
  }
`;

const DeleteButton = styled(motion.button)`
  padding: 0.5rem;
  background-color: var(--danger-color);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: var(--transition);
  
  &:hover {
    background-color: #C53030;
  }
`;

const MoveButton = styled(motion.button)`
  padding: 0.5rem;
  background-color: ${props => props.disabled ? '#CBD5E0' : '#4A5568'};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.75rem;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.5 : 1};
  transition: var(--transition);
  
  &:hover {
    background-color: ${props => props.disabled ? '#CBD5E0' : '#2D3748'};
  }
`;

const ErrorMessage = styled.div`
  background-color: #FED7D7;
  color: #9B2C2C;
  padding: 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  margin-bottom: 1rem;
`;

const SuccessMessage = styled.div`
  background-color: #C6F6D5;
  color: #22543D;
  padding: 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  margin-bottom: 1rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #718096;
  background-color: #F7FAFC;
  border-radius: 6px;
`;

const LoadingIndicator = styled.div`
  text-align: center;
  padding: 2rem;
  color: #718096;
`;

const EditForm = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const CategoryForm = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [editName, setEditName] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();
  
  // Load categories from localStorage
  const fetchCategories = () => {
    try {
      setLoading(true);
      
      // Get categories from localStorage
      const savedCategories = localStorage.getItem('portfolio_categories');
      
      if (savedCategories) {
        setCategories(JSON.parse(savedCategories));
      } else {
        // Default categories
        const defaultCategories = [
          {id: '1', name: 'Websites', display_order: 1},
          {id: '2', name: 'Games', display_order: 2},
          {id: '3', name: '3D', display_order: 3},
          {id: '4', name: 'Architecture', display_order: 4}
        ];
        localStorage.setItem('portfolio_categories', JSON.stringify(defaultCategories));
        setCategories(defaultCategories);
      }
    } catch (err) {
      console.error('Error loading categories:', err);
      setError('Error loading categories');
    } finally {
      setLoading(false);
    }
  };
  
  // Save categories to localStorage
  const saveCategories = (updatedCategories) => {
    localStorage.setItem('portfolio_categories', JSON.stringify(updatedCategories));
    setCategories(updatedCategories);
  };
  
  // Load categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);
  
  // Handle adding a new category
  const handleAddCategory = async (e) => {
    e.preventDefault();
    
    if (!newCategory.trim()) {
      setError('Category name cannot be empty');
      return;
    }
    
    setError('');
    setSuccess('');
    setSubmitting(true);
    
    try {
      const nextOrder = categories.length > 0 
        ? Math.max(...categories.map(c => c.display_order)) + 1 
        : 1;
      
      // Use direct table access
      const { data, error } = await supabase
        .from('categories')
        .insert({
          name: newCategory.trim(),
          display_order: nextOrder
        })
        .select();
      
      if (error) throw error;
      
      // Refresh categories
      await fetchCategories();
      setNewCategory('');
      setSuccess('Category added successfully');
    } catch (err) {
      console.error('Error adding category:', err);
      setError('Failed to add category: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const startEditing = (category) => {
    setEditingCategory(category.id);
    setEditName(category.name);
  };
  
  const cancelEditing = () => {
    setEditingCategory(null);
    setEditName('');
  };
  
  const saveEdit = (id) => {
    if (!editName.trim()) {
      setError('Category name cannot be empty');
      return;
    }
    
    setError('');
    setSuccess('');
    setSubmitting(true);
    
    try {
      // Update category in state
      const updatedCategories = categories.map(category => 
        category.id === id ? { ...category, name: editName.trim() } : category
      );
      
      // Save to localStorage
      saveCategories(updatedCategories);
      
      setEditingCategory(null);
      setEditName('');
      setSuccess('Category updated successfully');
    } catch (err) {
      console.error('Error updating category:', err);
      setError('Failed to update category');
    } finally {
      setSubmitting(false);
    }
  };
  
  const deleteCategory = (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return;
    }
    
    setError('');
    setSuccess('');
    setSubmitting(true);
    
    try {
      // Filter out the deleted category
      const updatedCategories = categories.filter(category => category.id !== id);
      
      // Save to localStorage
      saveCategories(updatedCategories);
      
      setSuccess('Category deleted successfully');
    } catch (err) {
      console.error('Error deleting category:', err);
      setError('Failed to delete category');
    } finally {
      setSubmitting(false);
    }
  };
  
  const moveCategory = (id, direction) => {
    const index = categories.findIndex(category => category.id === id);
    
    if ((direction === 'up' && index === 0) || 
        (direction === 'down' && index === categories.length - 1)) {
      return;
    }
    
    setSubmitting(true);
    
    try {
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      const updatedCategories = [...categories];
      
      // Swap display orders
      const temp = updatedCategories[index].display_order;
      updatedCategories[index].display_order = updatedCategories[newIndex].display_order;
      updatedCategories[newIndex].display_order = temp;
      
      // Sort by display order
      updatedCategories.sort((a, b) => a.display_order - b.display_order);
      
      // Save to localStorage
      saveCategories(updatedCategories);
    } catch (err) {
      console.error('Error moving category:', err);
      setError('Failed to reorder categories');
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return <LoadingIndicator>Loading categories...</LoadingIndicator>;
  }
  
  return (
    <Container>
      <Header>
        <Title>Manage Categories</Title>
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
      
      <Card>
        <CardHeader>
          <CardTitle>Add New Category</CardTitle>
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleAddCategory}>
            <Input 
              type="text"
              placeholder="Enter category name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              disabled={submitting}
            />
            <Button 
              type="submit"
              disabled={submitting}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {submitting ? 'Adding...' : 'Add Category'}
            </Button>
          </Form>
        </CardBody>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Existing Categories</CardTitle>
        </CardHeader>
        <CardBody>
          {categories.length > 0 ? (
            <CategoryList>
              {categories.map((category, index) => (
                <CategoryItem key={category.id}>
                  {editingCategory === category.id ? (
                    <EditForm>
                      <Input 
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        disabled={submitting}
                      />
                      <Button 
                        onClick={() => saveEdit(category.id)}
                        disabled={submitting}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        Save
                      </Button>
                      <BackButton 
                        onClick={cancelEditing}
                        disabled={submitting}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        Cancel
                      </BackButton>
                    </EditForm>
                  ) : (
                    <>
                      <CategoryName>{category.name}</CategoryName>
                      <CategoryActions>
                        <MoveButton 
                          onClick={() => moveCategory(category.id, 'up')}
                          disabled={index === 0 || submitting}
                          whileHover={{ scale: !submitting && index !== 0 ? 1.1 : 1 }}
                          whileTap={{ scale: !submitting && index !== 0 ? 0.9 : 1 }}
                        >
                          ↑
                        </MoveButton>
                        <MoveButton 
                          onClick={() => moveCategory(category.id, 'down')}
                          disabled={index === categories.length - 1 || submitting}
                          whileHover={{ scale: !submitting && index !== categories.length - 1 ? 1.1 : 1 }}
                          whileTap={{ scale: !submitting && index !== categories.length - 1 ? 0.9 : 1 }}
                        >
                          ↓
                        </MoveButton>
                        <EditButton 
                          onClick={() => startEditing(category)}
                          disabled={submitting}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          Edit
                        </EditButton>
                        <DeleteButton 
                          onClick={() => deleteCategory(category.id)}
                          disabled={submitting}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          Delete
                        </DeleteButton>
                      </CategoryActions>
                    </>
                  )}
                </CategoryItem>
              ))}
            </CategoryList>
          ) : (
            <EmptyState>No categories yet. Add your first category above.</EmptyState>
          )}
        </CardBody>
      </Card>
    </Container>
  );
};

export default CategoryForm;