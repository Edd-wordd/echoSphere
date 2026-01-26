import React, { useState } from 'react'
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Collapse,
  Stack,
  LinearProgress,
  Link,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tabs,
  Tab,
} from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import AddIcon from '@mui/icons-material/Add'
import VisibilityIcon from '@mui/icons-material/Visibility'
import LockIcon from '@mui/icons-material/Lock'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import SportsIcon from '@mui/icons-material/Sports'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'
import { glassyCard } from '../../styles/adminStyles'

const currentWeekNumber = 3
const currentWeekLockCountdown = '2h 14m'
const currentWeekLockLabel = 'Sun 1:00 PM ET'

function formatUpdated(updatedAt) {
  if (!updatedAt) return '—'
  const d = typeof updatedAt === 'string' ? new Date(updatedAt) : updatedAt
  const now = new Date()
  const diffMs = now - d
  const diffM = Math.floor(diffMs / 60000)
  const diffH = Math.floor(diffMs / 3600000)
  const diffD = Math.floor(diffMs / 86400000)
  if (diffM < 60) return `${diffM}m`
  if (diffH < 24) return `${diffH}h`
  if (diffD === 1) return '1d'
  if (diffD < 7) return `${diffD}d`
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

const weeks = [
  {
    id: '1',
    weekNumber: 1,
    lockTime: '2024-09-05T13:00:00',
    lockTimeLabel: 'Sep 5, 2024 1:00 PM ET',
    status: 'FINALIZED',
    totalUsers: 14,
    playersSubmitted: 14,
    gamesTotal: 14,
    gamesFinal: 14,
    winner: { label: 'Alex', record: '12–4' },
    tieBreaker: { set: true, resolved: true, label: '49ers @ Rams' },
    updatedAt: new Date(Date.now() - 14 * 24 * 3600000),
  },
  {
    id: '2',
    weekNumber: 2,
    lockTime: '2024-09-12T13:00:00',
    lockTimeLabel: 'Sep 12, 2024 1:00 PM ET',
    status: 'FINALIZED',
    totalUsers: 14,
    playersSubmitted: 14,
    gamesTotal: 14,
    gamesFinal: 14,
    winner: { label: 'Jordan', record: '11–5' },
    tieBreaker: { set: true, resolved: true, label: 'Chiefs @ Bills' },
    updatedAt: new Date(Date.now() - 7 * 24 * 3600000),
  },
  {
    id: '3',
    weekNumber: 3,
    lockTime: '2024-09-19T13:00:00',
    lockTimeLabel: 'Sep 19, 2024 1:00 PM ET',
    status: 'OPEN',
    totalUsers: 14,
    playersSubmitted: 10,
    gamesTotal: 14,
    gamesFinal: 12,
    winner: null,
    tieBreaker: { set: true, resolved: false, label: '49ers @ Rams' },
    updatedAt: new Date(Date.now() - 2 * 3600000),
  },
  {
    id: '4',
    weekNumber: 4,
    lockTime: '2024-09-26T13:00:00',
    lockTimeLabel: 'Sep 26, 2024 1:00 PM ET',
    status: 'SCHEDULED',
    totalUsers: 14,
    playersSubmitted: 0,
    gamesTotal: 14,
    gamesFinal: 0,
    winner: null,
    tieBreaker: { set: false, resolved: false, label: null },
    updatedAt: null,
  },
  {
    id: '5',
    weekNumber: 5,
    lockTime: '2024-10-03T13:00:00',
    lockTimeLabel: 'Oct 3, 2024 1:00 PM ET',
    status: 'LOCKED',
    totalUsers: 14,
    playersSubmitted: 14,
    gamesTotal: 14,
    gamesFinal: 10,
    winner: null,
    tieBreaker: { set: true, resolved: false, label: 'Cowboys @ Eagles' },
    updatedAt: new Date(Date.now() - 24 * 3600000),
  },
]

const statusChipStyle = {
  SCHEDULED: { bg: 'rgba(255,255,255,0.08)', color: 'rgba(233,236,245,0.7)' },
  OPEN: { bg: 'rgba(0,200,83,0.15)', color: '#81c784' },
  LOCKED: { bg: 'rgba(255,152,0,0.15)', color: '#ffb74d' },
  FINALIZED: { bg: 'rgba(124,77,255,0.18)', color: '#b39ddb' },
}

function StatusChip({ status }) {
  const s = statusChipStyle[status] || statusChipStyle.SCHEDULED
  return (
    <Chip
      label={status}
      size="small"
      sx={{
        bgcolor: s.bg,
        color: s.color,
        fontWeight: 600,
        fontSize: '0.7rem',
        height: 20,
        px: 0.75,
        py: 0,
        borderRadius: 1,
        border: 'none',
        boxShadow: 'none',
        '& .MuiChip-label': {
          px: 0.5,
          py: 0,
        },
      }}
    />
  )
}

function TBIcon({ tieBreaker }) {
  const sx = { fontSize: 16, width: 16, height: 16 }
  if (tieBreaker?.resolved) return <CheckCircleIcon sx={{ ...sx, color: 'rgba(0,200,83,0.75)' }} titleAccess="Resolved" />
  if (tieBreaker?.set) return <CheckCircleIcon sx={{ ...sx, color: 'rgba(0,200,83,0.7)' }} titleAccess="Set" />
  return <WarningAmberIcon sx={{ ...sx, color: 'rgba(255,152,0,0.65)' }} titleAccess="Missing" />
}

function HealthCell({ row }) {
  const playersPct = row.totalUsers ? Math.round((row.playersSubmitted / row.totalUsers) * 100) : 0
  const gamesComplete = row.gamesTotal && row.gamesFinal >= row.gamesTotal
  return (
    <Stack spacing={0.5} sx={{ minWidth: 100 }}>
      <Box>
        <Typography variant="caption" sx={{ color: 'rgba(233,236,245,0.3)', fontSize: '0.65rem', lineHeight: 1.2 }}>Players </Typography>
        <Typography component="span" variant="body2" sx={{ color: '#e9ecf5', fontWeight: 600, fontSize: '0.8125rem', lineHeight: 1.3 }}>
          {row.playersSubmitted}/{row.totalUsers}
        </Typography>
        <Typography component="span" variant="caption" sx={{ color: 'rgba(233,236,245,0.35)', ml: 0.5, fontSize: '0.65rem' }}>
          ({playersPct}%)
        </Typography>
        <LinearProgress
          variant="determinate"
          value={playersPct}
          sx={{
            mt: 0.5,
            height: 2,
            borderRadius: 0.5,
            bgcolor: 'rgba(255,255,255,0.04)',
            '& .MuiLinearProgress-bar': { bgcolor: 'rgba(124,77,255,0.5)', borderRadius: 0.5 },
          }}
        />
      </Box>
      <Stack direction="row" alignItems="center" spacing={0.5}>
        <Typography variant="caption" sx={{ color: 'rgba(233,236,245,0.3)', fontSize: '0.65rem', lineHeight: 1.2 }}>Games </Typography>
        <Typography variant="body2" sx={{ color: '#e9ecf5', fontSize: '0.8125rem', fontWeight: 500, lineHeight: 1.3 }}>
          {row.gamesFinal}/{row.gamesTotal} Final
        </Typography>
        {!gamesComplete && row.gamesTotal > 0 && (
          <WarningAmberIcon sx={{ fontSize: 14, color: 'rgba(255,152,0,0.7)', ml: 0.25 }} titleAccess="Incomplete" />
        )}
      </Stack>
    </Stack>
  )
}

export default function WeeksManager() {
  const [expandedId, setExpandedId] = useState(null)
  const [filter, setFilter] = useState('all')
  const [menuAnchor, setMenuAnchor] = useState({ el: null, row: null })

  const filtered = weeks.filter((w) => (filter === 'all' ? true : w.status === filter))
  const currentWeek = weeks.find((w) => w.weekNumber === currentWeekNumber)

  const tbLabel = (tb) => {
    if (!tb) return '—'
    if (tb.resolved) return 'Resolved'
    if (tb.set) return 'Set'
    return 'Missing'
  }

  const handleTabChange = (event, newValue) => {
    setFilter(newValue)
  }

  return (
    <Box sx={{ color: '#e9ecf5', p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 800, mb: 0.5 }}>
            Weeks
          </Typography>
          <Tabs
            value={filter}
            onChange={handleTabChange}
            sx={{
              mt: 0.5,
              mb: 1.5,
              minHeight: 40,
              '& .MuiTabs-indicator': {
                height: 2,
                borderRadius: '2px 2px 0 0',
                bgcolor: 'rgba(124,77,255,0.8)',
                boxShadow: '0 0 8px rgba(124,77,255,0.4)',
              },
            }}
          >
            <Tab
              label="All"
              value="all"
              sx={{
                minHeight: 40,
                textTransform: 'none',
                fontSize: '0.875rem',
                fontWeight: filter === 'all' ? 600 : 500,
                color: filter === 'all' ? '#e9ecf5' : 'rgba(233,236,245,0.5)',
                '&:hover': {
                  color: 'rgba(233,236,245,0.8)',
                },
                transition: 'color 0.2s',
              }}
            />
            <Tab
              label="Open"
              value="OPEN"
              sx={{
                minHeight: 40,
                textTransform: 'none',
                fontSize: '0.875rem',
                fontWeight: filter === 'OPEN' ? 600 : 500,
                color: filter === 'OPEN' ? '#e9ecf5' : 'rgba(233,236,245,0.5)',
                '&:hover': {
                  color: 'rgba(233,236,245,0.8)',
                },
                transition: 'color 0.2s',
              }}
            />
            <Tab
              label="Locked"
              value="LOCKED"
              sx={{
                minHeight: 40,
                textTransform: 'none',
                fontSize: '0.875rem',
                fontWeight: filter === 'LOCKED' ? 600 : 500,
                color: filter === 'LOCKED' ? '#e9ecf5' : 'rgba(233,236,245,0.5)',
                '&:hover': {
                  color: 'rgba(233,236,245,0.8)',
                },
                transition: 'color 0.2s',
              }}
            />
            <Tab
              label="Finalized"
              value="FINALIZED"
              sx={{
                minHeight: 40,
                textTransform: 'none',
                fontSize: '0.875rem',
                fontWeight: filter === 'FINALIZED' ? 600 : 500,
                color: filter === 'FINALIZED' ? '#e9ecf5' : 'rgba(233,236,245,0.5)',
                '&:hover': {
                  color: 'rgba(233,236,245,0.8)',
                },
                transition: 'color 0.2s',
              }}
            />
          </Tabs>
          <Typography variant="body2" color="rgba(233,236,245,0.6)" sx={{ fontSize: '0.875rem' }}>
            Manage weeks, lock times, and status.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          disabled
          sx={{
            background: 'linear-gradient(120deg, #7c4dff, #00c853)',
            '&:hover': { background: 'linear-gradient(120deg, #6c3ff0, #00b84a)' },
            '&.Mui-disabled': { background: 'rgba(255,255,255,0.1)', color: 'rgba(233,236,245,0.5)' },
          }}
        >
          Create Week
        </Button>
      </Box>

      {currentWeek && (
        <Box
          sx={{
            mb: 4,
            p: 2.5,
            borderRadius: 2.5,
            bgcolor: 'rgba(15,15,17,0.7)',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          }}
        >
          <Typography variant="caption" sx={{ color: 'rgba(233,236,245,0.4)', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700, fontSize: '0.65rem' }}>
            Current Week
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2.5, mt: 1.5 }}>
            <Box sx={{ flex: 1, minWidth: 280 }}>
              <Typography variant="h5" sx={{ color: '#e9ecf5', fontWeight: 800, letterSpacing: '-0.01em', mb: 0.75 }}>
                Week {currentWeek.weekNumber} — {currentWeek.status}
              </Typography>
              <Typography variant="body2" color="rgba(233,236,245,0.7)" sx={{ mb: 0.75, fontSize: '0.875rem' }}>
                Locks in {currentWeekLockCountdown} ({currentWeekLockLabel})
              </Typography>
              <Typography variant="caption" color="rgba(233,236,245,0.45)" sx={{ display: 'block', fontSize: '0.75rem', lineHeight: 1.5 }}>
                Players: {currentWeek.playersSubmitted}/{currentWeek.totalUsers} • Games: {currentWeek.gamesFinal}/{currentWeek.gamesTotal} Final • TB: {tbLabel(currentWeek.tieBreaker)}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'flex-start' }}>
              <Button
                component={RouterLink}
                to="/admin/games"
                variant="contained"
                size="medium"
                startIcon={<SportsIcon />}
                sx={{
                  bgcolor: 'rgba(124,77,255,0.25)',
                  color: '#e9ecf5',
                  border: '1px solid rgba(124,77,255,0.3)',
                  fontWeight: 600,
                  '&:hover': {
                    bgcolor: 'rgba(124,77,255,0.35)',
                    borderColor: 'rgba(124,77,255,0.4)',
                  },
                }}
              >
                Go to Games
              </Button>
              <Button
                variant="outlined"
                size="medium"
                startIcon={<LockIcon />}
                disabled
                sx={{
                  borderColor: 'rgba(255,255,255,0.12)',
                  color: 'rgba(233,236,245,0.5)',
                  fontWeight: 500,
                  '&.Mui-disabled': { borderColor: 'rgba(255,255,255,0.06)', color: 'rgba(233,236,245,0.35)' },
                }}
              >
                Lock Week
              </Button>
            </Stack>
          </Box>
        </Box>
      )}

      <TableContainer component={Paper} sx={{ ...glassyCard, overflow: 'auto' }}>
        <Table size="small" sx={{ '& .MuiTableCell-root': { borderColor: 'rgba(255,255,255,0.05)' } }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: 48, py: 1, px: 2, color: 'rgba(233,236,245,0.3)', fontSize: '0.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', lineHeight: 1.2 }} />
              <TableCell sx={{ width: 100, py: 1, px: 2, color: 'rgba(233,236,245,0.3)', fontSize: '0.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', lineHeight: 1.2 }}>Status</TableCell>
              <TableCell sx={{ width: 80, py: 1, px: 2, color: 'rgba(233,236,245,0.3)', fontSize: '0.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', lineHeight: 1.2 }}>Week</TableCell>
              <TableCell sx={{ py: 1, px: 2, color: 'rgba(233,236,245,0.3)', fontSize: '0.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', lineHeight: 1.2 }}>Lock Time</TableCell>
              <TableCell sx={{ py: 1, px: 2, color: 'rgba(233,236,245,0.3)', fontSize: '0.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', lineHeight: 1.2 }}>Health</TableCell>
              <TableCell sx={{ py: 1, px: 2, color: 'rgba(233,236,245,0.3)', fontSize: '0.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', lineHeight: 1.2 }}>Winner</TableCell>
              <TableCell sx={{ width: 48, py: 1, px: 2, color: 'rgba(233,236,245,0.3)', fontSize: '0.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', lineHeight: 1.2 }}>TB</TableCell>
              <TableCell sx={{ width: 64, py: 1, px: 2, color: 'rgba(233,236,245,0.3)', fontSize: '0.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', lineHeight: 1.2 }}>Updated</TableCell>
              <TableCell sx={{ width: 48, py: 1, px: 2, color: 'rgba(233,236,245,0.3)', fontSize: '0.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', lineHeight: 1.2 }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((row) => {
              const isExpanded = expandedId === row.id
              const isCurrent = row.weekNumber === currentWeekNumber
              const gamesComplete = row.gamesTotal && row.gamesFinal >= row.gamesTotal
              const winnerLabel = row.status === 'FINALIZED' && row.winner
                ? (Array.isArray(row.winner)
                  ? `Tie: ${row.winner.map((w) => w.label).join(', ')} (${row.winner[0]?.record ?? '—'})`
                  : `${row.winner.label} (${row.winner.record})`)
                : null

              return (
                <React.Fragment key={row.id}>
                  <TableRow
                    hover
                    sx={{
                      bgcolor: isCurrent ? 'rgba(124,77,255,0.04)' : 'transparent',
                      transition: 'background-color 0.15s ease',
                      '&:hover': {
                        bgcolor: isCurrent ? 'rgba(124,77,255,0.08)' : 'rgba(124,77,255,0.03)',
                      },
                      '& td': {
                        py: 1.25,
                        px: 2,
                        verticalAlign: 'middle',
                        borderBottom: '1px solid rgba(255,255,255,0.04)',
                        lineHeight: 1.3,
                      },
                    }}
                  >
                    <TableCell sx={{ width: 48 }}>
                      <IconButton
                        size="small"
                        onClick={() => setExpandedId(isExpanded ? null : row.id)}
                        sx={{
                          color: 'rgba(233,236,245,0.4)',
                          padding: 0.5,
                          '&:hover': { color: 'rgba(233,236,245,0.7)', bgcolor: 'rgba(255,255,255,0.04)' },
                        }}
                      >
                        {isExpanded ? <ExpandLessIcon sx={{ fontSize: 16 }} /> : <ExpandMoreIcon sx={{ fontSize: 16 }} />}
                      </IconButton>
                    </TableCell>
                    <TableCell sx={{ width: 100 }}>
                      <StatusChip status={row.status} />
                    </TableCell>
                    <TableCell sx={{ width: 80 }}>
                      <Typography sx={{ color: '#e9ecf5', fontWeight: isCurrent ? 700 : 600, fontSize: '0.875rem', lineHeight: 1.3 }}>
                        {row.weekNumber}
                        {isCurrent && (
                          <Typography component="span" variant="caption" sx={{ ml: 0.75, color: 'rgba(124,77,255,0.8)', fontWeight: 600, fontSize: '0.65rem' }}>
                            Current
                          </Typography>
                        )}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ color: 'rgba(233,236,245,0.55)', fontSize: '0.75rem', lineHeight: 1.3 }}>{row.lockTimeLabel}</TableCell>
                    <TableCell>
                      <HealthCell row={row} />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: winnerLabel ? 'rgba(233,236,245,0.45)' : 'rgba(233,236,245,0.3)', fontSize: '0.7rem', lineHeight: 1.3 }}>
                        {winnerLabel ?? '—'}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      <TBIcon tieBreaker={row.tieBreaker} />
                    </TableCell>
                    <TableCell sx={{ color: 'rgba(233,236,245,0.35)', fontSize: '0.7rem', lineHeight: 1.3 }}>
                      {formatUpdated(row.updatedAt)}
                    </TableCell>
                    <TableCell>
                      <ActionsMenu row={row} menuAnchor={menuAnchor} setMenuAnchor={setMenuAnchor} />
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ '& > td': { py: 0, borderBottom: '1px solid rgba(255,255,255,0.04)' } }}>
                    <TableCell colSpan={9} sx={{ p: 0 }}>
                      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                        <WeekSummaryRow row={row} winnerLabel={winnerLabel} gamesComplete={gamesComplete} />
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Typography variant="caption" color="rgba(233,236,245,0.35)" sx={{ display: 'block', mt: 2, fontSize: '0.7rem' }}>
        Backend wiring coming soon. Actions are disabled.
      </Typography>
    </Box>
  )
}

