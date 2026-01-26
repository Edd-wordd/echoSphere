import React from 'react'
import { Box, Typography, Grid, Card, CardContent, Chip, Button, Stack } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import LockIcon from '@mui/icons-material/Lock'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import { glassyCard } from '../../styles/adminStyles'

const glassQuiet = {
  ...glassyCard,
  border: '1px solid rgba(255,255,255,0.06)',
  boxShadow: 'none',
}

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
  return (
    <Typography component="h2" sx={sectionLabelSx}>
      {children}
    </Typography>
  )
}

// Mock config — wire to Firebase later
const config = {
  league: {
    leagueName: 'Family NFL Picks',
    seasonYear: '2024',
    leagueStatus: 'Active',
    timezone: 'America/New_York (ET)',
    leagueId: 'lgl_a1b2c3d4e5',
    createdDate: '2024-08-15',
  },
  status: {
    currentWeek: 3,
    totalWeeks: 18,
    picksLocked: false,
    standingsAutoCalc: true,
  },
  pickLock: {
    lockMode: 'First game kickoff',
    lockDay: 'Thursday / Sunday',
    lockTime: '1:00 PM ET',
    gracePeriod: 'None',
  },
  scoring: {
    pointsPerCorrectPick: 1,
    bonusPoints: 'None',
    tiesAllowed: false,
  },
  tieBreak: {
    method: 'Total points in designated game',
    fallbackRule: 'Closest wins',
  },
  season: {
    totalWeeks: 18,
    currentWeek: 3,
    weeksCompleted: 2,
    weeksRemaining: 15,
    playoffsEnabled: false,
  },
  systemState: {
    standingsAutoCalculate: true,
    manualOverrideAllowed: true,
    adminActionsLogged: true,
    leagueLocked: false,
  },
  audit: {
    lastConfigChangeDate: '2024-09-18',
    changedBy: 'Alex (Admin)',
  },
}

const STANDINGS_RECALC_WARNING =
  '⚠ Changing these settings will require standings recalculation.'

function ConfigRow({ label, value, mono }) {
  return (
    <Box
      sx={{
        py: 1,
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        '&:last-of-type': { borderBottom: 'none' },
      }}
    >
      <Typography
        variant="caption"
        sx={{
          color: 'rgba(233,236,245,0.55)',
          fontSize: '0.72rem',
          fontWeight: 600,
          display: 'block',
          mb: 0.35,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}
      >
        {label}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: 'rgba(233,236,245,0.6)',
          fontWeight: 500,
          fontSize: '0.8125rem',
          fontFamily: mono ? 'ui-monospace, monospace' : 'inherit',
        }}
      >
        {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}
      </Typography>
    </Box>
  )
}

function StatePill({ enabled }) {
  return (
    <Chip
      label={enabled ? 'Enabled' : 'Disabled'}
      size="small"
      sx={{
        bgcolor: enabled ? 'rgba(0,200,83,0.15)' : 'rgba(255,255,255,0.06)',
        color: enabled ? '#81c784' : 'rgba(233,236,245,0.5)',
        fontWeight: 600,
        fontSize: '0.7rem',
        height: 22,
        border: enabled ? 'none' : '1px solid rgba(255,255,255,0.08)',
      }}
    />
  )
}

function ConfigRowWithPill({ label, value }) {
  return (
    <Box
      sx={{
        py: 1,
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        '&:last-of-type': { borderBottom: 'none' },
      }}
    >
      <Typography
        variant="caption"
        sx={{
          color: 'rgba(233,236,245,0.55)',
          fontSize: '0.72rem',
          fontWeight: 600,
          display: 'block',
          mb: 0.5,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}
      >
        {label}
      </Typography>
      <StatePill enabled={value} />
    </Box>
  )
}

function SectionHeader({ title, description, impactBadge }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 1.5,
        mb: 1.5,
        pb: 1.5,
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <Box>
        <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" useFlexGap>
          <Typography variant="subtitle1" fontWeight={700} sx={{ color: 'rgba(233,236,245,0.95)', fontSize: '1rem' }}>
            {title}
          </Typography>
          {impactBadge && (
            <Chip
              label={impactBadge}
              size="small"
              sx={{
                bgcolor: 'rgba(124,77,255,0.12)',
                color: 'rgba(183,148,246,0.95)',
                fontWeight: 600,
                fontSize: '0.65rem',
                height: 20,
              }}
            />
          )}
        </Stack>
        {description && (
          <Typography variant="caption" color="rgba(233,236,245,0.5)" sx={{ display: 'block', mt: 0.25 }}>
            {description}
          </Typography>
        )}
      </Box>
      <Button
        size="small"
        startIcon={<EditIcon sx={{ fontSize: 16 }} />}
        disabled
        sx={{
          textTransform: 'none',
          color: 'rgba(233,236,245,0.4)',
          fontWeight: 600,
          fontSize: '0.8rem',
          '&.Mui-disabled': { color: 'rgba(233,236,245,0.25)' },
        }}
      >
        Edit
      </Button>
    </Box>
  )
}

