import React, { useEffect, useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  ButtonBase,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Container,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  Switch,
  Tooltip,
  Typography,
  Skeleton,
  TextField,
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import LockIcon from '@mui/icons-material/Lock'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import SportsFootballIcon from '@mui/icons-material/SportsFootball'
import { glassyCard } from '../../styles/adminStyles'

// Team logo mapping - replace with actual logo paths when available
const getTeamLogo = (teamName) => {
  // For now, return null to use placeholder. Replace with actual paths like:
  // return `/logos/${teamName.toLowerCase().replace(/\s+/g, '-')}.svg`
  // Or use a CDN: return `https://cdn.example.com/logos/${teamName}.svg`
  return null
}

// Mock data / services (replace with Firebase services when ready)
const mockGames = [
  {
    id: 'game1',
    away: 'Cowboys',
    home: 'Eagles',
    kickoff: 'Sun 3:25 PM',
    kickoffAt: '2024-10-06T20:25:00Z',
  },
  {
    id: 'game2',
    away: 'Bills',
    home: 'Chiefs',
    kickoff: 'Sun 7:20 PM',
    kickoffAt: '2024-10-06T23:20:00Z',
  },
  {
    id: 'game3',
    away: 'Packers',
    home: 'Bears',
    kickoff: 'Mon 7:15 PM',
    kickoffAt: '2024-10-07T23:15:00Z',
  },
]

const getWeekGames = async (week) =>
  Promise.resolve(mockGames.map((g) => ({ ...g, id: `${g.id}-${week}` })))
const getUserPicks = async () => Promise.resolve({ picks: {}, lockOfWeek: null })
const saveUserPicks = async (_uid, _week, picks, lockOfWeek, tieBreaker) =>
  new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          picks,
          lockOfWeek,
          tieBreaker,
          updatedAt: new Date().toISOString(),
        }),
      500,
    ),
  )

