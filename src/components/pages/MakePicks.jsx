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
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

// Mock data / services (replace with Firebase services when ready)
const mockGames = [
  { id: 'game1', away: 'Cowboys', home: 'Eagles', kickoff: 'Sun 3:25 PM' },
  { id: 'game2', away: 'Bills', home: 'Chiefs', kickoff: 'Sun 7:20 PM' },
  { id: 'game3', away: 'Packers', home: 'Bears', kickoff: 'Mon 7:15 PM' },
]

const getWeekGames = async (week) =>
  Promise.resolve(mockGames.map((g) => ({ ...g, id: `${g.id}-${week}` })))
const getUserPicks = async () => Promise.resolve({ picks: {}, lockOfWeek: null })
const saveUserPicks = async (_uid, _week, picks, lockOfWeek) =>
  new Promise((resolve) =>
    setTimeout(() => resolve({ picks, lockOfWeek, updatedAt: new Date().toISOString() }), 500),
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
        <Button variant="contained" onClick={onSave} disabled={isSaving || isLocked}>
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
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [error, setError] = useState('')

  const pickedCount = useMemo(() => Object.keys(picks).length, [picks])
  const hasUnsavedChanges = useMemo(
    () => JSON.stringify(picks) !== JSON.stringify(savedPicks) || lockOfWeek !== savedLockOfWeek,
    [picks, savedPicks, lockOfWeek, savedLockOfWeek],
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
    const missing = games.length - Object.keys(picks).length
    if (missing > 0) {
      const proceed = window.confirm(
        `You haven't picked all games (${missing} missing). Save anyway?`,
      )
      if (!proceed) return
    }
    try {
      setIsSaving(true)
      await saveUserPicks('mock-user', selectedWeek, picks, lockOfWeek)
      setSavedPicks(picks)
      setSavedLockOfWeek(lockOfWeek)
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
