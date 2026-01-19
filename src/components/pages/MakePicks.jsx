import React, { useEffect, useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Skeleton,
  TextField,
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

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
    <InputLabel id="week-label">Week</InputLabel>
    <Select
      labelId="week-label"
      value={value}
      label="Week"
      onChange={(e) => onChange(Number(e.target.value))}
    >
      {Array.from({ length: max }, (_, i) => i + 1).map((w) => (
        <MenuItem key={w} value={w}>
          Week {w}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
)

const MatchupCard = ({ game, pick, savedPick, onPick, lockOfWeek, onToggleLock, isLocked }) => {
  const isLock = lockOfWeek === game.id
  const pickedSide = pick

  return (
    <Card
      variant="outlined"
      sx={{
        borderColor: isLock ? 'primary.main' : pickedSide ? 'success.light' : 'divider',
      }}
    >
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="subtitle1" fontWeight={700}>
              {game.away} @ {game.home}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {game.kickoff}
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            {pickedSide && (
              <Chip
                icon={<CheckCircleIcon fontSize="small" />}
                label="Saved"
                size="small"
                color="success"
                variant={savedPick === pickedSide ? 'outlined' : 'filled'}
              />
            )}
            {isLock && <Chip label="Lock of Week" size="small" color="primary" />}
          </Stack>
        </Stack>

        <ToggleButtonGroup exclusive fullWidth value={pickedSide || null} sx={{ mt: 2 }}>
          <ToggleButton
            value="away"
            selected={pickedSide === 'away'}
            onClick={() => onPick('away')}
            disabled={isLocked}
            sx={{ textTransform: 'none', py: 1.5 }}
          >
            {game.away}
          </ToggleButton>
          <ToggleButton
            value="home"
            selected={pickedSide === 'home'}
            onClick={() => onPick('home')}
            disabled={isLocked}
            sx={{ textTransform: 'none', py: 1.5 }}
          >
            {game.home}
          </ToggleButton>
        </ToggleButtonGroup>

        <Stack direction="row" justifyContent="space-between" alignItems="center" mt={2}>
          <Button
            size="small"
            variant={isLock ? 'contained' : 'outlined'}
            onClick={() => onToggleLock(game.id)}
            disabled={isLocked || !pickedSide}
          >
            {isLock ? 'Lock Selected' : 'Set Lock of Week'}
          </Button>
          {pickedSide && (
            <Button size="small" onClick={() => onPick(pickedSide)} disabled={isLocked}>
              Clear pick
            </Button>
          )}
        </Stack>

        {isLocked && (
          <Typography variant="caption" color="error" display="block" mt={1}>
            Picks are locked
          </Typography>
        )}
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
    component={Card}
    elevation={6}
    sx={{
      position: 'sticky',
      bottom: 0,
      left: 0,
      right: 0,
      p: 2,
      borderTop: 1,
      borderColor: 'divider',
      backgroundColor: 'background.paper',
      mt: 3,
    }}
  >
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={1.5}
      alignItems={{ xs: 'flex-start', sm: 'center' }}
      justifyContent="space-between"
    >
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography variant="body1" fontWeight={600}>
          Picked: {pickedCount}/{totalGames}
        </Typography>
        {hasUnsavedChanges && <Chip label="Unsaved changes" size="small" color="warning" />}
      </Stack>
      <Stack direction="row" spacing={1} sx={{ width: { xs: '100%', sm: 'auto' } }}>
        <Button variant="outlined" onClick={onClear} disabled={isSaving || isLocked}>
          Clear Week
        </Button>
        <Button
          variant="contained"
          onClick={onSave}
          disabled={isSaving || isLocked || extraDisabled}
        >
          {isSaving ? 'Saving...' : 'Save Picks'}
        </Button>
      </Stack>
    </Stack>
    {isLocked && (
      <Typography variant="caption" color="error" display="block" mt={1}>
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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={0.5} mb={2}>
        <Typography variant="h4">Make Your Picks</Typography>
        <Typography variant="body1" color="text.secondary">
          Week {selectedWeek} • Picks lock at Sun 3:25 PM
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Locks in 3h 12m
        </Typography>
      </Stack>

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        alignItems={{ xs: 'flex-start', md: 'center' }}
        justifyContent="space-between"
        mb={3}
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
              />
            }
            label="Show unpicked only"
          />
          <FormControlLabel
            control={
              <Switch
                checked={highlightDiff}
                onChange={(e) => setHighlightDiff(e.target.checked)}
              />
            }
            label="Highlight changes"
          />
        </Stack>
        <Button variant="outlined" onClick={handleAutoPick} disabled={isLocked}>
          Auto Pick Favorites
        </Button>
      </Stack>

      {/* Tie-breaker card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack spacing={1} mb={1}>
            <Typography variant="h6">Weekly Tie-Breaker</Typography>
            <Typography variant="body2" color="text.secondary">
              Used only if there’s a tie on the leaderboard this week.
            </Typography>
          </Stack>
          <Stack spacing={1} mb={2}>
            <Typography variant="body2" fontWeight={600}>
              Tie-breaker matchup
            </Typography>
            <Typography variant="body1">
              {games.find((g) => g.id === tiebreakerGameId)?.away} @{' '}
              {games.find((g) => g.id === tiebreakerGameId)?.home}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {games.find((g) => g.id === tiebreakerGameId)?.kickoff || 'Kickoff TBD'}
            </Typography>
          </Stack>
          <Stack spacing={1} mb={1}>
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
            />
          </Stack>
          <Typography variant="caption" color="text.secondary">
            Closest total wins the tie-breaker (difference from actual total).
          </Typography>
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2}>
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Grid item xs={12} sm={6} key={`sk-${i}`}>
              <Skeleton variant="rectangular" height={150} />
            </Grid>
          ))
        ) : filteredGames.length === 0 ? (
          <Grid item xs={12}>
            <Typography variant="body1" color="text.secondary" align="center">
              No games found for this week.
            </Typography>
          </Grid>
        ) : (
          filteredGames.map((game) => (
            <Grid item xs={12} sm={6} key={game.id}>
              <MatchupCard
                game={game}
                pick={picks[game.id]}
                savedPick={savedPicks[game.id]}
                onPick={(side) => handlePick(game.id, side)}
                lockOfWeek={lockOfWeek}
                onToggleLock={handleToggleLock}
                isLocked={isLocked}
              />
            </Grid>
          ))
        )}
      </Grid>

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
        <Alert severity="success" onClose={() => setSnackbarOpen(false)} sx={{ width: '100%' }}>
          Picks saved!
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default MakePicks
