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
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import { glassyCard } from '../../styles/adminStyles'

const movementChip = (delta) => {
  if (delta === undefined || delta === null) return null
  if (delta === 0) return null
  const Icon = delta > 0 ? TrendingUpIcon : TrendingDownIcon
  const color = delta > 0 ? '#81c784' : '#ff8a80'
  return (
    <Stack direction="row" alignItems="center" spacing={0.25}>
      <Icon sx={{ fontSize: 12, color }} />
      <Typography variant="caption" sx={{ color, fontSize: '0.7rem', fontWeight: 600 }}>
        {Math.abs(delta)}
      </Typography>
    </Stack>
  )
}

const LeaderboardRow = ({ entry, isCurrent }) => (
  <ListItem
    disableGutters
    sx={{
      py: 0.75,
      px: 1.5,
      borderRadius: 1,
      backgroundColor: isCurrent ? 'rgba(124,77,255,0.08)' : 'transparent',
      borderLeft: isCurrent ? '2px solid rgba(124,77,255,0.5)' : 'none',
      '&:hover': {
        bgcolor: isCurrent ? 'rgba(124,77,255,0.1)' : 'rgba(255,255,255,0.02)',
      },
    }}
    secondaryAction={
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <Typography variant="body2" sx={{ color: 'rgba(233,236,245,0.7)', fontSize: '0.8125rem' }}>
          {entry.points} pts
        </Typography>
        {isCurrent && (
          <Chip
            label="You"
            size="small"
            sx={{
              bgcolor: 'rgba(124,77,255,0.2)',
              color: '#b794f6',
              fontWeight: 600,
              fontSize: '0.65rem',
              height: 20,
            }}
          />
        )}
        {movementChip(entry.rankDelta)}
      </Stack>
    }
  >
    <ListItemText
      primary={
        <Stack direction="row" alignItems="center" spacing={1}>
          {entry.rank === 1 && (
            <EmojiEventsIcon sx={{ fontSize: 16, color: '#ffb74d' }} />
          )}
          <Typography
            variant="body2"
            sx={{
              color: '#e9ecf5',
              fontWeight: isCurrent ? 700 : 600,
              fontSize: '0.875rem',
            }}
          >
            {entry.rank}. {entry.displayName}
          </Typography>
        </Stack>
      }
      secondary={
        <Typography variant="caption" sx={{ color: 'rgba(233,236,245,0.5)', fontSize: '0.75rem' }}>
          {entry.record}
        </Typography>
      }
      primaryTypographyProps={{ sx: { mb: 0.25 } }}
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
    <Card sx={glassyCard}>
      <CardContent sx={{ color: '#e9ecf5', py: 2.5, px: 2.5 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'rgba(233,236,245,0.95)', mb: 1.5 }}>
          Leaderboard
        </Typography>
        <List dense sx={{ py: 0 }}>
          {top10.map((entry) => (
            <LeaderboardRow
              key={entry.userId}
              entry={entry}
              isCurrent={entry.userId === currentUserId}
            />
          ))}
          {!isMeInTop10 && me && (
            <>
              <Divider sx={{ my: 0.75, borderColor: 'rgba(255,255,255,0.06)' }} />
              <ListItem disableGutters sx={{ justifyContent: 'center', py: 0.5 }}>
                <Typography variant="caption" sx={{ color: 'rgba(233,236,245,0.3)', fontSize: '0.7rem' }}>
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
            mt: 1.5,
            textTransform: 'none',
            color: 'rgba(183,148,246,0.9)',
            fontWeight: 600,
            fontSize: '0.8rem',
            '&:hover': { color: '#b794f6', bgcolor: 'rgba(124,77,255,0.08)' },
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
