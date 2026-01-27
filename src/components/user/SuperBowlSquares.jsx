import React, { useMemo, useState, useRef } from 'react'
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
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
} from '@mui/material'
import SportsFootballOutlinedIcon from '@mui/icons-material/SportsFootballOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import HourglassEmptyOutlinedIcon from '@mui/icons-material/HourglassEmptyOutlined'
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import { glassyCard } from '../../styles/adminStyles'

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
    { label: 'Q4', score: quarterScores.q4 },
    { label: 'Final', score: quarterScores.q4 },
  ]
  return (
    <Card sx={{ ...glassyCard, mb: 3 }}>
      <CardContent sx={{ py: 2.5, px: 2.5 }}>
        <Typography
          variant="h6"
          sx={{
            color: '#e9ecf5',
            fontWeight: 600,
            fontSize: '1.125rem',
            mb: 2,
          }}
          gutterBottom
        >
          Quarter Winners
        </Typography>
        <Stack spacing={1.5}>
          {entries.map((entry) => {
            if (!entry.score) {
              return (
                <Stack
                  key={entry.label}
                  direction="row"
                  alignItems="center"
                  spacing={1.5}
                  sx={{ py: 0.5 }}
                >
                  <HourglassEmptyOutlinedIcon
                    sx={{ fontSize: 18, color: 'rgba(233,236,245,0.5)' }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'rgba(233,236,245,0.6)',
                      fontSize: '0.875rem',
                    }}
                  >
                    {entry.label}: Pending
                  </Typography>
                </Stack>
              )
            }
            const win = getWinningSquare(digits, entry.score)
            const claim = win && claims.find((c) => c.row === win.row && c.col === win.col)
            return (
              <Stack
                key={entry.label}
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ py: 0.5 }}
              >
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <EmojiEventsOutlinedIcon sx={{ fontSize: 18, color: 'rgba(255,183,77,0.7)' }} />
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#e9ecf5',
                      fontSize: '0.875rem',
                    }}
                  >
                    {entry.label}: {entry.score.away}-{entry.score.home}
                  </Typography>
                </Stack>
                {win ? (
                  <Chip
                    label={
                      claim
                        ? `${claim.userDisplayName} (${win.row}, ${win.col})`
                        : `(${win.row}, ${win.col})`
                    }
                    size="small"
                    sx={{
                      bgcolor: 'rgba(76,175,80,0.15)',
                      color: '#81c784',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      height: 24,
                    }}
                  />
                ) : (
                  <Chip
                    label="No winner"
                    size="small"
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.05)',
                      color: 'rgba(233,236,245,0.5)',
                      fontSize: '0.75rem',
                      height: 24,
                    }}
                  />
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
  squaresRef,
}) => {
  const grid = buildGrid(claims)
  const userClaims = getClaimCounts(claims, currentUser.id)
  const topDigits = game.colDigits || []
  const leftDigits = game.rowDigits || []

  const renderCell = (row, col) => {
    const claim = grid[row][col]
    const ownedByUser = claim && claim.userId === currentUser.id
    const isWinner = winners.some((w) => w.row === row && w.col === col)
    const canClaim = !disabled && !claim && userClaims < maxPerUser
    const canUnclaim = !disabled && claim && claim.userId === currentUser.id

    const tooltipContent = () => {
      if (claim) {
        const digitsInfo =
          game.colDigits && game.rowDigits
            ? `\nDigits: Row ${leftDigits[row]}, Col ${topDigits[col]}`
            : ''
        return `Row: ${row}, Col: ${col}\nClaimed by: ${claim.userDisplayName || claim.userId}${digitsInfo}`
      }
      const digitsInfo =
        game.colDigits && game.rowDigits
          ? `\nDigits: Row ${leftDigits[row]}, Col ${topDigits[col]}`
          : ''
      return `Row: ${row}, Col: ${col}${digitsInfo}`
    }

    return (
      <Tooltip
        key={`${row}-${col}`}
        title={tooltipContent()}
        arrow
        placement="top"
        componentsProps={{
          tooltip: {
            sx: {
              bgcolor: 'rgba(15,15,17,0.95)',
              border: '1px solid rgba(255,255,255,0.1)',
              fontSize: '0.75rem',
              whiteSpace: 'pre-line',
            },
          },
        }}
      >
        <Button
          ref={(el) => {
            if (squaresRef && el) {
              squaresRef.current[`${row}-${col}`] = el
            }
          }}
          onClick={() => {
            if (canUnclaim) {
              onUnclaim(claim)
            } else if (canClaim) {
              onClaim(row, col)
            }
          }}
          disabled={!canClaim && !canUnclaim}
          sx={{
            minWidth: 0,
            width: '100%',
            height: 48,
            border: '1px solid',
            borderColor: isWinner ? 'rgba(76,175,80,0.5)' : 'rgba(255,255,255,0.06)',
            bgcolor: ownedByUser
              ? 'rgba(124,77,255,0.15)'
              : claim
                ? 'rgba(255,255,255,0.03)'
                : 'rgba(255,255,255,0.02)',
            color: ownedByUser
              ? '#b794f6'
              : claim
                ? 'rgba(233,236,245,0.5)'
                : 'rgba(233,236,245,0.7)',
            fontSize: '0.7rem',
            textTransform: 'none',
            borderRadius: 0,
            '&:hover': {
              bgcolor: ownedByUser
                ? 'rgba(124,77,255,0.2)'
                : canClaim
                  ? 'rgba(124,77,255,0.08)'
                  : 'rgba(255,255,255,0.04)',
              borderColor: ownedByUser
                ? 'rgba(124,77,255,0.6)'
                : canClaim
                  ? 'rgba(124,77,255,0.3)'
                  : 'rgba(255,255,255,0.08)',
            },
            '&:disabled': {
              bgcolor: 'rgba(255,255,255,0.02)',
              color: 'rgba(233,236,245,0.3)',
              borderColor: 'rgba(255,255,255,0.04)',
            },
          }}
        >
          <Stack alignItems="center" spacing={0.25}>
            {ownedByUser && <CheckCircleOutlineIcon sx={{ fontSize: 14, color: '#b794f6' }} />}
            <Typography
              variant="caption"
              sx={{
                fontSize: '0.65rem',
                fontWeight: ownedByUser ? 600 : 400,
                lineHeight: 1.2,
              }}
            >
              {claim
                ? claim.userDisplayName
                    ?.split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase() || 'Taken'
                : 'Claim'}
            </Typography>
          </Stack>
        </Button>
      </Tooltip>
    )
  }

  return (
    <Card sx={{ ...glassyCard }}>
      <CardContent sx={{ py: 2.5, px: 2.5 }}>
        {/* Header Stats */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mb: 2 }}>
          <Chip
            label={`Your squares: ${userClaims} / ${maxPerUser}`}
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
            icon={disabled ? <LockOutlinedIcon /> : <LockOpenOutlinedIcon />}
            label={disabled ? 'Locked' : 'Unlocked'}
            size="small"
            sx={{
              bgcolor: disabled ? 'rgba(255,152,0,0.15)' : 'rgba(76,175,80,0.15)',
              color: disabled ? '#ffb74d' : '#81c784',
              fontWeight: 600,
              fontSize: '0.75rem',
              height: 28,
              '& .MuiChip-icon': {
                fontSize: 14,
              },
            }}
          />
        </Stack>

        {disabled && !game.colDigits && (
          <Typography
            variant="caption"
            sx={{
              color: 'rgba(233,236,245,0.5)',
              fontSize: '0.7rem',
              display: 'block',
              mb: 2,
            }}
          >
            Digits assigned when board locks.
          </Typography>
        )}

        {/* Team Labels Legend */}
        <Box sx={{ mb: 1.5 }}>
          <Typography
            variant="caption"
            sx={{
              color: 'rgba(233,236,245,0.5)',
              fontSize: '0.7rem',
            }}
          >
            Top = Away ({game.awayTeam.abbrev}) • Left = Home ({game.homeTeam.abbrev})
          </Typography>
        </Box>

        {/* Grid */}
        <Box sx={{ overflowX: 'auto', mb: 2 }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '80px repeat(10, 64px)',
              gap: 0,
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {/* Top-left corner */}
            <Box
              sx={{
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'rgba(255,255,255,0.03)',
                borderRight: '1px solid rgba(255,255,255,0.06)',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: 'rgba(233,236,245,0.7)',
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  textAlign: 'center',
                }}
              >
                {game.awayTeam.abbrev}
              </Typography>
            </Box>

            {/* Top header row with Away team label */}
            {Array.from({ length: 10 }, (_, col) => (
              <Box
                key={`col-${col}`}
                sx={{
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'rgba(255,255,255,0.03)',
                  borderRight: col < 9 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: '#e9ecf5',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                  }}
                >
                  {game.colDigits ? topDigits[col] : col}
                </Typography>
              </Box>
            ))}

            {/* Rows with Left team label */}
            {Array.from({ length: 10 }, (_, row) => (
              <React.Fragment key={`row-${row}`}>
                {/* Left label cell */}
                <Box
                  sx={{
                    height: 48,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'rgba(255,255,255,0.03)',
                    borderRight: '1px solid rgba(255,255,255,0.06)',
                    borderBottom: row < 9 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#e9ecf5',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                    }}
                  >
                    {game.rowDigits ? leftDigits[row] : row}
                  </Typography>
                </Box>
                {/* Grid cells */}
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
  const [lockDialogOpen, setLockDialogOpen] = useState(false)
  const { currentUser, game, claims, quarterScores } = model
  const isLocked = game.status === 'locked' || Date.now() >= new Date(game.lockAt).getTime()
  const squaresRef = useRef({})

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

  const mySquares = useMemo(() => {
    return claims
      .filter((c) => c.userId === currentUser.id)
      .map((c) => ({ row: c.row, col: c.col }))
      .sort((a, b) => (a.row !== b.row ? a.row - b.row : a.col - b.col))
  }, [claims, currentUser.id])

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
    setLockDialogOpen(false)
  }

  const scrollToSquare = (row, col) => {
    const key = `${row}-${col}`
    const element = squaresRef.current[key]
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      element.style.transition = 'all 0.3s'
      element.style.border = '2px solid rgba(124,77,255,0.8)'
      setTimeout(() => {
        element.style.border = ''
        setTimeout(() => {
          element.style.transition = ''
        }, 300)
      }, 1000)
    }
  }

  const formatLockTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
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
    <Container maxWidth="lg" sx={{ py: 4, color: '#e9ecf5' }}>
      {/* Page Header */}
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
        <SportsFootballOutlinedIcon
          sx={{
            fontSize: 32,
            color: 'rgba(124,77,255,0.7)',
          }}
        />
        <Stack spacing={0.5}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: 'rgba(233,236,245,0.95)',
              fontSize: { xs: '1.5rem', sm: '2rem' },
            }}
          >
            Super Bowl Squares
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(233,236,245,0.6)',
                fontSize: '0.8125rem',
              }}
            >
              {game.awayTeam.name} @ {game.homeTeam.name}
            </Typography>
            <AccessTimeIcon sx={{ fontSize: 14, color: 'rgba(233,236,245,0.5)' }} />
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(233,236,245,0.6)',
                fontSize: '0.8125rem',
              }}
            >
              Locks {formatLockTime(game.lockAt)}
            </Typography>
          </Stack>
        </Stack>
      </Stack>

      {/* Info Banner */}
      <Alert
        severity="info"
        icon={<InfoOutlinedIcon />}
        sx={{
          mb: 3,
          bgcolor: 'rgba(33,150,243,0.1)',
          border: '1px solid rgba(33,150,243,0.2)',
          color: '#90caf9',
          '& .MuiAlert-icon': {
            color: '#64b5f6',
          },
          '& .MuiAlert-message': {
            color: '#90caf9',
          },
        }}
      >
        Claim up to {MAX_SQUARES_PER_USER} squares. Board locks at the first kickoff or when an
        admin locks it. Winners are based on the last digit of each team’s score at the end of each
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
            squaresRef={squaresRef}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            {/* Board Status */}
            <Card sx={{ ...glassyCard }}>
              <CardContent sx={{ py: 2.5, px: 2.5 }}>
                <Typography
                  variant="h6"
                  sx={{
                    color: '#e9ecf5',
                    fontWeight: 600,
                    fontSize: '1.125rem',
                    mb: 2,
                  }}
                  gutterBottom
                >
                  Board Status
                </Typography>
                <Stack spacing={1.5}>
                  <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                    <Chip
                      icon={isLocked ? <LockOutlinedIcon /> : <LockOpenOutlinedIcon />}
                      label={isLocked ? 'Locked' : 'Unlocked'}
                      size="small"
                      sx={{
                        bgcolor: isLocked ? 'rgba(255,152,0,0.15)' : 'rgba(76,175,80,0.15)',
                        color: isLocked ? '#ffb74d' : '#81c784',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        height: 28,
                        '& .MuiChip-icon': {
                          fontSize: 14,
                        },
                      }}
                    />
                    <Chip
                      label={
                        game.colDigits && game.rowDigits
                          ? 'Digits assigned: Yes'
                          : 'Digits assigned: No'
                      }
                      size="small"
                      sx={{
                        bgcolor:
                          game.colDigits && game.rowDigits
                            ? 'rgba(76,175,80,0.15)'
                            : 'rgba(255,255,255,0.05)',
                        color:
                          game.colDigits && game.rowDigits ? '#81c784' : 'rgba(233,236,245,0.6)',
                        fontWeight: 500,
                        fontSize: '0.75rem',
                        height: 28,
                      }}
                    />
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <AccessTimeIcon sx={{ fontSize: 14, color: 'rgba(233,236,245,0.5)' }} />
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'rgba(233,236,245,0.7)',
                        fontSize: '0.8125rem',
                      }}
                    >
                      Lock at: {formatLockTime(game.lockAt)}
                    </Typography>
                  </Stack>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'rgba(233,236,245,0.7)',
                      fontSize: '0.8125rem',
                    }}
                  >
                    {game.awayTeam.name} @ {game.homeTeam.name}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>

            {/* Admin Controls */}
            {currentUser.role === 'admin' && (
              <Card sx={{ ...glassyCard }}>
                <CardContent sx={{ py: 2.5, px: 2.5 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: '#e9ecf5',
                      fontWeight: 600,
                      fontSize: '1.125rem',
                      mb: 2,
                    }}
                    gutterBottom
                  >
                    Admin Controls
                  </Typography>
                  <Stack spacing={2}>
                    <Button
                      variant="contained"
                      onClick={() => setLockDialogOpen(true)}
                      disabled={isLocked}
                      sx={{
                        bgcolor: 'rgba(124,77,255,0.8)',
                        color: '#fff',
                        fontWeight: 600,
                        py: 1.25,
                        '&:hover': {
                          bgcolor: 'rgba(124,77,255,0.9)',
                        },
                        '&:disabled': {
                          bgcolor: 'rgba(255,255,255,0.05)',
                          color: 'rgba(233,236,245,0.3)',
                        },
                      }}
                    >
                      Lock Board &amp; Generate Digits
                    </Button>
                    <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'rgba(233,236,245,0.6)',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        mb: 1,
                      }}
                    >
                      Quarter Scores
                    </Typography>
                    {['q1', 'q2', 'q3', 'q4'].map((q) => (
                      <Stack key={q} direction="row" spacing={1} alignItems="center">
                        <Typography
                          variant="caption"
                          sx={{
                            width: 32,
                            color: 'rgba(233,236,245,0.7)',
                            fontWeight: 600,
                            fontSize: '0.7rem',
                          }}
                        >
                          {q.toUpperCase()}
                        </Typography>
                        <TextField
                          size="small"
                          label={game.awayTeam.abbrev}
                          type="number"
                          value={quarterScores[q]?.away ?? ''}
                          onChange={(e) => handleScoreChange(q, 'away', e.target.value)}
                          sx={{
                            width: 90,
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
                            '& .MuiInputLabel-root': {
                              color: 'rgba(233,236,245,0.7)',
                            },
                          }}
                        />
                        <TextField
                          size="small"
                          label={game.homeTeam.abbrev}
                          type="number"
                          value={quarterScores[q]?.home ?? ''}
                          onChange={(e) => handleScoreChange(q, 'home', e.target.value)}
                          sx={{
                            width: 90,
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
                            '& .MuiInputLabel-root': {
                              color: 'rgba(233,236,245,0.7)',
                            },
                          }}
                        />
                      </Stack>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            )}

            {/* My Squares */}
            {mySquares.length > 0 && (
              <Card sx={{ ...glassyCard }}>
                <CardContent sx={{ py: 2.5, px: 2.5 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: '#e9ecf5',
                      fontWeight: 600,
                      fontSize: '1.125rem',
                      mb: 2,
                    }}
                    gutterBottom
                  >
                    My Squares
                  </Typography>
                  <List dense sx={{ py: 0 }}>
                    {mySquares.map((square, idx) => (
                      <ListItem
                        key={idx}
                        button
                        onClick={() => scrollToSquare(square.row, square.col)}
                        sx={{
                          py: 0.75,
                          px: 1.5,
                          borderRadius: 1,
                          mb: 0.5,
                          '&:hover': {
                            bgcolor: 'rgba(124,77,255,0.1)',
                          },
                        }}
                      >
                        <ListItemText
                          primary={
                            <Typography
                              variant="body2"
                              sx={{
                                color: '#e9ecf5',
                                fontSize: '0.8125rem',
                              }}
                            >
                              Row {square.row}, Col {square.col}
                            </Typography>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            )}

            {/* Quarter Winners */}
            <QuarterWinners game={game} quarterScores={quarterScores} claims={claims} />

            {/* How it Works */}
            <Card sx={{ ...glassyCard }}>
              <CardContent sx={{ py: 2.5, px: 2.5 }}>
                <Accordion
                  disableGutters
                  sx={{
                    bgcolor: 'transparent',
                    boxShadow: 'none',
                    '&:before': {
                      display: 'none',
                    },
                  }}
                >
                  <AccordionSummary
                    expandIcon={
                      <ExpandMoreIcon
                        sx={{
                          color: 'rgba(233,236,245,0.7)',
                        }}
                      />
                    }
                    sx={{
                      px: 0,
                      '& .MuiAccordionSummary-content': {
                        my: 0,
                      },
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        color: '#e9ecf5',
                        fontWeight: 600,
                        fontSize: '1.125rem',
                      }}
                    >
                      How it works
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ px: 0, pt: 1 }}>
                    <Stack component="ul" spacing={1} sx={{ pl: 2, m: 0, listStyle: 'none' }}>
                      <Box component="li" sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <Typography
                          component="span"
                          sx={{
                            color: '#e9ecf5',
                            fontSize: '0.875rem',
                            lineHeight: 1.6,
                            '&::before': {
                              content: '"•"',
                              color: 'rgba(124,77,255,0.7)',
                              fontWeight: 'bold',
                              display: 'inline-block',
                              width: '1em',
                              marginRight: '0.5em',
                            },
                          }}
                        >
                          Claim up to {MAX_SQUARES_PER_USER} squares before the board locks.
                        </Typography>
                      </Box>
                      <Box component="li" sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <Typography
                          component="span"
                          sx={{
                            color: '#e9ecf5',
                            fontSize: '0.875rem',
                            lineHeight: 1.6,
                            '&::before': {
                              content: '"•"',
                              color: 'rgba(124,77,255,0.7)',
                              fontWeight: 'bold',
                              display: 'inline-block',
                              width: '1em',
                              marginRight: '0.5em',
                            },
                          }}
                        >
                          Digits are randomly assigned to rows and columns when the board locks.
                        </Typography>
                      </Box>
                      <Box component="li" sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <Typography
                          component="span"
                          sx={{
                            color: '#e9ecf5',
                            fontSize: '0.875rem',
                            lineHeight: 1.6,
                            '&::before': {
                              content: '"•"',
                              color: 'rgba(124,77,255,0.7)',
                              fontWeight: 'bold',
                              display: 'inline-block',
                              width: '1em',
                              marginRight: '0.5em',
                            },
                          }}
                        >
                          Winners are determined by the last digit of each team's score at the end
                          of each quarter (Q1, Q2, Q3, Q4) and the final score.
                        </Typography>
                      </Box>
                    </Stack>
                  </AccordionDetails>
                </Accordion>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>

      {/* Lock Confirmation Dialog */}
      <Dialog
        open={lockDialogOpen}
        onClose={() => setLockDialogOpen(false)}
        PaperProps={{
          sx: {
            bgcolor: 'rgba(15,15,17,0.95)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#e9ecf5',
          },
        }}
      >
        <DialogTitle sx={{ color: '#e9ecf5', fontWeight: 600 }}>
          Lock Board & Generate Digits?
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'rgba(233,236,245,0.7)' }}>
            This will lock the board and randomly assign digits to rows and columns. This action
            cannot be undone. Are you sure?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setLockDialogOpen(false)}
            sx={{
              color: 'rgba(233,236,245,0.7)',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.05)',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleLockBoard}
            variant="contained"
            sx={{
              bgcolor: 'rgba(124,77,255,0.8)',
              color: '#fff',
              fontWeight: 600,
              '&:hover': {
                bgcolor: 'rgba(124,77,255,0.9)',
              },
            }}
          >
            Lock Board
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default SuperBowlSquares
