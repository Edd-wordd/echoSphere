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
} from '@mui/material'
import LockIcon from '@mui/icons-material/Lock'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
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
  const [modalOpen, setModalOpen] = useState(false)
  const lockCountdown = formatCountdown(lockAt)
  const isLocked = lockCountdown === 'Locked'
  const statusLabel = !picksSubmitted ? 'Not Submitted' : isLocked ? 'Locked' : 'Submitted'
  const statusColor = !picksSubmitted ? 'error' : isLocked ? 'default' : 'success'
  const summary = useMemo(() => getPicksSummary(games, picks), [games, picks])
  const previews = useMemo(() => getPreviewList(games, picks, 4), [games, picks])
  const remaining = Math.max(0, summary.total - previews.length)
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
        <Stack spacing={1.5} sx={{ mb: 2 }}>
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
              Picks
            </Typography>
            <Chip label={statusLabel} color={statusColor} size="small" sx={{ height: 20 }} />
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <AccessTimeIcon sx={{ fontSize: 16, color: 'rgba(233,236,245,0.5)' }} />
            <Stack spacing={0.25}>
              <Typography
                variant="body2"
                sx={{ color: 'rgba(233,236,245,0.5)', fontSize: '0.75rem' }}
              >
                Lock deadline
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: '#e9ecf5', fontWeight: 500, fontSize: '0.8125rem' }}
              >
                {lockDeadline}
              </Typography>
              {!picksSubmitted && lockCountdown && (
                <Typography
                  variant="caption"
                  sx={{ color: 'rgba(255,82,82,0.8)', fontSize: '0.7rem' }}
                >
                  Locks in {lockCountdown}
                </Typography>
              )}
              {picksSubmitted && !isLocked && (
                <Typography
                  variant="caption"
                  sx={{ color: 'rgba(233,236,245,0.5)', fontSize: '0.7rem' }}
                >
                  Edits allowed until kickoff
                </Typography>
              )}
              {picksSubmitted && isLocked && (
                <Typography
                  variant="caption"
                  sx={{ color: 'rgba(233,236,245,0.5)', fontSize: '0.7rem' }}
                >
                  Picks are locked
                </Typography>
              )}
            </Stack>
          </Stack>
        </Stack>

        {picksSubmitted && (
          <>
            <Stack spacing={0.75} sx={{ mb: 2 }}>
              <Typography
                variant="body2"
                sx={{ color: 'rgba(233,236,245,0.5)', fontSize: '0.75rem', fontWeight: 600 }}
              >
                Picks Overview
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: '#e9ecf5', fontWeight: 600, fontSize: '0.875rem' }}
              >
                Picks saved: {summary.total} / {games.length}
              </Typography>
              {summary.favorites + summary.underdogs > 0 && (
                <Typography
                  variant="body2"
                  sx={{ color: 'rgba(233,236,245,0.7)', fontSize: '0.8125rem' }}
                >
                  Favorites: {summary.favorites} • Underdogs: {summary.underdogs}
                </Typography>
              )}
              <Typography
                variant="body2"
                sx={{ color: 'rgba(233,236,245,0.7)', fontSize: '0.8125rem' }}
              >
                Home: {summary.home} • Away: {summary.away}
              </Typography>
              {progress.finishedCount > 0 && (
                <Typography
                  variant="body2"
                  sx={{ color: '#e9ecf5', fontWeight: 600, fontSize: '0.875rem' }}
                >
                  This week (so far): {progress.wins}-{progress.losses} • Remaining:{' '}
                  {progress.remaining} {progress.remaining === 1 ? 'game' : 'games'}
                </Typography>
              )}
              {tieInfo && (
                <Typography
                  variant="body2"
                  sx={{ color: 'rgba(233,236,245,0.7)', fontSize: '0.8125rem' }}
                >
                  Tie-breaker: {tieInfo.matchup}
                  {tieInfo.totalPoints != null ? ` • Your guess: ${tieInfo.totalPoints}` : ''}
                </Typography>
              )}
              <Button
                size="small"
                variant="text"
                sx={{
                  alignSelf: 'flex-start',
                  mt: 0.5,
                  textTransform: 'none',
                  color: 'rgba(183,148,246,0.9)',
                  fontSize: '0.8rem',
                  '&:hover': { bgcolor: 'rgba(124,77,255,0.08)' },
                }}
                onClick={() => setModalOpen(true)}
              >
                View all picks
              </Button>
            </Stack>

            {previews.length > 0 && (
              <Stack spacing={1} sx={{ mb: 2 }}>
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />
                <Typography
                  variant="body2"
                  sx={{ color: 'rgba(233,236,245,0.5)', fontSize: '0.75rem', fontWeight: 600 }}
                >
                  Upcoming picks
                </Typography>
                {previews.map((preview) => (
                  <Stack key={preview.game.id} spacing={0.25} alignItems="flex-start">
                    <Typography
                      variant="body2"
                      sx={{ color: '#e9ecf5', fontWeight: 600, fontSize: '0.875rem' }}
                    >
                      {preview.game.awayTeam.name} @ {preview.game.homeTeam.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: 'rgba(233,236,245,0.6)', fontSize: '0.75rem' }}
                    >
                      Picked:{' '}
                      {preview.pickedTeamId === preview.game.homeTeam.id
                        ? preview.game.homeTeam.name
                        : preview.game.awayTeam.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: 'rgba(233,236,245,0.5)', fontSize: '0.7rem' }}
                    >
                      {new Date(preview.game.kickoffAt).toLocaleString()}
                    </Typography>
                  </Stack>
                ))}
                {remaining > 0 && (
                  <Link
                    component="button"
                    type="button"
                    onClick={() => setModalOpen(true)}
                    underline="hover"
                    sx={{
                      fontSize: '0.75rem',
                      alignSelf: 'flex-start',
                      color: 'rgba(183,148,246,0.9)',
                    }}
                  >
                    +{remaining} more
                  </Link>
                )}
              </Stack>
            )}
          </>
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
