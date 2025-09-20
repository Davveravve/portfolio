import { doc, setDoc, collection, addDoc, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

// Setup admin configuration - run this once manually to set up authentication
export const setupAdminConfig = async (adminPassword = 'yourSecurePassword123') => {
  try {
    await setDoc(doc(db, 'admin', 'config'), {
      adminPassword: adminPassword,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log('✅ Admin configuration created successfully');
    console.log('🔑 Admin password set to:', adminPassword);
    console.log('🚀 You can now log in at /admin with this password');
    return true;
  } catch (error) {
    console.error('❌ Error creating admin configuration:', error);
    throw error;
  }
};

// Setup initial about data
export const setupAboutData = async () => {
  try {
    await setDoc(doc(db, 'content', 'about'), {
      name: 'David Rajala',
      title: 'Full Stack Developer',
      bio: 'Passionate developer with experience in modern web technologies. I love creating beautiful and functional applications that solve real-world problems.',
      profileImage: '', // Will be uploaded via admin panel
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log('✅ About data created successfully');
    return true;
  } catch (error) {
    console.error('❌ Error creating about data:', error);
    throw error;
  }
};

// Setup initial categories
export const setupCategories = async () => {
  const categories = [
    {
      name: 'Web Development',
      description: 'Full-stack web applications',
      displayOrder: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Mobile Apps',
      description: 'iOS and Android applications',
      displayOrder: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'UI/UX Design',
      description: 'User interface and experience design',
      displayOrder: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  try {
    for (const category of categories) {
      await addDoc(collection(db, 'categories'), category);
    }

    console.log('✅ Categories created successfully');
    return true;
  } catch (error) {
    console.error('❌ Error creating categories:', error);
    throw error;
  }
};

// Setup sample project
export const setupSampleProject = async () => {
  try {
    // Get first category ID
    const categoriesQuery = query(collection(db, 'categories'), orderBy('displayOrder'));
    const categoriesSnapshot = await getDocs(categoriesQuery);
    const firstCategory = categoriesSnapshot.docs[0];

    const sampleProject = {
      title: 'Sample Portfolio Project',
      description: 'This is a sample project to demonstrate the portfolio functionality. You can edit or delete this project from the admin panel.',
      technologies: ['React', 'Firebase', 'Styled Components'],
      githubUrl: 'https://github.com/your-username/sample-project',
      liveUrl: 'https://your-sample-project.com',
      featured: true,
      media: [],
      categoryId: firstCategory ? firstCategory.id : '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await addDoc(collection(db, 'projects'), sampleProject);
    console.log('✅ Sample project created successfully');
    return true;
  } catch (error) {
    console.error('❌ Error creating sample project:', error);
    throw error;
  }
};

// Main setup function - run this to initialize your Firebase database
export const initializeFirebaseData = async (adminPassword = 'yourSecurePassword123') => {
  console.log('🚀 Starting Firebase initialization...');

  try {
    await setupAdminConfig(adminPassword);
    await setupAboutData();
    await setupCategories();
    await setupSampleProject();

    console.log('');
    console.log('🎉 Firebase initialization complete!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Go to /admin and log in with your password');
    console.log('2. Update your About Me information');
    console.log('3. Add your profile image');
    console.log('4. Create your first real project');
    console.log('5. Customize categories as needed');
    console.log('');
    console.log('🔐 Admin login: /admin');
    console.log('🔑 Password:', adminPassword);

  } catch (error) {
    console.error('❌ Firebase initialization failed:', error);
    throw error;
  }
};

// Helper function to change admin password
export const changeAdminPassword = async (newPassword) => {
  try {
    await setDoc(doc(db, 'admin', 'config'), {
      adminPassword: newPassword,
      updatedAt: new Date()
    }, { merge: true });

    console.log('✅ Admin password updated successfully');
    return true;
  } catch (error) {
    console.error('❌ Error updating admin password:', error);
    throw error;
  }
};

// Usage example (uncomment and run in console to initialize):
// import { initializeFirebaseData } from './src/utils/setupFirebase.js';
// initializeFirebaseData('yourChosenPassword123');