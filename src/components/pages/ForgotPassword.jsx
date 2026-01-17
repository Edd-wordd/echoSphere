import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '../../firebase/firebase'
import { sendPasswordResetEmail } from 'firebase/auth'
import { TextField, Button, Typography, Box, Alert, CircularProgress } from '@mui/material'

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
        maxWidth: 400,
        mx: 'auto',
        mt: 8,
        p: 4,
        backgroundColor: 'background.paper',
        borderRadius: 2,
        boxShadow: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Typography variant="h5" component="h1" align="center" gutterBottom>
        Forgot Password
      </Typography>
      {success && <Alert severity="success">{success}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Enter your email"
          variant="outlined"
          type="email"
          required
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Send Reset Link'}
        </Button>
      </form>
      <Button
        variant="text"
        color="primary"
        fullWidth
        onClick={handleBackToSignIn}
        sx={{ mt: 1 }}
        disabled={loading}
      >
        Back to Sign In
      </Button>
    </Box>
  )
}

export default ForgotPassword
