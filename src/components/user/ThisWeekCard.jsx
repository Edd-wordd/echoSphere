import React, { useMemo, useState } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Button,
  Chip,
  Divider,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Box,
  Grid,
  Collapse,
  alpha,
  useTheme,
} from '@mui/material'
import LockIcon from '@mui/icons-material/Lock'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import { glassyCard } from '../../styles/adminStyles'

const formatCountdown = (lockAt) => {
  if (!lockAt) return null
  const diffMs = new Date(lockAt).getTime() - Date.now()
  if (diffMs <= 0) return 'Locked'
  const totalMinutes = Math.floor(diffMs / 60000)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  const days = Math.floor(hours / 24)
  const remHours = hours % 24
  if (days > 0) return `${days}d ${remHours}h ${minutes}m`
  return `${hours}h ${minutes}m`
}

const getPicksSummary = (games = [], picks = []) => {
  const picksByGame = picks.reduce((acc, p) => ({ ...acc, [p.gameId]: p.pickedTeamId }), {})
  const total = Object.keys(picksByGame).length
  const home = games.filter((g) => picksByGame[g.id] === g.homeTeam.id).length
  const away = games.filter((g) => picksByGame[g.id] === g.awayTeam.id).length
  let favorites = 0
  let underdogs = 0
  games.forEach((g) => {
    if (!g.favoriteTeamId) return
    const pick = picksByGame[g.id]
    if (pick === g.favoriteTeamId) favorites += 1
    else if (pick) underdogs += 1
  })
  return { total, home, away, favorites, underdogs }
}

const getPreviewList = (games = [], picks = [], limit = 4) => {
  const picksByGame = picks.reduce((acc, p) => ({ ...acc, [p.gameId]: p.pickedTeamId }), {})
  return games
    .filter((g) => picksByGame[g.id])
    .sort((a, b) => new Date(a.kickoffAt).getTime() - new Date(b.kickoffAt).getTime())
    .slice(0, limit)
    .map((g) => ({
      game: g,
      pickedTeamId: picksByGame[g.id],
    }))
}

const getWeekProgress = (games = [], picks = []) => {
  const picksByGame = picks.reduce((acc, p) => ({ ...acc, [p.gameId]: p.pickedTeamId }), {})
  const finished = games.filter((g) => g.status === 'FINAL' && g.winningTeamId)
  let wins = 0
  let losses = 0
  finished.forEach((g) => {
    const pick = picksByGame[g.id]
    if (!pick) return
    if (pick === g.winningTeamId) wins += 1
    else losses += 1
  })
  const remaining = games.length - finished.length
  return { wins, losses, remaining, finishedCount: finished.length }
}

// Reusable SummaryTile component
const SummaryTile = ({ label, value, icon, theme }) => (
  <Box
    sx={{
      p: 1.5,
      borderRadius: 1.5,
      bgcolor: alpha(theme.palette.primary.main, 0.08),
      border: '1px solid rgba(255,255,255,0.05)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 70,
    }}
  >
    {icon && (
      <Box sx={{ mb: 0.5, display: 'flex', alignItems: 'center' }}>
        {icon}
      </Box>
    )}
    <Typography
      variant="h6"
      sx={{
        color: '#e9ecf5',
        fontWeight: 700,
        fontSize: '1.125rem',
        mb: 0.25,
      }}
    >
      {value}
    </Typography>
    <Typography
      variant="caption"
      sx={{
        color: 'rgba(233,236,245,0.6)',
        fontSize: '0.7rem',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        fontWeight: 600,
      }}
    >
      {label}
    </Typography>
  </Box>
)

// Reusable UpcomingGameRow component
const UpcomingGameRow = ({ game, pickedTeamId }) => {
  const pickedTeam = pickedTeamId === game.homeTeam.id ? game.homeTeam : game.awayTeam
  const kickoffTime = new Date(game.kickoffAt).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        py: 0.75,
        px: 1,
        borderRadius: 1,
        '&:hover': {
          bgcolor: 'rgba(255,255,255,0.02)',
        },
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center" sx={{ flex: 1 }}>
        <Typography
          variant="body2"
          sx={{
            color: '#e9ecf5',
            fontWeight: 600,
            fontSize: '0.8125rem',
            minWidth: 120,
          }}
        >
          {game.awayTeam.abbrev || game.awayTeam.name} @ {game.homeTeam.abbrev || game.homeTeam.name}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: 'rgba(233,236,245,0.5)',
            fontSize: '0.75rem',
          }}
        >
          {pickedTeam.abbrev || pickedTeam.name}
        </Typography>
      </Stack>
      <Typography
        variant="caption"
        sx={{
          color: 'rgba(233,236,245,0.4)',
          fontSize: '0.7rem',
        }}
      >
        {kickoffTime}
      </Typography>
    </Stack>
  )
}

