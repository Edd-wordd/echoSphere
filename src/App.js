import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SignUp from './components/pages/SignUp'
import SignIn from './components/pages/SignIn'
import Dashboard from './components/pages/Dashboard'
// import NotFound from './components/pages/NotFound'
import EmailVerificationHandler from './components/auth/EmailVerificationHandler'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/dashboard"
          element={
            <EmailVerificationHandler>
              <Dashboard />
            </EmailVerificationHandler>
          }
        />
        {/*<Route path="*" element={<NotFound />} />*/}
      </Routes>
    </Router>
  )
}

export default App
