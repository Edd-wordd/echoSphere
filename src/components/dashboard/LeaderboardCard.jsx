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
      backgroundColor: isCurrent ? 'rgba(139,233,198,0.08)' : 'transparent',
      borderRadius: 1.5,
      px: 1,
    }}
    secondaryAction={
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography variant="body2" color="rgba(233,236,245,0.7)">
          {entry.points} pts
        </Typography>
        {isCurrent && (
          <Chip
            label="You"
            size="small"
            sx={{
              background: 'linear-gradient(120deg, #7c4dff, #00c853)',
              color: '#0b0c0f',
              fontWeight: 700,
            }}
          />
        )}
        {movementChip(entry.rankDelta)}
      </Stack>
    }
  >
    <ListItemText
      primary={
        <Typography variant="body1" fontWeight={isCurrent ? 700 : 500} color="#f5f7ff">
          {entry.rank}. {entry.displayName}
        </Typography>
      }
      secondary={
        <Typography variant="body2" color="rgba(233,236,245,0.7)">
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
              <Divider sx={{ my: 1, borderColor: 'rgba(255,255,255,0.08)' }} />
              <ListItem disableGutters sx={{ justifyContent: 'center', py: 0.5 }}>
                <Typography variant="body2" color="rgba(233,236,245,0.7)">
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
          sx={{
            mt: 1,
            textTransform: 'none',
            color: '#8be9c6',
            fontWeight: 700,
          }}
          onClick={onViewFull}
        >
          View full leaderboard →
        </Button>
      </CardContent>
    </Card>
  )
}

export default LeaderboardCard
