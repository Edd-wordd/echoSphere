import React, { useMemo } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  Divider,
  Button,
  Box,
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
  <Stack
    direction="row"
    alignItems="center"
    justifyContent="space-between"
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
  >
    <Stack direction="row" alignItems="center" spacing={1.5} sx={{ flex: 1 }}>
      <Typography
        variant="body2"
        sx={{
          color: '#e9ecf5',
          fontWeight: isCurrent ? 700 : entry.rank <= 3 ? 600 : 500,
          fontSize: '0.875rem',
          minWidth: 28,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {entry.rank}.
      </Typography>
      {entry.rank === 1 && (
        <EmojiEventsIcon sx={{ fontSize: 16, color: '#ffb74d' }} />
      )}
      <Typography
        variant="body2"
        sx={{
          color: '#e9ecf5',
          fontWeight: isCurrent ? 700 : 600,
          fontSize: '0.875rem',
          flex: 1,
        }}
      >
        {entry.displayName}
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
            height: 18,
          }}
        />
      )}
    </Stack>
    <Stack direction="row" alignItems="center" spacing={1.5}>
      <Typography
        variant="body2"
        sx={{
          color: '#e9ecf5',
          fontWeight: 600,
          fontSize: '0.875rem',
          fontVariantNumeric: 'tabular-nums',
          minWidth: 50,
          textAlign: 'right',
        }}
      >
        {entry.points}
      </Typography>
      {movementChip(entry.rankDelta)}
    </Stack>
  </Stack>
)

const LeaderboardCard = ({ entries = [], currentUserId, onViewFull }) => {
  const { top5, me, isMeInTop5 } = useMemo(() => {
    const top5 = entries.slice(0, 5)
    const me = entries.find((e) => e.userId === currentUserId)
    const isMeInTop5 = !!top5.find((e) => e.userId === currentUserId)
    return { top5, me, isMeInTop5 }
  }, [entries, currentUserId])

  return (
    <Card sx={glassyCard}>
      <CardContent sx={{ color: '#e9ecf5', py: 2.5, px: 2.5 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'rgba(233,236,245,0.95)', mb: 1.5 }}>
          Leaderboard
        </Typography>
        <Stack spacing={0.5} sx={{ mb: 1.5 }}>
          {top5.map((entry) => (
            <LeaderboardRow
              key={entry.userId}
              entry={entry}
              isCurrent={entry.userId === currentUserId}
            />
          ))}
          {!isMeInTop5 && me && (
            <>
              <Divider sx={{ my: 0.5, borderColor: 'rgba(255,255,255,0.06)' }} />
              <Box sx={{ textAlign: 'center', py: 0.5 }}>
                <Typography variant="caption" sx={{ color: 'rgba(233,236,245,0.3)', fontSize: '0.7rem' }}>
                  ...
                </Typography>
              </Box>
              <LeaderboardRow entry={me} isCurrent />
            </>
          )}
        </Stack>
        <Button
          variant="text"
          size="small"
          fullWidth
          sx={{
            mt: 1,
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
