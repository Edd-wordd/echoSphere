import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { useNavigate } from 'react-router-dom'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        color: 'text.primary',
      }}
    >
      <Typography variant="h1">404</Typography>
      <Typography variant="h6">Page Not Found</Typography>
      <Button variant="contained" color="primary" onClick={() => navigate('/')}>
        Go to Home
      </Button>
    </Box>
  )
}

export default NotFound
