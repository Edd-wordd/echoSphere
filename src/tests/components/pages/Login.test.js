import React from 'react'
import { render, screen } from '@testing-library/react'
import App from '../../../App'

describe('Route Tests', () => {
  test('renders Login page when navigating to / route', async () => {
    window.history.pushState({}, '', '/')

    render(<App />)

    const loginPageText = await screen.findByText(/Login Page/i)
    expect(loginPageText).toBeInTheDocument()
  })
})
