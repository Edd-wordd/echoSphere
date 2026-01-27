import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '../../firebase/firebase'
import { sendPasswordResetEmail } from 'firebase/auth'
import {
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Stack,
  Backdrop,
  Link,
} from '@mui/material'
import SportsFootballIcon from '@mui/icons-material/SportsFootball'
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

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await sendPasswordResetEmail(auth, email)
      setSuccess('Password reset link sent! Please check your email.')
    } catch (err) {
      setError(err.message || 'Error sending password reset email.')
    } finally {
      setLoading(false)
    }
  }

  const handleBackToSignIn = () => {
    navigate('/signin')
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
        open={loading}
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
            Reset your password
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(233,236,245,0.55)',
              fontSize: '0.8125rem',
              textAlign: 'center',
            }}
          >
            Enter your email and we'll send you a reset link.
          </Typography>
        </Stack>

        <Box component="form" noValidate onSubmit={handleSubmit}>
          {success && (
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
              {success}
            </Alert>
          )}
          {error && (
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
              {error}
            </Alert>
          )}

          <TextField
            label="Email address"
            variant="outlined"
            type="email"
            required
            fullWidth
            size="small"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            autoFocus
            sx={inputSx}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="medium"
            disabled={loading}
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
            {loading ? 'Sending...' : 'Send reset link'}
          </Button>

          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            sx={{ mt: 2 }}
          >
            <Link
              component="button"
              type="button"
              variant="body2"
              onClick={handleBackToSignIn}
              disabled={loading}
              sx={{
                color: 'rgba(233,236,245,0.55)',
                fontSize: '0.8rem',
                textDecoration: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                '&:hover': { color: 'rgba(183,148,246,0.9)', textDecoration: 'underline' },
                '&:disabled': { color: 'rgba(233,236,245,0.3)', cursor: 'not-allowed' },
              }}
            >
              Back to Sign In
            </Link>
          </Stack>
        </Box>
      </Box>

      <Footer sx={{ mt: 3, color: 'rgba(233,236,245,0.4)', fontSize: '0.75rem' }} />
    </Box>
  )
}

export default ForgotPassword
