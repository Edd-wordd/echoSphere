import React from 'react'
import { Card, CardContent, Typography, Stack } from '@mui/material'
import SportsFootballIcon from '@mui/icons-material/SportsFootball'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import { glassyCard } from '../../styles/adminStyles'

const NextGameCard = ({ matchup, kickoffTime, timeUntil }) => (
  <Card sx={glassyCard}>
    <CardContent sx={{ color: '#e9ecf5', py: 2.5, px: 2.5 }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <SportsFootballIcon sx={{ fontSize: 18, color: 'rgba(233,236,245,0.5)' }} />
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'rgba(233,236,245,0.95)' }}>
          Next Game
        </Typography>
      </Stack>
      {matchup ? (
        <Stack spacing={1}>
          <Typography variant="body2" sx={{ color: '#e9ecf5', fontWeight: 600, fontSize: '0.875rem' }}>
            {matchup}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1}>
            <AccessTimeIcon sx={{ fontSize: 14, color: 'rgba(233,236,245,0.5)' }} />
            <Typography variant="body2" sx={{ color: 'rgba(233,236,245,0.7)', fontSize: '0.8125rem' }}>
              {kickoffTime}
            </Typography>
          </Stack>
          {timeUntil && (
            <Typography variant="caption" sx={{ color: 'rgba(233,236,245,0.5)', fontSize: '0.7rem' }}>
              {timeUntil}
            </Typography>
          )}
        </Stack>
      ) : (
        <Typography variant="body2" sx={{ color: 'rgba(233,236,245,0.7)', fontSize: '0.8125rem' }}>
          No upcoming game scheduled.
        </Typography>
      )}
    </CardContent>
  </Card>
)

export default NextGameCard
