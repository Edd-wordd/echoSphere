import React from 'react'
import { Card, CardContent, Typography, Stack, Button, Chip } from '@mui/material'

const ThisWeekCard = ({ weekNumber, picksSubmitted, lockDeadline, onManagePicks }) => {
  const statusLabel = picksSubmitted ? 'Submitted' : 'Not submitted'
  const statusColor = picksSubmitted ? 'success' : 'warning'
  const actionLabel = picksSubmitted ? 'Edit Picks' : 'Make Picks'

  return (
    <Card>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h6">This Week</Typography>
          <Chip label={`Week ${weekNumber}`} color="primary" size="small" />
        </Stack>
        <Stack spacing={1} mb={2}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2" color="text.secondary">
              Picks
            </Typography>
            <Chip label={statusLabel} color={statusColor} size="small" />
          </Stack>
          <Typography variant="body2" color="text.secondary">
            Lock deadline
          </Typography>
          <Typography variant="body1">{lockDeadline}</Typography>
        </Stack>
        <Button variant="contained" onClick={onManagePicks} fullWidth>
          {actionLabel}
        </Button>
      </CardContent>
    </Card>
  )
}

export default ThisWeekCard
