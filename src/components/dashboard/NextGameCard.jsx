import React from 'react'
import { Card, CardContent, Typography, Stack } from '@mui/material'

const NextGameCard = ({ matchup, kickoffTime, timeUntil }) => (
  <Card
    sx={{
      backgroundColor: 'rgba(15,15,17,0.9)',
      color: '#f5f7ff',
      borderRadius: 2.5,
      border: '1px solid rgba(255,255,255,0.08)',
      boxShadow: '0 20px 60px rgba(0,0,0,0.45)',
      backdropFilter: 'blur(10px)',
    }}
  >
    <CardContent sx={{ color: '#e9ecf5' }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
        Next Game
      </Typography>
      {matchup ? (
        <Stack spacing={0.5}>
          <Typography variant="body1" fontWeight={600} color="#f5f7ff">
            {matchup}
          </Typography>
          <Typography variant="body2" color="rgba(233,236,245,0.7)">
            {kickoffTime}
          </Typography>
          {timeUntil && (
            <Typography variant="caption" color="rgba(233,236,245,0.7)">
              {timeUntil}
            </Typography>
          )}
        </Stack>
      ) : (
        <Typography variant="body2" color="rgba(233,236,245,0.7)">
          No upcoming game scheduled.
        </Typography>
      )}
    </CardContent>
  </Card>
)

export default NextGameCard
