// App.js
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
// import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import SignUp from './components/pages/SignUp'
import SignIn from './components/pages/SignIn'
import Dashboard from './components/pages/Dashboard'
import EmailVerificationHandler from './components/auth/EmailVerificationHandler'
import HadiCapping from './components/gameData/HandiCapping' // Assuming HadiCapping is a page component
import Admin from './components/pages/Admin'
import ForgotPassword from './components/pages/ForgotPassword'
import Access from './components/pages/Access'

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
        {/* May need to add a admin route here could potentially be used for admin dashboard with / route */}
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
        <Route path="/admin" element={<Admin />} />
        <Route path="/hadicapping" element={<HadiCapping />} /> {/* Add the HadiCapping route */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </Router>
    // </ThemeProvider>
  )
}

export default App
