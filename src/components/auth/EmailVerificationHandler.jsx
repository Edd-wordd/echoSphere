import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, firestore } from '../../firebase/firebase'
import { doc, setDoc } from 'firebase/firestore'
import CircularProgress from '@mui/material/CircularProgress'

const EmailVerificationHandler = ({ children }) => {
  const [user, loading] = useAuthState(auth)
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const processUser = async () => {
      if (user) {
        const displayName = user.displayName || ''
        const nameParts = displayName.split(' ')
        const firstName = nameParts[0] ? nameParts[0].toLowerCase() : ''
        const lastName = nameParts[1] ? nameParts[1].toLowerCase() : ''

        const userDocRef = doc(firestore, 'users', user.uid)
        const userData = {
          firstName,
          lastName,
          email: user.email,
          createdAt: new Date().toISOString(),
          userRole: 'user',
          lastLogin: new Date().toISOString(),
          record: {
            wins: 0,
            losses: 0,
            weeksPlayed: 0,
            amountPaid: 0,
            amountWon: 0,
          },
        }

        await setDoc(userDocRef, userData)
        navigate('/dashboard')
      }
    }

    if (user) {
      processUser()
    }
  }, [user, navigate])

  if (loading) {
    return <CircularProgress />
  }

  if (!user) {
    return <Navigate to="/signin" replace />
  }

  return children
}

export default EmailVerificationHandler
