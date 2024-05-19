import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SignUp from './components/pages/SignUp'
import Login from './components/pages/Login'
import Dashboard from './components/pages/Dashboard'
import Notfound from './components/pages/Notfound'
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Notfound />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  )
}

export default App
