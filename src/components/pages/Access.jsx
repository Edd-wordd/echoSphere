import React, { useState, useEffect } from 'react'
import { Box, TextField, Button, Typography, Paper } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const VALID_ACCESS_NUMBERS = ['12345', 'abcde', '2024', '123'] // Demo: Valid numbers (replace in production)

function Access() {
  const [accessNumber, setAccessNumber] = useState('')
  const [result, setResult] = useState(null) // null, "success", or "denied"
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setAccessNumber(e.target.value)
    setResult(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    // Simulate checking access number validity (replace with backend/API as needed)
    setTimeout(() => {
      if (VALID_ACCESS_NUMBERS.includes(accessNumber.trim())) {
        setResult('success')
      } else {
        setResult('denied')
      }
      setLoading(false)
    }, 600)
  }

  useEffect(() => {
    // Redirects to signin 1 second after "Welcome"
    if (result === 'success') {
      const timer = setTimeout(() => {
        navigate('/signin')
      }, 1000)
      return () => clearTimeout(timer)
    }
    if (result === 'denied') {
      const timer = setTimeout(() => {
        // Reset back to initial "home" view on this route
        setResult(null)
        setAccessNumber('')
        navigate('/', { replace: true })
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [result, navigate])

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          minWidth: 350,
          backgroundColor: '#1a237e', // Deep blue - solid
          color: '#fff',
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {result === 'success' ? (
          <Typography
            variant="h3"
            align="center"
            gutterBottom
            sx={{
              fontWeight: 700,
              color: '#00c853',
              letterSpacing: 2,
              textTransform: 'uppercase',
            }}
          >
            Welcome
          </Typography>
        ) : result === 'denied' ? (
          <Typography
            variant="h3"
            align="center"
            gutterBottom
            sx={{
              fontWeight: 700,
              color: '#ff1744',
              letterSpacing: 2,
              textTransform: 'uppercase',
            }}
          >
            Access Denied
          </Typography>
        ) : (
          <>
            <Typography variant="h5" align="center" gutterBottom>
              Enter Access Number
            </Typography>
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <TextField
                label="Access Number"
                variant="outlined"
                fullWidth
                value={accessNumber}
                onChange={handleChange}
                InputProps={{ style: { color: '#fff' } }}
                InputLabelProps={{ style: { color: '#b0bec5' } }}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#fff',
                    },
                    '&:hover fieldset': {
                      borderColor: '#90caf9',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#90caf9',
                    },
                  },
                }}
                disabled={loading}
                autoFocus
                required
              />
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                fullWidth
                disabled={loading}
                sx={{ mt: 1, fontWeight: 600 }}
              >
                {loading ? 'Checking...' : 'Continue'}
              </Button>
            </form>
          </>
        )}
      </Paper>
    </Box>
  )
}

export default Access
