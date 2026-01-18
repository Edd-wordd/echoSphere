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

const UserRecapCard = ({ lastWeekRecord, seasonRecord, currentRank }) => (
  <Card>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        Your Recap
      </Typography>
      <StatRow label="Last week" value={lastWeekRecord} />
      <StatRow label="Season" value={seasonRecord} />
      <StatRow label="Current rank" value={currentRank} />
    </CardContent>
  </Card>
)

export default UserRecapCard
