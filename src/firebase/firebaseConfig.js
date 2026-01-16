const isTest = process.env.NODE_ENV === 'test'

// Provide safe fallbacks for test runs so initializeApp doesn't throw when
// Firebase env vars aren't injected in CI/Jest. Production/dev still rely on
// real environment variables.
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || (isTest ? 'test-api-key' : ''),
  authDomain:
    process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || (isTest ? 'test-app.firebaseapp.com' : ''),
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || (isTest ? 'test-project-id' : ''),
  storageBucket:
    process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || (isTest ? 'test.appspot.com' : ''),
  messagingSenderId:
    process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || (isTest ? '1234567890' : ''),
  appId: process.env.REACT_APP_FIREBASE_APP_ID || (isTest ? '1:1234567890:web:testappid' : ''),
}

export default firebaseConfig
