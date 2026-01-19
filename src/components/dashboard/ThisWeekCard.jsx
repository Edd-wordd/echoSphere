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
          tieBreaker.kickoff ||
          (g && g.kickoffAt ? new Date(g.kickoffAt).toLocaleString() : ''),
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
    <Card>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h6">This Week</Typography>
          <Chip label={`Week ${weekNumber}`} color="primary" size="small" />
        </Stack>
        <Stack spacing={1} mb={2}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2" color="text.secondary">
              Picks
            </Typography>
            <Chip label={statusLabel} color={statusColor} size="small" />
          </Stack>
          <Typography variant="body2" color="text.secondary">
            Lock deadline
          </Typography>
          <Typography variant="body1">{lockDeadline}</Typography>
          {!picksSubmitted && lockCountdown && (
            <Typography variant="caption" color="error.main">
              Locks in {lockCountdown}
            </Typography>
          )}
          {picksSubmitted && !isLocked && (
            <Typography variant="caption" color="text.secondary">
              Edits allowed until kickoff
            </Typography>
          )}
          {picksSubmitted && isLocked && (
            <Typography variant="caption" color="text.secondary">
              Picks are locked
            </Typography>
          )}
        </Stack>

        {picksSubmitted && (
          <>
            <Stack spacing={0.5} mb={2}>
              <Typography variant="body2" color="text.secondary">
                Picks Overview
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                Picks saved: {summary.total} / {games.length}
              </Typography>
              {summary.favorites + summary.underdogs > 0 && (
                <Typography variant="body2">
                  Favorites: {summary.favorites} • Underdogs: {summary.underdogs}
                </Typography>
              )}
              <Typography variant="body2">
                Home: {summary.home} • Away: {summary.away}
              </Typography>
              {progress.finishedCount > 0 && (
                <Typography variant="body2" fontWeight={600}>
                  This week (so far): {progress.wins}-{progress.losses} • Remaining:{' '}
                  {progress.remaining} {progress.remaining === 1 ? 'game' : 'games'}
                </Typography>
              )}
              {tieInfo && (
                <Typography variant="body2" color="text.secondary">
                  Tie-breaker: {tieInfo.matchup}
                  {tieInfo.totalPoints != null ? ` • Your guess: ${tieInfo.totalPoints}` : ''}
                </Typography>
              )}
              <Button
                size="small"
                variant="text"
                sx={{ alignSelf: 'flex-start', mt: 0.5, textTransform: 'none' }}
                onClick={() => setModalOpen(true)}
              >
                View all picks
              </Button>
            </Stack>

            {previews.length > 0 && (
              <Stack spacing={1} mb={2}>
                <Divider />
                <Typography variant="body2" color="text.secondary">
                  Upcoming picks
                </Typography>
                {previews.map((preview) => (
                  <Stack key={preview.game.id} spacing={0} alignItems="flex-start">
                    <Typography variant="body2" fontWeight={600}>
                      {preview.game.awayTeam.name} @ {preview.game.homeTeam.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Picked:{' '}
                      {preview.pickedTeamId === preview.game.homeTeam.id
                        ? preview.game.homeTeam.name
                        : preview.game.awayTeam.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
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
                    sx={{ fontSize: 12, alignSelf: 'flex-start' }}
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
        >
          {!picksSubmitted ? 'MAKE PICKS NOW' : isLocked ? 'PICKS LOCKED' : 'EDIT PICKS'}
        </Button>

        <Dialog open={modalOpen} onClose={() => setModalOpen(false)} fullWidth maxWidth="sm">
          <DialogTitle>Picks for Week {weekNumber}</DialogTitle>
          <DialogContent dividers>
            {tieInfo && (
              <Stack spacing={0.5} mb={2}>
                <Typography variant="body2" fontWeight={600}>
                  Tie-breaker
                </Typography>
                <Typography variant="body2">
                  {tieInfo.matchup}
                  {tieInfo.kickoff ? ` — ${tieInfo.kickoff}` : ''}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Your guess: {tieInfo.totalPoints != null ? tieInfo.totalPoints : '—'}
                </Typography>
                <Divider sx={{ mt: 1 }} />
              </Stack>
            )}
            {fullPickList.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
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
                          <Typography component="span" variant="body2" color="text.primary">
                            Picked: {item.picked}
                          </Typography>
                          <Typography
                            component="span"
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: 'block' }}
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
          <DialogActions>
            <Button onClick={() => setModalOpen(false)}>Close</Button>
            <Button
              onClick={onViewAllPicks || onManagePicks}
              disabled={picksSubmitted && isLocked}
              variant="contained"
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
