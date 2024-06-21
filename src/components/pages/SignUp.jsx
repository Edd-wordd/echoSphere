import * as React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import Link from '@mui/material/Link'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import CircularProgress from '@mui/material/CircularProgress'
import Backdrop from '@mui/material/Backdrop'
import Alert from '@mui/material/Alert'
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  GithubAuthProvider,
  FacebookAuthProvider,
} from 'firebase/auth'
import { auth, firestore } from '../../firebase/firebase'
import { doc, setDoc, getDocs, getDoc, collection, query, where } from 'firebase/firestore'
import GoogleIcon from '@mui/icons-material/Google'
import GitHubIcon from '@mui/icons-material/GitHub'
import FacebookIcon from '@mui/icons-material/Facebook'
import Footer from '../../components/pages/Footer'

export default function SignUp() {
  const navigate = useNavigate()
  const [userCredentials, setUserCredentials] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    lastName: '',
    firstName: '',
  })
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [emailSentAlert, setEmailSentAlert] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // Add a state to manage the spinner for social media sign-ins
  const [isSocialMediaSigningIn, setIsSocialMediaSigningIn] = useState(false)

  useEffect(() => {
    const { firstName, lastName, email, password } = userCredentials
    const hasErrors = !!errors.firstName || !!errors.lastName || !!errors.email || !!errors.password
    const allFieldsFilled = firstName && lastName && email && password
    setIsSubmitDisabled(hasErrors || !allFieldsFilled)
  }, [userCredentials, errors])

  useEffect(() => {
    if (emailSentAlert) {
      const timer = setTimeout(() => {
        setEmailSentAlert(false)
      }, 3000)
      return () => clearTimeout(timer) // Cleanup the timeout on unmount
    }
  }, [emailSentAlert])

  useEffect(() => {
    let timer
    if (errorMessage) {
      timer = setTimeout(() => {
        setErrorMessage('')
      }, 3000)
    }
    return () => clearTimeout(timer) // Cleanup the timeout on unmount
  }, [errorMessage])

  // Handle the redirect result in useEffect to keep the spinner visible
  useEffect(() => {
    const handleRedirectResult = async () => {
      setIsSocialMediaSigningIn(true)
      try {
        const result = await getRedirectResult(auth)
        if (result) {
          const user = result.user

          // Check if user document exists
          const userDocRef = doc(firestore, 'users', user.uid)
          const userDoc = await getDoc(userDocRef)

          if (!userDoc.exists()) {
            // Safely handle displayName and split it
            const displayName = user.displayName ? user.displayName : ''
            const [firstName, lastName] = displayName.split(' ')

            // Create new user document in Firestore
            const additionalUserInfo = {
              firstName: firstName ? firstName.toLowerCase() : '',
              lastName: lastName ? lastName.toLowerCase() : '',
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

            await setDoc(userDocRef, additionalUserInfo)
          }

          console.log('User signed in and Firestore document checked/created:', user)
          navigate('/dashboard')
        }
      } catch (error) {
        console.error('Error getting redirect result:', error)
        setErrorMessage('Error during sign-in. Please try again.')
      } finally {
        setIsSocialMediaSigningIn(false)
      }
    }

    handleRedirectResult()
  }, [navigate])

  const handleGoogleSignIn = async (e) => {
    e.preventDefault()
    setIsSocialMediaSigningIn(true)
    const provider = new GoogleAuthProvider()
    try {
      await signInWithRedirect(auth, provider)
    } catch (error) {
      console.error('Error during sign-in with redirect:', error)
      setErrorMessage('Error during sign-in. Please try again.')
      setIsSocialMediaSigningIn(false)
    }
  }

  const handleGitHubSignIn = async (e) => {
    e.preventDefault()
    setIsSocialMediaSigningIn(true)
    const provider = new GithubAuthProvider()
    try {
      await signInWithRedirect(auth, provider)
    } catch (error) {
      console.error('Error during sign-in with redirect:', error)
      setErrorMessage('Error during sign-in. Please try again.')
      setIsSocialMediaSigningIn(false)
    }
  }

  const handleFacebookSignIn = async (e) => {
    e.preventDefault()
    setIsSocialMediaSigningIn(true)
    const provider = new FacebookAuthProvider()
    try {
      await signInWithRedirect(auth, provider)
    } catch (error) {
      console.error('Error during sign-in with redirect:', error)
      setErrorMessage('Error during sign-in. Please try again.')
      setIsSocialMediaSigningIn(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    setUserCredentials((prev) => {
      const updatedCredentials = {
        ...prev,
        [name]: value,
      }

      if (name === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: emailRegex.test(value) ? '' : 'Invalid email format',
        }))
      }

      if (name === 'firstName' || name === 'lastName') {
        const nameRegex = /^[a-zA-Z]+$/
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: nameRegex.test(value) ? '' : 'Invalid name format',
        }))
      }
      return updatedCredentials
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const { firstName, lastName, email, password } = userCredentials

    setIsSubmitting(true)

    if (errors.email || errors.firstName || errors.lastName) {
      console.log('Invalid form')
      setIsSubmitting(false)
      return
    }

    try {
      // Check if the email is already in use in Firestore
      const q = query(collection(firestore, 'users'), where('email', '==', email))
      const querySnapshot = await getDocs(q)
      if (!querySnapshot.empty) {
        setErrorMessage('Email already in use.')
        setIsSubmitting(false)
        return
      }

      // Create new user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      const additionalUserInfo = {
        firstName: firstName.toLowerCase(),
        lastName: lastName.toLowerCase(),
        email,
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

      await setDoc(doc(firestore, 'users', user.uid), additionalUserInfo)
      await sendEmailVerification(user).then(() => {
        setEmailSentAlert(true) // Show the email sent alert
      })

      setUserCredentials({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
      })
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setErrorMessage('Email already in use.')
      } else if (error.code === 'auth/invalid-email') {
        setErrorMessage('Invalid email address.')
      } else if (error.code === 'auth/weak-password') {
        setErrorMessage('Password is too weak. Need at least 6 characters.')
      } else {
        setErrorMessage('Error signing up. Please try again.')
      }
    }

    setIsSubmitting(false)
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      {/* Add Backdrop for social media sign-ins */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isSubmitting || isSocialMediaSigningIn}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          {emailSentAlert && <Alert severity="success">Email verification sent!</Alert>}
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="given-name"
                name="firstName"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                onChange={handleChange}
                helperText={errors.firstName}
                error={!!errors.firstName}
                value={userCredentials.firstName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="family-name"
                onChange={handleChange}
                helperText={errors.lastName}
                error={!!errors.lastName}
                value={userCredentials.lastName}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={handleChange}
                helperText={errors.email}
                error={!!errors.email}
                value={userCredentials.email}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                onChange={handleChange}
                helperText={errors.password}
                error={!!errors.password}
                value={userCredentials.password}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isSubmitDisabled || isSubmitting}
            sx={{ mt: 3, mb: 2 }}
          >
            {isSubmitting ? 'Submitting...' : 'Sign Up'}
          </Button>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, mb: 2 }}>
            <Box sx={{ flex: 1, height: '1px', backgroundColor: 'rgba(0, 0, 0, 0.12)' }} />
            <Typography variant="body2" sx={{ mx: 2 }}>
              or
            </Typography>
            <Box sx={{ flex: 1, height: '1px', backgroundColor: 'rgba(0, 0, 0, 0.12)' }} />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<GoogleIcon />}
              onClick={handleGoogleSignIn}
            >
              Sign in with Google
            </Button>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<GitHubIcon />}
              onClick={handleGitHubSignIn}
            >
              Sign in with GitHub
            </Button>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FacebookIcon />}
              onClick={handleFacebookSignIn}
            >
              Sign in with Facebook
            </Button>
          </Box>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Footer sx={{ mt: 5 }} />
    </Container>
  )
}
