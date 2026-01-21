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
  Grid,
  Box,
  CssBaseline,
  Avatar,
  Typography,
  TextField,
  Button,
  Link,
  Container,
  Alert,
  Backdrop,
  CircularProgress,
} from '@mui/material'
import {
  LockOutlined as LockOutlinedIcon,
  Google as GoogleIcon,
  Facebook as FacebookIcon,
} from '@mui/icons-material'
import Footer from '../layout/Footer'
import { firestore } from '../../firebase/firebase'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { IconButton, InputAdornment } from '@mui/material'

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
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isSubmitting || isSocialMediaSigningIn}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
          {emailSentAlert && (
            <Alert severity="success">
              Email verification has been sent. Please check your email.
            </Alert>
          )}
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
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="new-password"
                onChange={handleChange}
                helperText={errors.password}
                error={!!errors.password}
                value={userCredentials.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
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
            {/* <Button
              fullWidth
              variant="outlined"
              startIcon={<GitHubIcon />}
              onClick={handleGitHubSignIn}
            >
              Sign in with GitHub
            </Button> */}
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
              <Link href="/signin" variant="body2">
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