const WeekSelector = ({ value, onChange, max = 18 }) => (
  <FormControl size="small" sx={{ minWidth: 140 }}>
    <InputLabel id="week-label" sx={{ color: 'rgba(233,236,245,0.7)' }}>
      Week
    </InputLabel>
    <Select
      labelId="week-label"
      value={value}
      label="Week"
      onChange={(e) => onChange(Number(e.target.value))}
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
      {Array.from({ length: max }, (_, i) => i + 1).map((w) => (
        <MenuItem key={w} value={w} sx={{ color: '#e9ecf5' }}>
          Week {w}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
)

const MatchupCard = ({ game, pick, savedPick, onPick, lockOfWeek, onToggleLock, isLocked }) => {
  const isLock = lockOfWeek === game.id
  const pickedSide = pick
  const hasSelection = pickedSide || isLock

  const TeamTile = ({ team, side }) => {
    const isSelected = pickedSide === side
    const logoUrl = getTeamLogo(team)

    return (
      <ButtonBase
        onClick={() => onPick(side)}
        disabled={isLocked}
        sx={{
          width: '100%',
          position: 'relative',
          borderRadius: 1.5,
          border: isSelected
            ? '2px solid rgba(124,77,255,0.6)'
            : '1px solid rgba(255,255,255,0.08)',
          bgcolor: isSelected ? 'rgba(124,77,255,0.08)' : 'rgba(255,255,255,0.02)',
          py: 1,
          px: 1.5,
          transition: 'all 0.15s ease',
          boxShadow: isSelected
            ? '0 0 0 1px rgba(124,77,255,0.3), 0 2px 8px rgba(124,77,255,0.15)'
            : 'none',
          '&:hover:not(:disabled)': {
            borderColor: isSelected ? 'rgba(124,77,255,0.7)' : 'rgba(255,255,255,0.15)',
            bgcolor: isSelected ? 'rgba(124,77,255,0.12)' : 'rgba(255,255,255,0.04)',
            boxShadow: isSelected
              ? '0 0 0 1px rgba(124,77,255,0.4), 0 4px 12px rgba(124,77,255,0.2)'
              : '0 2px 4px rgba(0,0,0,0.2)',
          },
          '&:disabled': {
            opacity: 0.4,
            cursor: 'not-allowed',
          },
        }}
      >
        {isSelected && (
          <CheckCircleIcon
            sx={{
              position: 'absolute',
              top: 4,
              right: 4,
              fontSize: 16,
              color: '#b794f6',
              zIndex: 2,
              filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))',
            }}
          />
        )}
        <Stack
          direction="column"
          alignItems="center"
          spacing={0.5}
          sx={{ position: 'relative', zIndex: 1 }}
        >
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              bgcolor: 'rgba(255,255,255,0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(255,255,255,0.08)',
              overflow: 'hidden',
            }}
          >
            {logoUrl ? (
              <Box
                component="img"
                src={logoUrl}
                alt={team}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                }}
                onError={(e) => {
                  // Fallback if image fails to load
                  e.target.style.display = 'none'
                }}
              />
            ) : (
              <SportsFootballIcon
                sx={{
                  fontSize: 20,
                  color: 'rgba(233,236,245,0.4)',
                }}
              />
            )}
          </Box>
          <Typography
            variant="caption"
            sx={{
              fontWeight: isSelected ? 600 : 500,
              color: isSelected ? '#b794f6' : '#e9ecf5',
              fontSize: '0.7rem',
              textAlign: 'center',
            }}
          >
            {team}
          </Typography>
        </Stack>
      </ButtonBase>
    )
  }

  return (
    <Card
      sx={{
        ...glassyCard,
        borderColor: hasSelection
          ? isLock
            ? 'rgba(124,77,255,0.4)'
            : 'rgba(124,77,255,0.2)'
          : 'rgba(255,255,255,0.06)',
        borderWidth: hasSelection ? 1.5 : 1,
        boxShadow: hasSelection
          ? '0 2px 8px rgba(0,0,0,0.3), 0 0 0 1px rgba(124,77,255,0.1)'
          : 'none',
      }}
    >
      <CardContent sx={{ color: '#e9ecf5', py: 1.25, px: 2 }}>
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.25 }}>
          <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, color: '#e9ecf5', fontSize: '0.875rem' }}
            >
              {game.away} @ {game.home}
            </Typography>
            <Stack direction="row" alignItems="center" spacing={0.25}>
              <AccessTimeIcon sx={{ fontSize: 12, color: 'rgba(233,236,245,0.5)' }} />
              <Typography
                variant="caption"
                sx={{ color: 'rgba(233,236,245,0.5)', fontSize: '0.7rem' }}
              >
                {game.kickoff}
              </Typography>
            </Stack>
          </Stack>
          <Chip
            icon={isLocked ? <LockIcon sx={{ fontSize: 12 }} /> : null}
            label={isLocked ? 'Locked' : 'Open'}
            size="small"
            sx={{
              bgcolor: isLocked ? 'rgba(255,82,82,0.12)' : 'rgba(0,200,83,0.12)',
              color: isLocked ? '#ff8a80' : '#81c784',
              height: 20,
              fontSize: '0.65rem',
              '& .MuiChip-label': {
                px: 0.75,
              },
            }}
          />
        </Stack>

        {/* Body: Team Tiles */}
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 1.25 }}
        >
          <Box sx={{ flex: 1, maxWidth: 'calc(50% - 12px)' }}>
            <TeamTile team={game.away} side="away" />
          </Box>
          <Typography
            variant="caption"
            sx={{
              color: 'rgba(233,236,245,0.3)',
              fontSize: '0.65rem',
              fontWeight: 600,
              px: 0.5,
              flexShrink: 0,
            }}
          >
            vs
          </Typography>
          <Box sx={{ flex: 1, maxWidth: 'calc(50% - 12px)' }}>
            <TeamTile team={game.home} side="home" />
          </Box>
        </Stack>

        {/* Footer */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            pt: 1,
            borderTop: '1px solid rgba(255,255,255,0.04)',
          }}
        >
          <Typography variant="caption" sx={{ color: 'rgba(233,236,245,0.6)', fontSize: '0.7rem' }}>
            {pickedSide ? (
              <>
                Picked:{' '}
                <strong style={{ color: '#e9ecf5' }}>
                  {pickedSide === 'away' ? game.away : game.home}
                </strong>
              </>
            ) : (
              'Not picked'
            )}
          </Typography>
          <Tooltip title={isLock ? 'Lock of Week' : 'Set Lock of Week'}>
            <IconButton
              size="small"
              onClick={() => onToggleLock(game.id)}
              disabled={isLocked || !pickedSide}
              sx={{
                p: 0.5,
                color: isLock ? '#b794f6' : 'rgba(233,236,245,0.5)',
                bgcolor: isLock ? 'rgba(124,77,255,0.15)' : 'transparent',
                '&:hover': {
                  bgcolor: isLock ? 'rgba(124,77,255,0.2)' : 'rgba(255,255,255,0.05)',
                },
                '&.Mui-disabled': {
                  opacity: 0.3,
                },
              }}
            >
              <LockIcon sx={{ fontSize: 14 }} />
            </IconButton>
          </Tooltip>
        </Stack>
      </CardContent>
    </Card>
  )
}

