import { doc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export const setupAdminConfig = async (adminPassword) => {
  try {
    await setDoc(doc(db, 'admin', 'config'), {
      adminPassword: adminPassword,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log('Admin configuration created successfully');
    return true;
  } catch (error) {
    console.error('Error creating admin configuration:', error);
    throw error;
  }
};

export const updateAdminPassword = async (newPassword) => {
  try {
    await setDoc(doc(db, 'admin', 'config'), {
      adminPassword: newPassword,
      updatedAt: new Date()
    }, { merge: true });

    console.log('Admin password updated successfully');
    return true;
  } catch (error) {
    console.error('Error updating admin password:', error);
    throw error;
  }
};