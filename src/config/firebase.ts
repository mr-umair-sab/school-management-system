// Firebase Configuration
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// Firebase config - Update with your credentials
const firebaseConfig = {
  apiKey: "AIzaSyBxxx", // Replace with your API key
  authDomain: "school-management-data.firebaseapp.com",
  projectId: "school-management-data",
  storageBucket: "school-management-data.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:xxxxx"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)

export default app
