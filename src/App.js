import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import SignUp from './components/pages/SignUp'
import SignIn from './components/pages/SignIn'
import Dashboard from './components/pages/Dashboard'
import EmailVerificationHandler from './components/admin/EmailVerificationHandler'
import AdminGuard from './components/admin/AdminGuard'
import ForgotPassword from './components/pages/ForgotPassword'
import Access from './components/pages/Access'
import AdminLayout from './components/pages/AdminLayout'
import AdminOverview from './components/admin/AdminOverview'
import WeeksManager from './components/admin/WeeksManager'
import GamesManager from './components/admin/GamesManager'
import UsersManager from './components/admin/UsersManager'
import AdminSettings from './components/admin/AdminSettings'
import ActivityLog from './components/admin/ActivityLog'
import NotFound from './components/pages/NotFound'

function App() {
  return (
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
        <Route
          path="/admin"
          element={
            <AdminGuard>
              <AdminLayout />
            </AdminGuard>
          }
        >
          <Route index element={<Navigate to="/admin/overview" replace />} />
          <Route path="overview" element={<AdminOverview />} />
          <Route path="weeks" element={<WeeksManager />} />
          <Route path="games" element={<GamesManager />} />
          <Route path="users" element={<UsersManager />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="activity" element={<ActivityLog />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App
