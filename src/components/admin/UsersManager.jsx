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
  Button,
  Grid,
  Card,
  CardContent,
  Stack,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tabs,
  Tab,
  Avatar,
} from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import EditIcon from '@mui/icons-material/Edit'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import NotificationsIcon from '@mui/icons-material/Notifications'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import PersonOffIcon from '@mui/icons-material/PersonOff'
import PersonIcon from '@mui/icons-material/Person'
import { glassyCard } from '../../styles/adminStyles'

const mockUsers = [
  {
    id: '1',
    name: 'Alex',
    role: 'Admin',
    picksThisWeek: 14,
    totalPicksThisWeek: 14,
    totalWins: 20,
    totalGames: 28,
    status: 'Active',
    reliability: 'Good',
    rank: 1,
    lastActive: new Date(Date.now() - 30 * 60000),
    lastPick: new Date(Date.now() - 2 * 3600000),
  },
  {
    id: '2',
    name: 'Jordan',
    role: 'User',
    picksThisWeek: 14,
    totalPicksThisWeek: 14,
    totalWins: 18,
    totalGames: 28,
    status: 'Active',
    reliability: 'Good',
    rank: 2,
    lastActive: new Date(Date.now() - 2 * 3600000),
    lastPick: new Date(Date.now() - 3 * 3600000),
  },
  {
    id: '3',
    name: 'Sam',
    role: 'User',
    picksThisWeek: 10,
    totalPicksThisWeek: 14,
    totalWins: 17,
    totalGames: 28,
    status: 'Active',
    reliability: 'At Risk',
    rank: 3,
    lastActive: new Date(Date.now() - 6 * 3600000),
    lastPick: new Date(Date.now() - 1 * 86400000),
  },
  {
    id: '4',
    name: 'Taylor',
    role: 'User',
    picksThisWeek: 0,
    totalPicksThisWeek: 14,
    totalWins: 16,
    totalGames: 28,
    status: 'Active',
    reliability: 'At Risk',
    rank: 4,
    lastActive: new Date(Date.now() - 3 * 86400000),
    lastPick: null,
  },
  {
    id: '5',
    name: 'Chris',
    role: 'User',
    picksThisWeek: 14,
    totalPicksThisWeek: 14,
    totalWins: 15,
    totalGames: 28,
    status: 'Disabled',
    reliability: 'Inactive',
    rank: 5,
    lastActive: new Date(Date.now() - 14 * 86400000),
    lastPick: new Date(Date.now() - 14 * 86400000),
  },
  {
    id: '6',
    name: 'Jamie',
    role: 'User',
    picksThisWeek: 12,
    totalPicksThisWeek: 14,
    totalWins: 14,
    totalGames: 28,
    status: 'Active',
    reliability: 'At Risk',
    rank: 6,
    lastActive: new Date(Date.now() - 12 * 3600000),
    lastPick: new Date(Date.now() - 1 * 86400000),
  },
  {
    id: '7',
    name: 'Pat',
    role: 'User',
    picksThisWeek: 14,
    totalPicksThisWeek: 14,
    totalWins: 13,
    totalGames: 28,
    status: 'Active',
    reliability: 'Good',
    rank: 7,
    lastActive: new Date(Date.now() - 1 * 3600000),
    lastPick: new Date(Date.now() - 2 * 3600000),
  },
  {
    id: '8',
    name: 'Morgan',
    role: 'User',
    picksThisWeek: 14,
    totalPicksThisWeek: 14,
    totalWins: 12,
    totalGames: 28,
    status: 'Active',
    reliability: 'Good',
    rank: 8,
    lastActive: new Date(Date.now() - 4 * 3600000),
    lastPick: new Date(Date.now() - 5 * 3600000),
  },
  {
    id: '9',
    name: 'Riley',
    role: 'User',
    picksThisWeek: 8,
    totalPicksThisWeek: 14,
    totalWins: 11,
    totalGames: 28,
    status: 'Active',
    reliability: 'At Risk',
    rank: 9,
    lastActive: new Date(Date.now() - 2 * 86400000),
    lastPick: new Date(Date.now() - 2 * 86400000),
  },
  {
    id: '10',
    name: 'Casey',
    role: 'User',
    picksThisWeek: 14,
    totalPicksThisWeek: 14,
    totalWins: 10,
    totalGames: 28,
    status: 'Active',
    reliability: 'Good',
    rank: 10,
    lastActive: new Date(Date.now() - 3 * 3600000),
    lastPick: new Date(Date.now() - 4 * 3600000),
  },
  {
    id: '11',
    name: 'Drew',
    role: 'User',
    picksThisWeek: 14,
    totalPicksThisWeek: 14,
    totalWins: 9,
    totalGames: 28,
    status: 'Active',
    reliability: 'Good',
    rank: 11,
    lastActive: new Date(Date.now() - 5 * 3600000),
    lastPick: new Date(Date.now() - 6 * 3600000),
  },
  {
    id: '12',
    name: 'Quinn',
    role: 'User',
    picksThisWeek: 0,
    totalPicksThisWeek: 14,
    totalWins: 8,
    totalGames: 28,
    status: 'Active',
    reliability: 'At Risk',
    rank: 12,
    lastActive: new Date(Date.now() - 5 * 86400000),
    lastPick: null,
  },
  {
    id: '13',
    name: 'Sage',
    role: 'User',
    picksThisWeek: 14,
    totalPicksThisWeek: 14,
    totalWins: 7,
    totalGames: 28,
    status: 'Active',
    reliability: 'Good',
    rank: 13,
    lastActive: new Date(Date.now() - 1 * 3600000),
    lastPick: new Date(Date.now() - 2 * 3600000),
  },
  {
    id: '14',
    name: 'Blake',
    role: 'User',
    picksThisWeek: 14,
    totalPicksThisWeek: 14,
    totalWins: 6,
    totalGames: 28,
    status: 'Active',
    reliability: 'Good',
    rank: 14,
    lastActive: new Date(Date.now() - 2 * 3600000),
    lastPick: new Date(Date.now() - 3 * 3600000),
  },
]

