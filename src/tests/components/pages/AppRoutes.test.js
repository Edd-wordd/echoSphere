import React from 'react'
import { render, screen } from '@testing-library/react'
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

    const dashboardPageText = await screen.findByText(/Dashboard/i)
    expect(dashboardPageText).toBeInTheDocument()
  })

  test('renders Profile page when navigating to /signup', async () => {
    window.history.pushState({}, '', '/signup')

    render(<App />)

    const profilePageText = await screen.findByText(/Signup/i)
    expect(profilePageText).toBeInTheDocument()
  })
})
