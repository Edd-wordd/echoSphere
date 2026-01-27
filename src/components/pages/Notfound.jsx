import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { useNavigate } from 'react-router-dom'
import { mainBackground } from '../../styles/adminStyles'
import Footer from '../layout/Footer'

const NotFound = () => {
  const navigate = useNavigate()

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
      <Box sx={{ textAlign: 'center' }}>
        <Typography
          variant="h1"
          sx={{
            color: '#e9ecf5',
            fontWeight: 700,
            mb: 2,
            fontSize: { xs: '6rem', sm: '8rem', md: '10rem' },
            lineHeight: 1,
          }}
        >
          404
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: 'rgba(233,236,245,0.8)',
            mb: 3,
            fontWeight: 500,
          }}
        >
          Page Not Found
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/')}
          sx={{
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
          Go to Home
        </Button>
      </Box>
      <Footer sx={{ mt: 3, color: 'rgba(233,236,245,0.4)', fontSize: '0.75rem' }} />
    </Box>
  )
}

export default NotFound
