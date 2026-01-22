import React, { useState, useEffect, useMemo } from 'react'
import { Box, TextField, Button, Typography, Paper, Stack } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import Spline from '@splinetool/react-spline'

const VALID_ACCESS_NUMBERS = ['12345', 'abcde', '2024', '123'] // Demo only
const SPLINE_SCENE_URL = 'https://prod.spline.design/byX3TPqdB123e57B/scene.splinecode'

function Access() {
  const [accessNumber, setAccessNumber] = useState('')
  const [result, setResult] = useState(null) // null | "success" | "denied"
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setAccessNumber(e.target.value)
    setResult(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)

    setTimeout(() => {
      if (VALID_ACCESS_NUMBERS.includes(accessNumber.trim())) setResult('success')
      else setResult('denied')
      setLoading(false)
    }, 600)
  }

  useEffect(() => {
    if (result === 'success') {
      const timer = setTimeout(() => navigate('/signin'), 2000)
      return () => clearTimeout(timer)
    }
    if (result === 'denied') {
      const timer = setTimeout(() => {
        setResult(null)
        setAccessNumber('')
        navigate('/', { replace: true })
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [result, navigate])

  const title = useMemo(() => {
    if (result === 'success') return 'Welcome'
    if (result === 'denied') return 'Access Denied'
    return 'Enter Access Number'
  }, [result])

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        bgcolor: 'black',
        m: 0,
      }}
    >
      {/* Spline layer covering background */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          opacity: 0.95,
          filter: 'saturate(1.05) contrast(1.02)',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '120vw', sm: '110vw', md: '100vw' },
            maxWidth: '1400px',
            maxHeight: '1400px',
          }}
        >
          <Spline scene={SPLINE_SCENE_URL} />
        </Box>
      </Box>

      {result === 'success' && (
        <Box
          sx={{
            position: 'absolute',
            top: { xs: '16%', sm: '24%' },
            left: '45%',
            transform: 'translateX(-50%)',
            zIndex: 2,
            px: 2.5,
            py: 1.25,
            bgcolor: '#e8f5e9',
            color: '#1b5e20',
            borderRadius: 2,
            boxShadow: '0px 8px 30px rgba(0,0,0,0.35)',
            border: '1px solid rgba(27,94,32,0.15)',
            minWidth: 190,
            textAlign: 'center',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Typography variant="body2" fontWeight={800}>
            Welcome aboard
          </Typography>
          <Box
            sx={{
              position: 'absolute',
              bottom: -10,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '10px solid transparent',
              borderRight: '10px solid transparent',
              borderTop: '10px solid #e8f5e9',
            }}
          />
        </Box>
      )}

      {result === 'denied' && (
        <Box
          sx={{
            position: 'absolute',
            top: { xs: '18%', sm: '27%' },
            left: '55%',
            transform: 'translateX(-50%)',
            zIndex: 2,
            px: 2,
            py: 1,
            bgcolor: '#fff',
            color: '#000',
            borderRadius: 2,
            boxShadow: '0px 8px 30px rgba(0,0,0,0.35)',
            border: '1px solid rgba(0,0,0,0.10)',
            minWidth: 180,
            textAlign: 'center',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Typography variant="body2" fontWeight={700}>
            Sorry Access denied
          </Typography>
          <Box
            sx={{
              position: 'absolute',
              bottom: -10,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '10px solid transparent',
              borderRight: '10px solid transparent',
              borderTop: '10px solid #fff',
            }}
          />
        </Box>
      )}

      {/* Foreground UI */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          minHeight: '85vh',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          px: 2,
          pb: { xs: 10, sm: 8 },
        }}
      >
        <Paper
          elevation={10}
          sx={{
            p: 2,
            width: '100%',
            maxWidth: 360,
            borderRadius: 2,
            backgroundColor: 'rgba(15,15,15,0.8)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#fff',
            backdropFilter: 'blur(10px)',
          }}
        >
          <form onSubmit={handleSubmit}>
            <Stack spacing={1.5}>
              <Typography variant="subtitle1" align="center" sx={{ fontWeight: 700 }}>
                Enter Access Code
              </Typography>
              <TextField
                size="small"
                label="Access Number"
                variant="outlined"
                fullWidth
                value={accessNumber}
                onChange={handleChange}
                InputProps={{ style: { color: '#fff' } }}
                InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    borderRadius: 1.5,
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.18)' },
                    '&:hover fieldset': { borderColor: 'rgba(144,202,249,0.8)' },
                    '&.Mui-focused fieldset': { borderColor: 'rgba(144,202,249,0.95)' },
                  },
                }}
                disabled={loading}
                required
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  fontWeight: 800,
                  borderRadius: 1.5,
                  py: 1,
                  textTransform: 'none',
                  background: 'linear-gradient(90deg, #7c4dff, #00c853)',
                  '&:hover': { background: 'linear-gradient(90deg, #6c3ff0, #00b84a)' },
                }}
              >
                {loading ? 'Checking…' : 'Continue'}
              </Button>
            </Stack>
          </form>
        </Paper>
      </Box>
    </Box>
  )
}

export default Access
