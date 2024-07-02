// import React from 'react'
// import { render, screen, waitFor } from '@testing-library/react'
// import App from '../../../App'
// import { getAuth } from 'firebase/auth'
//
// // Mock firebase/auth module
// jest.mock('firebase/auth', () => {
//   const originalModule = jest.requireActual('firebase/auth')
//   return {
//     ...originalModule,
//     getAuth: jest.fn(() => ({
//       onAuthStateChanged: jest.fn(),
//       signOut: jest.fn(),
//     })),
//   }
// })
//
// describe('Route Tests', () => {
//   let authMock
//
//   beforeAll(() => {
//     authMock = getAuth()
//     authMock.onAuthStateChanged.mockImplementation((callback) => {
//       callback({ displayName: 'Test User' }) // Mock a logged-in user
//       return jest.fn() // Mock the unsubscribe function
//     })
//   })
//
//   test('renders SignIn page when navigating to / route', async () => {
//     window.history.pushState({}, '', '/')
//
//     render(<App />)
//
//     const loginHeading = await screen.findByRole('heading', { name: /Sign in/i })
//     expect(loginHeading).toBeInTheDocument()
//
//     const emailField = await screen.findByLabelText(/Email Address/i)
//     expect(emailField).toBeInTheDocument()
//
//     const passwordField = await screen.findByLabelText(/Password/i)
//     expect(passwordField).toBeInTheDocument()
//   })
//
//   test('renders Dashboard page when navigating to /dashboard route', async () => {
//     window.history.pushState({}, '', '/dashboard')
//
//     render(<App />)
//
//     await waitFor(() => {
//       const dashboardPageText = screen.getByText(/Dashboard/i)
//       expect(dashboardPageText).toBeInTheDocument()
//     })
//   })
//
//   test('renders Profile page when navigating to /signup', async () => {
//     window.history.pushState({}, '', '/signup')
//
//     render(<App />)
//
//     const loginHeading = await screen.findByRole('heading', { name: /Sign up/i })
//     expect(loginHeading).toBeInTheDocument()
//
//     const emailField = await screen.findByLabelText(/Email Address/i)
//     expect(emailField).toBeInTheDocument()
//
//     const passwordField = await screen.findByLabelText(/Password/i)
//     expect(passwordField).toBeInTheDocument()
//   })
// })
