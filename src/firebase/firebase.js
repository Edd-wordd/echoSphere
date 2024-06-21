console.log('Firebase API Key:', process.env.REACT_APP_FIREBASE_API_KEY)
console.log('Firebase Auth Domain:', process.env.REACT_APP_FIREBASE_AUTH_DOMAIN)
// Repeat for other environment variables

import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import firebaseConfig from './firebaseConfig'

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase services
const auth = getAuth(app)
const firestore = getFirestore(app)

// Export Firebase services
export { auth, firestore }
export default app
