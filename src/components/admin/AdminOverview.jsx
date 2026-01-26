import React from 'react'
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Stack,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
  LinearProgress,
} from '@mui/material'
import { Link } from 'react-router-dom'
import LockIcon from '@mui/icons-material/Lock'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import RefreshIcon from '@mui/icons-material/Refresh'
import TrendUpIcon from '@mui/icons-material/TrendingUp'
import TrendDownIcon from '@mui/icons-material/TrendingDown'
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'
import SportsScoreIcon from '@mui/icons-material/SportsScore'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import FlagIcon from '@mui/icons-material/Flag'
import ScheduleIcon from '@mui/icons-material/Schedule'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { glassyCard } from '../../styles/adminStyles'

// Mock data
const lockDeadline = {
  hoursRemaining: 2,
  minutesRemaining: 14,
  label: 'Week 3 locks Sunday at 1:00 PM ET',
}
const gamesStatus = { total: 14, final: 12, live: 1, missing: 1 }
const recentActivity = [
  { id: '1', text: 'Score updated: Chiefs vs Bills', time: '2h ago', type: 'score' },
  { id: '2', text: "Jordan's picks reset", time: '5h ago', type: 'reset' },
  { id: '3', text: 'Week 2 locked', time: 'Yesterday', type: 'locked' },
  { id: '4', text: 'Tie-breaker set: 49ers vs Rams', time: '2d ago', type: 'tiebreaker' },
]

const season = { currentWeek: 3, totalWeeks: 18 }

const mock = {
  currentWeek: 3,
  lockStatus: 'Open',
  lockCountdown: '2d 5h',
  unlockOverrideAvailable: false,
  defaultLock: 'Sun 1:00 PM ET',
  totalUsers: 14,
  newUsers7d: 2,
  lockedIn: 10,
  missingUsers: [
    { id: '1', name: 'Jordan', lastSeen: '2h ago' },
    { id: '2', name: 'Taylor', lastSeen: '1d ago' },
    { id: '3', name: 'Jamie', lastSeen: '3d ago' },
    { id: '4', name: 'Pat', lastSeen: '6h ago' },
  ],
  tieBreaker: {
    game: '49ers @ Rams',
    status: 'Set',
  },
}

// System checks: ok | warning | error. Derived from gamesStatus, tieBreaker, etc. when wired.
const systemChecks = [
  { id: '1', label: 'All games have start times', status: 'ok' },
  { id: '2', label: '1 game missing final score', status: 'error' },
  { id: '3', label: 'Tie-breaker is set', status: 'ok' },
  { id: '4', label: 'Picks count matches game count', status: 'ok' },
  { id: '5', label: 'No orphaned picks detected', status: 'ok' },
]

const lastUpdated = '2 minutes ago'
const picksByDay = [
  { day: 'Mon', count: 2 },
  { day: 'Tue', count: 5 },
  { day: 'Wed', count: 8 },
  { day: 'Thu', count: 6 },
  { day: 'Fri', count: 4 },
  { day: 'Sat', count: 3 },
  { day: 'Sun', count: 2 },
]
const lockedInVsLastWeek = 2
const missingPicksVsLastWeek = 1

// League Health mock data
const leagueHealthMetrics = {
  avgWeeklyLockRate: 89.2, // percentage
  avgWeeklyLockRateTrend: 2.1, // positive = up, negative = down
  avgPicksPerWeek: 12.4, // average users submitting picks
  totalUsers: 14,
  perfectWeeks: 2, // weeks with 100% lock rate
  atRiskUsers: 4, // users with <70% reliability
  weeksAnalyzed: 5, // last N weeks
}

const participationTrends = [
  { week: 1, locked: 14, total: 14, status: 'perfect' },
  { week: 2, locked: 13, total: 14, status: 'warning' },
  { week: 3, locked: 10, total: 14, status: 'error' },
  { week: 4, locked: 14, total: 14, status: 'perfect' },
  { week: 5, locked: 12, total: 14, status: 'warning' },
]

const cardSx = { height: '100%' }

const glassQuiet = {
  ...glassyCard,
  border: '1px solid rgba(255,255,255,0.06)',
  boxShadow: 'none',
}

const sectionSpacing = 5
const sectionLabelSx = {
  fontSize: '0.65rem',
  fontWeight: 700,
  letterSpacing: '0.22em',
  color: 'rgba(233,236,245,0.38)',
  textTransform: 'uppercase',
  mb: 1.5,
  mt: 0,
}

function SectionLabel({ children }) {
  return <Typography component="h2" sx={sectionLabelSx}>{children}</Typography>
}