function formatTimeAgo(date) {
  if (!date) return 'Never'
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffMs = now - d
  const diffM = Math.floor(diffMs / 60000)
  const diffH = Math.floor(diffMs / 3600000)
  const diffD = Math.floor(diffMs / 86400000)
  if (diffM < 60) return `${diffM}m ago`
  if (diffH < 24) return `${diffH}h ago`
  if (diffD === 1) return 'Yesterday'
  if (diffD < 7) return `${diffD}d ago`
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

function calculateWinRate(wins, games) {
  if (!games || games === 0) return 0
  return Math.round((wins / games) * 100)
}

export default function UsersManager() {
  const [filterTab, setFilterTab] = useState(0)
  const [menuAnchor, setMenuAnchor] = useState({ el: null, user: null })

  const totalUsers = mockUsers.length
  const activeUsers = mockUsers.filter((u) => u.status === 'Active').length
  const missingPicksUsers = mockUsers.filter((u) => u.picksThisWeek === 0 || u.picksThisWeek < u.totalPicksThisWeek).length
  const disabledUsers = mockUsers.filter((u) => u.status === 'Disabled').length
  const needsAttentionUsers = mockUsers.filter(
    (u) => u.picksThisWeek === 0 || u.picksThisWeek < u.totalPicksThisWeek || u.status === 'Disabled' || u.reliability === 'At Risk'
  )

  const leagueHealth = (() => {
    const missingRatio = missingPicksUsers / totalUsers
    if (missingRatio > 0.3) return { label: 'Attention Needed', color: '#ffb74d', bg: 'rgba(255,152,0,0.1)' }
    if (missingRatio > 0.15) return { label: 'Monitor', color: '#ffb74d', bg: 'rgba(255,152,0,0.08)' }
    return { label: 'Good', color: '#81c784', bg: 'rgba(0,200,83,0.1)' }
  })()

  const filteredUsers = (() => {
    switch (filterTab) {
      case 1:
        return needsAttentionUsers
      case 2:
        return mockUsers.filter((u) => u.status === 'Active')
      case 3:
        return mockUsers.filter((u) => u.status === 'Disabled')
      case 4:
        return mockUsers.filter((u) => u.role === 'Admin')
      default:
        return mockUsers
    }
  })()

  const handleMenuOpen = (e, user) => {
    e.stopPropagation()
    setMenuAnchor({ el: e.currentTarget, user })
  }
  const handleMenuClose = () => setMenuAnchor({ el: null, user: null })

  return (
    <Box sx={{ color: '#e9ecf5', p: 2 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 800 }}>
          Users
        </Typography>
        <Typography variant="body2" color="rgba(233,236,245,0.6)" sx={{ fontSize: '0.875rem' }}>
          League operations & user command center — manage users, roles, picks, and status.
        </Typography>
      </Box>

      {/* Users Health Summary */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <Card sx={{ ...glassyCard, height: '100%' }}>
            <CardContent sx={{ py: 1.5, px: 2 }}>
              <Typography variant="caption" sx={{ color: 'rgba(233,236,245,0.5)', fontSize: '0.7rem' }}>Total Users</Typography>
              <Typography variant="h6" sx={{ color: '#e9ecf5', fontWeight: 700, mt: 0.5 }}>
                {totalUsers}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card sx={{ ...glassyCard, height: '100%' }}>
            <CardContent sx={{ py: 1.5, px: 2 }}>
              <Typography variant="caption" sx={{ color: 'rgba(233,236,245,0.5)', fontSize: '0.7rem' }}>Active</Typography>
              <Typography variant="h6" sx={{ color: '#81c784', fontWeight: 700, mt: 0.5 }}>
                {activeUsers}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card sx={{ ...glassyCard, height: '100%' }}>
            <CardContent sx={{ py: 1.5, px: 2 }}>
              <Typography variant="caption" sx={{ color: 'rgba(233,236,245,0.5)', fontSize: '0.7rem' }}>Missing Picks</Typography>
              <Typography variant="h6" sx={{ color: missingPicksUsers > 0 ? '#ffb74d' : '#81c784', fontWeight: 700, mt: 0.5 }}>
                {missingPicksUsers}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card sx={{ ...glassyCard, height: '100%' }}>
            <CardContent sx={{ py: 1.5, px: 2 }}>
              <Typography variant="caption" sx={{ color: 'rgba(233,236,245,0.5)', fontSize: '0.7rem' }}>Disabled</Typography>
              <Typography variant="h6" sx={{ color: disabledUsers > 0 ? '#ff8a80' : '#81c784', fontWeight: 700, mt: 0.5 }}>
                {disabledUsers}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* League Health Status */}
      <Box sx={{ mb: 3 }}>
        <Card sx={{ ...glassyCard }}>
          <CardContent sx={{ py: 1.5, px: 2 }}>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Typography variant="body2" sx={{ color: 'rgba(233,236,245,0.6)', fontSize: '0.8rem' }}>League health:</Typography>
              <Chip
                label={leagueHealth.label}
                size="small"
                sx={{
                  bgcolor: leagueHealth.bg,
                  color: leagueHealth.color,
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  height: 22,
                }}
              />
            </Stack>
          </CardContent>
        </Card>
      </Box>

      {/* Needs Attention Section */}
      {needsAttentionUsers.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ color: '#e9ecf5', fontWeight: 700, mb: 1.5, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Needs Attention
          </Typography>
          <Stack spacing={1.5}>
            {needsAttentionUsers.slice(0, 5).map((user) => {
              const problem = (() => {
                if (user.status === 'Disabled') return 'Disabled'
                if (user.picksThisWeek === 0) return `Missing ${user.totalPicksThisWeek} picks`
                if (user.picksThisWeek < user.totalPicksThisWeek)
                  return `Missing ${user.totalPicksThisWeek - user.picksThisWeek} picks`
                if (user.reliability === 'At Risk') return 'At Risk'
                return 'Needs attention'
              })()

              return (
                <Card key={user.id} sx={{ ...glassyCard, borderLeft: '3px solid #ffb74d' }}>
                  <CardContent sx={{ py: 1.5, px: 2 }}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, minWidth: 200 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(124,77,255,0.3)', fontSize: '0.875rem' }}>
                          {user.name[0]}
                        </Avatar>
                        <Box>
                          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.25 }}>
                            <Typography variant="body1" sx={{ color: '#e9ecf5', fontWeight: 600 }}>
                              {user.name}
                            </Typography>
                            {user.role === 'Admin' && (
                              <Chip
                                label="Admin"
                                size="small"
                                sx={{
                                  bgcolor: 'rgba(124,77,255,0.2)',
                                  color: '#b794f6',
                                  fontWeight: 600,
                                  fontSize: '0.65rem',
                                  height: 18,
                                }}
                              />
                            )}
                          </Stack>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <WarningAmberIcon sx={{ fontSize: 14, color: '#ffb74d' }} />
                            <Typography variant="body2" sx={{ color: 'rgba(233,236,245,0.7)', fontSize: '0.8rem' }}>
                              {problem}
                            </Typography>
                          </Stack>
                        </Box>
                      </Box>
                      <Stack direction="row" spacing={1}>
                        {user.picksThisWeek < user.totalPicksThisWeek && (
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<NotificationsIcon />}
                            disabled
                            sx={{
                              borderColor: 'rgba(255,255,255,0.15)',
                              color: 'rgba(233,236,245,0.6)',
                              '&.Mui-disabled': { borderColor: 'rgba(255,255,255,0.08)', color: 'rgba(233,236,245,0.4)' },
                            }}
                          >
                            Send Reminder
                          </Button>
                        )}
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<VisibilityIcon />}
                          disabled
                          sx={{
                            borderColor: 'rgba(255,255,255,0.15)',
                            color: 'rgba(233,236,245,0.6)',
                            '&.Mui-disabled': { borderColor: 'rgba(255,255,255,0.08)', color: 'rgba(233,236,245,0.4)' },
                          }}
                        >
                          View
                        </Button>
                      </Stack>
                    </Box>
                  </CardContent>
                </Card>
              )
            })}
          </Stack>
        </Box>
      )}

      {/* Filters */}
      <Box sx={{ mb: 2 }}>
        <Tabs
          value={filterTab}
          onChange={(e, v) => setFilterTab(v)}
          sx={{
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            '& .MuiTab-root': {
              color: 'rgba(233,236,245,0.5)',
              fontSize: '0.8125rem',
              fontWeight: 500,
              textTransform: 'none',
              minHeight: 40,
              px: 2,
              '&.Mui-selected': {
                color: '#e9ecf5',
                fontWeight: 600,
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#7c4dff',
              height: 2,
            },
          }}
        >
          <Tab label="All" />
          <Tab label={`Needs Attention (${needsAttentionUsers.length})`} />
          <Tab label="Active" />
          <Tab label="Disabled" />
          <Tab label="Admins" />
        </Tabs>
      </Box>

      {/* Users Table */}
      <TableContainer component={Paper} sx={{ ...glassyCard, overflow: 'auto' }}>
        <Table size="small" sx={{ '& .MuiTableCell-root': { borderColor: 'rgba(255,255,255,0.05)' } }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ py: 1, px: 2, color: 'rgba(233,236,245,0.3)', fontSize: '0.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em' }} />
              <TableCell sx={{ py: 1, px: 2, color: 'rgba(233,236,245,0.3)', fontSize: '0.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Name</TableCell>
              <TableCell sx={{ py: 1, px: 2, color: 'rgba(233,236,245,0.3)', fontSize: '0.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Role</TableCell>
              <TableCell sx={{ py: 1, px: 2, color: 'rgba(233,236,245,0.3)', fontSize: '0.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Status</TableCell>
              <TableCell sx={{ py: 1, px: 2, color: 'rgba(233,236,245,0.3)', fontSize: '0.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Picks (Week)</TableCell>
              <TableCell sx={{ py: 1, px: 2, color: 'rgba(233,236,245,0.3)', fontSize: '0.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Reliability</TableCell>
              <TableCell sx={{ py: 1, px: 2, color: 'rgba(233,236,245,0.3)', fontSize: '0.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Rank</TableCell>
              <TableCell sx={{ py: 1, px: 2, color: 'rgba(233,236,245,0.3)', fontSize: '0.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Win Rate</TableCell>
              <TableCell sx={{ py: 1, px: 2, color: 'rgba(233,236,245,0.3)', fontSize: '0.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Last Active</TableCell>
              <TableCell sx={{ py: 1, px: 2, color: 'rgba(233,236,245,0.3)', fontSize: '0.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Last Pick</TableCell>
              <TableCell sx={{ width: 48, py: 1, px: 2, color: 'rgba(233,236,245,0.3)', fontSize: '0.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em' }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((row) => {
              const needsAttention = row.picksThisWeek === 0 || row.picksThisWeek < row.totalPicksThisWeek || row.status === 'Disabled' || row.reliability === 'At Risk'
              const winRate = calculateWinRate(row.totalWins, row.totalGames)

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
                    ...(needsAttention && { bgcolor: 'rgba(255,152,0,0.02)', borderLeft: '2px solid #ffb74d' }),
                  }}
                >
                  <TableCell sx={{ width: 40 }}>
                    {needsAttention && <WarningAmberIcon sx={{ fontSize: 16, color: '#ffb74d' }} />}
                    {!needsAttention && row.reliability === 'Good' && <CheckCircleIcon sx={{ fontSize: 16, color: 'rgba(0,200,83,0.8)' }} />}
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ color: '#e9ecf5', fontWeight: 600, fontSize: '0.875rem' }}>{row.name}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={row.role}
                      size="small"
                      sx={{
                        bgcolor: row.role === 'Admin' ? 'rgba(124,77,255,0.15)' : 'rgba(255,255,255,0.08)',
                        color: row.role === 'Admin' ? '#b794f6' : 'rgba(233,236,245,0.7)',
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
                  <TableCell>
                    <Chip
                      label={row.status}
                      size="small"
                      sx={{
                        bgcolor: row.status === 'Active' ? 'rgba(0,200,83,0.15)' : 'rgba(255,82,82,0.15)',
                        color: row.status === 'Active' ? '#81c784' : '#ff8a80',
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
                  <TableCell>
                    <Typography sx={{ color: '#e9ecf5', fontSize: '0.8125rem', fontWeight: 500 }}>
                      {row.picksThisWeek} / {row.totalPicksThisWeek}
                    </Typography>
                    {row.picksThisWeek < row.totalPicksThisWeek && (
                      <Typography variant="caption" sx={{ color: '#ffb74d', fontSize: '0.7rem', display: 'block', mt: 0.25 }}>
                        Missing {row.totalPicksThisWeek - row.picksThisWeek}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={row.reliability}
                      size="small"
                      sx={{
                        bgcolor:
                          row.reliability === 'Good'
                            ? 'rgba(0,200,83,0.15)'
                            : row.reliability === 'At Risk'
                              ? 'rgba(255,152,0,0.15)'
                              : 'rgba(255,82,82,0.15)',
                        color:
                          row.reliability === 'Good'
                            ? '#81c784'
                            : row.reliability === 'At Risk'
                              ? '#ffb74d'
                              : '#ff8a80',
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
                  <TableCell sx={{ color: 'rgba(233,236,245,0.7)', fontSize: '0.75rem' }}>#{row.rank}</TableCell>
                  <TableCell sx={{ color: 'rgba(233,236,245,0.7)', fontSize: '0.75rem' }}>{winRate}%</TableCell>
                  <TableCell sx={{ color: 'rgba(233,236,245,0.4)', fontSize: '0.7rem' }}>{formatTimeAgo(row.lastActive)}</TableCell>
                  <TableCell sx={{ color: 'rgba(233,236,245,0.4)', fontSize: '0.7rem' }}>{formatTimeAgo(row.lastPick)}</TableCell>
                  <TableCell>
                    <UserActionsMenu user={row} menuAnchor={menuAnchor} onOpen={handleMenuOpen} onClose={handleMenuClose} />
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

function UserActionsMenu({ user, menuAnchor, onOpen, onClose }) {
  const open = Boolean(menuAnchor.el) && menuAnchor.user?.id === user.id

  const item = (icon, label, disabled = true) => (
    <MenuItem key={label} disabled={disabled} onClick={onClose} sx={{ color: 'rgba(233,236,245,0.85)' }}>
      <ListItemIcon sx={{ color: 'inherit', minWidth: 32 }}>{icon}</ListItemIcon>
      <ListItemText primary={label} primaryTypographyProps={{ fontSize: '0.85rem' }} />
    </MenuItem>
  )

  const menuItems = [
    item(<VisibilityIcon fontSize="small" />, 'View Profile'),
    item(<EditIcon fontSize="small" />, 'Edit Role'),
    user.status === 'Active' ? item(<PersonOffIcon fontSize="small" />, 'Disable User') : item(<PersonIcon fontSize="small" />, 'Enable User'),
    item(<RestartAltIcon fontSize="small" />, 'Reset Week Picks'),
    item(<NotificationsIcon fontSize="small" />, 'Send Reminder'),
  ]

  return (
    <>
      <IconButton
        size="small"
        onClick={(e) => onOpen(e, user)}
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
            minWidth: 180,
          },
        }}
      >
        {menuItems}
      </Menu>
    </>
  )
}
