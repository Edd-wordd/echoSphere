import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  TextField,
  Link,
  Typography,
  Stack,
  Alert,
  Backdrop,
  CircularProgress,
} from '@mui/material'
import SportsFootballIcon from '@mui/icons-material/SportsFootball'
import GoogleIcon from '@mui/icons-material/Google'
import FacebookIcon from '@mui/icons-material/Facebook'
import {
  getAuth,
  FacebookAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { processUserData } from '../utilis/ProcessUserData'
import { glassyCard, mainBackground } from '../../styles/adminStyles'
import Footer from '../layout/Footer'

const glassAuthCard = {
  ...glassyCard,
  maxWidth: 400,
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
  },
  '& .MuiInputLabel-root': { color: 'rgba(233,236,245,0.6)' },
  '& .MuiInputBase-input': { color: '#e9ecf5' },
}

export default function SignIn() {
  const navigate = useNavigate()
  const [userCredentials, setUserCredentials] = useState({ email: '', password: '' })
  const [errorMessage, setErrorMessage] = useState('')
  const [isSocialMediaSigningIn, setIsSocialMediaSigningIn] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleGoogleSignIn = async (e) => {
    e.preventDefault()
    setIsSocialMediaSigningIn(true)
    const provider = new GoogleAuthProvider()
    try {
      const result = await signInWithPopup(getAuth(), provider)
      await processUserData(result.user)
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
      const result = await signInWithPopup(getAuth(), provider)
      await processUserData(result.user)
      navigate('/dashboard')
    } catch (error) {
      console.error('Error during sign-in with popup:', error)
      setErrorMessage('Error during sign-in. Please try again.')
      setIsSocialMediaSigningIn(false)
    }
  }

  useEffect(() => {
    const auth = getAuth()
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await processUserData(user)
        navigate('/dashboard')
      }
    })
    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [navigate])

  useEffect(() => {
    let timer
    if (errorMessage) {
      timer = setTimeout(() => setErrorMessage(''), 3000)
    }
    return () => clearTimeout(timer)
  }, [errorMessage])

  const handleChange = (e) => {
    const { value, name } = e.target
    setUserCredentials({ ...userCredentials, [name]: value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/

    if (userCredentials.email === '' || userCredentials.password === '') {
      setErrorMessage('Email or password is empty')
      setIsSubmitting(false)
      return
    }
    if (!emailRegex.test(userCredentials.email)) {
      setErrorMessage('Invalid email address')
      setIsSubmitting(false)
      return
    }

    setIsSubmitting(true)
    try {
      const userCredential = await signInWithEmailAndPassword(
        getAuth(),
        userCredentials.email,
        userCredentials.password,
      )
      const user = userCredential.user

      if (!user.emailVerified) {
        await signOut(getAuth())
        setErrorMessage('Please verify your email before logging in.')
        setIsSubmitting(false)
        return
      }

      await processUserData(user)
      navigate('/dashboard')
    } catch (error) {
      console.error('Error during email sign-in:', error)
      if (error.code === 'auth/user-not-found') {
        setErrorMessage('No user found with this email.')
      } else if (error.code === 'auth/wrong-password') {
        setErrorMessage('Incorrect password.')
      } else if (error.code === 'auth/invalid-credential') {
        setErrorMessage('Invalid email or password.')
      } else {
        setErrorMessage('Error during sign-in. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
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
            Sign in to EchoSphere
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(233,236,245,0.55)',
              fontSize: '0.8125rem',
              textAlign: 'center',
            }}
          >
            Access your picks and league dashboard
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

          <Stack spacing={1.5}>
            <TextField
              required
              fullWidth
              id="email"
              label="Email address"
              name="email"
              type="email"
              autoComplete="email"
              autoFocus
              variant="outlined"
              size="small"
              onChange={handleChange}
              sx={inputSx}
            />
            <TextField
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              variant="outlined"
              size="small"
              onChange={handleChange}
              sx={inputSx}
            />
          </Stack>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="medium"
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
            }}
          >
            Sign in
          </Button>

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            gap={1}
            sx={{ mt: 2 }}
          >
            <Link
              href="/forgot-password"
              variant="body2"
              sx={{
                color: 'rgba(233,236,245,0.55)',
                fontSize: '0.8rem',
                textDecoration: 'none',
                '&:hover': { color: 'rgba(183,148,246,0.9)', textDecoration: 'underline' },
              }}
            >
              Forgot password?
            </Link>
            <Link
              href="/Signup"
              variant="body2"
              sx={{
                color: 'rgba(233,236,245,0.55)',
                fontSize: '0.8rem',
                textDecoration: 'none',
                '&:hover': { color: 'rgba(183,148,246,0.9)', textDecoration: 'underline' },
              }}
            >
              Create account
            </Link>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ my: 2 }}>
            <Box sx={{ flex: 1, height: 1, bgcolor: 'rgba(255,255,255,0.08)' }} />
            <Typography
              variant="caption"
              sx={{ color: 'rgba(233,236,245,0.4)', fontSize: '0.75rem' }}
            >
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
