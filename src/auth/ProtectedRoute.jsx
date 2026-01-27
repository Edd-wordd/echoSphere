import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../firebase/firebase'
import CircularProgress from '@mui/material/CircularProgress'

const ProtectedRoute = ({ children }) => {
  const [user, loading] = useAuthState(auth)

  if (loading) {
    return <CircularProgress />
  }

  if (!user || (user && !user.emailVerified)) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute
