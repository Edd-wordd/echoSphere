import React, { useMemo, useState } from 'react'
import {
  Container,
  Typography,
  Card,
  CardContent,
  Stack,
  Alert,
  Grid,
  Button,
  Chip,
  Box,
  Divider,
  TextField,
} from '@mui/material'

const MAX_SQUARES_PER_USER = 3

const shuffleDigits = () => {
  const arr = Array.from({ length: 10 }, (_, i) => i)
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

const makeInitialModel = () => ({
  currentUser: { id: 'u1', displayName: 'You', role: 'admin' },
  game: {
    id: 'sb-lix',
    name: 'Super Bowl LIX',
    homeTeam: { id: 'SF', name: '49ers', abbrev: 'SF' },
    awayTeam: { id: 'BUF', name: 'Bills', abbrev: 'BUF' },
    status: 'open',
    lockAt: '2025-02-09T23:30:00Z',
    createdByUserId: 'u1',
    rowDigits: null,
    colDigits: null,
  },
  quarterScores: {
    gameId: 'sb-lix',
    q1: null,
    q2: null,
    q3: null,
    q4: null,
  },
  claims: [],
})

const getClaimCounts = (claims, userId) => claims.filter((c) => c.userId === userId).length

const buildGrid = (claims) => {
  const grid = Array.from({ length: 10 }, () => Array(10).fill(null))
  claims.forEach((c) => {
    grid[c.row][c.col] = c
  })
  return grid
}

const getWinningSquare = (digits, score) => {
  if (!digits) return null
  const awayLast = score.away % 10
  const homeLast = score.home % 10
  const row = digits.rowDigits?.indexOf(awayLast)
  const col = digits.colDigits?.indexOf(homeLast)
  if (row === -1 || col === -1 || row == null || col == null) return null
  return { row, col }
}

const QuarterWinners = ({ game, quarterScores, claims }) => {
  const digits = { rowDigits: game.rowDigits, colDigits: game.colDigits }
  const entries = [
    { label: 'Q1', score: quarterScores.q1 },
    { label: 'Q2', score: quarterScores.q2 },
    { label: 'Q3', score: quarterScores.q3 },
    { label: 'Final', score: quarterScores.q4 },
  ]
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Quarter Winners
        </Typography>
        <Stack spacing={1}>
          {entries.map((entry) => {
            if (!entry.score) {
              return (
                <Typography key={entry.label} variant="body2" color="text.secondary">
                  {entry.label}: Pending
                </Typography>
              )
            }
            const win = getWinningSquare(digits, entry.score)
            const claim =
              win && claims.find((c) => c.row === win.row && c.col === win.col)
            return (
              <Stack
                key={entry.label}
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="body2">
                  {entry.label}: {entry.score.away}-{entry.score.home}
                </Typography>
                {win ? (
                  <Chip
                    label={
                      claim
                        ? `${claim.userDisplayName} (row ${win.row}, col ${win.col})`
                        : `row ${win.row}, col ${win.col}`
                    }
                    color="success"
                    size="small"
                  />
                ) : (
                  <Chip label="No winner mapped" size="small" />
                )}
              </Stack>
            )
          })}
        </Stack>
      </CardContent>
    </Card>
  )
}

