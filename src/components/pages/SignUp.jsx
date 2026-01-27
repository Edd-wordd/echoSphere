import * as React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '../../firebase/firebase'
import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  signOut,
} from 'firebase/auth'
import { collection, query, where, getDocs, doc, setDoc, serverTimestamp } from 'firebase/firestore'
import {
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  Backdrop,
  CircularProgress,
  Stack,
  Grid,
  IconButton,
  InputAdornment,
} from '@mui/material'
import SportsFootballIcon from '@mui/icons-material/SportsFootball'
import GoogleIcon from '@mui/icons-material/Google'
import FacebookIcon from '@mui/icons-material/Facebook'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import Footer from '../layout/Footer'
import { firestore } from '../../firebase/firebase'
import { glassyCard, mainBackground } from '../../styles/adminStyles'

const glassAuthCard = {
  ...glassyCard,
  maxWidth: 440,
  width: '100%',
  borderRadius: 2.5,
  border: '1px solid rgba(255,255,255,0.08)',
  boxShadow: '0 24px 64px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)',
  backdropFilter: 'blur(16px)',
}

const inputSx = {
  '& .MuiOutlinedInput-root': {
    bgcolor: 'rgba(255,255,255,0.04)',
    borderRadius: 1.5,
    '& fieldset': { borderColor: 'rgba(255,255,255,0.12)' },
    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.18)' },
    '&.Mui-focused fieldset': {
      borderColor: 'rgba(124,77,255,0.5)',
      boxShadow: '0 0 0 1px rgba(124,77,255,0.25)',
    },
    '&.Mui-error fieldset': {
      borderColor: 'rgba(255,82,82,0.5)',
    },
  },
  '& .MuiInputLabel-root': { color: 'rgba(233,236,245,0.6)' },
  '& .MuiInputBase-input': { color: '#e9ecf5' },
  '& .MuiFormHelperText-root': { color: 'rgba(233,236,245,0.5)', fontSize: '0.75rem' },
}