const StickySaveBar = ({
  pickedCount,
  totalGames,
  hasUnsavedChanges,
  isSaving,
  isLocked,
  onSave,
  onClear,
  extraDisabled = false,
}) => (
  <Box
    sx={{
      position: 'sticky',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 10,
      mt: 3,
      ...glassyCard,
      p: 1.5,
      backdropFilter: 'blur(16px)',
      borderTop: '1px solid rgba(255,255,255,0.08)',
    }}
  >
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={1.5}
      alignItems={{ xs: 'flex-start', sm: 'center' }}
      justifyContent="space-between"
    >
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography
          variant="body2"
          sx={{ fontWeight: 600, color: '#e9ecf5', fontSize: '0.875rem' }}
        >
          Picked: {pickedCount}/{totalGames}
        </Typography>
        {hasUnsavedChanges && (
          <Chip
            label="Unsaved changes"
            size="small"
            sx={{
              bgcolor: 'rgba(255,152,0,0.15)',
              color: '#ffb74d',
              fontSize: '0.7rem',
              height: 20,
            }}
          />
        )}
      </Stack>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1}
        sx={{ width: { xs: '100%', sm: 'auto' } }}
      >
        <Button
          variant="outlined"
          onClick={onClear}
          disabled={isSaving || isLocked}
          sx={{
            textTransform: 'none',
            color: 'rgba(233,236,245,0.7)',
            borderColor: 'rgba(255,255,255,0.12)',
            '&:hover': {
              borderColor: 'rgba(255,255,255,0.2)',
              bgcolor: 'rgba(255,255,255,0.05)',
            },
            '&.Mui-disabled': {
              color: 'rgba(233,236,245,0.3)',
              borderColor: 'rgba(255,255,255,0.06)',
            },
          }}
        >
          Clear Week
        </Button>
        <Button
          variant="contained"
          onClick={onSave}
          disabled={isSaving || isLocked || extraDisabled}
          sx={{
            textTransform: 'none',
            bgcolor: 'rgba(124,77,255,0.4)',
            color: '#e9ecf5',
            border: '1px solid rgba(255,255,255,0.12)',
            '&:hover': {
              bgcolor: 'rgba(124,77,255,0.5)',
              borderColor: 'rgba(255,255,255,0.18)',
            },
            '&.Mui-disabled': {
              bgcolor: 'rgba(124,77,255,0.15)',
              color: 'rgba(233,236,245,0.4)',
              borderColor: 'rgba(255,255,255,0.06)',
            },
          }}
        >
          {isSaving ? 'Saving...' : 'Save Picks'}
        </Button>
      </Stack>
    </Stack>
    {isLocked && (
      <Typography variant="caption" sx={{ color: 'rgba(255,82,82,0.8)', display: 'block', mt: 1 }}>
        Picks are locked. Saving disabled.
      </Typography>
    )}
  </Box>
)

const validateTiebreaker = (gameId, total) => {
  if (!gameId) return 'Select a tie-breaker game'
  if (total === '') return 'Enter total points'
  if (!/^-?\d+$/.test(total)) return 'Total must be an integer'
  const num = Number(total)
  if (num < 0 || num > 200) return 'Total must be between 0 and 200'
  return ''
}