function WarningCallout() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1,
        mt: 2,
        p: 1.5,
        borderRadius: 1,
        bgcolor: 'rgba(255,152,0,0.06)',
        border: '1px solid rgba(255,152,0,0.15)',
      }}
    >
      <WarningAmberIcon sx={{ fontSize: 18, color: '#ffb74d', mt: 0.15, flexShrink: 0 }} />
      <Typography variant="caption" sx={{ color: 'rgba(233,236,245,0.8)', fontSize: '0.8rem', lineHeight: 1.4 }}>
        {STANDINGS_RECALC_WARNING}
      </Typography>
    </Box>
  )
}

export default function AdminSettings() {
  return (
    <Box sx={{ color: '#e9ecf5', p: 2 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 800 }}>
          Settings
        </Typography>
        <Typography variant="body2" color="rgba(233,236,245,0.6)" sx={{ fontSize: '0.875rem' }}>
          League control center. Configure identity, rules, and system state.
        </Typography>
      </Box>

      {/* ——— Global locked notice ——— */}
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          p: 1.5,
          borderRadius: 1.5,
          bgcolor: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <LockIcon sx={{ fontSize: 20, color: 'rgba(233,236,245,0.5)' }} />
        <Typography variant="body2" sx={{ color: 'rgba(233,236,245,0.75)', fontWeight: 500 }}>
          🔒 Settings are locked. Editing will be enabled when backend wiring is complete.
        </Typography>
      </Box>

      {/* ——— League Status summary card ——— */}
      <Box sx={{ mb: 4 }}>
        <SectionLabel>League Status</SectionLabel>
        <Card
          sx={{
            ...glassQuiet,
            borderLeft: '4px solid rgba(124,77,255,0.5)',
            bgcolor: 'rgba(124,77,255,0.04)',
          }}
        >
          <CardContent sx={{ py: 2.5, px: 3 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={4}>
                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{ color: '#e9ecf5', mb: 0.25 }}
                >
                  {config.league.leagueName}
                </Typography>
                <Typography variant="body2" color="rgba(233,236,245,0.6)">
                  Season {config.league.seasonYear}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={4} md={2}>
                <Typography variant="caption" sx={{ color: 'rgba(233,236,245,0.5)', fontSize: '0.7rem', display: 'block', mb: 0.25 }}>
                  League status
                </Typography>
                <Chip
                  label={config.league.leagueStatus}
                  size="small"
                  sx={{
                    bgcolor: 'rgba(0,200,83,0.2)',
                    color: '#81c784',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    height: 24,
                  }}
                />
              </Grid>
              <Grid item xs={6} sm={4} md={2}>
                <Typography variant="caption" sx={{ color: 'rgba(233,236,245,0.5)', fontSize: '0.7rem', display: 'block', mb: 0.25 }}>
                  Current week
                </Typography>
                <Typography variant="body1" fontWeight={600} sx={{ color: '#e9ecf5' }}>
                  {config.status.currentWeek} / {config.status.totalWeeks}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={4} md={2}>
                <Typography variant="caption" sx={{ color: 'rgba(233,236,245,0.5)', fontSize: '0.7rem', display: 'block', mb: 0.25 }}>
                  Picks locked
                </Typography>
                <StatePill enabled={config.status.picksLocked} />
              </Grid>
              <Grid item xs={6} sm={4} md={2}>
                <Typography variant="caption" sx={{ color: 'rgba(233,236,245,0.5)', fontSize: '0.7rem', display: 'block', mb: 0.25 }}>
                  Standings auto-calc
                </Typography>
                <StatePill enabled={config.status.standingsAutoCalc} />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>

      {/* ——— League ——— */}
      <Box sx={{ mb: 4 }}>
        <SectionLabel>League</SectionLabel>
        <Card sx={{ ...glassQuiet }}>
          <CardContent sx={{ py: 2, px: 2.5 }}>
            <SectionHeader
              title="League"
              description="Core league identity and metadata."
            />
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <ConfigRow label="League Name" value={config.league.leagueName} />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <ConfigRow label="Season Year" value={config.league.seasonYear} />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <ConfigRow label="Timezone" value={config.league.timezone} />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <ConfigRow label="League ID" value={config.league.leagueId} mono />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <ConfigRow label="Created Date" value={config.league.createdDate} />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>

      {/* ——— Pick Lock Rules ——— */}
      <Box sx={{ mb: 4 }}>
        <SectionLabel>Pick Lock Rules</SectionLabel>
        <Card sx={{ ...glassQuiet }}>
          <CardContent sx={{ py: 2, px: 2.5 }}>
            <SectionHeader
              title="Pick Lock Rules"
              description="When picks lock and any grace period."
              impactBadge="Affects all users"
            />
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <ConfigRow label="Lock mode" value={config.pickLock.lockMode} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <ConfigRow label="Lock day" value={config.pickLock.lockDay} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <ConfigRow label="Lock time" value={config.pickLock.lockTime} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <ConfigRow label="Grace period" value={config.pickLock.gracePeriod} />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>

      {/* ——— Scoring Rules ——— */}
      <Box sx={{ mb: 4 }}>
        <SectionLabel>Scoring Rules</SectionLabel>
        <Card sx={{ ...glassQuiet }}>
          <CardContent sx={{ py: 2, px: 2.5 }}>
            <SectionHeader
              title="Scoring Rules"
              description="Points per pick, bonuses, and tie handling."
              impactBadge="Affects standings"
            />
            <WarningCallout />
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6} md={4}>
                <ConfigRow label="Points per correct pick" value={config.scoring.pointsPerCorrectPick} />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <ConfigRow label="Bonus points" value={config.scoring.bonusPoints} />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <ConfigRowWithPill label="Ties allowed" value={config.scoring.tiesAllowed} />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>

      {/* ——— Tie-break Rules ——— */}
      <Box sx={{ mb: 4 }}>
        <SectionLabel>Tie-break Rules</SectionLabel>
        <Card sx={{ ...glassQuiet }}>
          <CardContent sx={{ py: 2, px: 2.5 }}>
            <SectionHeader
              title="Tie-break Rules"
              description="How ties are broken and fallback rule."
              impactBadge="Used on ties"
            />
            <WarningCallout />
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <ConfigRow label="Tie-break method" value={config.tieBreak.method} />
              </Grid>
              <Grid item xs={12} md={6}>
                <ConfigRow label="Fallback rule" value={config.tieBreak.fallbackRule} />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>

      {/* ——— Season ——— */}
      <Box sx={{ mb: 4 }}>
        <SectionLabel>Season</SectionLabel>
        <Card sx={{ ...glassQuiet }}>
          <CardContent sx={{ py: 2, px: 2.5 }}>
            <SectionHeader
              title="Season"
              description="Week counts and playoff settings."
            />
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={2}>
                <ConfigRow label="Total weeks" value={config.season.totalWeeks} />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <ConfigRow label="Current week" value={config.season.currentWeek} />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <ConfigRow label="Weeks completed" value={config.season.weeksCompleted} />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <ConfigRow label="Weeks remaining" value={config.season.weeksRemaining} />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <ConfigRowWithPill label="Playoffs enabled" value={config.season.playoffsEnabled} />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>

      {/* ——— System State ——— */}
      <Box sx={{ mb: 4 }}>
        <SectionLabel>System State</SectionLabel>
        <Card sx={{ ...glassQuiet }}>
          <CardContent sx={{ py: 2, px: 2.5 }}>
            <SectionHeader
              title="System State"
              description="Standings, overrides, logging, and league lock."
            />
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <ConfigRowWithPill label="Standings auto-calculate" value={config.systemState.standingsAutoCalculate} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <ConfigRowWithPill label="Manual override allowed" value={config.systemState.manualOverrideAllowed} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <ConfigRowWithPill label="Admin actions logged" value={config.systemState.adminActionsLogged} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <ConfigRowWithPill label="League locked" value={config.systemState.leagueLocked} />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>

      {/* ——— Audit ——— */}
      <Box sx={{ mb: 2 }}>
        <SectionLabel>Audit</SectionLabel>
        <Card sx={{ ...glassQuiet }}>
          <CardContent sx={{ py: 2, px: 2.5 }}>
            <SectionHeader
              title="Audit"
              description="Last configuration change."
            />
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <ConfigRow label="Last config change date" value={config.audit.lastConfigChangeDate} />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <ConfigRow label="Changed by" value={config.audit.changedBy} />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}
