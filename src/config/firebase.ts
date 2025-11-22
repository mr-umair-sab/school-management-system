// Firebase Configuration
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyArPjlXPmooN11UHxNHnOg_MzASvcb_u5Y",
  authDomain: "school-management-data.firebaseapp.com",
  projectId: "school-management-data",
  storageBucket: "school-management-data.firebasestorage.app",
  messagingSenderId: "986071124254",
  appId: "1:986071124254:web:e49457890912e40b6ea10f",
  measurementId: "G-JJP884JCZN"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)

export default app