const MakePicks = () => {
  const [selectedWeek, setSelectedWeek] = useState(1)
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(false)
  const [picks, setPicks] = useState({})
  const [savedPicks, setSavedPicks] = useState({})
  const [lockOfWeek, setLockOfWeek] = useState(null)
  const [savedLockOfWeek, setSavedLockOfWeek] = useState(null)
  const [isLocked, setIsLocked] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showOnlyUnpicked, setShowOnlyUnpicked] = useState(false)
  const [highlightDiff, setHighlightDiff] = useState(false)
  const [tiebreakerGameId, setTiebreakerGameId] = useState('')
  const [tiebreakerTotal, setTiebreakerTotal] = useState('')
  const [savedTiebreaker, setSavedTiebreaker] = useState({ gameId: '', total: '' })
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [error, setError] = useState('')

  const pickedCount = useMemo(() => Object.keys(picks).length, [picks])
  const hasUnsavedChanges = useMemo(
    () =>
      JSON.stringify(picks) !== JSON.stringify(savedPicks) ||
      lockOfWeek !== savedLockOfWeek ||
      tiebreakerGameId !== savedTiebreaker.gameId ||
      tiebreakerTotal !== savedTiebreaker.total,
    [
      picks,
      savedPicks,
      lockOfWeek,
      savedLockOfWeek,
      tiebreakerGameId,
      tiebreakerTotal,
      savedTiebreaker,
    ],
  )

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const weekGames = await getWeekGames(selectedWeek)
        const userPicks = await getUserPicks('mock-user', selectedWeek)
        setGames(weekGames)
        setPicks(userPicks.picks || {})
        setSavedPicks(userPicks.picks || {})
        setLockOfWeek(userPicks.lockOfWeek || null)
        setSavedLockOfWeek(userPicks.lockOfWeek || null)
        // tie-breaker load
        const chosenTieGame =
          userPicks.tieBreaker?.gameId ||
          (weekGames.length
            ? weekGames
                .slice()
                .sort(
                  (a, b) =>
                    new Date(b.kickoffAt || 0).getTime() - new Date(a.kickoffAt || 0).getTime(),
                )[0].id
            : '')
        const tieTotalValue =
          userPicks.tieBreaker?.totalPoints != null ? String(userPicks.tieBreaker.totalPoints) : ''
        setTiebreakerGameId(chosenTieGame)
        setTiebreakerTotal(tieTotalValue)
        setSavedTiebreaker({ gameId: chosenTieGame, total: tieTotalValue })
        setIsLocked(false)
      } catch (err) {
        console.error(err)
        setError('Unable to load games right now.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [selectedWeek])

  const tieValidationError = validateTiebreaker(tiebreakerGameId, tiebreakerTotal)
  const saveDisabled = isSaving || isLocked || !!tieValidationError

  const handlePick = (gameId, side) => {
    if (isLocked) return
    setPicks((prev) => {
      const current = prev[gameId]
      if (current === side) {
        const next = { ...prev }
        delete next[gameId]
        return next
      }
      return { ...prev, [gameId]: side }
    })
  }

  const handleToggleLock = (gameId) => {
    if (isLocked) return
    setLockOfWeek((prev) => (prev === gameId ? null : gameId))
  }

  const handleClear = () => {
    if (isLocked) return
    setPicks({})
    setLockOfWeek(null)
  }

  const handleSave = async () => {
    if (isLocked) return
    if (tieValidationError) return
    const missing = games.length - Object.keys(picks).length
    if (missing > 0) {
      const proceed = window.confirm(
        `You haven't picked all games (${missing} missing). Save anyway?`,
      )
      if (!proceed) return
    }
    try {
      setIsSaving(true)
      await saveUserPicks('mock-user', selectedWeek, picks, lockOfWeek, {
        gameId: tiebreakerGameId,
        totalPoints: Number(tiebreakerTotal),
      })
      setSavedPicks(picks)
      setSavedLockOfWeek(lockOfWeek)
      setSavedTiebreaker({ gameId: tiebreakerGameId, total: tiebreakerTotal })
      setSnackbarOpen(true)
    } catch (err) {
      console.error(err)
      setError('Failed to save picks. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleAutoPick = () => {
    if (isLocked) return
    const next = { ...picks }
    games.forEach((g) => {
      if (!next[g.id]) {
        next[g.id] = 'home'
      }
    })
    setPicks(next)
  }

  const filteredGames = showOnlyUnpicked ? games.filter((g) => !picks[g.id]) : games

  // Group games by kickoff time (optional grouping)
  const groupedGames = useMemo(() => {
    const groups = {}
    filteredGames.forEach((game) => {
      const kickoff = game.kickoff || ''
      let groupKey = 'Other'
      if (kickoff.includes('Sun')) {
        if (kickoff.includes('Early') || kickoff.includes('1:00') || kickoff.includes('1:25')) {
          groupKey = 'Sunday Early'
        } else if (kickoff.includes('Late') || kickoff.includes('4:') || kickoff.includes('4:25')) {
          groupKey = 'Sunday Late'
        } else {
          groupKey = 'Sunday'
        }
      } else if (kickoff.includes('Mon')) {
        groupKey = 'Monday Night'
      } else if (kickoff.includes('Thu')) {
        groupKey = 'Thursday Night'
      }
      if (!groups[groupKey]) {
        groups[groupKey] = []
      }
      groups[groupKey].push(game)
    })
    return groups
  }, [filteredGames])

  const progressValue = games.length > 0 ? (pickedCount / games.length) * 100 : 0

  return (
    <Container maxWidth="lg" sx={{ py: 4, color: '#e9ecf5', pb: 10 }}>
      {/* Page Header */}
      <Stack spacing={1.5} sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: 'rgba(233,236,245,0.95)' }}>
          Make Your Picks
        </Typography>
        <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
          <Typography
            variant="body2"
            sx={{ color: 'rgba(233,236,245,0.7)', fontSize: '0.8125rem' }}
          >
            Week {selectedWeek} • Picks lock at Sun 3:25 PM
          </Typography>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <AccessTimeIcon sx={{ fontSize: 14, color: 'rgba(233,236,245,0.5)' }} />
            <Typography
              variant="caption"
              sx={{ color: 'rgba(233,236,245,0.6)', fontSize: '0.75rem' }}
            >
              Locks in 3h 12m
            </Typography>
          </Stack>
        </Stack>
        {/* Progress Indicator */}
        <Stack spacing={0.5}>
          <Typography
            variant="body2"
            sx={{ color: 'rgba(233,236,245,0.7)', fontSize: '0.8125rem' }}
          >
            Picked {pickedCount} / {games.length}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={progressValue}
            sx={{
              height: 4,
              borderRadius: 2,
              bgcolor: 'rgba(255,255,255,0.05)',
              '& .MuiLinearProgress-bar': {
                bgcolor: 'rgba(124,77,255,0.6)',
                borderRadius: 2,
              },
            }}
          />
        </Stack>
      </Stack>

      {/* Controls Row */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        justifyContent="space-between"
        sx={{ mb: 3 }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        >
          <WeekSelector value={selectedWeek} onChange={setSelectedWeek} />
          <FormControlLabel
            control={
              <Switch
                checked={showOnlyUnpicked}
                onChange={(e) => setShowOnlyUnpicked(e.target.checked)}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: '#b794f6',
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: 'rgba(124,77,255,0.5)',
                  },
                }}
              />
            }
            label={
              <Typography
                variant="body2"
                sx={{ color: 'rgba(233,236,245,0.7)', fontSize: '0.8125rem' }}
              >
                Show unpicked only
              </Typography>
            }
          />
          <FormControlLabel
            control={
              <Switch
                checked={highlightDiff}
                onChange={(e) => setHighlightDiff(e.target.checked)}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: '#b794f6',
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: 'rgba(124,77,255,0.5)',
                  },
                }}
              />
            }
            label={
              <Typography
                variant="body2"
                sx={{ color: 'rgba(233,236,245,0.7)', fontSize: '0.8125rem' }}
              >
                Highlight changes
              </Typography>
            }
          />
        </Stack>
        <Button
          variant="outlined"
          onClick={handleAutoPick}
          disabled={isLocked}
          sx={{
            textTransform: 'none',
            color: 'rgba(233,236,245,0.7)',
            borderColor: 'rgba(255,255,255,0.12)',
            '&:hover': {
              borderColor: 'rgba(255,255,255,0.2)',
              bgcolor: 'rgba(255,255,255,0.05)',
            },
            '&.Mui-disabled': {
              color: 'rgba(233,236,245,0.3)',
              borderColor: 'rgba(255,255,255,0.06)',
            },
            width: { xs: '100%', sm: 'auto' },
          }}
        >
          Auto Pick Favorites
        </Button>
      </Stack>

      {/* Tie-breaker card */}
      <Card sx={{ ...glassyCard, mb: 3 }}>
        <CardHeader
          title="Weekly Tie-Breaker"
          subheader="Used only if there's a tie on the leaderboard this week."
          titleTypographyProps={{
            sx: { fontWeight: 700, color: 'rgba(233,236,245,0.95)', fontSize: '1rem' },
          }}
          subheaderTypographyProps={{
            sx: { color: 'rgba(233,236,245,0.5)', fontSize: '0.75rem', mt: 0.5 },
          }}
        />
        <CardContent sx={{ pt: 0, pb: 2.5, px: 2.5 }}>
          <Stack spacing={1.5} sx={{ mb: 2 }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <SportsFootballIcon sx={{ fontSize: 16, color: 'rgba(233,236,245,0.5)' }} />
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, color: '#e9ecf5', fontSize: '0.875rem' }}
              >
                Tie-breaker matchup
              </Typography>
            </Stack>
            <Typography variant="body2" sx={{ color: '#e9ecf5', fontSize: '0.875rem' }}>
              {games.find((g) => g.id === tiebreakerGameId)?.away} @{' '}
              {games.find((g) => g.id === tiebreakerGameId)?.home}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: 'rgba(233,236,245,0.6)', fontSize: '0.75rem' }}
            >
              {games.find((g) => g.id === tiebreakerGameId)?.kickoff || 'Kickoff TBD'}
            </Typography>
          </Stack>
          <Stack spacing={1}>
            <TextField
              size="small"
              label="Total Points (Both Teams)"
              placeholder="e.g., 47"
              type="number"
              inputProps={{ min: 0, max: 200 }}
              value={tiebreakerTotal}
              disabled={isLocked}
              onChange={(e) => {
                setTiebreakerTotal(e.target.value)
              }}
              error={!!tieValidationError}
              helperText={
                isLocked
                  ? 'Locked'
                  : tieValidationError || 'Enter combined score for the tie-breaker game'
              }
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#e9ecf5',
                  '& fieldset': {
                    borderColor: tieValidationError
                      ? 'rgba(255,82,82,0.5)'
                      : 'rgba(255,255,255,0.12)',
                  },
                  '&:hover fieldset': {
                    borderColor: tieValidationError
                      ? 'rgba(255,82,82,0.7)'
                      : 'rgba(255,255,255,0.2)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: tieValidationError
                      ? 'rgba(255,82,82,0.8)'
                      : 'rgba(124,77,255,0.5)',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(233,236,245,0.7)',
                  '&.Mui-focused': {
                    color: tieValidationError ? 'rgba(255,82,82,0.8)' : 'rgba(124,77,255,0.7)',
                  },
                },
                '& .MuiFormHelperText-root': {
                  color: tieValidationError ? 'rgba(255,82,82,0.8)' : 'rgba(233,236,245,0.5)',
                  fontSize: '0.7rem',
                },
              }}
            />
          </Stack>
          <Typography
            variant="caption"
            sx={{ color: 'rgba(233,236,245,0.5)', fontSize: '0.7rem', mt: 1, display: 'block' }}
          >
            Closest total wins the tie-breaker (difference from actual total).
          </Typography>
        </CardContent>
      </Card>

      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 2,
            bgcolor: 'rgba(211,47,47,0.15)',
            color: '#ff8a80',
            border: '1px solid rgba(255,82,82,0.3)',
          }}
        >
          {error}
        </Alert>
      )}

      {/* Game List */}
      <Stack spacing={2}>
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton
              key={`sk-${i}`}
              variant="rectangular"
              height={120}
              sx={{
                bgcolor: 'rgba(255,255,255,0.05)',
                borderRadius: 2,
              }}
            />
          ))
        ) : filteredGames.length === 0 ? (
          <Typography
            variant="body2"
            sx={{ color: 'rgba(233,236,245,0.6)', textAlign: 'center', py: 4 }}
          >
            No games found for this week.
          </Typography>
        ) : (
          Object.entries(groupedGames).map(([groupKey, groupGames]) => (
            <Box key={groupKey}>
              {Object.keys(groupedGames).length > 1 && (
                <Typography
                  variant="caption"
                  sx={{
                    color: 'rgba(233,236,245,0.4)',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    mb: 1,
                    display: 'block',
                  }}
                >
                  {groupKey}
                </Typography>
              )}
              <Stack spacing={1}>
                {groupGames.map((game) => (
                  <MatchupCard
                    key={game.id}
                    game={game}
                    pick={picks[game.id]}
                    savedPick={savedPicks[game.id]}
                    onPick={(side) => handlePick(game.id, side)}
                    lockOfWeek={lockOfWeek}
                    onToggleLock={handleToggleLock}
                    isLocked={isLocked}
                  />
                ))}
              </Stack>
            </Box>
          ))
        )}
      </Stack>

      <StickySaveBar
        pickedCount={pickedCount}
        totalGames={games.length}
        hasUnsavedChanges={hasUnsavedChanges}
        isSaving={isSaving}
        isLocked={isLocked}
        onSave={handleSave}
        onClear={handleClear}
        extraDisabled={saveDisabled}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity="success"
          onClose={() => setSnackbarOpen(false)}
          sx={{
            width: '100%',
            bgcolor: 'rgba(0,200,83,0.15)',
            color: '#81c784',
            border: '1px solid rgba(0,200,83,0.3)',
          }}
        >
          Picks saved!
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default MakePicks
