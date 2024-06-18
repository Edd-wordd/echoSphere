// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import firebaseConfig from '../firebase/firebaseConfig' // Ensure you have this file with your config

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase services
const auth = getAuth(app)
const firestore = getFirestore(app)

// Export Firebase services
export { auth, firestore }
export default app
