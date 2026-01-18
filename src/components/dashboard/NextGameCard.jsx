import React from 'react'
import { Card, CardContent, Typography, Stack } from '@mui/material'

const NextGameCard = ({ matchup, kickoffTime, timeUntil }) => (
  <Card>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        Next Game
      </Typography>
      {matchup ? (
        <Stack spacing={0.5}>
          <Typography variant="body1" fontWeight={600}>
            {matchup}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {kickoffTime}
          </Typography>
          {timeUntil && (
            <Typography variant="caption" color="text.secondary">
              {timeUntil}
            </Typography>
          )}
        </Stack>
      ) : (
        <Typography variant="body2" color="text.secondary">
          No upcoming game scheduled.
        </Typography>
      )}
    </CardContent>
  </Card>
)

export default NextGameCard
