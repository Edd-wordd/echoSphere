import React from 'react'
import { Card, CardContent, Typography, Stack } from '@mui/material'

const StatRow = ({ label, value }) => (
  <Stack direction="row" justifyContent="space-between" mb={1}>
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="body1" fontWeight={600}>
      {value}
    </Typography>
  </Stack>
)

const UserRecapCard = ({ lastWeekRecord, seasonRecord, currentRank, streak }) => (
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
        Your Recap
      </Typography>
      <StatRow label="Last week" value={lastWeekRecord} />
      <StatRow label="Season" value={seasonRecord} />
      <StatRow label="Current rank" value={currentRank} />
      {streak && (
        <Typography variant="body2" mt={1} color={streak.type === 'hot' ? '#8be9c6' : '#ffbaba'}>
          {streak.type === 'hot' ? '🔥' : '❄️'} {streak.label}
        </Typography>
      )}
    </CardContent>
  </Card>
)

export default UserRecapCard
