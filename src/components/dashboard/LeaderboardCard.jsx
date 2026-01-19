import React, { useMemo } from 'react'
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  Stack,
  Divider,
  Button,
} from '@mui/material'

const movementChip = (delta) => {
  if (delta === undefined || delta === null) return null
  const label = `${delta > 0 ? '▲' : delta < 0 ? '▼' : '—'} ${delta === 0 ? '' : Math.abs(delta)}`
  const color = delta > 0 ? 'success' : delta < 0 ? 'error' : 'default'
  return (
    <Chip
      label={label}
      size="small"
      color={color}
      variant="outlined"
      sx={{ minWidth: 50, justifyContent: 'center' }}
    />
  )
}

const LeaderboardRow = ({ entry, isCurrent }) => (
  <ListItem
    disableGutters
    sx={{
      backgroundColor: isCurrent ? 'action.hover' : 'transparent',
      borderRadius: 1,
      px: 1,
    }}
    secondaryAction={
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography variant="body2" color="text.secondary">
          {entry.points} pts
        </Typography>
        {isCurrent && <Chip label="You" color="primary" size="small" />}
        {movementChip(entry.rankDelta)}
      </Stack>
    }
  >
    <ListItemText
      primary={
        <Typography variant="body1" fontWeight={isCurrent ? 700 : 500}>
          {entry.rank}. {entry.displayName}
        </Typography>
      }
      secondary={
        <Typography variant="body2" color="text.secondary">
          {entry.record}
        </Typography>
      }
    />
  </ListItem>
)

const LeaderboardCard = ({ entries = [], currentUserId, onViewFull }) => {
  const { top10, me, isMeInTop10 } = useMemo(() => {
    const top10 = entries.slice(0, 10)
    const me = entries.find((e) => e.userId === currentUserId)
    const isMeInTop10 = !!top10.find((e) => e.userId === currentUserId)
    return { top10, me, isMeInTop10 }
  }, [entries, currentUserId])

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Leaderboard
        </Typography>
        <List dense>
          {top10.map((entry) => (
            <LeaderboardRow
              key={entry.userId}
              entry={entry}
              isCurrent={entry.userId === currentUserId}
            />
          ))}
          {!isMeInTop10 && me && (
            <>
              <Divider sx={{ my: 1 }} />
              <ListItem disableGutters sx={{ justifyContent: 'center', py: 0.5 }}>
                <Typography variant="body2" color="text.secondary">
                  ...
                </Typography>
              </ListItem>
              <LeaderboardRow entry={me} isCurrent />
            </>
          )}
        </List>
        <Button
          variant="text"
          size="small"
          sx={{ mt: 1, textTransform: 'none' }}
          onClick={onViewFull}
        >
          View full leaderboard →
        </Button>
      </CardContent>
    </Card>
  )
}

export default LeaderboardCard