function formatTimeToLock(h, m) {
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

function getLockUrgency(hoursRemaining, minutesRemaining) {
  const totalHours = hoursRemaining + minutesRemaining / 60
  if (totalHours < 2) return 'danger'
  if (totalHours < 24) return 'warning'
  return 'normal'
}

function StatCard({ label, value, sub, compact, quiet }) {
  const cardStyle = quiet ? { ...glassQuiet, ...cardSx } : { ...glassyCard, ...cardSx }
  return (
    <Card sx={cardStyle}>
      <CardContent sx={compact ? { py: 1.25, px: 2, '&:last-child': { pb: 1.25 } } : undefined}>
        <Typography variant="body2" color="rgba(233,236,245,0.7)" sx={compact ? { fontSize: '0.75rem' } : undefined}>
          {label}
        </Typography>
        <Typography variant="h4" fontWeight={700} sx={{ mt: 0.5, ...(compact && { fontSize: '1.35rem' }) }}>
          {value}
        </Typography>
        {sub && (
          <Box sx={{ mt: 0.5 }}>
            {typeof sub === 'string' ? (
              <Typography variant="caption" color="rgba(233,236,245,0.6)">
                {sub}
              </Typography>
            ) : (
              sub
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

function ActivityIcon({ type }) {
  const iconSx = { fontSize: 18, color: 'rgba(233,236,245,0.7)' }
  switch (type) {
    case 'score':
      return <SportsScoreIcon sx={iconSx} />
    case 'reset':
      return <RestartAltIcon sx={iconSx} />
    case 'locked':
      return <LockIcon sx={iconSx} />
    case 'tiebreaker':
      return <FlagIcon sx={iconSx} />
    default:
      return <ScheduleIcon sx={iconSx} />
  }
}

function SystemCheckIcon({ status }) {
  const sx = { fontSize: 18 }
  if (status === 'ok') return <CheckCircleIcon sx={{ ...sx, color: 'rgba(0,200,83,0.9)' }} />
  if (status === 'warning') return <WarningAmberIcon sx={{ ...sx, color: '#ffb74d' }} />
  return <ErrorOutlineIcon sx={{ ...sx, color: '#ff8a80' }} />
}

export default function AdminOverview() {
  const isLocked = mock.lockStatus === 'Locked'
  const lockPillBg = isLocked ? 'rgba(255,82,82,0.3)' : 'rgba(0,200,83,0.3)'
  const lockSecondary = isLocked
    ? 'Locked' + (mock.unlockOverrideAvailable ? ' · Unlock override available' : '')
    : `Locks in ${mock.lockCountdown}`

  const timeToLockStr = formatTimeToLock(lockDeadline.hoursRemaining, lockDeadline.minutesRemaining)
  const lockUrgency = getLockUrgency(lockDeadline.hoursRemaining, lockDeadline.minutesRemaining)
  const hasMissingResults = gamesStatus.missing > 0
  const standingsStatus = hasMissingResults ? 'blocked' : 'ok'
  const seasonProgress = season.totalWeeks > 0 ? (season.currentWeek / season.totalWeeks) * 100 : 0
  const weeksRemaining = Math.max(0, season.totalWeeks - season.currentWeek)

  // Action-oriented alerts (derived from mock)
  const alerts = []
  const totalLockHours = lockDeadline.hoursRemaining + lockDeadline.minutesRemaining / 60
  if (!isLocked && totalLockHours < 24) {
    alerts.push({
      id: 'lock',
      message: `Week 3 locks in ${timeToLockStr} — lock or remind missing users.`,
      severity: totalLockHours < 2 ? 'critical' : 'warning',
    })
  }
  if (mock.missingUsers.length > 0) {
    alerts.push({
      id: 'missing',
      message: `${mock.missingUsers.length} users missing picks — send reminders before lock.`,
      severity: 'warning',
    })
  }
  if (hasMissingResults) {
    alerts.push({
      id: 'results',
      message: `${gamesStatus.missing} game${gamesStatus.missing > 1 ? 's' : ''} missing final score — standings are blocked.`,
      severity: 'critical',
    })
  }
  if (alerts.length === 0) {
    alerts.push({ id: 'ok', message: 'No urgent actions needed.', severity: 'info' })
  }

  const urgencyStyles = {
    normal: {
      borderLeft: '3px solid rgba(124,77,255,0.4)',
      bgcolor: 'rgba(124,77,255,0.05)',
      accent: 'rgba(233,236,245,0.85)',
    },
    warning: {
      borderLeft: '3px solid rgba(255,152,0,0.5)',
      bgcolor: 'rgba(255,152,0,0.06)',
      accent: '#ffb74d',
    },
    danger: {
      borderLeft: '3px solid rgba(255,82,82,0.55)',
      bgcolor: 'rgba(255,82,82,0.06)',
      accent: '#ff8a80',
    },
  }
  const lockStyle = urgencyStyles[lockUrgency]
  const isStandingsCritical = standingsStatus === 'blocked'

  const hasSystemCheckError = systemChecks.some((c) => c.status === 'error')
  const leagueHealth = (() => {
    let score = 100
    if (mock.missingUsers.length) score -= mock.missingUsers.length * 3
    if (gamesStatus.missing) score -= gamesStatus.missing * 8
    systemChecks.forEach((c) => { if (c.status === 'error') score -= 5; if (c.status === 'warning') score -= 2 })
    return Math.max(0, Math.min(100, Math.round(score)))
  })()
  const leagueHealthColor = leagueHealth >= 90 ? 'rgba(0,200,83,0.9)' : leagueHealth >= 70 ? '#ffb74d' : '#ff8a80'

  return (
    <Box sx={{ color: '#e9ecf5', p: 2 }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2, mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 800 }}>
            Admin Overview
          </Typography>
          <Typography variant="body1" color="rgba(233,236,245,0.7)" sx={{ mb: 1 }}>
            Command center — current week, lock status, and quick actions.
          </Typography>
          <Typography variant="caption" color="rgba(233,236,245,0.45)">
            Last sync: {lastUpdated}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'stretch', sm: 'flex-end' } }}>
          <Stack direction="row" flexWrap="wrap" gap={1} useFlexGap justifyContent={{ xs: 'flex-start', sm: 'flex-end' }}>
            <Button
              variant="contained"
              size="medium"
              startIcon={<LockIcon />}
              disabled
              sx={{
                bgcolor: 'rgba(124,77,255,0.35)',
                color: '#e9ecf5',
                border: '1px solid rgba(255,255,255,0.15)',
                '&.Mui-disabled': { bgcolor: 'rgba(124,77,255,0.15)', color: 'rgba(233,236,245,0.4)' },
              }}
            >
              Lock Week
            </Button>
            <Button
              variant="contained"
              size="medium"
              startIcon={<NotificationsActiveIcon />}
              disabled
              sx={{
                bgcolor: 'rgba(124,77,255,0.35)',
                color: '#e9ecf5',
                border: '1px solid rgba(255,255,255,0.15)',
                '&.Mui-disabled': { bgcolor: 'rgba(124,77,255,0.15)', color: 'rgba(233,236,245,0.4)' },
              }}
            >
              Send Reminders
            </Button>
            <Button
              variant="contained"
              size="medium"
              startIcon={<RefreshIcon />}
              disabled
              sx={{
                bgcolor: 'rgba(124,77,255,0.35)',
                color: '#e9ecf5',
                border: '1px solid rgba(255,255,255,0.15)',
                '&.Mui-disabled': { bgcolor: 'rgba(124,77,255,0.15)', color: 'rgba(233,236,245,0.4)' },
              }}
            >
              Recalculate Standings
            </Button>
          </Stack>
          <Typography variant="caption" color="rgba(233,236,245,0.45)" sx={{ mt: 1 }}>
            Actions will be enabled when backend wiring is complete.
          </Typography>
        </Box>
      </Box>

      {/* ——— URGENT ——— */}
      <Box sx={{ mb: sectionSpacing }}>
        <SectionLabel>Urgent</SectionLabel>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
          <Card
            sx={{
              ...glassyCard,
              borderLeft: lockStyle.borderLeft,
              bgcolor: lockStyle.bgcolor,
              border: '1px solid rgba(255,255,255,0.06)',
              boxShadow: 'none',
            }}
          >
            <CardContent sx={{ py: 1.5, px: 2.5, '&:last-child': { pb: 1.5 } }}>
              <Typography
                variant="caption"
                sx={{
                  color: 'rgba(233,236,245,0.55)',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  display: 'block',
                }}
              >
                Time to Lock
              </Typography>
              <Typography
                sx={{
                  color: lockStyle.accent,
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  lineHeight: 1.2,
                  mt: 0.25,
                }}
              >
                {timeToLockStr}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: 'rgba(233,236,245,0.5)',
                  fontSize: '0.75rem',
                  display: 'block',
                  mt: 0.5,
                }}
              >
                {lockDeadline.label}
              </Typography>
            </CardContent>
          </Card>
          {isStandingsCritical && (
            <Card
              sx={{
                ...glassyCard,
                borderLeft: '3px solid rgba(255,82,82,0.5)',
                bgcolor: 'rgba(255,82,82,0.06)',
                border: '1px solid rgba(255,82,82,0.12)',
                boxShadow: 'none',
              }}
            >
              <CardContent sx={{ py: 1.5, px: 2.5, '&:last-child': { pb: 1.5 } }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
                  <Stack direction="row" alignItems="center" spacing={1.25}>
                    <ErrorOutlineIcon sx={{ fontSize: 20, color: 'rgba(255,138,128,0.9)' }} />
                    <Box>
                      <Typography sx={{ fontSize: '0.9375rem', fontWeight: 700, color: '#ff8a80', lineHeight: 1.3 }}>
                        Standings blocked
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(233,236,245,0.55)', fontSize: '0.75rem', display: 'block', mt: 0.25 }}>
                        Cannot finalize standings until all results are entered.
                      </Typography>
                    </Box>
                  </Stack>
                  <Button
                    variant="outlined"
                    size="small"
                    disabled
                    sx={{
                      borderColor: 'rgba(255,255,255,0.15)',
                      color: 'rgba(233,236,245,0.5)',
                      fontSize: '0.8rem',
                      py: 0.5,
                      '&.Mui-disabled': { borderColor: 'rgba(255,255,255,0.08)', color: 'rgba(233,236,245,0.35)' },
                    }}
                  >
                    Resolve Blocking Issue
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          )}
        </Box>
      </Box>

      {/* Compact stats strip — at a glance */}
      <Grid container spacing={2} sx={{ mb: sectionSpacing }}>
        <Grid item xs={6} sm={6} md={3}>
          <Card sx={{ ...glassQuiet, ...cardSx }}>
            <CardContent sx={{ py: 1.25, px: 2, '&:last-child': { pb: 1.25 } }}>
              <Typography variant="body2" color="rgba(233,236,245,0.7)" sx={{ fontSize: '0.75rem' }}>
                Current Week
              </Typography>
              <Typography variant="h4" fontWeight={700} sx={{ mt: 0.5, fontSize: '1.35rem' }}>
                Week {mock.currentWeek}
              </Typography>
              <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mt: 0.75, flexWrap: 'wrap', gap: 0.5 }}>
                <Chip label={mock.lockStatus} size="small" sx={{ bgcolor: lockPillBg, color: '#f5f7ff', fontWeight: 600, height: 20 }} />
                <Typography variant="caption" color="rgba(233,236,245,0.75)">{lockSecondary}</Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard label="Total Users" value={mock.totalUsers} compact quiet />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard
            label="New Users (7d)"
            value={mock.newUsers7d}
            sub={
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <TrendUpIcon sx={{ fontSize: 12, color: 'rgba(0,200,83,0.9)' }} />
                <Typography component="span" variant="caption" color="rgba(233,236,245,0.6)">vs last week</Typography>
              </Stack>
            }
            compact
            quiet
          />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard
            label="Locked In"
            value={mock.lockedIn}
            sub={
              <Stack direction="row" alignItems="center" spacing={0.5}>
                {lockedInVsLastWeek >= 0 ? (
                  <TrendUpIcon sx={{ fontSize: 12, color: 'rgba(0,200,83,0.9)' }} />
                ) : (
                  <TrendUpIcon sx={{ fontSize: 12, color: '#ff8a80', transform: 'rotate(180deg)' }} />
                )}
                <Typography component="span" variant="caption" color="rgba(233,236,245,0.6)">
                  {lockedInVsLastWeek >= 0 ? '+' : ''}{lockedInVsLastWeek} vs last week
                </Typography>
              </Stack>
            }
            compact
            quiet
          />
        </Grid>
      </Grid>

      {/* ——— LEAGUE HEALTH ——— */}
      <Box sx={{ mb: sectionSpacing }}>
        <SectionLabel>League Health</SectionLabel>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6} sm={6} md={3}>
            <Card sx={{ ...glassQuiet, ...cardSx }}>
              <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
                <Typography variant="body2" color="rgba(233,236,245,0.65)" sx={{ fontSize: '0.75rem' }}>
                  Avg Weekly Lock Rate
                </Typography>
                <Stack direction="row" alignItems="baseline" spacing={0.5} sx={{ mt: 0.5 }}>
                  <Typography variant="h5" fontWeight={700} sx={{ color: '#e9ecf5' }}>
                    {leagueHealthMetrics.avgWeeklyLockRate}%
                  </Typography>
                  {leagueHealthMetrics.avgWeeklyLockRateTrend >= 0 ? (
                    <TrendUpIcon sx={{ fontSize: 14, color: 'rgba(0,200,83,0.9)' }} />
                  ) : (
                    <TrendDownIcon sx={{ fontSize: 14, color: '#ff8a80' }} />
                  )}
                </Stack>
                <Typography variant="caption" color="rgba(233,236,245,0.5)" sx={{ display: 'block', mt: 0.5 }}>
                  Based on last {leagueHealthMetrics.weeksAnalyzed} weeks
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <Card sx={{ ...glassQuiet, ...cardSx }}>
              <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
                <Typography variant="body2" color="rgba(233,236,245,0.65)" sx={{ fontSize: '0.75rem' }}>
                  Avg Picks Per Week
                </Typography>
                <Typography variant="h5" fontWeight={700} sx={{ color: '#e9ecf5', mt: 0.5 }}>
                  {leagueHealthMetrics.avgPicksPerWeek.toFixed(1)} / {leagueHealthMetrics.totalUsers}
                </Typography>
                <Typography variant="caption" color="rgba(233,236,245,0.5)" sx={{ display: 'block', mt: 0.5 }}>
                  Participation consistency
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <Card sx={{ ...glassQuiet, ...cardSx }}>
              <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
                <Typography variant="body2" color="rgba(233,236,245,0.65)" sx={{ fontSize: '0.75rem' }}>
                  Perfect Weeks
                </Typography>
                <Typography variant="h5" fontWeight={700} sx={{ color: '#81c784', mt: 0.5 }}>
                  {leagueHealthMetrics.perfectWeeks}
                </Typography>
                <Typography variant="caption" color="rgba(233,236,245,0.5)" sx={{ display: 'block', mt: 0.5 }}>
                  This season
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <Card sx={{ ...glassQuiet, ...cardSx }}>
              <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
                <Typography variant="body2" color="rgba(233,236,245,0.65)" sx={{ fontSize: '0.75rem' }}>
                  At-Risk Users
                </Typography>
                <Typography
                  variant="h5"
                  fontWeight={700}
                  sx={{
                    color: leagueHealthMetrics.atRiskUsers > 0 ? '#ffb74d' : '#81c784',
                    mt: 0.5,
                    cursor: leagueHealthMetrics.atRiskUsers > 0 ? 'pointer' : 'default',
                    '&:hover': leagueHealthMetrics.atRiskUsers > 0 ? { color: '#ffa726' } : {},
                  }}
                  component={leagueHealthMetrics.atRiskUsers > 0 ? Link : 'div'}
                  to={leagueHealthMetrics.atRiskUsers > 0 ? '/admin/users' : undefined}
                >
                  {leagueHealthMetrics.atRiskUsers}
                </Typography>
                <Typography variant="caption" color="rgba(233,236,245,0.5)" sx={{ display: 'block', mt: 0.5 }}>
                  Needs reminders
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Card sx={{ ...glassQuiet, ...cardSx }}>
              <CardContent sx={{ py: 2, px: 2.5 }}>
                <Typography variant="subtitle1" fontWeight={700} gutterBottom sx={{ color: 'rgba(233,236,245,0.9)', mb: 1.5 }}>
                  Participation Trends
                </Typography>
                <Stack spacing={0.75}>
                  {participationTrends.map((trend) => {
                    const isCurrentWeek = trend.week === mock.currentWeek
                    const statusColor =
                      trend.status === 'perfect'
                        ? 'rgba(0,200,83,0.9)'
                        : trend.status === 'warning'
                          ? '#ffb74d'
                          : '#ff8a80'
                    const statusIcon =
                      trend.status === 'perfect' ? (
                        <CheckCircleIcon sx={{ fontSize: 16, color: statusColor }} />
                      ) : trend.status === 'warning' ? (
                        <WarningAmberIcon sx={{ fontSize: 16, color: statusColor }} />
                      ) : (
                        <ErrorOutlineIcon sx={{ fontSize: 16, color: statusColor }} />
                      )

                    return (
                      <Box
                        key={trend.week}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          py: 0.75,
                          px: 1.5,
                          borderRadius: 1,
                          bgcolor: isCurrentWeek ? 'rgba(124,77,255,0.08)' : 'transparent',
                          border: isCurrentWeek ? '1px solid rgba(124,77,255,0.2)' : 'none',
                        }}
                      >
                        <Stack direction="row" alignItems="center" spacing={1.5}>
                          <Typography variant="body2" sx={{ color: '#e9ecf5', fontWeight: 600, minWidth: 60 }}>
                            Week {trend.week}
                            {isCurrentWeek && (
                              <Chip
                                label="Current"
                                size="small"
                                sx={{
                                  ml: 1,
                                  bgcolor: 'rgba(124,77,255,0.2)',
                                  color: '#b794f6',
                                  height: 18,
                                  fontSize: '0.65rem',
                                  fontWeight: 600,
                                }}
                              />
                            )}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(233,236,245,0.7)', fontSize: '0.875rem' }}>
                            {trend.locked} / {trend.total} locked
                          </Typography>
                        </Stack>
                        {statusIcon}
                      </Box>
                    )
                  })}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* ——— SYSTEM HEALTH ——— */}
      <Box sx={{ mb: sectionSpacing }}>
        <SectionLabel>System Health</SectionLabel>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={4}>
            <Card sx={{ ...glassQuiet, ...cardSx }}>
              <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
                <Typography variant="body2" color="rgba(233,236,245,0.65)" sx={{ fontSize: '0.75rem' }}>Season Progress</Typography>
                <Typography variant="body1" fontWeight={700} sx={{ color: '#e9ecf5', mt: 0.5 }}>Week {season.currentWeek} of {season.totalWeeks}</Typography>
                <LinearProgress
                  variant="determinate"
                  value={seasonProgress}
                  sx={{ mt: 1, height: 5, borderRadius: 1, bgcolor: 'rgba(255,255,255,0.06)', '& .MuiLinearProgress-bar': { bgcolor: 'rgba(124,77,255,0.5)' } }}
                />
                <Typography variant="caption" color="rgba(233,236,245,0.5)" sx={{ display: 'block', mt: 0.75 }}>{weeksRemaining} weeks left</Typography>
              </CardContent>
            </Card>
          </Grid>
          {!isStandingsCritical && (
            <Grid item xs={12} sm={4}>
              <Card sx={{ ...glassQuiet, ...cardSx }}>
                <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
                  <Typography variant="body2" color="rgba(233,236,245,0.65)" sx={{ fontSize: '0.75rem' }}>Standings Status</Typography>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5 }}>
                    <CheckCircleIcon sx={{ fontSize: 22, color: 'rgba(0,200,83,0.9)' }} />
                    <Typography variant="body1" fontWeight={700} sx={{ color: 'rgba(0,200,83,0.95)' }}>Up to date</Typography>
                  </Stack>
                  <Typography variant="caption" color="rgba(233,236,245,0.5)" sx={{ display: 'block', mt: 0.5 }}>All results accounted for.</Typography>
                </CardContent>
              </Card>
            </Grid>
          )}
          <Grid item xs={12} sm={isStandingsCritical ? 8 : 4}>
            <Card
              sx={{
                ...glassQuiet,
                ...cardSx,
                ...(hasMissingResults && {
                  borderLeft: '3px solid rgba(255,152,0,0.6)',
                  bgcolor: 'rgba(255,152,0,0.04)',
                  boxShadow: '0 0 16px rgba(255,152,0,0.08)',
                }),
              }}
            >
              <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
                <Typography variant="body2" color="rgba(233,236,245,0.65)" sx={{ fontSize: '0.75rem' }}>Games Status</Typography>
                <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 0.5 }} alignItems="center">
                  <Typography variant="body2" color="rgba(233,236,245,0.85)" component="span">{gamesStatus.total} total</Typography>
                  <Chip label={`${gamesStatus.final} final`} size="small" sx={{ bgcolor: 'rgba(0,200,83,0.15)', color: '#81c784', height: 20 }} />
                  <Chip label={`${gamesStatus.live} live`} size="small" sx={{ bgcolor: 'rgba(33,150,243,0.15)', color: '#64b5f6', height: 20 }} />
                  {gamesStatus.missing > 0 && (
                    <Chip label={`${gamesStatus.missing} missing ❗`} size="small" sx={{ bgcolor: 'rgba(255,82,82,0.2)', color: '#ff8a80', height: 20 }} />
                  )}
                </Stack>
                <Typography variant="caption" color="rgba(233,236,245,0.5)" sx={{ display: 'block', mt: 0.75 }}>Standings cannot be finalized until all results are entered.</Typography>
                <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 1 }}>
                  <Button component={Link} to="/admin/games" size="small" sx={{ textTransform: 'none', color: 'rgba(124,77,255,0.9)', fontWeight: 600 }}>Go to Games</Button>
                  {hasMissingResults && (
                    <Button size="small" disabled sx={{ textTransform: 'none', color: 'rgba(233,236,245,0.5)', '&.Mui-disabled': { color: 'rgba(233,236,245,0.35)' } }}>Enter Missing Result</Button>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ ...glassQuiet, ...cardSx }}>
              <CardContent sx={{ py: 2, px: 2.5 }}>
                <Typography variant="body2" color="rgba(233,236,245,0.65)" sx={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>League Health</Typography>
                <Typography variant="h3" fontWeight={800} sx={{ color: leagueHealthColor, mt: 0.5, letterSpacing: '-0.02em' }}>{leagueHealth}%</Typography>
                <Typography variant="caption" color="rgba(233,236,245,0.5)" sx={{ display: 'block', mt: 1 }}>
                  Based on results completeness, participation, and system checks.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={8}>
            <Card sx={{ ...glassQuiet, ...cardSx }}>
              <CardContent sx={{ py: 2, px: 2.5 }}>
                <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#e9ecf5', mb: 1.25 }}>Picks submitted by day (this week)</Typography>
                <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 0.75, height: 80, mt: 1 }}>
                  {picksByDay.map((d) => {
                    const max = Math.max(...picksByDay.map((x) => x.count))
                    const h = max ? (d.count / max) * 56 : 0
                    return (
                      <Box key={d.day} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Box
                          sx={{
                            width: '100%',
                            maxWidth: 28,
                            height: h,
                            minHeight: d.count ? 4 : 0,
                            borderRadius: '6px 6px 0 0',
                            bgcolor: 'rgba(124,77,255,0.4)',
                          }}
                        />
                        <Typography variant="caption" color="rgba(233,236,245,0.5)" sx={{ mt: 0.5 }}>{d.day}</Typography>
                      </Box>
                    )
                  })}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Card sx={{ ...glassQuiet, ...cardSx }}>
          <CardContent sx={{ py: 2, px: 2.5 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 1, mb: 1.25 }}>
              <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#e9ecf5' }}>System Checks</Typography>
              {hasSystemCheckError && (
                <Button size="small" disabled sx={{ textTransform: 'none', color: 'rgba(124,77,255,0.85)', fontWeight: 600, '&.Mui-disabled': { color: 'rgba(233,236,245,0.4)' } }}>View Details</Button>
              )}
            </Box>
            <Stack direction="row" flexWrap="wrap" gap={1} useFlexGap>
              {systemChecks.map((c) => (
                <Stack key={c.id} direction="row" alignItems="center" spacing={1} sx={{ py: 0.5, px: 1.25, borderRadius: 1, bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <SystemCheckIcon status={c.status} />
                  <Typography variant="body2" sx={{ color: '#e9ecf5' }}>{c.label}</Typography>
                </Stack>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Box>

      {/* ——— OPERATIONS ——— */}
      <Box sx={{ mb: sectionSpacing }}>
        <SectionLabel>Operations</SectionLabel>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ ...glassQuiet, ...cardSx }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight={700} gutterBottom sx={{ color: '#e9ecf5' }}>
                  Missing Picks
                </Typography>
                <Typography variant="body2" color="rgba(233,236,245,0.6)" sx={{ mb: 0.5 }}>
                  {mock.missingUsers.length} users missing picks · {missingPicksVsLastWeek >= 0 ? '+' : ''}{missingPicksVsLastWeek} vs last week
                </Typography>
                <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 1.5 }}>
                  <Button size="small" disabled startIcon={<NotificationsActiveIcon />} sx={{ textTransform: 'none', color: 'rgba(233,236,245,0.5)', '&.Mui-disabled': { color: 'rgba(233,236,245,0.35)' } }}>Send Reminders</Button>
                  <Button component={Link} to="/admin/users" size="small" sx={{ textTransform: 'none', color: 'rgba(124,77,255,0.9)', fontWeight: 600 }}>View All Users</Button>
                </Stack>
                <List dense disablePadding sx={{ border: '1px solid rgba(255,255,255,0.06)', borderRadius: 1 }}>
                  {mock.missingUsers.map((u, i) => (
                    <React.Fragment key={u.id}>
                      {i > 0 && <Divider component="li" sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />}
                      <ListItem
                        secondaryAction={
                          <Button
                            size="small"
                            disabled
                            startIcon={<NotificationsActiveIcon />}
                            sx={{
                              color: 'rgba(233,236,245,0.5)',
                              borderColor: 'rgba(255,255,255,0.15)',
                              '&.Mui-disabled': { color: 'rgba(233,236,245,0.35)', borderColor: 'rgba(255,255,255,0.08)' },
                            }}
                            variant="outlined"
                          >
                            Remind
                          </Button>
                        }
                        sx={{ py: 1 }}
                      >
                        <ListItemAvatar>
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              bgcolor: 'rgba(124,77,255,0.35)',
                              color: '#c5b8ff',
                              fontSize: '0.85rem',
                            }}
                          >
                            {u.name.charAt(0)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={u.name}
                          secondary={u.lastSeen}
                          primaryTypographyProps={{ sx: { color: '#e9ecf5', fontWeight: 600 } }}
                          secondaryTypographyProps={{ sx: { color: 'rgba(233,236,245,0.6)', fontSize: '0.8rem' } }}
                        />
                        <Chip label="Missing" size="small" sx={{ ml: 1, bgcolor: 'rgba(255,152,0,0.2)', color: '#ffb74d' }} />
                      </ListItem>
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ ...glassQuiet, ...cardSx }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight={700} gutterBottom sx={{ color: '#e9ecf5' }}>
                  Alerts
                </Typography>
                <Stack spacing={1}>
                  {alerts.map((a) => {
                    const isCritical = a.severity === 'critical'
                    const isWarning = a.severity === 'warning'
                    const bg = isCritical ? 'rgba(255,82,82,0.1)' : isWarning ? 'rgba(255,152,0,0.08)' : 'rgba(255,255,255,0.03)'
                    const border = isCritical ? '1px solid rgba(255,82,82,0.25)' : isWarning ? '1px solid rgba(255,152,0,0.2)' : '1px solid rgba(255,255,255,0.05)'
                    return (
                      <Box key={a.id} sx={{ py: 1, px: 1.25, borderRadius: 1, bgcolor: bg, border }}>
                        <Typography variant="body2" sx={{ color: '#e9ecf5' }}>{a.message}</Typography>
                      </Box>
                    )
                  })}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={8}>
            <Card sx={{ ...glassQuiet, ...cardSx }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight={700} gutterBottom sx={{ color: '#e9ecf5' }}>
                  Recent Activity
                </Typography>
                <List dense disablePadding>
                  {recentActivity.map((item, i) => (
                    <React.Fragment key={item.id}>
                      {i > 0 && <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />}
                      <ListItem alignItems="flex-start" sx={{ py: 0.75, px: 0 }}>
                        <Box sx={{ minWidth: 28, mr: 1.25, mt: 0.2, display: 'flex', alignItems: 'center' }}>
                          <ActivityIcon type={item.type} />
                        </Box>
                        <ListItemText
                          primary={item.text}
                          secondary={item.time}
                          primaryTypographyProps={{ variant: 'body2', sx: { color: '#e9ecf5' } }}
                          secondaryTypographyProps={{ variant: 'caption', sx: { color: 'rgba(233,236,245,0.55)' } }}
                        />
                      </ListItem>
                    </React.Fragment>
                  ))}
                </List>
                <Button
                  component={Link}
                  to="/admin/activity"
                  size="small"
                  sx={{ mt: 1, textTransform: 'none', color: 'rgba(124,77,255,0.85)', fontWeight: 600 }}
                >
                  View Full Log
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* ——— CONFIGURATION ——— */}
      <Box sx={{ mb: 2 }}>
        <SectionLabel>Configuration</SectionLabel>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ ...glassQuiet, ...cardSx }}>
              <CardContent sx={{ py: 2, px: 2.5 }}>
                <Typography variant="subtitle1" fontWeight={700} gutterBottom sx={{ color: 'rgba(233,236,245,0.9)' }}>
                  This Week Tie-breaker
                </Typography>
                <Typography variant="body2" color="rgba(233,236,245,0.8)" sx={{ mt: 0.5 }}>
                  {mock.tieBreaker.game}
                </Typography>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1.5 }}>
                  <Chip
                    label={mock.tieBreaker.status === 'Set' ? 'Set' : 'Not set'}
                    size="small"
                    sx={{
                      bgcolor: mock.tieBreaker.status === 'Set' ? 'rgba(0,200,83,0.2)' : 'rgba(255,152,0,0.2)',
                      color: mock.tieBreaker.status === 'Set' ? '#81c784' : '#ffb74d',
                      fontWeight: 600,
                    }}
                  />
                  <Button
                    size="small"
                    disabled
                    variant="outlined"
                    sx={{
                      borderColor: 'rgba(255,255,255,0.12)',
                      color: 'rgba(233,236,245,0.5)',
                      '&.Mui-disabled': { borderColor: 'rgba(255,255,255,0.08)', color: 'rgba(233,236,245,0.35)' },
                    }}
                  >
                    Set tie-breaker
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ ...glassQuiet, ...cardSx }}>
              <CardContent sx={{ py: 2, px: 2.5 }}>
                <Typography variant="subtitle1" fontWeight={700} gutterBottom sx={{ color: 'rgba(233,236,245,0.9)' }}>
                  Quick Actions
                </Typography>
                <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 1 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<LockIcon />}
                    disabled
                    sx={{
                      borderColor: 'rgba(255,255,255,0.12)',
                      color: 'rgba(233,236,245,0.5)',
                      '&.Mui-disabled': { borderColor: 'rgba(255,255,255,0.08)', color: 'rgba(233,236,245,0.35)' },
                    }}
                  >
                    Lock Week
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<LockOpenIcon />}
                    disabled
                    sx={{
                      borderColor: 'rgba(255,255,255,0.12)',
                      color: 'rgba(233,236,245,0.5)',
                      '&.Mui-disabled': { borderColor: 'rgba(255,255,255,0.08)', color: 'rgba(233,236,245,0.35)' },
                    }}
                  >
                    Unlock Week
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<RefreshIcon />}
                    disabled
                    sx={{
                      borderColor: 'rgba(255,255,255,0.12)',
                      color: 'rgba(233,236,245,0.5)',
                      '&.Mui-disabled': { borderColor: 'rgba(255,255,255,0.08)', color: 'rgba(233,236,245,0.35)' },
                    }}
                  >
                    Recalculate Standings
                  </Button>
                </Stack>
                <Typography variant="caption" color="rgba(233,236,245,0.45)" sx={{ display: 'block', mt: 1.5 }}>
                  Actions will be enabled when backend wiring is complete.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}