function ActionsMenu({ row, menuAnchor, setMenuAnchor }) {
  const open = Boolean(menuAnchor.el) && menuAnchor.row?.id === row.id
  const handleOpen = (e) => {
    e.stopPropagation()
    setMenuAnchor({ el: e.currentTarget, row })
  }
  const handleClose = () => setMenuAnchor({ el: null, row: null })

  const item = (icon, label, disabled = true) => (
    <MenuItem key={label} disabled={disabled} onClick={handleClose} sx={{ color: 'rgba(233,236,245,0.85)' }}>
      <ListItemIcon sx={{ color: 'inherit', minWidth: 32 }}>{icon}</ListItemIcon>
      <ListItemText primary={label} primaryTypographyProps={{ fontSize: '0.85rem' }} />
    </MenuItem>
  )

  let menuItems = []
  if (row.status === 'SCHEDULED') {
    menuItems = [
      item(<EditIcon fontSize="small" />, 'Edit'),
      item(<DeleteIcon fontSize="small" />, 'Delete'),
    ]
  } else if (row.status === 'OPEN') {
    menuItems = [
      item(<VisibilityIcon fontSize="small" />, 'View'),
      item(<LockIcon fontSize="small" />, 'Lock Week'),
      item(<NotificationsActiveIcon fontSize="small" />, 'Send Reminders'),
    ]
  } else if (row.status === 'LOCKED') {
    menuItems = [
      item(<VisibilityIcon fontSize="small" />, 'View Summary'),
      item(<SportsIcon fontSize="small" />, 'Manage Games'),
      item(<CheckCircleIcon fontSize="small" />, 'Finalize Week'),
      item(<RestartAltIcon fontSize="small" />, 'Recalculate'),
    ]
  } else if (row.status === 'FINALIZED') {
    menuItems = [
      item(<VisibilityIcon fontSize="small" />, 'View Summary'),
      item(<RestartAltIcon fontSize="small" />, 'Recalculate'),
    ]
  }

  return (
    <>
      <IconButton
        size="small"
        onClick={handleOpen}
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
        onClose={handleClose}
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

function WeekSummaryRow({ row, winnerLabel, gamesComplete }) {
  const tb = row.tieBreaker
  const tbText = tb?.resolved ? 'Resolved' : tb?.set ? 'Set' : 'Missing'
  return (
    <Box sx={{ px: 3, py: 2.5, bgcolor: 'rgba(0,0,0,0.12)', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
      <Typography variant="caption" sx={{ color: 'rgba(233,236,245,0.35)', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, mb: 2, display: 'block', fontSize: '0.625rem' }}>
        Week {row.weekNumber} summary
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2.5 }}>
        <Box>
          <Typography variant="caption" color="rgba(233,236,245,0.4)" sx={{ fontSize: '0.7rem' }}>Lock time</Typography>
          <Typography variant="body2" sx={{ color: 'rgba(233,236,245,0.8)', mt: 0.5, fontSize: '0.875rem' }}>{row.lockTimeLabel}</Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="rgba(233,236,245,0.4)" sx={{ fontSize: '0.7rem' }}>Players</Typography>
          <Typography variant="body2" sx={{ color: 'rgba(233,236,245,0.8)', mt: 0.5, fontSize: '0.875rem' }}>{row.playersSubmitted} / {row.totalUsers}</Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="rgba(233,236,245,0.4)" sx={{ fontSize: '0.7rem' }}>Games</Typography>
          <Typography variant="body2" sx={{ color: 'rgba(233,236,245,0.8)', mt: 0.5, fontSize: '0.875rem' }}>
            {row.gamesFinal} / {row.gamesTotal} Final
            {!gamesComplete && <WarningAmberIcon sx={{ fontSize: 16, color: 'rgba(255,152,0,0.8)', verticalAlign: 'middle', ml: 0.5 }} />}
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="rgba(233,236,245,0.4)" sx={{ fontSize: '0.7rem' }}>Winner</Typography>
          <Typography variant="body2" sx={{ color: 'rgba(233,236,245,0.8)', mt: 0.5, fontSize: '0.875rem' }}>{winnerLabel ?? '—'}</Typography>
        </Box>
      </Box>
      <Box sx={{ mt: 2 }}>
        <Typography variant="caption" color="rgba(233,236,245,0.4)" sx={{ fontSize: '0.7rem' }}>Tie-breaker</Typography>
        <Typography variant="body2" sx={{ color: 'rgba(233,236,245,0.8)', mt: 0.5, fontSize: '0.875rem' }}>{tb?.label ?? '—'} · {tbText}</Typography>
      </Box>
      <Box sx={{ mt: 2 }}>
        <Typography variant="caption" color="rgba(233,236,245,0.4)" sx={{ fontSize: '0.7rem' }}>Notes</Typography>
        <Typography variant="body2" sx={{ color: 'rgba(233,236,245,0.4)', fontStyle: 'italic', mt: 0.5, fontSize: '0.875rem' }}>—</Typography>
      </Box>
      <Stack direction="row" flexWrap="wrap" gap={1.5} sx={{ mt: 2.5 }}>
        <Link component={RouterLink} to="/admin/games" underline="hover" sx={{ color: 'rgba(124,77,255,0.85)', fontWeight: 600, fontSize: '0.8125rem' }}>View Games</Link>
        <Link component={RouterLink} to="/dashboard" underline="hover" sx={{ color: 'rgba(124,77,255,0.85)', fontWeight: 600, fontSize: '0.8125rem' }}>View Leaderboard</Link>
      </Stack>
    </Box>
  )
}
