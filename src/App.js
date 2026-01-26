// App.js
import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
// import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import SignUp from './components/pages/SignUp'
import SignIn from './components/pages/SignIn'
import Dashboard from './components/pages/Dashboard'
import EmailVerificationHandler from './components/auth/EmailVerificationHandler'
import AdminGuard from './components/auth/AdminGuard'
import ForgotPassword from './components/pages/ForgotPassword'
import Access from './components/pages/Access'
import SuperBowlSquares from './components/pages/SuperBowlSquares'
import AdminLayout from './components/pages/AdminLayout'
import AdminOverview from './components/admin/AdminOverview'
import WeeksManager from './components/admin/WeeksManager'
import GamesManager from './components/admin/GamesManager'
import UsersManager from './components/admin/UsersManager'
import AdminSettings from './components/admin/AdminSettings'
import ActivityLog from './components/admin/ActivityLog'

// const darkTheme = createTheme({
//   palette: {
//     mode: 'dark',
//     primary: {
//       main: '#90caf9',
//     },
//     secondary: {
//       main: '#f48fb1',
//     },
//     background: {
//       default: '#121212',
//       paper: '#1d1d1d',
//       lighterGrey: '#2c2c2c', // Custom lighter grey color for dark mode
//     },
//     text: {
//       primary: '#ffffff',
//       secondary: '#b0bec5',
//     },
//   },
//   typography: {
//     h4: {
//       color: '#ffffff',
//     },
//     h5: {
//       color: '#ffffff',
//     },
//     body1: {
//       color: '#b0bec5',
//     },
//     body2: {
//       color: '#90caf9',
//     },
//     caption: {
//       color: '#f48fb1',
//     },
//   },
// })

function App() {
  return (
    // <ThemeProvider theme={darkTheme}>
    //   <CssBaseline />
    <Router>
      <Routes>
        <Route path="/" element={<Access />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/dashboard"
          element={
            <EmailVerificationHandler>
              <Dashboard />
            </EmailVerificationHandler>
          }
        />
        <Route path="/superbowl" element={<SuperBowlSquares />} />
        <Route path="/admin" element={<AdminGuard><AdminLayout /></AdminGuard>}>
          <Route index element={<Navigate to="/admin/overview" replace />} />
          <Route path="overview" element={<AdminOverview />} />
          <Route path="weeks" element={<WeeksManager />} />
          <Route path="games" element={<GamesManager />} />
          <Route path="users" element={<UsersManager />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="activity" element={<ActivityLog />} />
        </Route>
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </Router>
    // </ThemeProvider>
  )
}

export default App
