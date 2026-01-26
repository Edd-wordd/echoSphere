import React from 'react'
import { Navigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Skeleton from '@mui/material/Skeleton'
import { useAuthProfile } from '../../hooks/useAuthProfile'

const glassySx = {
  p: 3,
  backgroundColor: 'rgba(15,15,17,0.9)',
  color: '#f5f7ff',
  borderRadius: 2.5,
  border: '1px solid rgba(255,255,255,0.08)',
  boxShadow: '0 20px 60px rgba(0,0,0,0.45)',
  backdropFilter: 'blur(12px)',
}

/**
 * AdminGuard: loading -> skeleton; !user -> /signin; !isAdmin -> /dashboard; else children.
 */
export default function AdminGuard({ children }) {
  const { user, isAdmin, loading } = useAuthProfile()

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: `
            radial-gradient(circle at 20% 20%, rgba(124,77,255,0.10), transparent 32%),
            radial-gradient(circle at 80% 0%, rgba(0,200,83,0.12), transparent 30%),
            radial-gradient(circle at 50% 120%, rgba(255,64,129,0.18), transparent 35%),
            #050507`,
          color: '#e9ecf5',
        }}
      >
        <Paper sx={glassySx}>
          <Skeleton variant="text" width="60%" height={32} sx={{ bgcolor: 'rgba(255,255,255,0.12)', mb: 2 }} />
          <Skeleton variant="rectangular" height={56} sx={{ bgcolor: 'rgba(255,255,255,0.12)', borderRadius: 1, mb: 2 }} />
          <Skeleton variant="rectangular" height={56} sx={{ bgcolor: 'rgba(255,255,255,0.12)', borderRadius: 1, mb: 2 }} />
          <Skeleton variant="text" width="40%" height={24} sx={{ bgcolor: 'rgba(255,255,255,0.12)' }} />
        </Paper>
      </Box>
    )
  }

  if (!user) return <Navigate to="/signin" replace />
  if (!isAdmin) return <Navigate to="/dashboard" replace />

  return children
}