export default function SignUp() {
  const navigate = useNavigate()
  const [userCredentials, setUserCredentials] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState({ email: '', password: '', lastName: '', firstName: '' })
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isSocialMediaSigningIn, setIsSocialMediaSigningIn] = useState(false)
  const [emailSentAlert, setEmailSentAlert] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    const { firstName, lastName, email, password } = userCredentials
    const hasErrors = !!errors.firstName || !!errors.lastName || !!errors.email || !!errors.password
    const allFieldsFilled = firstName && lastName && email && password
    setIsSubmitDisabled(hasErrors || !allFieldsFilled)
  }, [userCredentials, errors])

  useEffect(() => {
    let timer
    if (errorMessage) {
      timer = setTimeout(() => {
        setErrorMessage('')
      }, 3000)
    }
    return () => clearTimeout(timer)
  }, [errorMessage])

  const handleGoogleSignIn = async (e) => {
    e.preventDefault()
    setIsSocialMediaSigningIn(true)
    const provider = new GoogleAuthProvider()
    try {
      const result = await signInWithPopup(auth, provider)
      console.log('Google sign-in result:', result)
      navigate('/dashboard')
    } catch (error) {
      console.error('Error during sign-in with popup:', error)
      setErrorMessage('Error during sign-in. Please try again.')
      setIsSocialMediaSigningIn(false)
    }
  }

  const handleFacebookSignIn = async (e) => {
    e.preventDefault()
    setIsSocialMediaSigningIn(true)
    const provider = new FacebookAuthProvider()
    try {
      const result = await signInWithPopup(auth, provider)
      console.log('Facebook sign-in result:', result)
      navigate('/dashboard')
    } catch (error) {
      console.error('Error during sign-in with popup:', error)
      setErrorMessage('Error during sign-in. Please try again.')
      setIsSocialMediaSigningIn(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    setUserCredentials((prev) => {
      const updatedCredentials = { ...prev, [name]: value.trim() }

      if (name === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: emailRegex.test(value) ? '' : 'Invalid email format',
        }))
      }

      if (name === 'firstName' || name === 'lastName') {
        const nameRegex = /^[a-zA-Z\s]+$/
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: nameRegex.test(value) ? '' : 'Invalid name format',
        }))
      }

      if (name === 'password') {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        setErrors((prevErrors) => ({
          ...prevErrors,
          password: passwordRegex.test(value)
            ? ''
            : 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character',
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
      // First check if email exists in Firestore
      const q = query(collection(firestore, 'users'), where('email', '==', email))
      const querySnapshot = await getDocs(q)
      if (!querySnapshot.empty) {
        setErrorMessage('Email already in use.')
        setIsSubmitting(false)
        return
      }

      // Create authentication user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Update user profile
      await updateProfile(user, { displayName: `${firstName} ${lastName}` })

      // Save user data to Firestore
      try {
        await setDoc(doc(firestore, 'users', user.uid), {
          firstName,
          lastName,
          email,
          createdAt: serverTimestamp(),
          uid: user.uid,
          role: 'user',
        })
      } catch (firestoreError) {
        console.error('Error saving to Firestore:', firestoreError)
        // If Firestore save fails, delete the auth user to maintain consistency
        await user.delete()
        throw new Error('Failed to save user data')
      }

      // Send verification email
      await sendEmailVerification(user)

      setUserCredentials({ firstName: '', lastName: '', email: '', password: '' })
      setEmailSentAlert(true)

      // Sign out the user after sending the email verification
      await signOut(auth)

      setTimeout(() => {
        setEmailSentAlert(false)
        navigate('/signin') // Redirect to the sign-in page
      }, 3000)
    } catch (error) {
      console.error('Signup error:', error)
      if (error.code === 'auth/email-already-in-use') {
        setErrorMessage('Email already in use.')
      } else if (error.code === 'auth/invalid-email') {
        setErrorMessage('Invalid email address.')
      } else if (error.code === 'auth/weak-password') {
        setErrorMessage('Password is too weak. Need at least 6 characters.')
      } else if (error.message === 'Failed to save user data') {
        setErrorMessage('Error creating account. Please try again.')
      } else {
        setErrorMessage('Error signing up. Please try again.')
      }
    }

    setIsSubmitting(false)
  }

  return (
    <Box
      sx={{
        ...mainBackground,
        width: '100vw',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflowX: 'hidden',
        py: 4,
        px: 2,
      }}
    >
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: 'rgba(0,0,0,0.6)',
        }}
        open={isSubmitting || isSocialMediaSigningIn}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Box
        component="div"
        sx={{
          ...glassAuthCard,
          p: 3,
        }}
      >
        <Stack alignItems="center" spacing={1.5} sx={{ mb: 2.5 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2,
              bgcolor: 'rgba(124,77,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <SportsFootballIcon sx={{ fontSize: 24, color: 'rgba(183,148,246,0.95)' }} />
          </Box>
          <Typography
            component="h1"
            sx={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: '#e9ecf5',
              letterSpacing: '-0.02em',
            }}
          >
            Create your account
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(233,236,245,0.55)',
              fontSize: '0.8125rem',
              textAlign: 'center',
            }}
          >
            Join your league and start making picks.
          </Typography>
        </Stack>

        <Box component="form" noValidate onSubmit={handleSubmit}>
          {errorMessage && (
            <Alert
              severity="error"
              sx={{
                mb: 2,
                bgcolor: 'rgba(255,82,82,0.1)',
                color: '#ff8a80',
                '& .MuiAlert-icon': { color: '#ff8a80' },
                border: '1px solid rgba(255,82,82,0.2)',
              }}
            >
              {errorMessage}
            </Alert>
          )}
          {emailSentAlert && (
            <Alert
              severity="success"
              sx={{
                mb: 2,
                bgcolor: 'rgba(0,200,83,0.1)',
                color: '#81c784',
                '& .MuiAlert-icon': { color: '#81c784' },
                border: '1px solid rgba(0,200,83,0.2)',
              }}
            >
              Email verification has been sent. Please check your email.
            </Alert>
          )}

          <Grid container spacing={1.5}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="given-name"
                name="firstName"
                required
                fullWidth
                id="firstName"
                label="First name"
                autoFocus
                variant="outlined"
                size="small"
                onChange={handleChange}
                helperText={errors.firstName}
                error={!!errors.firstName}
                value={userCredentials.firstName}
                sx={inputSx}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="lastName"
                label="Last name"
                name="lastName"
                autoComplete="family-name"
                variant="outlined"
                size="small"
                onChange={handleChange}
                helperText={errors.lastName}
                error={!!errors.lastName}
                value={userCredentials.lastName}
                sx={inputSx}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email address"
                name="email"
                type="email"
                autoComplete="email"
                variant="outlined"
                size="small"
                onChange={handleChange}
                helperText={errors.email}
                error={!!errors.email}
                value={userCredentials.email}
                sx={inputSx}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="new-password"
                variant="outlined"
                size="small"
                onChange={handleChange}
                helperText={errors.password}
                error={!!errors.password}
                value={userCredentials.password}
                sx={inputSx}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: 'rgba(233,236,245,0.6)' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="medium"
            disabled={isSubmitDisabled || isSubmitting}
            sx={{
              mt: 2,
              py: 1.25,
              fontWeight: 600,
              fontSize: '0.9rem',
              textTransform: 'none',
              bgcolor: 'rgba(124,77,255,0.4)',
              color: '#e9ecf5',
              border: '1px solid rgba(255,255,255,0.12)',
              '&:hover': {
                bgcolor: 'rgba(124,77,255,0.5)',
                borderColor: 'rgba(255,255,255,0.18)',
              },
              '&.Mui-disabled': {
                bgcolor: 'rgba(124,77,255,0.15)',
                color: 'rgba(233,236,245,0.4)',
                borderColor: 'rgba(255,255,255,0.06)',
              },
            }}
          >
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </Button>

          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            sx={{ mt: 2 }}
          >
            <Link
              href="/signin"
              variant="body2"
              sx={{
                color: 'rgba(233,236,245,0.55)',
                fontSize: '0.8rem',
                textDecoration: 'none',
                '&:hover': { color: 'rgba(183,148,246,0.9)', textDecoration: 'underline' },
              }}
            >
              Already have an account? Sign in
            </Link>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ my: 2 }}>
            <Box sx={{ flex: 1, height: 1, bgcolor: 'rgba(255,255,255,0.08)' }} />
            <Typography variant="caption" sx={{ color: 'rgba(233,236,245,0.4)', fontSize: '0.75rem' }}>
              or
            </Typography>
            <Box sx={{ flex: 1, height: 1, bgcolor: 'rgba(255,255,255,0.08)' }} />
          </Stack>

          <Stack direction="row" spacing={1.5}>
            <Button
              fullWidth
              variant="outlined"
              size="small"
              startIcon={<GoogleIcon sx={{ fontSize: 18 }} />}
              onClick={handleGoogleSignIn}
              sx={{
                py: 1,
                textTransform: 'none',
                fontSize: '0.8rem',
                fontWeight: 500,
                bgcolor: 'rgba(255,255,255,0.04)',
                borderColor: 'rgba(255,255,255,0.12)',
                color: 'rgba(233,236,245,0.8)',
                '&:hover': {
                  borderColor: 'rgba(255,255,255,0.2)',
                  bgcolor: 'rgba(255,255,255,0.06)',
                },
              }}
            >
              Google
            </Button>
            <Button
              fullWidth
              variant="outlined"
              size="small"
              startIcon={<FacebookIcon sx={{ fontSize: 18 }} />}
              onClick={handleFacebookSignIn}
              sx={{
                py: 1,
                textTransform: 'none',
                fontSize: '0.8rem',
                fontWeight: 500,
                bgcolor: 'rgba(255,255,255,0.04)',
                borderColor: 'rgba(255,255,255,0.12)',
                color: 'rgba(233,236,245,0.8)',
                '&:hover': {
                  borderColor: 'rgba(255,255,255,0.2)',
                  bgcolor: 'rgba(255,255,255,0.06)',
                },
              }}
            >
              Facebook
            </Button>
          </Stack>
        </Box>
      </Box>

      <Footer sx={{ mt: 3, color: 'rgba(233,236,245,0.4)', fontSize: '0.75rem' }} />
    </Box>
  )
}
