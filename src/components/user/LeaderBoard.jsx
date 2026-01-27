import React, { useMemo, useState } from 'react'
import {
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  FormControl,
  InputAdornment,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat'
import SearchIcon from '@mui/icons-material/Search'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import SportsFootballIcon from '@mui/icons-material/SportsFootball'
import { glassyCard } from '../../styles/adminStyles'
import { useAuthProfile } from '../../hooks/useAuthProfile'

// Mock leaderboard data
const mockLeaderboardData = {
  season: [
    {
      userId: 'u2',
      displayName: 'Alex',
      record: '10-2',
      points: 20,
      rank: 1,
      rankDelta: 1,
      wins: 10,
      losses: 2,
    },
    {
      userId: 'u3',
      displayName: 'Jordan',
      record: '9-3',
      points: 18,
      rank: 2,
      rankDelta: 0,
      wins: 9,
      losses: 3,
    },
    {
      userId: 'u4',
      displayName: 'Sam',
      record: '9-3',
      points: 17,
      rank: 3,
      rankDelta: 1,
      wins: 9,
      losses: 3,
    },
    {
      userId: 'u5',
      displayName: 'Taylor',
      record: '8-4',
      points: 16,
      rank: 4,
      rankDelta: -1,
      wins: 8,
      losses: 4,
    },
    {
      userId: 'u6',
      displayName: 'Chris',
      record: '8-4',
      points: 15,
      rank: 5,
      rankDelta: 0,
      wins: 8,
      losses: 4,
    },
    {
      userId: 'u7',
      displayName: 'Morgan',
      record: '7-5',
      points: 14,
      rank: 6,
      rankDelta: 0,
      wins: 7,
      losses: 5,
    },
    {
      userId: 'u8',
      displayName: 'Jamie',
      record: '7-5',
      points: 13,
      rank: 7,
      rankDelta: -1,
      wins: 7,
      losses: 5,
    },
    {
      userId: 'u9',
      displayName: 'Pat',
      record: '6-6',
      points: 12,
      rank: 8,
      rankDelta: 0,
      wins: 6,
      losses: 6,
    },
    {
      userId: 'u10',
      displayName: 'Riley',
      record: '6-6',
      points: 11,
      rank: 9,
      rankDelta: 0,
      wins: 6,
      losses: 6,
    },
    {
      userId: 'u11',
      displayName: 'Jordan B',
      record: '5-7',
      points: 10,
      rank: 10,
      rankDelta: 0,
      wins: 5,
      losses: 7,
    },
    {
      userId: 'u12',
      displayName: 'Casey',
      record: '5-7',
      points: 9,
      rank: 11,
      rankDelta: 0,
      wins: 5,
      losses: 7,
    },
    {
      userId: 'u13',
      displayName: 'Dakota',
      record: '5-7',
      points: 8,
      rank: 12,
      rankDelta: 0,
      wins: 5,
      losses: 7,
    },
    {
      userId: 'u14',
      displayName: 'Alexis',
      record: '5-7',
      points: 7,
      rank: 13,
      rankDelta: 0,
      wins: 5,
      losses: 7,
    },
    {
      userId: 'u15',
      displayName: 'Cameron',
      record: '4-8',
      points: 6,
      rank: 14,
      rankDelta: 0,
      wins: 4,
      losses: 8,
    },
    {
      userId: 'u16',
      displayName: 'Shawn',
      record: '4-8',
      points: 5,
      rank: 15,
      rankDelta: 0,
      wins: 4,
      losses: 8,
    },
    {
      userId: 'u17',
      displayName: 'Rowan',
      record: '4-8',
      points: 4,
      rank: 16,
      rankDelta: 0,
      wins: 4,
      losses: 8,
    },
    {
      userId: 'u18',
      displayName: 'Skyler',
      record: '3-9',
      points: 3,
      rank: 17,
      rankDelta: 0,
      wins: 3,
      losses: 9,
    },
    {
      userId: 'u19',
      displayName: 'Avery',
      record: '3-9',
      points: 2,
      rank: 18,
      rankDelta: 0,
      wins: 3,
      losses: 9,
    },
    {
      userId: 'u20',
      displayName: 'Quinn',
      record: '3-9',
      points: 2,
      rank: 19,
      rankDelta: 0,
      wins: 3,
      losses: 9,
    },
    {
      userId: 'u21',
      displayName: 'Reese',
      record: '3-9',
      points: 2,
      rank: 20,
      rankDelta: 0,
      wins: 3,
      losses: 9,
    },
    {
      userId: 'u22',
      displayName: 'Blake',
      record: '3-9',
      points: 1,
      rank: 21,
      rankDelta: 0,
      wins: 3,
      losses: 9,
    },
    {
      userId: 'u23',
      displayName: 'Peyton',
      record: '2-10',
      points: 1,
      rank: 22,
      rankDelta: 0,
      wins: 2,
      losses: 10,
    },
    {
      userId: 'u24',
      displayName: 'Drew',
      record: '2-10',
      points: 1,
      rank: 23,
      rankDelta: 0,
      wins: 2,
      losses: 10,
    },
    {
      userId: 'u25',
      displayName: 'Harper',
      record: '2-10',
      points: 1,
      rank: 24,
      rankDelta: 0,
      wins: 2,
      losses: 10,
    },
    {
      userId: 'u26',
      displayName: 'Sawyer',
      record: '1-11',
      points: 0,
      rank: 25,
      rankDelta: 0,
      wins: 1,
      losses: 11,
    },
    {
      userId: 'u27',
      displayName: 'Rory',
      record: '1-11',
      points: 0,
      rank: 26,
      rankDelta: 0,
      wins: 1,
      losses: 11,
    },
    {
      userId: 'u28',
      displayName: 'Jordan C',
      record: '1-11',
      points: 0,
      rank: 27,
      rankDelta: 0,
      wins: 1,
      losses: 11,
    },
    {
      userId: 'u29',
      displayName: 'Devon',
      record: '1-11',
      points: 0,
      rank: 28,
      rankDelta: 0,
      wins: 1,
      losses: 11,
    },
    {
      userId: 'u30',
      displayName: 'Lane',
      record: '1-11',
      points: 0,
      rank: 29,
      rankDelta: 0,
      wins: 1,
      losses: 11,
    },
    {
      userId: 'u31',
      displayName: 'River',
      record: '1-11',
      points: 0,
      rank: 30,
      rankDelta: 0,
      wins: 1,
      losses: 11,
    },
    {
      userId: 'u32',
      displayName: 'Case',
      record: '1-11',
      points: 0,
      rank: 31,
      rankDelta: 0,
      wins: 1,
      losses: 11,
    },
    {
      userId: 'u1',
      displayName: 'You',
      record: '1-11',
      points: 0,
      rank: 32,
      rankDelta: 0,
      wins: 1,
      losses: 11,
    },
  ],
  week: null, // Weekly data not available yet
}

const TrendIcon = ({ trend }) => {
  if (trend === 'up' || trend > 0) {
    return <TrendingUpIcon sx={{ fontSize: 14, color: '#81c784' }} />
  }
  if (trend === 'down' || trend < 0) {
    return <TrendingDownIcon sx={{ fontSize: 14, color: '#ff8a80' }} />
  }
  return <TrendingFlatIcon sx={{ fontSize: 14, color: 'rgba(233,236,245,0.5)' }} />
}

const LeaderboardSummary = ({ currentUser }) => {
  if (!currentUser) return null

  return (
    <Stack direction="row" spacing={1.5} sx={{ mb: 2.5, flexWrap: 'wrap' }}>
      <Chip
        icon={<WorkspacePremiumOutlinedIcon sx={{ fontSize: 14 }} />}
        label={`Rank: #${currentUser.rank}`}
        size="small"
        sx={{
          bgcolor: 'rgba(124,77,255,0.15)',
          color: '#b794f6',
          fontWeight: 600,
          fontSize: '0.75rem',
          height: 28,
        }}
      />
      <Chip
        label={`Points: ${currentUser.points}`}
        size="small"
        sx={{
          bgcolor: 'rgba(255,255,255,0.05)',
          color: '#e9ecf5',
          fontWeight: 500,
          fontSize: '0.75rem',
          height: 28,
        }}
      />
      <Chip
        label={`Record: ${currentUser.record}`}
        size="small"
        sx={{
          bgcolor: 'rgba(255,255,255,0.05)',
          color: '#e9ecf5',
          fontWeight: 500,
          fontSize: '0.75rem',
          height: 28,
        }}
      />
    </Stack>
  )
}

const LeaderboardTableRow = ({ entry, isCurrent, leaderPoints }) => {
  const trend =
    entry.rankDelta !== undefined && entry.rankDelta !== null
      ? entry.rankDelta > 0
        ? 'up'
        : entry.rankDelta < 0
          ? 'down'
          : 'flat'
      : 'flat'

  const behindLeader =
    leaderPoints !== undefined && entry.rank > 1 ? leaderPoints - entry.points : null

  return (
    <TableRow
      sx={{
        bgcolor: isCurrent ? 'rgba(124,77,255,0.08)' : 'transparent',
        borderLeft: isCurrent ? '3px solid rgba(124,77,255,0.5)' : 'none',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        '&:hover': {
          bgcolor: isCurrent ? 'rgba(124,77,255,0.1)' : 'rgba(255,255,255,0.02)',
        },
        '&:last-child td': {
          borderBottom: 'none',
        },
      }}
    >
      <TableCell sx={{ py: 1.25, px: 2, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          {entry.rank === 1 && (
            <WorkspacePremiumOutlinedIcon
              sx={{ fontSize: 18, color: 'rgba(255,183,77,0.6)', opacity: 0.7 }}
            />
          )}
          <Typography
            variant="body2"
            sx={{
              color: '#e9ecf5',
              fontWeight: isCurrent ? 700 : entry.rank <= 3 ? 600 : 500,
              fontSize: '0.875rem',
              minWidth: 32,
            }}
          >
            {entry.rank}
          </Typography>
        </Stack>
      </TableCell>
      <TableCell sx={{ py: 1.25, px: 2, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography
            variant="body2"
            sx={{
              color: '#e9ecf5',
              fontWeight: isCurrent ? 700 : 600,
              fontSize: '0.875rem',
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
      </TableCell>
      <TableCell sx={{ py: 1.25, px: 2, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Typography variant="body2" sx={{ color: 'rgba(233,236,245,0.7)', fontSize: '0.8125rem' }}>
          {entry.record}
        </Typography>
      </TableCell>
      <TableCell sx={{ py: 1.25, px: 2, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Stack spacing={0.25}>
          <Typography
            variant="body2"
            sx={{ color: '#e9ecf5', fontWeight: 600, fontSize: '0.875rem' }}
          >
            {entry.points}
          </Typography>
          {behindLeader !== null && behindLeader > 0 && (
            <Typography
              variant="caption"
              sx={{ color: 'rgba(233,236,245,0.4)', fontSize: '0.7rem' }}
            >
              -{behindLeader}
            </Typography>
          )}
        </Stack>
      </TableCell>
      <TableCell sx={{ py: 1.25, px: 2, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <TrendIcon trend={trend} />
      </TableCell>
    </TableRow>
  )
}

const LeaderboardListRow = ({ entry, isCurrent, leaderPoints }) => {
  const trend =
    entry.rankDelta !== undefined && entry.rankDelta !== null
      ? entry.rankDelta > 0
        ? 'up'
        : entry.rankDelta < 0
          ? 'down'
          : 'flat'
      : 'flat'

  const behindLeader =
    leaderPoints !== undefined && entry.rank > 1 ? leaderPoints - entry.points : null

  return (
    <ListItem
      disableGutters
      sx={{
        py: 1.25,
        px: 2,
        borderRadius: 1,
        bgcolor: isCurrent ? 'rgba(124,77,255,0.08)' : 'transparent',
        borderLeft: isCurrent ? '3px solid rgba(124,77,255,0.5)' : 'none',
        mb: 0.5,
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        '&:hover': {
          bgcolor: isCurrent ? 'rgba(124,77,255,0.1)' : 'rgba(255,255,255,0.02)',
        },
      }}
      secondaryAction={
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Stack spacing={0.25} alignItems="flex-end">
            <Typography
              variant="body2"
              sx={{ color: '#e9ecf5', fontWeight: 600, fontSize: '0.875rem' }}
            >
              {entry.points} pts
            </Typography>
            {behindLeader !== null && behindLeader > 0 && (
              <Typography
                variant="caption"
                sx={{ color: 'rgba(233,236,245,0.4)', fontSize: '0.7rem' }}
              >
                -{behindLeader}
              </Typography>
            )}
          </Stack>
          <TrendIcon trend={trend} />
        </Stack>
      }
    >
      <ListItemText
        primary={
          <Stack direction="row" alignItems="center" spacing={1}>
            {entry.rank === 1 && (
              <WorkspacePremiumOutlinedIcon
                sx={{ fontSize: 18, color: 'rgba(255,183,77,0.6)', opacity: 0.7 }}
              />
            )}
            <Typography
              variant="body2"
              sx={{
                color: '#e9ecf5',
                fontWeight: isCurrent ? 700 : entry.rank <= 3 ? 600 : 500,
                fontSize: '0.875rem',
                minWidth: 32,
              }}
            >
              {entry.rank}.
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#e9ecf5',
                fontWeight: isCurrent ? 700 : 600,
                fontSize: '0.875rem',
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
        }
        secondary={
          <Typography
            variant="caption"
            sx={{ color: 'rgba(233,236,245,0.5)', fontSize: '0.75rem' }}
          >
            {entry.record}
          </Typography>
        }
        primaryTypographyProps={{ sx: { mb: 0.25 } }}
      />
    </ListItem>
  )
}

const YourPositionRow = ({ entry, isTable, leaderPoints }) => {
  const trend =
    entry.rankDelta !== undefined && entry.rankDelta !== null
      ? entry.rankDelta > 0
        ? 'up'
        : entry.rankDelta < 0
          ? 'down'
          : 'flat'
      : 'flat'

  const behindLeader =
    leaderPoints !== undefined && entry.rank > 1 ? leaderPoints - entry.points : null

  if (isTable) {
    return (
      <>
        <TableRow>
          <TableCell colSpan={5} sx={{ py: 1, px: 2, border: 'none' }}>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', my: 1 }} />
          </TableCell>
        </TableRow>
        <TableRow
          sx={{
            bgcolor: 'rgba(124,77,255,0.08)',
            borderLeft: '3px solid rgba(124,77,255,0.5)',
            borderBottom: 'none',
          }}
        >
          <TableCell sx={{ py: 1.25, px: 2, borderBottom: 'none' }}>
            <Typography
              variant="body2"
              sx={{ color: '#e9ecf5', fontWeight: 700, fontSize: '0.875rem' }}
            >
              {entry.rank}
            </Typography>
          </TableCell>
          <TableCell sx={{ py: 1.25, px: 2, borderBottom: 'none' }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography
                variant="body2"
                sx={{ color: '#e9ecf5', fontWeight: 700, fontSize: '0.875rem' }}
              >
                You
              </Typography>
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
            </Stack>
          </TableCell>
          <TableCell sx={{ py: 1.25, px: 2, borderBottom: 'none' }}>
            <Typography
              variant="body2"
              sx={{ color: 'rgba(233,236,245,0.7)', fontSize: '0.8125rem' }}
            >
              {entry.record}
            </Typography>
          </TableCell>
          <TableCell sx={{ py: 1.25, px: 2, borderBottom: 'none' }}>
            <Stack spacing={0.25}>
              <Typography
                variant="body2"
                sx={{ color: '#e9ecf5', fontWeight: 600, fontSize: '0.875rem' }}
              >
                {entry.points}
              </Typography>
              {behindLeader !== null && behindLeader > 0 && (
                <Typography
                  variant="caption"
                  sx={{ color: 'rgba(233,236,245,0.4)', fontSize: '0.7rem' }}
                >
                  -{behindLeader}
                </Typography>
              )}
            </Stack>
          </TableCell>
          <TableCell sx={{ py: 1.25, px: 2, borderBottom: 'none' }}>
            <TrendIcon trend={trend} />
          </TableCell>
        </TableRow>
      </>
    )
  }

  return (
    <>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', my: 1 }} />
      <ListItem
        disableGutters
        sx={{
          py: 1.25,
          px: 2,
          borderRadius: 1,
          bgcolor: 'rgba(124,77,255,0.08)',
          borderLeft: '3px solid rgba(124,77,255,0.5)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
        secondaryAction={
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Stack spacing={0.25} alignItems="flex-end">
              <Typography
                variant="body2"
                sx={{ color: '#e9ecf5', fontWeight: 600, fontSize: '0.875rem' }}
              >
                {entry.points} pts
              </Typography>
              {behindLeader !== null && behindLeader > 0 && (
                <Typography
                  variant="caption"
                  sx={{ color: 'rgba(233,236,245,0.4)', fontSize: '0.7rem' }}
                >
                  -{behindLeader}
                </Typography>
              )}
            </Stack>
            <TrendIcon trend={trend} />
          </Stack>
        }
      >
        <ListItemText
          primary={
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography
                variant="body2"
                sx={{
                  color: '#e9ecf5',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  minWidth: 32,
                }}
              >
                {entry.rank}.
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: '#e9ecf5', fontWeight: 700, fontSize: '0.875rem' }}
              >
                You
              </Typography>
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
            </Stack>
          }
          secondary={
            <Typography
              variant="caption"
              sx={{ color: 'rgba(233,236,245,0.5)', fontSize: '0.75rem' }}
            >
              {entry.record}
            </Typography>
          }
          primaryTypographyProps={{ sx: { mb: 0.25 } }}
        />
      </ListItem>
    </>
  )
}

const LeaderboardPage = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const { user } = useAuthProfile()

  const [viewType, setViewType] = useState('season') // 'season' or 'week'
  const [sortBy, setSortBy] = useState('points') // 'points' or 'wins'
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)

  // Mock current user ID - replace with actual auth user ID when wired
  const currentUserId = user?.uid || 'u1'

  const leaderboardData = useMemo(() => {
    const data = viewType === 'week' ? mockLeaderboardData.week : mockLeaderboardData.season
    if (!data) return []

    let filtered = [...data]

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter((entry) =>
        entry.displayName.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Sort
    if (sortBy === 'wins') {
      filtered.sort((a, b) => {
        if (b.wins !== a.wins) return b.wins - a.wins
        return b.points - a.points
      })
    } else {
      filtered.sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points
        return b.wins - a.wins
      })
    }

    // Re-rank after sorting
    filtered = filtered.map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }))

    return filtered
  }, [viewType, sortBy, searchQuery])

  const currentUser = useMemo(() => {
    return leaderboardData.find((entry) => entry.userId === currentUserId)
  }, [leaderboardData, currentUserId])

  const top10 = useMemo(() => {
    return leaderboardData.slice(0, 10)
  }, [leaderboardData])

  const isUserInTop10 = useMemo(() => {
    return top10.some((entry) => entry.userId === currentUserId)
  }, [top10, currentUserId])

  const leaderPoints = useMemo(() => {
    if (leaderboardData.length === 0) return undefined
    return leaderboardData[0]?.points
  }, [leaderboardData])

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, color: '#e9ecf5' }}>
        <Stack spacing={2}>
          <Skeleton variant="rectangular" height={60} sx={{ borderRadius: 2 }} />
          <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
        </Stack>
      </Container>
    )
  }

  if (leaderboardData.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, color: '#e9ecf5' }}>
        <Stack spacing={2} sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'rgba(233,236,245,0.95)' }}>
            Leaderboard
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: 'rgba(233,236,245,0.6)', fontSize: '0.8125rem' }}
          >
            View standings and rankings.
          </Typography>
        </Stack>
        <Card sx={glassyCard}>
          <CardContent sx={{ py: 6, px: 3, textAlign: 'center' }}>
            <SportsFootballIcon sx={{ fontSize: 48, color: 'rgba(233,236,245,0.3)', mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#e9ecf5', fontWeight: 600, mb: 1 }}>
              No standings yet
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(233,236,245,0.6)', mb: 3 }}>
              Check back after Week 1 locks.
            </Typography>
          </CardContent>
        </Card>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4, color: '#e9ecf5' }}>
      {/* Page Header */}
      <Stack spacing={1.5} sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: 'rgba(233,236,245,0.95)' }}>
          Leaderboard
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(233,236,245,0.6)', fontSize: '0.8125rem' }}>
          View standings and rankings.
        </Typography>
      </Stack>

      {/* Summary Strip */}
      <LeaderboardSummary currentUser={currentUser} />

      {/* Filters */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel id="view-type-label" sx={{ color: 'rgba(233,236,245,0.7)' }}>
            View
          </InputLabel>
          <Select
            labelId="view-type-label"
            value={viewType}
            label="View"
            onChange={(e) => setViewType(e.target.value)}
            sx={{
              color: '#e9ecf5',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255,255,255,0.12)',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255,255,255,0.2)',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(124,77,255,0.5)',
              },
              '& .MuiSvgIcon-root': {
                color: 'rgba(233,236,245,0.7)',
              },
            }}
          >
            <MenuItem value="season" sx={{ color: '#e9ecf5' }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <CalendarMonthIcon sx={{ fontSize: 16 }} />
                <span>Season</span>
              </Stack>
            </MenuItem>
            <MenuItem value="week" disabled sx={{ color: 'rgba(233,236,245,0.3)' }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <CalendarMonthIcon sx={{ fontSize: 16 }} />
                <span>This Week</span>
              </Stack>
            </MenuItem>
          </Select>
          {viewType === 'week' && (
            <Typography
              variant="caption"
              sx={{ color: 'rgba(233,236,245,0.5)', fontSize: '0.7rem', mt: 0.5, display: 'block' }}
            >
              Coming soon
            </Typography>
          )}
        </FormControl>

        <TextField
          size="small"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 18, color: 'rgba(233,236,245,0.5)' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            flex: 1,
            maxWidth: { xs: '100%', sm: 300 },
            '& .MuiOutlinedInput-root': {
              color: '#e9ecf5',
              '& fieldset': {
                borderColor: 'rgba(255,255,255,0.12)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(255,255,255,0.2)',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'rgba(124,77,255,0.5)',
              },
            },
          }}
        />

        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel id="sort-by-label" sx={{ color: 'rgba(233,236,245,0.7)' }}>
            Sort by
          </InputLabel>
          <Select
            labelId="sort-by-label"
            value={sortBy}
            label="Sort by"
            onChange={(e) => setSortBy(e.target.value)}
            sx={{
              color: '#e9ecf5',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255,255,255,0.12)',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255,255,255,0.2)',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(124,77,255,0.5)',
              },
              '& .MuiSvgIcon-root': {
                color: 'rgba(233,236,245,0.7)',
              },
            }}
          >
            <MenuItem value="points" sx={{ color: '#e9ecf5' }}>
              Points
            </MenuItem>
            <MenuItem value="wins" sx={{ color: '#e9ecf5' }}>
              Wins
            </MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {/* Leaderboard Table/List */}
      <Card sx={glassyCard}>
        <CardContent sx={{ py: 2.5, px: 2.5 }}>
          {isMobile ? (
            <List dense sx={{ py: 0 }}>
              {top10.map((entry) => (
                <LeaderboardListRow
                  key={entry.userId}
                  entry={entry}
                  isCurrent={entry.userId === currentUserId}
                  leaderPoints={leaderPoints}
                />
              ))}
              {!isUserInTop10 && currentUser && (
                <YourPositionRow entry={currentUser} isTable={false} leaderPoints={leaderPoints} />
              )}
            </List>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        color: 'rgba(233,236,245,0.5)',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        py: 1.5,
                        px: 2,
                        borderBottom: '1px solid rgba(255,255,255,0.1)',
                      }}
                    >
                      Rank
                    </TableCell>
                    <TableCell
                      sx={{
                        color: 'rgba(233,236,245,0.5)',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        py: 1.5,
                        px: 2,
                        borderBottom: '1px solid rgba(255,255,255,0.1)',
                      }}
                    >
                      User
                    </TableCell>
                    <TableCell
                      sx={{
                        color: 'rgba(233,236,245,0.5)',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        py: 1.5,
                        px: 2,
                        borderBottom: '1px solid rgba(255,255,255,0.1)',
                      }}
                    >
                      Record
                    </TableCell>
                    <TableCell
                      sx={{
                        color: 'rgba(233,236,245,0.5)',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        py: 1.5,
                        px: 2,
                        borderBottom: '1px solid rgba(255,255,255,0.1)',
                      }}
                    >
                      Points
                    </TableCell>
                    <TableCell
                      sx={{
                        color: 'rgba(233,236,245,0.5)',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        py: 1.5,
                        px: 2,
                        borderBottom: '1px solid rgba(255,255,255,0.1)',
                      }}
                    >
                      Trend
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {top10.map((entry) => (
                    <LeaderboardTableRow
                      key={entry.userId}
                      entry={entry}
                      isCurrent={entry.userId === currentUserId}
                      leaderPoints={leaderPoints}
                    />
                  ))}
                  {!isUserInTop10 && currentUser && (
                    <YourPositionRow
                      entry={currentUser}
                      isTable={true}
                      leaderPoints={leaderPoints}
                    />
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Container>
  )
}

export default LeaderboardPage