const ThisWeekCard = ({
  weekNumber,
  picksSubmitted,
  lockDeadline,
  lockAt,
  games = [],
  picks = [],
  tieBreaker,
  onManagePicks,
  onViewAllPicks,
}) => {
  const theme = useTheme()
  const [modalOpen, setModalOpen] = useState(false)
  const [detailsExpanded, setDetailsExpanded] = useState(false)
  const lockCountdown = formatCountdown(lockAt)
  const isLocked = lockCountdown === 'Locked'
  const statusLabel = !picksSubmitted ? 'Not Submitted' : isLocked ? 'Locked' : 'Open'
  const statusColor = !picksSubmitted ? 'error' : isLocked ? 'default' : 'success'
  const summary = useMemo(() => getPicksSummary(games, picks), [games, picks])
  const previews = useMemo(() => getPreviewList(games, picks, 4), [games, picks])
  const remaining = Math.max(0, games.length - summary.total)
  const progress = useMemo(() => getWeekProgress(games, picks), [games, picks])
  const fullPickList = useMemo(() => {
    const picksByGame = picks.reduce((acc, p) => ({ ...acc, [p.gameId]: p.pickedTeamId }), {})
    return games
      .filter((g) => picksByGame[g.id])
      .sort((a, b) => new Date(a.kickoffAt).getTime() - new Date(b.kickoffAt).getTime())
      .map((g) => ({
        id: g.id,
        label: `${g.awayTeam.name} @ ${g.homeTeam.name}`,
        picked: picksByGame[g.id] === g.homeTeam.id ? g.homeTeam.name : g.awayTeam.name,
        kickoff: new Date(g.kickoffAt).toLocaleString(),
      }))
  }, [games, picks])

  const tieInfo = useMemo(() => {
    if (tieBreaker?.gameId) {
      const g = games.find((game) => game.id === tieBreaker.gameId)
      return {
        matchup: tieBreaker.matchup || (g ? `${g.awayTeam.name} @ ${g.homeTeam.name}` : ''),
        kickoff:
          tieBreaker.kickoff || (g && g.kickoffAt ? new Date(g.kickoffAt).toLocaleString() : ''),
        totalPoints: tieBreaker.totalPoints ?? null,
      }
    }
    // fallback: last game by kickoff
    if (!games.length) return null
    const sorted = games
      .slice()
      .sort((a, b) => new Date(a.kickoffAt || 0) - new Date(b.kickoffAt || 0))
    const g = sorted[sorted.length - 1]
    return {
      matchup: `${g.awayTeam.name} @ ${g.homeTeam.name}`,
      kickoff: g.kickoffAt ? new Date(g.kickoffAt).toLocaleString() : '',
      totalPoints: tieBreaker?.totalPoints ?? null,
    }
  }, [games, tieBreaker])

  return (
    <Card sx={glassyCard}>
      <CardContent sx={{ color: '#e9ecf5', py: 2.5, px: 2.5 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'rgba(233,236,245,0.95)' }}>
            This Week
          </Typography>
          <Chip
            label={`Week ${weekNumber}`}
            size="small"
            sx={{
              bgcolor: 'rgba(124,77,255,0.15)',
              color: '#b794f6',
              fontWeight: 600,
              fontSize: '0.7rem',
              height: 22,
            }}
          />
        </Stack>

        {/* Compact Summary Tiles */}
        {picksSubmitted && (
          <Grid container spacing={1.5} sx={{ mb: 2 }}>
            <Grid item xs={6} sm={3}>
              <SummaryTile
                label="Picks In"
                value={`${summary.total}/${games.length}`}
                theme={theme}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <SummaryTile
                label="Status"
                value={statusLabel}
                icon={
                  isLocked ? (
                    <LockIcon sx={{ fontSize: 18, color: 'rgba(255,82,82,0.7)' }} />
                  ) : (
                    <LockOpenIcon sx={{ fontSize: 18, color: 'rgba(0,200,83,0.7)' }} />
                  )
                }
                theme={theme}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <SummaryTile
                label="Record This Week"
                value={
                  progress.finishedCount > 0
                    ? `${progress.wins}–${progress.losses}`
                    : '—'
                }
                theme={theme}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <SummaryTile
                label="Remaining"
                value={`${progress.remaining} ${progress.remaining === 1 ? 'game' : 'games'}`}
                theme={theme}
              />
            </Grid>
          </Grid>
        )}

        {/* Collapsible Details Section */}
        {picksSubmitted && (
          <>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', my: 1.5 }} />
            <Button
              variant="text"
              size="small"
              onClick={() => setDetailsExpanded(!detailsExpanded)}
              endIcon={detailsExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              sx={{
                textTransform: 'none',
                color: 'rgba(183,148,246,0.9)',
                fontSize: '0.8rem',
                fontWeight: 500,
                px: 0,
                '&:hover': { bgcolor: 'rgba(124,77,255,0.08)' },
              }}
            >
              View details
            </Button>
            <Collapse in={detailsExpanded}>
              <Box sx={{ mt: 1.5 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={1}>
                      <Typography
                        variant="caption"
                        sx={{ color: 'rgba(233,236,245,0.5)', fontSize: '0.7rem', fontWeight: 600 }}
                      >
                        Lock deadline
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: '#e9ecf5', fontSize: '0.8125rem' }}
                      >
                        {lockDeadline}
                      </Typography>
                      {summary.favorites + summary.underdogs > 0 && (
                        <>
                          <Typography
                            variant="caption"
                            sx={{ color: 'rgba(233,236,245,0.5)', fontSize: '0.7rem', fontWeight: 600, mt: 1 }}
                          >
                            Favorites / Underdogs
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: '#e9ecf5', fontSize: '0.8125rem' }}
                          >
                            {summary.favorites} / {summary.underdogs}
                          </Typography>
                        </>
                      )}
                      <Typography
                        variant="caption"
                        sx={{ color: 'rgba(233,236,245,0.5)', fontSize: '0.7rem', fontWeight: 600, mt: 1 }}
                      >
                        Home / Away
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: '#e9ecf5', fontSize: '0.8125rem' }}
                      >
                        {summary.home} / {summary.away}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={1}>
                      {tieInfo && (
                        <>
                          <Typography
                            variant="caption"
                            sx={{ color: 'rgba(233,236,245,0.5)', fontSize: '0.7rem', fontWeight: 600 }}
                          >
                            Tie-breaker
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: '#e9ecf5', fontSize: '0.8125rem' }}
                          >
                            {tieInfo.matchup}
                          </Typography>
                          {tieInfo.totalPoints != null && (
                            <>
                              <Typography
                                variant="caption"
                                sx={{ color: 'rgba(233,236,245,0.5)', fontSize: '0.7rem', fontWeight: 600, mt: 1 }}
                              >
                                Your guess
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{ color: '#e9ecf5', fontSize: '0.8125rem' }}
                              >
                                {tieInfo.totalPoints} points
                              </Typography>
                            </>
                          )}
                        </>
                      )}
                    </Stack>
                  </Grid>
                </Grid>
              </Box>
            </Collapse>
          </>
        )}

        {/* Upcoming Picks - Compact List */}
        {picksSubmitted && previews.length > 0 && (
          <Stack spacing={1} sx={{ mt: 2 }}>
            <Typography
              variant="body2"
              sx={{ color: 'rgba(233,236,245,0.5)', fontSize: '0.75rem', fontWeight: 600 }}
            >
              Upcoming picks
            </Typography>
            <Box
              sx={{
                borderRadius: 1,
                border: '1px solid rgba(255,255,255,0.06)',
                bgcolor: 'rgba(255,255,255,0.02)',
                p: 0.5,
              }}
            >
              {previews.map((preview) => (
                <UpcomingGameRow
                  key={preview.game.id}
                  game={preview.game}
                  pickedTeamId={preview.pickedTeamId}
                />
              ))}
            </Box>
            {remaining > 0 && (
              <Button
                size="small"
                variant="text"
                onClick={() => setModalOpen(true)}
                sx={{
                  textTransform: 'none',
                  color: 'rgba(183,148,246,0.9)',
                  fontSize: '0.75rem',
                  alignSelf: 'flex-start',
                  '&:hover': { bgcolor: 'rgba(124,77,255,0.08)' },
                }}
              >
                +{remaining} more
              </Button>
            )}
          </Stack>
        )}

        {!picksSubmitted && (
          <Stack spacing={1} sx={{ mb: 2 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              {isLocked ? (
                <LockIcon sx={{ fontSize: 16, color: 'rgba(255,82,82,0.7)' }} />
              ) : (
                <LockOpenIcon sx={{ fontSize: 16, color: 'rgba(0,200,83,0.7)' }} />
              )}
              <Typography
                variant="body2"
                sx={{ color: 'rgba(233,236,245,0.7)', fontSize: '0.8125rem' }}
              >
                Status: {statusLabel}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <AccessTimeIcon sx={{ fontSize: 16, color: 'rgba(233,236,245,0.5)' }} />
              <Typography
                variant="body2"
                sx={{ color: 'rgba(233,236,245,0.7)', fontSize: '0.8125rem' }}
              >
                Lock deadline: {lockDeadline}
              </Typography>
            </Stack>
            {lockCountdown && lockCountdown !== 'Locked' && (
              <Typography
                variant="caption"
                sx={{ color: 'rgba(255,82,82,0.8)', fontSize: '0.7rem' }}
              >
                Locks in {lockCountdown}
              </Typography>
            )}
          </Stack>
        )}

        <Button
          variant="contained"
          color={!picksSubmitted ? 'error' : 'primary'}
          onClick={onManagePicks}
          fullWidth
          disabled={picksSubmitted && isLocked}
          sx={{
            mt: 1,
            py: 1.25,
            fontWeight: 600,
            fontSize: '0.9rem',
            textTransform: 'none',
            bgcolor: !picksSubmitted ? 'rgba(255,82,82,0.4)' : 'rgba(124,77,255,0.4)',
            color: '#e9ecf5',
            border: '1px solid rgba(255,255,255,0.12)',
            '&:hover': {
              bgcolor: !picksSubmitted ? 'rgba(255,82,82,0.5)' : 'rgba(124,77,255,0.5)',
              borderColor: 'rgba(255,255,255,0.18)',
            },
            '&.Mui-disabled': {
              bgcolor: 'rgba(124,77,255,0.15)',
              color: 'rgba(233,236,245,0.4)',
              borderColor: 'rgba(255,255,255,0.06)',
            },
          }}
        >
          {!picksSubmitted ? 'MAKE PICKS NOW' : isLocked ? 'PICKS LOCKED' : 'EDIT PICKS'}
        </Button>

        <Dialog
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          fullWidth
          maxWidth="sm"
          PaperProps={{
            sx: {
              ...glassyCard,
              backgroundColor: 'rgba(10,10,12,0.95)',
            },
          }}
        >
          <DialogTitle sx={{ fontWeight: 700, color: '#e9ecf5' }}>
            Picks for Week {weekNumber}
          </DialogTitle>
          <DialogContent dividers sx={{ borderColor: 'rgba(255,255,255,0.08)' }}>
            {tieInfo && (
              <Stack spacing={0.5} sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#e9ecf5' }}>
                  Tie-breaker
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(233,236,245,0.9)' }}>
                  {tieInfo.matchup}
                  {tieInfo.kickoff ? ` — ${tieInfo.kickoff}` : ''}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(233,236,245,0.7)' }}>
                  Your guess: {tieInfo.totalPoints != null ? tieInfo.totalPoints : '—'}
                </Typography>
                <Divider sx={{ mt: 1, borderColor: 'rgba(255,255,255,0.08)' }} />
              </Stack>
            )}
            {fullPickList.length === 0 ? (
              <Typography variant="body2" sx={{ color: 'rgba(233,236,245,0.7)' }}>
                No picks yet.
              </Typography>
            ) : (
              <List dense>
                {fullPickList.map((item) => (
                  <ListItem key={item.id} alignItems="flex-start">
                    <ListItemText
                      primary={item.label}
                      secondary={
                        <>
                          <Typography component="span" variant="body2" sx={{ color: '#e9ecf5' }}>
                            Picked: {item.picked}
                          </Typography>
                          <Typography
                            component="span"
                            variant="caption"
                            sx={{ color: 'rgba(233,236,245,0.7)', display: 'block' }}
                          >
                            {item.kickoff}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </DialogContent>
          <DialogActions sx={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <Button onClick={() => setModalOpen(false)} sx={{ color: 'rgba(183,148,246,0.9)' }}>
              Close
            </Button>
            <Button
              onClick={onViewAllPicks || onManagePicks}
              disabled={picksSubmitted && isLocked}
              variant="contained"
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                bgcolor: 'rgba(124,77,255,0.4)',
                color: '#e9ecf5',
                border: '1px solid rgba(255,255,255,0.12)',
                '&:hover': { bgcolor: 'rgba(124,77,255,0.5)' },
              }}
            >
              {isLocked ? 'PICKS LOCKED' : 'Edit picks'}
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  )
}

export default ThisWeekCard
