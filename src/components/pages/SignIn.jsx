import * as React from 'react'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Link from '@mui/material/Link'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'
import Typography from '@mui/material/Typography'
import Footer from '../../components/pages/Footer'
import { useState, useEffect } from 'react'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { auth, firestore } from '../../firebase/firebase'
import GoogleIcon from '@mui/icons-material/Google'
import GitHubIcon from '@mui/icons-material/GitHub'
import FacebookIcon from '@mui/icons-material/Facebook'
import Alert from '@mui/material/Alert'
import {
  FacebookAuthProvider,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithRedirect,
} from 'firebase/auth'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress' // Adjust the path as necessary
import { useNavigate } from 'react-router-dom' // or your preferred routing library
import { onAuthStateChanged } from 'firebase/auth'

export default function SignIn() {
  const navigate = useNavigate() // useNavigate hook returns a navigate function

  const [userCredentials, setUserCredentials] = useState({
    email: '',
    password: '',
  })
  const [errorMessage, setErrorMessage] = useState('')
  const [isSocialMediaSigningIn, setIsSocialMediaSigningIn] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

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
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, redirect to dashboard
        navigate('/dashboard')
      }
    })

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [navigate])
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

  useEffect(() => {
    let timer
    if (errorMessage) {
      timer = setTimeout(() => {
        setErrorMessage('')
      }, 3000)
    }
    return () => {
      clearTimeout(timer)
    }
  }, [errorMessage])

  const handleChange = (e) => {
    const { value, name } = e.target
    setUserCredentials({ ...userCredentials, [name]: value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/

    if (userCredentials.email === '' || userCredentials.password === '') {
      console.log('Email or password is empty')
      setErrorMessage('Email or password is empty')
      setIsSubmitting(false)

      return
    }

    if (!emailRegex.test(userCredentials.email)) {
      console.log('Invalid email address')
      setErrorMessage('Invalid email address')
      setIsSubmitting(false)

      return
    }

    setIsSubmitting(true)

    try {
      // Log the user credentials for debugging purposes
      console.log('User credentials:', userCredentials)

      // Create a query against the collection
      const q = query(collection(firestore, 'users'), where('email', '==', userCredentials.email))

      // Execute the query
      const querySnapshot = await getDocs(q)

      if (!querySnapshot.empty) {
        // Log each document found
        querySnapshot.forEach((doc) => {
          console.log('User data:', doc.data())
        })
      } else {
        // Log that no documents were found
        console.log('No such user!')
        setErrorMessage('No such user!')
      }
    } catch (error) {
      // Log any errors that occur during the retrieval
      console.error('Error fetching user data:', error)
    }
  }

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      <CssBaseline />
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isSubmitting || isSocialMediaSigningIn}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1677212004257-103cfa6b59d0?q=80&w=2160&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)',
          backgroundRepeat: 'no-repeat',
          backgroundColor: (t) =>
            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <Grid
        item
        xs={12}
        sm={8}
        md={5}
        component={Paper}
        elevation={6}
        square
        sx={{ backgroundColor: '#f5f5f5' }}
      >
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <RocketLaunchIcon />
          </Avatar>
          <Typography component="h1" variant="h5" color={'#375e6d'}>
            Sign in
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={handleChange}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/Signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
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
            <Footer sx={{ mt: 5 }} />
          </Box>
        </Box>
      </Grid>
    </Grid>
  )
}
