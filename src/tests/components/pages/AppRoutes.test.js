import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import App from '../../../App'

describe('Route Tests', () => {
  test('renders SignIn page when navigating to / route', async () => {
    window.history.pushState({}, '', '/')

    render(<App />)

    const loginHeading = await screen.findByRole('heading', { name: /Sign in/i })
    expect(loginHeading).toBeInTheDocument()

    const emailField = await screen.findByLabelText(/Email Address/i)
    expect(emailField).toBeInTheDocument()

    const passwordField = await screen.findByLabelText(/Password/i)
    expect(passwordField).toBeInTheDocument()
  })

  test('renders Dashboard page when navigating to /dashboard route', async () => {
    window.history.pushState({}, '', '/dashboard')

    render(<App />)

    // Use waitFor to ensure the component has fully rendered
    await waitFor(() => {
      // Use a more flexible matcher to find the Dashboard text
      const dashboardPageText = screen.getByText((content, element) => /Dashboard/i.test(content))
      expect(dashboardPageText).toBeInTheDocument()
    })
  })

  test('renders Profile page when navigating to /signup', async () => {
    window.history.pushState({}, '', '/signup')

    render(<App />)

    const loginHeading = await screen.findByRole('heading', { name: /Sign up/i })
    expect(loginHeading).toBeInTheDocument()

    const emailField = await screen.findByLabelText(/Email Address/i)
    expect(emailField).toBeInTheDocument()

    const passwordField = await screen.findByLabelText(/Password/i)
    expect(passwordField).toBeInTheDocument()
  })
})
// src/tests/components/pages/AppRoutes.test.js

jest.mock('firebase/auth', () => {
  const actualAuth = jest.requireActual('firebase/auth')
  return {
    ...actualAuth,
    getRedirectResult: jest.fn(() => Promise.resolve(null)),
  }
})
