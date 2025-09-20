import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBpS1NzpJRMAdvjYWWzwXG7_31vKj7dyTw",
  authDomain: "davidrajala-f24f9.firebaseapp.com",
  projectId: "davidrajala-f24f9",
  storageBucket: "davidrajala-f24f9.firebasestorage.app",
  messagingSenderId: "239486857989",
  appId: "1:239486857989:web:2724fdbcadc49eb640bd6c",
  measurementId: "G-YWY7723CBP"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;