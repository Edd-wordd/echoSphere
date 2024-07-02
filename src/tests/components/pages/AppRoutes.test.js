import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter as Router } from 'react-router-dom'
import App from '../../../App'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

// Mock Firebase Auth
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  onAuthStateChanged: jest.fn(),
  signInWithPopup: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
}))

describe('Route Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders SignIn page when navigating to / route', async () => {
    window.history.pushState({}, '', '/')

    render(
      <Router>
        <App />
      </Router>,
    )

    await waitFor(() => {
      expect(screen.getByText(/Sign in/i)).toBeInTheDocument()
    })
  })

  test('renders Dashboard page when navigating to /dashboard route', async () => {
    const mockUser = { email: 'test@example.com', emailVerified: true }
    const mockOnAuthStateChanged = (auth, callback) => {
      callback(mockUser)
      return jest.fn() // Mock the unsubscribe function
    }
    onAuthStateChanged.mockImplementation(mockOnAuthStateChanged)

    window.history.pushState({}, '', '/dashboard')

    render(
      <Router>
        <App />
      </Router>,
    )

    await waitFor(() => {
      expect(screen.getByText(/Dashboard/i)).toBeInTheDocument()
    })
  })

  test('renders Profile page when navigating to /signup route', async () => {
    window.history.pushState({}, '', '/signup')

    render(
      <Router>
        <App />
      </Router>,
    )

    await waitFor(() => {
      expect(screen.getByText(/Sign up/i)).toBeInTheDocument()
    })
  })
})
