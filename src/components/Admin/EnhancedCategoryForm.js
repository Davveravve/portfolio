import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import useNotification from '../../hooks/useNotification';
import Notifications from '../Notifications';
import AdminLayout from './AdminLayout';
import ConfirmationModal from '../ConfirmationModal';

const Container = styled.div`
  max-width: 800px;
`;

const FormSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  margin-bottom: 2rem;
`;

const FormRow = styled.div`
  display: flex;
  gap: 1rem;
  align-items: end;
`;

const FormGroup = styled.div`
  flex: 1;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: #f9fafb;

  &:focus {
    outline: none;
    border-color: #ef4444;
    background: white;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
  }

  &:hover {
    border-color: #d1d5db;
  }
`;

const AddButton = styled(motion.button)`
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  height: fit-content;

  &:hover {
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
  }

  &:disabled {
    background: #d1d5db;
    cursor: not-allowed;
  }
`;

const CategoriesList = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
`;

const CategoryItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  margin-bottom: 0.75rem;
  cursor: grab;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border-color: #cbd5e1;
  }

  &:active {
    cursor: grabbing;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const OrderControls = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const OrderButton = styled(motion.button)`
  width: 24px;
  height: 20px;
  border: 1px solid #e2e8f0;
  border-radius: 3px;
  background: white;
  color: #64748b;
  cursor: pointer;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: #f8fafc;
    border-color: #cbd5e1;
    color: #374151;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CategoryInfo = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const CategoryName = styled.div`
  font-weight: 600;
  color: #1f2937;
  flex: 1;
`;

const CategoryOrder = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
  background: #e5e7eb;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  min-width: 60px;
  text-align: center;
`;

const CategoryActions = styled.div`
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
  transition: all 0.2s ease;

  &:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
  }

  &.edit {
    color: #3b82f6;
    border-color: #3b82f6;

    &:hover {
      background: #eff6ff;
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

const EditForm = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex: 1;
`;

const EditInput = styled.input`
  flex: 1;
  padding: 0.5rem;
  border: 2px solid #ef4444;
  border-radius: 4px;
  font-size: 1rem;
  background: white;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
  }
`;

const SaveButton = styled(motion.button)`
  padding: 0.5rem 1rem;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;

  &:hover {
    background: #059669;
  }
`;

const CancelButton = styled(motion.button)`
  padding: 0.5rem 1rem;
  background: #6b7280;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;

  &:hover {
    background: #4b5563;
  }
`;


const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #64748b;

  h3 {
    color: #1f2937;
    margin-bottom: 0.5rem;
  }
`;

// Category Item Component with Order Controls
const CategoryItemWithControls = ({ category, onEdit, onDelete, onSave, onCancel, editingId, editValue, setEditValue, onMoveUp, onMoveDown, isFirst, isLast }) => {
  const isEditing = editingId === category.id;

  return (
    <CategoryItem
      whileHover={{ y: -1 }}
    >
      <OrderControls>
        <OrderButton
          onClick={() => onMoveUp(category.id)}
          disabled={isFirst}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="Move up"
        >
          ↑
        </OrderButton>
        <OrderButton
          onClick={() => onMoveDown(category.id)}
          disabled={isLast}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="Move down"
        >
          ↓
        </OrderButton>
      </OrderControls>

      <CategoryInfo>
        {isEditing ? (
          <EditForm>
            <EditInput
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              autoFocus
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  onSave(category.id);
                }
                if (e.key === 'Escape') {
                  onCancel();
                }
              }}
            />
            <SaveButton
              onClick={() => onSave(category.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Save
            </SaveButton>
            <CancelButton
              onClick={onCancel}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Cancel
            </CancelButton>
          </EditForm>
        ) : (
          <>
            <CategoryName>{category.name}</CategoryName>
            <CategoryOrder>Order: {category.displayOrder}</CategoryOrder>
          </>
        )}
      </CategoryInfo>

      {!isEditing && (
        <CategoryActions>
          <ActionButton
            className="edit"
            onClick={() => onEdit(category.id, category.name)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Edit
          </ActionButton>
          <ActionButton
            className="delete"
            onClick={() => onDelete(category.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Delete
          </ActionButton>
        </CategoryActions>
      )}
    </CategoryItem>
  );
};

const EnhancedCategoryForm = () => {
  const { notifications, success, error, setNotifications } = useNotification();
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);


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

  const handleMoveUp = async (categoryId) => {
    const categoryIndex = categories.findIndex(cat => cat.id === categoryId);
    if (categoryIndex <= 0) return;

    const newCategories = [...categories];
    [newCategories[categoryIndex - 1], newCategories[categoryIndex]] =
    [newCategories[categoryIndex], newCategories[categoryIndex - 1]];

    setCategories(newCategories);

    // Update display order in Firebase
    try {
      const updatePromises = newCategories.map((item, index) =>
        updateDoc(doc(db, 'categories', item.id), { displayOrder: index + 1 })
      );
      await Promise.all(updatePromises);
      success('Category order updated successfully!');
    } catch (error) {
      console.error('Error updating order:', error);
      error('Failed to update category order');
    }
  };

  const handleMoveDown = async (categoryId) => {
    const categoryIndex = categories.findIndex(cat => cat.id === categoryId);
    if (categoryIndex >= categories.length - 1) return;

    const newCategories = [...categories];
    [newCategories[categoryIndex], newCategories[categoryIndex + 1]] =
    [newCategories[categoryIndex + 1], newCategories[categoryIndex]];

    setCategories(newCategories);

    // Update display order in Firebase
    try {
      const updatePromises = newCategories.map((item, index) =>
        updateDoc(doc(db, 'categories', item.id), { displayOrder: index + 1 })
      );
      await Promise.all(updatePromises);
      success('Category order updated successfully!');
    } catch (error) {
      console.error('Error updating order:', error);
      error('Failed to update category order');
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setSaving(true);

    try {
      const categoryData = {
        name: newCategoryName.trim(),
        displayOrder: categories.length + 1,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const docRef = await addDoc(collection(db, 'categories'), categoryData);
      const newCategory = { id: docRef.id, ...categoryData };

      setCategories(prev => [...prev, newCategory]);
      setNewCategoryName('');
      success('Category added successfully!');
    } catch (err) {
      console.error('Error adding category:', err);
      error('Failed to add category');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (id, name) => {
    setEditingId(id);
    setEditValue(name);
  };

  const handleSaveEdit = async (id) => {
    if (!editValue.trim()) return;

    try {
      await updateDoc(doc(db, 'categories', id), {
        name: editValue.trim(),
        updatedAt: new Date()
      });

      setCategories(prev => prev.map(cat =>
        cat.id === id ? { ...cat, name: editValue.trim() } : cat
      ));

      setEditingId(null);
      setEditValue('');
      success('Category updated successfully!');
    } catch (err) {
      console.error('Error updating category:', err);
      error('Failed to update category');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  const handleDelete = (id) => {
    setCategoryToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;

    try {
      await deleteDoc(doc(db, 'categories', categoryToDelete));
      setCategories(prev => prev.filter(cat => cat.id !== categoryToDelete));
      success('Category deleted successfully!');
    } catch (err) {
      console.error('Error deleting category:', err);
      error('Failed to delete category');
    } finally {
      setShowDeleteConfirm(false);
      setCategoryToDelete(null);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Categories" subtitle="Loading...">
        <div>Loading...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Categories"
      subtitle="Manage your project categories"
    >
      <Container>
        <FormSection>
          <h3 style={{ margin: '0 0 1.5rem 0', color: '#1f2937' }}>Add New Category</h3>
          <form onSubmit={handleAddCategory}>
            <FormRow>
              <FormGroup>
                <Label htmlFor="categoryName">Category Name</Label>
                <Input
                  type="text"
                  id="categoryName"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Enter category name"
                  required
                />
              </FormGroup>
              <AddButton
                type="submit"
                disabled={saving || !newCategoryName.trim()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {saving ? 'Adding...' : 'Add Category'}
              </AddButton>
            </FormRow>
          </form>
        </FormSection>

        <CategoriesList>
          <h3 style={{ margin: '0 0 1.5rem 0', color: '#1f2937' }}>
            Categories ({categories.length})
          </h3>
          <p style={{ margin: '0 0 2rem 0', color: '#6b7280', fontSize: '0.875rem' }}>
            Drag and drop to reorder categories. The order here determines how they appear on your portfolio.
          </p>

          {categories.length === 0 ? (
            <EmptyState>
              <h3>No categories yet</h3>
              <p>Create your first category to organize your projects</p>
            </EmptyState>
          ) : (
            <AnimatePresence>
              {categories.map((category, index) => (
                <CategoryItemWithControls
                  key={category.id}
                  category={category}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onSave={handleSaveEdit}
                  onCancel={handleCancelEdit}
                  onMoveUp={handleMoveUp}
                  onMoveDown={handleMoveDown}
                  editingId={editingId}
                  editValue={editValue}
                  setEditValue={setEditValue}
                  isFirst={index === 0}
                  isLast={index === categories.length - 1}
                />
              ))}
            </AnimatePresence>
          )}
        </CategoriesList>
      </Container>

      <Notifications
        notifications={notifications}
        onRemove={(id) => setNotifications(prev => prev.filter(n => n.id !== id))}
      />

      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setCategoryToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Ta bort kategori"
        message="Är du säker på att du vill ta bort denna kategori? Denna åtgärd kan inte ångras."
        confirmText="Ta bort"
        cancelText="Avbryt"
        type="danger"
      />
    </AdminLayout>
  );
};

export default EnhancedCategoryForm;