import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import App from '../../../App'
import { getAuth } from 'firebase/auth'

// Mock EmailVerificationHandler to avoid Firebase dependencies during routing tests
jest.mock('../../../components/auth/EmailVerificationHandler', () => ({
  __esModule: true,
  default: ({ children }) => <>{children}</>,
}))

// Mock firebase/auth module
jest.mock('firebase/auth', () => {
  const originalModule = jest.requireActual('firebase/auth')
  return {
    ...originalModule,
    getAuth: jest.fn(() => ({
      onAuthStateChanged: jest.fn(),
      signOut: jest.fn(),
    })),
    onAuthStateChanged: jest.fn((auth, callback) => {
      if (callback) callback({ displayName: 'Test User' })
      return jest.fn()
    }),
  }
})

describe('Route Tests', () => {
  let authMock

  beforeAll(() => {
    authMock = getAuth()
  })

  test('renders Access page when navigating to / route', async () => {
    window.history.pushState({}, '', '/')

    render(<App />)

    const accessHeading = await screen.findByRole('heading', { name: /Enter Access Number/i })
    expect(accessHeading).toBeInTheDocument()

    // The Access page shows "Access Number" field and not email/password. So test for that.
    const accessField = await screen.findByLabelText(/Access Number/i)
    expect(accessField).toBeInTheDocument()
  })

  test('renders Dashboard page when navigating to /dashboard route', async () => {
    window.history.pushState({}, '', '/dashboard')

    render(<App />)

    await waitFor(() => {
      const dashboardHeading = screen.getByRole('heading', { name: /Dashboard/i })
      expect(dashboardHeading).toBeInTheDocument()
    })
  })

  test('renders Profile page when navigating to /signup', async () => {
    window.history.pushState({}, '', '/signup')

    render(<App />)

    const loginHeading = await screen.findByRole('heading', { name: /Sign up/i })
    expect(loginHeading).toBeInTheDocument()

    const emailField = await screen.findByLabelText(/Email Address/i)
    expect(emailField).toBeInTheDocument()

    const passwordFields = await screen.findAllByLabelText(/Password/i)
    expect(passwordFields[0]).toBeInTheDocument()
  })
})