const SquaresBoard = ({
  game,
  claims,
  currentUser,
  onClaim,
  onUnclaim,
  disabled,
  maxPerUser,
  winners = [],
}) => {
  const grid = buildGrid(claims)
  const userClaims = getClaimCounts(claims, currentUser.id)

  const renderCell = (row, col) => {
    const claim = grid[row][col]
    const ownedByUser = claim && claim.userId === currentUser.id
    const isWinner = winners.some((w) => w.row === row && w.col === col)
    return (
      <Box
        key={`${row}-${col}`}
        onClick={() => {
          if (disabled) return
          if (claim && claim.userId === currentUser.id) {
            onUnclaim(claim)
          } else if (!claim && userClaims < maxPerUser) {
            onClaim(row, col)
          }
        }}
        sx={{
          border: '1px solid',
          borderColor: isWinner ? 'success.main' : 'divider',
          height: 48,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: claim
            ? ownedByUser
              ? 'primary.light'
              : 'action.hover'
            : 'background.paper',
          cursor: disabled
            ? 'not-allowed'
            : claim && claim.userId !== currentUser.id
            ? 'not-allowed'
            : 'pointer',
          fontSize: 12,
          textAlign: 'center',
          px: 0.5,
        }}
      >
        {claim ? claim.userDisplayName || claim.userId : 'Claim'}
      </Box>
    )
  }

  const topDigits = game.colDigits || []
  const leftDigits = game.rowDigits || []

  return (
    <Card>
      <CardContent>
        <Stack spacing={1} mb={1}>
          <Typography variant="h6">{game.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {game.awayTeam.name} @ {game.homeTeam.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Your squares: {userClaims} / {maxPerUser}
          </Typography>
          {disabled && (
            <Chip label="Board locked" size="small" color="default" variant="outlined" />
          )}
        </Stack>
        {game.colDigits && game.rowDigits ? (
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
            Digits assigned (board locked)
          </Typography>
        ) : (
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
            Digits will be assigned when board locks
          </Typography>
        )}

        <Box sx={{ overflowX: 'auto' }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(11, 64px)' }}>
            <Box />
            {Array.from({ length: 10 }, (_, col) => (
              <Box
                key={`col-${col}`}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                  bgcolor: 'background.default',
                }}
              >
                {game.colDigits ? topDigits[col] : col}
              </Box>
            ))}
            {Array.from({ length: 10 }, (_, row) => (
              <React.Fragment key={`row-${row}`}>
                <Box
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    height: 48,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 600,
                    bgcolor: 'background.default',
                  }}
                >
                  {game.rowDigits ? leftDigits[row] : row}
                </Box>
                {Array.from({ length: 10 }, (_, col) => renderCell(row, col))}
              </React.Fragment>
            ))}
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

const SuperBowlSquares = () => {
  const [model, setModel] = useState(makeInitialModel())
  const { currentUser, game, claims, quarterScores } = model
  const isLocked = game.status === 'locked' || Date.now() >= new Date(game.lockAt).getTime()

  const winners = useMemo(() => {
    const digits = { rowDigits: game.rowDigits, colDigits: game.colDigits }
    if (!digits.rowDigits || !digits.colDigits) return []
    const scores = [quarterScores.q1, quarterScores.q2, quarterScores.q3, quarterScores.q4].filter(
      Boolean,
    )
    const list = []
    scores.forEach((score) => {
      const win = getWinningSquare(digits, score)
      if (win) list.push(win)
    })
    return list
  }, [game.rowDigits, game.colDigits, quarterScores])

  const handleClaim = (row, col) => {
    if (isLocked) return
    setModel((prev) => {
      const nextClaim = {
        gameId: prev.game.id,
        index: row * 10 + col,
        row,
        col,
        userId: currentUser.id,
        userDisplayName: currentUser.displayName,
        claimedAt: new Date().toISOString(),
      }
      return { ...prev, claims: [...prev.claims, nextClaim] }
    })
  }

  const handleUnclaim = (claim) => {
    if (isLocked) return
    setModel((prev) => ({
      ...prev,
      claims: prev.claims.filter((c) => c.index !== claim.index || c.userId !== claim.userId),
    }))
  }

  const handleLockBoard = () => {
    setModel((prev) => ({
      ...prev,
      game: {
        ...prev.game,
        status: 'locked',
        rowDigits: shuffleDigits(),
        colDigits: shuffleDigits(),
      },
    }))
  }

  const handleScoreChange = (field, team, value) => {
    setModel((prev) => {
      const nextScores = { ...prev.quarterScores }
      const quarter = nextScores[field] || { home: 0, away: 0 }
      const parsed = Number(value)
      quarter[team] = Number.isNaN(parsed) ? 0 : parsed
      nextScores[field] = quarter
      return { ...prev, quarterScores: nextScores }
    })
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={1} mb={2}>
        <Typography variant="h4">Family NFL Picks</Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Super Bowl Squares
        </Typography>
      </Stack>

      <Alert severity="info" sx={{ mb: 3 }}>
        Claim up to {MAX_SQUARES_PER_USER} squares. Board locks at the first kickoff or when an admin
        locks it. Winners are based on the last digit of each team’s score at the end of each
        quarter.
      </Alert>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <SquaresBoard
            game={game}
            claims={claims}
            currentUser={currentUser}
            onClaim={handleClaim}
            onUnclaim={handleUnclaim}
            disabled={isLocked}
            maxPerUser={MAX_SQUARES_PER_USER}
            winners={winners}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Board Status
              </Typography>
              <Stack spacing={1}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip
                    label={isLocked ? 'Locked' : 'Open'}
                    color={isLocked ? 'default' : 'success'}
                    size="small"
                  />
                  <Typography variant="body2" color="text.secondary">
                    Lock at: {new Date(game.lockAt).toLocaleString()}
                  </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  {game.awayTeam.name} @ {game.homeTeam.name}
                </Typography>
              </Stack>
            </CardContent>
          </Card>

          {currentUser.role === 'admin' && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Admin Controls
                </Typography>
                <Stack spacing={2}>
                  <Button
                    variant="contained"
                    onClick={handleLockBoard}
                    disabled={isLocked}
                  >
                    Lock Board &amp; Generate Digits
                  </Button>
                  <Divider />
                  <Typography variant="body2" color="text.secondary">
                    Quarter Scores
                  </Typography>
                  {['q1', 'q2', 'q3', 'q4'].map((q) => (
                    <Stack key={q} direction="row" spacing={1} alignItems="center">
                      <Typography variant="caption" sx={{ width: 32 }}>
                        {q.toUpperCase()}
                      </Typography>
                      <TextField
                        size="small"
                        label={`${game.awayTeam.abbrev}`}
                        type="number"
                        value={quarterScores[q]?.away ?? ''}
                        onChange={(e) => handleScoreChange(q, 'away', e.target.value)}
                        sx={{ width: 90 }}
                      />
                      <TextField
                        size="small"
                        label={`${game.homeTeam.abbrev}`}
                        type="number"
                        value={quarterScores[q]?.home ?? ''}
                        onChange={(e) => handleScoreChange(q, 'home', e.target.value)}
                        sx={{ width: 90 }}
                      />
                    </Stack>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          )}

          <QuarterWinners game={game} quarterScores={quarterScores} claims={claims} />
        </Grid>
      </Grid>
    </Container>
  )
}

export default SuperBowlSquares
