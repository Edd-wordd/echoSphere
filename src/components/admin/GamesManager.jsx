import React, { useState } from 'react'
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  IconButton,
  Stack,
  Grid,
  Card,
  CardContent,
  Menu,
  MenuItem as MuiMenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import FlagIcon from '@mui/icons-material/Flag'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import SportsScoreIcon from '@mui/icons-material/SportsScore'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { glassyCard } from '../../styles/adminStyles'

const mockWeeks = [1, 2, 3, 4]
const currentWeek = 3

const mockGames = [
  {
    id: '1',
    matchup: 'Chiefs @ Bills',
    startTime: '2024-09-19 18:25 ET',
    status: 'FINAL',
    score: '20–17',
    winner: 'Chiefs',
    impact: 12,
    updatedAt: new Date(Date.now() - 2 * 3600000),
    quarter: null,
    currentScore: null,
  },
  {
    id: '2',
    matchup: 'Eagles @ Cowboys',
    startTime: '2024-09-19 20:25 ET',
    status: 'LIVE',
    score: '28–24',
    winner: null,
    impact: 14,
    updatedAt: new Date(Date.now() - 5 * 60000),
    quarter: 'Q4',
    currentScore: '28–24',
  },
  {
    id: '3',
    matchup: 'Packers @ Bears',
    startTime: '2024-09-20 00:15 ET',
    status: 'FINAL',
    score: '31–14',
    winner: 'Packers',
    impact: 11,
    updatedAt: new Date(Date.now() - 4 * 3600000),
    quarter: null,
    currentScore: null,
  },
  {
    id: '4',
    matchup: '49ers @ Rams',
    startTime: '2024-09-21 00:20 ET',
    status: 'MISSING',
    score: '—',
    winner: '—',
    impact: 13,
    updatedAt: null,
    quarter: null,
    currentScore: null,
  },
  {
    id: '5',
    matchup: 'Dolphins @ Jets',
    startTime: '2024-09-19 13:00 ET',
    status: 'FINAL',
    score: '24–10',
    winner: 'Dolphins',
    impact: 9,
    updatedAt: new Date(Date.now() - 6 * 3600000),
    quarter: null,
    currentScore: null,
  },
  {
    id: '6',
    matchup: 'Ravens @ Steelers',
    startTime: '2024-09-19 16:00 ET',
    status: 'FINAL',
    score: '17–14',
    winner: 'Ravens',
    impact: 10,
    updatedAt: new Date(Date.now() - 5 * 3600000),
    quarter: null,
    currentScore: null,
  },
  {
    id: '7',
    matchup: 'Bengals @ Browns',
    startTime: '2024-09-19 13:00 ET',
    status: 'FINAL',
    score: '21–7',
    winner: 'Bengals',
    impact: 8,
    updatedAt: new Date(Date.now() - 6 * 3600000),
    quarter: null,
    currentScore: null,
  },
  {
    id: '8',
    matchup: 'Titans @ Colts',
    startTime: '2024-09-19 13:00 ET',
    status: 'FINAL',
    score: '27–20',
    winner: 'Titans',
    impact: 7,
    updatedAt: new Date(Date.now() - 6 * 3600000),
    quarter: null,
    currentScore: null,
  },
  {
    id: '9',
    matchup: 'Patriots @ Dolphins',
    startTime: '2024-09-19 13:00 ET',
    status: 'FINAL',
    score: '14–10',
    winner: 'Patriots',
    impact: 6,
    updatedAt: new Date(Date.now() - 6 * 3600000),
    quarter: null,
    currentScore: null,
  },
  {
    id: '10',
    matchup: 'Falcons @ Saints',
    startTime: '2024-09-19 13:00 ET',
    status: 'FINAL',
    score: '30–17',
    winner: 'Falcons',
    impact: 5,
    updatedAt: new Date(Date.now() - 6 * 3600000),
    quarter: null,
    currentScore: null,
  },
  {
    id: '11',
    matchup: 'Panthers @ Buccaneers',
    startTime: '2024-09-19 13:00 ET',
    status: 'FINAL',
    score: '17–13',
    winner: 'Panthers',
    impact: 4,
    updatedAt: new Date(Date.now() - 6 * 3600000),
    quarter: null,
    currentScore: null,
  },
  {
    id: '12',
    matchup: 'Cardinals @ Seahawks',
    startTime: '2024-09-19 16:05 ET',
    status: 'FINAL',
    score: '28–21',
    winner: 'Cardinals',
    impact: 3,
    updatedAt: new Date(Date.now() - 5 * 3600000),
    quarter: null,
    currentScore: null,
  },
  {
    id: '13',
    matchup: 'Giants @ Commanders',
    startTime: '2024-09-19 13:00 ET',
    status: 'FINAL',
    score: '24–14',
    winner: 'Giants',
    impact: 2,
    updatedAt: new Date(Date.now() - 6 * 3600000),
    quarter: null,
    currentScore: null,
  },
  {
    id: '14',
    matchup: 'Lions @ Vikings',
    startTime: '2024-09-19 13:00 ET',
    status: 'FINAL',
    score: '35–28',
    winner: 'Lions',
    impact: 1,
    updatedAt: new Date(Date.now() - 6 * 3600000),
    quarter: null,
    currentScore: null,
  },
]

function formatUpdated(updatedAt) {
  if (!updatedAt) return '—'
  const d = typeof updatedAt === 'string' ? new Date(updatedAt) : updatedAt
  const now = new Date()
  const diffMs = now - d
  const diffM = Math.floor(diffMs / 60000)
  const diffH = Math.floor(diffMs / 3600000)
  if (diffM < 60) return `${diffM}m`
  if (diffH < 24) return `${diffH}h`
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export default function GamesManager() {
  const [week, setWeek] = useState(currentWeek)
  const [menuAnchor, setMenuAnchor] = useState({ el: null, game: null })

  const weekGames = mockGames
  const liveGames = weekGames.filter((g) => g.status === 'LIVE')
  const missingGames = weekGames.filter((g) => g.status === 'MISSING')
  const finalGames = weekGames.filter((g) => g.status === 'FINAL')
  const totalGames = weekGames.length

  const weekStatus = (() => {
    if (missingGames.length > 0) return { label: 'Blocked', color: '#ff8a80', bg: 'rgba(255,82,82,0.1)' }
    if (liveGames.length > 0) return { label: 'In Progress', color: '#ffb74d', bg: 'rgba(255,152,0,0.1)' }
    return { label: 'Ready', color: '#81c784', bg: 'rgba(0,200,83,0.1)' }
  })()

  const standingsReady = missingGames.length === 0 && liveGames.length === 0

  const handleMenuOpen = (e, game) => {
    e.stopPropagation()
    setMenuAnchor({ el: e.currentTarget, game })
  }
  const handleMenuClose = () => setMenuAnchor({ el: null, game: null })

  return (
    <Box sx={{ color: '#e9ecf5', p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 800 }}>
            Games
          </Typography>
          <Typography variant="body2" color="rgba(233,236,245,0.6)" sx={{ fontSize: '0.875rem' }}>
            Week operations command center — manage matchups, scores, and winners.
          </Typography>
        </Box>
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel id="week-select-label" sx={{ color: 'rgba(233,236,245,0.7)' }}>Week</InputLabel>
          <Select
            labelId="week-select-label"
            value={week}
            label="Week"
            onChange={(e) => setWeek(Number(e.target.value))}
            MenuProps={{ PaperProps: { sx: { backgroundColor: 'rgba(15,15,17,0.98)', color: '#e9ecf5', border: '1px solid rgba(255,255,255,0.08)' } } }}
            sx={{ color: '#e9ecf5', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' } }}
          >
            {mockWeeks.map((w) => (
              <MenuItem key={w} value={w}>
                Week {w}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Week Status Bar */}
      <Box
        sx={{
          mb: 3,
          p: 2,
          borderRadius: 2,
          bgcolor: weekStatus.bg,
          border: `1px solid ${weekStatus.color}40`,
        }}
      >
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ color: '#e9ecf5', fontWeight: 700, mb: 0.5 }}>
              Week {week} — {weekStatus.label}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(233,236,245,0.7)', fontSize: '0.875rem' }}>
              {finalGames.length} / {totalGames} games final — {liveGames.length} live — {missingGames.length} missing result
              {missingGames.length !== 1 ? 's' : ''}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Standings Readiness Banner */}
      {!standingsReady && (
        <Box
          sx={{
            mb: 3,
            p: 1.5,
            borderRadius: 1.5,
            bgcolor: 'rgba(255,82,82,0.08)',
            border: '1px solid rgba(255,82,82,0.2)',
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <WarningAmberIcon sx={{ fontSize: 20, color: '#ff8a80' }} />
            <Typography variant="body2" sx={{ color: '#e9ecf5', fontWeight: 500 }}>
              Standings cannot be finalized until all games are complete.
            </Typography>
          </Stack>
        </Box>
      )}
      {standingsReady && (
        <Box
          sx={{
            mb: 3,
            p: 1.5,
            borderRadius: 1.5,
            bgcolor: 'rgba(0,200,83,0.08)',
            border: '1px solid rgba(0,200,83,0.2)',
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <CheckCircleIcon sx={{ fontSize: 20, color: '#81c784' }} />
            <Typography variant="body2" sx={{ color: '#e9ecf5', fontWeight: 500 }}>
              All games final — you may finalize the week.
            </Typography>
          </Stack>
        </Box>
      )}

      {/* Week Health Summary */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <Card sx={{ ...glassyCard, height: '100%' }}>
            <CardContent sx={{ py: 1.5, px: 2 }}>
              <Typography variant="caption" sx={{ color: 'rgba(233,236,245,0.5)', fontSize: '0.7rem' }}>Total Games</Typography>
              <Typography variant="h6" sx={{ color: '#e9ecf5', fontWeight: 700, mt: 0.5 }}>
                {totalGames}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card sx={{ ...glassyCard, height: '100%' }}>
            <CardContent sx={{ py: 1.5, px: 2 }}>
              <Typography variant="caption" sx={{ color: 'rgba(233,236,245,0.5)', fontSize: '0.7rem' }}>Final</Typography>
              <Typography variant="h6" sx={{ color: '#81c784', fontWeight: 700, mt: 0.5 }}>
                {finalGames.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card sx={{ ...glassyCard, height: '100%' }}>
            <CardContent sx={{ py: 1.5, px: 2 }}>
              <Typography variant="caption" sx={{ color: 'rgba(233,236,245,0.5)', fontSize: '0.7rem' }}>Live</Typography>
              <Typography variant="h6" sx={{ color: '#64b5f6', fontWeight: 700, mt: 0.5 }}>
                {liveGames.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card sx={{ ...glassyCard, height: '100%' }}>
            <CardContent sx={{ py: 1.5, px: 2 }}>
              <Typography variant="caption" sx={{ color: 'rgba(233,236,245,0.5)', fontSize: '0.7rem' }}>Missing</Typography>
              <Typography variant="h6" sx={{ color: missingGames.length > 0 ? '#ff8a80' : '#81c784', fontWeight: 700, mt: 0.5 }}>
                {missingGames.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Standings Status Card */}
      <Box sx={{ mb: 3 }}>
        <Card sx={{ ...glassyCard }}>
          <CardContent sx={{ py: 1.5, px: 2 }}>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Typography variant="body2" sx={{ color: 'rgba(233,236,245,0.6)', fontSize: '0.8rem' }}>Standings:</Typography>
              <Chip
                label={standingsReady ? 'Ready' : 'Blocked'}
                size="small"
                sx={{
                  bgcolor: standingsReady ? 'rgba(0,200,83,0.2)' : 'rgba(255,82,82,0.2)',
                  color: standingsReady ? '#81c784' : '#ff8a80',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  height: 22,
                }}
              />
            </Stack>
          </CardContent>
        </Card>
      </Box>

      {/* Live Games Section */}
      {liveGames.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ color: '#e9ecf5', fontWeight: 700, mb: 1.5, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Live Games
          </Typography>
          <Stack spacing={1.5}>
            {liveGames.map((game) => (
              <Card key={game.id} sx={{ ...glassyCard, borderLeft: '3px solid #64b5f6' }}>
                <CardContent sx={{ py: 1.5, px: 2 }}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                    <Box sx={{ flex: 1, minWidth: 200 }}>
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                        <RadioButtonCheckedIcon sx={{ fontSize: 14, color: '#ff5252' }} />
                        <Chip label="LIVE" size="small" sx={{ bgcolor: 'rgba(255,82,82,0.2)', color: '#ff5252', fontWeight: 700, fontSize: '0.65rem', height: 20 }} />
                      </Stack>
                      <Typography variant="body1" sx={{ color: '#e9ecf5', fontWeight: 600, mb: 0.25 }}>
                        {game.matchup}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(233,236,245,0.7)', fontSize: '0.875rem' }}>
                        {game.currentScore} · {game.quarter}
                      </Typography>
                    </Box>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<SportsScoreIcon />}
                      disabled
                      sx={{
                        borderColor: 'rgba(255,255,255,0.15)',
                        color: 'rgba(233,236,245,0.6)',
                        '&.Mui-disabled': { borderColor: 'rgba(255,255,255,0.08)', color: 'rgba(233,236,245,0.4)' },
                      }}
                    >
                      Update Score
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Box>
      )}

      {/* Needs Attention Section */}
      {missingGames.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ color: '#e9ecf5', fontWeight: 700, mb: 1.5, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Needs Attention
          </Typography>
          <Stack spacing={1.5}>
            {missingGames.map((game) => (
              <Card key={game.id} sx={{ ...glassyCard, borderLeft: '3px solid #ffb74d' }}>
                <CardContent sx={{ py: 1.5, px: 2 }}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                    <Box sx={{ flex: 1, minWidth: 200 }}>
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                        <WarningAmberIcon sx={{ fontSize: 16, color: '#ffb74d' }} />
                        <Typography variant="body2" sx={{ color: 'rgba(233,236,245,0.7)', fontSize: '0.8rem' }}>
                          Missing final score
                        </Typography>
                      </Stack>
                      <Typography variant="body1" sx={{ color: '#e9ecf5', fontWeight: 600 }}>
                        {game.matchup}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(233,236,245,0.5)', fontSize: '0.75rem' }}>
                        Started: {game.startTime}
                      </Typography>
                    </Box>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<SportsScoreIcon />}
                      disabled
                      sx={{
                        borderColor: 'rgba(255,255,255,0.15)',
                        color: 'rgba(233,236,245,0.6)',
                        '&.Mui-disabled': { borderColor: 'rgba(255,255,255,0.08)', color: 'rgba(233,236,245,0.4)' },
                      }}
                    >
                      Enter Score
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Box>
      )}

      {/* All Games Table */}
      <Box sx={{ mb: 1.5 }}>
        <Typography variant="subtitle1" sx={{ color: '#e9ecf5', fontWeight: 700, mb: 1.5, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          All Games
        </Typography>
      </Box>
      <TableContainer component={Paper} sx={{ ...glassyCard, overflow: 'auto' }}>
        <Table size="small" sx={{ '& .MuiTableCell-root': { borderColor: 'rgba(255,255,255,0.05)' } }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ py: 1, px: 2, color: 'rgba(233,236,245,0.3)', fontSize: '0.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em' }} />
              <TableCell sx={{ py: 1, px: 2, color: 'rgba(233,236,245,0.3)', fontSize: '0.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Matchup</TableCell>
              <TableCell sx={{ py: 1, px: 2, color: 'rgba(233,236,245,0.3)', fontSize: '0.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Start</TableCell>
              <TableCell sx={{ py: 1, px: 2, color: 'rgba(233,236,245,0.3)', fontSize: '0.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Status</TableCell>
              <TableCell sx={{ py: 1, px: 2, color: 'rgba(233,236,245,0.3)', fontSize: '0.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Score</TableCell>
              <TableCell sx={{ py: 1, px: 2, color: 'rgba(233,236,245,0.3)', fontSize: '0.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Winner</TableCell>
              <TableCell sx={{ py: 1, px: 2, color: 'rgba(233,236,245,0.3)', fontSize: '0.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Impact</TableCell>
              <TableCell sx={{ py: 1, px: 2, color: 'rgba(233,236,245,0.3)', fontSize: '0.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Updated</TableCell>
              <TableCell sx={{ width: 48, py: 1, px: 2, color: 'rgba(233,236,245,0.3)', fontSize: '0.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em' }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {weekGames.map((row) => {
              const isLive = row.status === 'LIVE'
              const isMissing = row.status === 'MISSING'
              const isFinal = row.status === 'FINAL'
              const menuOpen = Boolean(menuAnchor.el) && menuAnchor.game?.id === row.id

              return (
                <TableRow
                  key={row.id}
                  hover
                  sx={{
                    transition: 'background-color 0.15s ease',
                    '&:hover': { bgcolor: 'rgba(124,77,255,0.03)' },
                    '& td': {
                      py: 1.25,
                      px: 2,
                      verticalAlign: 'middle',
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                      lineHeight: 1.3,
                    },
                    ...(isLive && { bgcolor: 'rgba(33,150,243,0.04)', borderLeft: '2px solid #64b5f6' }),
                    ...(isMissing && { bgcolor: 'rgba(255,152,0,0.04)', borderLeft: '2px solid #ffb74d' }),
                  }}
                >
                  <TableCell sx={{ width: 40 }}>
                    {isFinal && <CheckCircleIcon sx={{ fontSize: 16, color: 'rgba(0,200,83,0.8)' }} />}
                    {isLive && <RadioButtonCheckedIcon sx={{ fontSize: 14, color: '#ff5252' }} />}
                    {isMissing && <WarningAmberIcon sx={{ fontSize: 16, color: '#ffb74d' }} />}
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ color: '#e9ecf5', fontWeight: 600, fontSize: '0.875rem' }}>{row.matchup}</Typography>
                  </TableCell>
                  <TableCell sx={{ color: 'rgba(233,236,245,0.6)', fontSize: '0.75rem' }}>{row.startTime}</TableCell>
                  <TableCell>
                    <Chip
                      label={row.status}
                      size="small"
                      sx={{
                        bgcolor:
                          row.status === 'FINAL'
                            ? 'rgba(0,200,83,0.15)'
                            : row.status === 'LIVE'
                              ? 'rgba(33,150,243,0.15)'
                              : row.status === 'MISSING'
                                ? 'rgba(255,152,0,0.15)'
                                : 'rgba(255,255,255,0.08)',
                        color:
                          row.status === 'FINAL'
                            ? '#81c784'
                            : row.status === 'LIVE'
                              ? '#64b5f6'
                              : row.status === 'MISSING'
                                ? '#ffb74d'
                                : 'rgba(233,236,245,0.7)',
                        fontWeight: 600,
                        fontSize: '0.7rem',
                        height: 20,
                        px: 0.75,
                        py: 0,
                        borderRadius: 1,
                        border: 'none',
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ color: '#e9ecf5', fontSize: '0.8125rem', fontWeight: 500 }}>{row.score}</TableCell>
                  <TableCell sx={{ color: 'rgba(233,236,245,0.7)', fontSize: '0.75rem' }}>{row.winner}</TableCell>
                  <TableCell sx={{ color: 'rgba(233,236,245,0.6)', fontSize: '0.75rem' }}>{row.impact} picks</TableCell>
                  <TableCell sx={{ color: 'rgba(233,236,245,0.4)', fontSize: '0.7rem' }}>{formatUpdated(row.updatedAt)}</TableCell>
                  <TableCell>
                    <GameActionsMenu game={row} menuAnchor={menuAnchor} onOpen={handleMenuOpen} onClose={handleMenuClose} />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Typography variant="caption" color="rgba(233,236,245,0.35)" sx={{ display: 'block', mt: 1.5, fontSize: '0.7rem' }}>
        Backend wiring coming soon. Actions are disabled.
      </Typography>
    </Box>
  )
}

function GameActionsMenu({ game, menuAnchor, onOpen, onClose }) {
  const open = Boolean(menuAnchor.el) && menuAnchor.game?.id === game.id

  const item = (icon, label, disabled = true) => (
    <MuiMenuItem key={label} disabled={disabled} onClick={onClose} sx={{ color: 'rgba(233,236,245,0.85)' }}>
      <ListItemIcon sx={{ color: 'inherit', minWidth: 32 }}>{icon}</ListItemIcon>
      <ListItemText primary={label} primaryTypographyProps={{ fontSize: '0.85rem' }} />
    </MuiMenuItem>
  )

  let menuItems = []
  if (game.status === 'MISSING') {
    menuItems = [item(<SportsScoreIcon fontSize="small" />, 'Enter Score')]
  } else if (game.status === 'LIVE') {
    menuItems = [item(<SportsScoreIcon fontSize="small" />, 'Update Score'), item(<FlagIcon fontSize="small" />, 'Mark Final')]
  } else if (game.status === 'FINAL') {
    menuItems = [item(<EditIcon fontSize="small" />, 'Edit'), item(<VisibilityIcon fontSize="small" />, 'View Picks Impact')]
  } else {
    menuItems = [item(<EditIcon fontSize="small" />, 'Edit'), item(<FlagIcon fontSize="small" />, 'Mark Final')]
  }

  return (
    <>
      <IconButton
        size="small"
        onClick={(e) => onOpen(e, game)}
        sx={{
          color: 'rgba(233,236,245,0.4)',
          padding: 0.5,
          '&:hover': { color: 'rgba(233,236,245,0.7)', bgcolor: 'rgba(255,255,255,0.04)' },
        }}
        aria-label="Actions"
      >
        <MoreVertIcon sx={{ fontSize: 16 }} />
      </IconButton>
      <Menu
        anchorEl={menuAnchor.el}
        open={open}
        onClose={onClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            bgcolor: 'rgba(18,18,22,0.98)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 1.5,
            minWidth: 160,
          },
        }}
      >
        {menuItems}
      </Menu>
    </>
  )
}
