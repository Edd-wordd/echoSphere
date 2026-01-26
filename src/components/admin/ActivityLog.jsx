import React, { useState, useMemo } from 'react'
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Stack,
  Card,
  CardContent,
  Divider,
} from '@mui/material'
import { glassyCard } from '../../styles/adminStyles'

const glassQuiet = {
  ...glassyCard,
  border: '1px solid rgba(255,255,255,0.06)',
  boxShadow: 'none',
}

const TAB_ALL = 'all'
const TAB_WEEKS = 'weeks'
const TAB_GAMES = 'games'
const TAB_USERS = 'users'
const TAB_SETTINGS = 'settings'

const TYPE_LOCK = 'lock'
const TYPE_SCORE = 'score'
const TYPE_USER = 'user'
const TYPE_STANDINGS = 'standings'
const TYPE_SETTINGS = 'settings'

const ICONS = {
  [TYPE_LOCK]: '🔒',
  [TYPE_SCORE]: '🏈',
  [TYPE_USER]: '👤',
  [TYPE_STANDINGS]: '🔁',
  [TYPE_SETTINGS]: '⚙️',
}

// Mock audit log — wire to backend later
const MOCK_ENTRIES = [
  { id: '1', type: TYPE_LOCK, title: 'Week 3 locked', actor: 'Edward (Admin)', time: '2h ago', group: 'today', category: TAB_WEEKS, severity: 'important' },
  { id: '2', type: TYPE_SCORE, title: 'Score updated: Chiefs @ Bills — 20–17', actor: 'Edward (Admin)', time: '2h ago', group: 'today', category: TAB_GAMES, severity: 'normal' },
  { id: '3', type: TYPE_USER, title: 'Jordan sent reminder', actor: 'Edward (Admin)', time: '3h ago', group: 'today', category: TAB_USERS, severity: 'normal' },
  { id: '4', type: TYPE_STANDINGS, title: 'Standings recalculated', actor: 'Edward (Admin)', time: '5h ago', group: 'today', category: TAB_WEEKS, severity: 'important' },
  { id: '5', type: TYPE_SETTINGS, title: 'Lock time changed to 1:00 PM ET', actor: 'Edward (Admin)', time: '6h ago', group: 'today', category: TAB_SETTINGS, severity: 'critical' },
  { id: '6', type: TYPE_LOCK, title: 'Week 3 unlock override used', actor: 'Edward (Admin)', time: 'Yesterday, 10:15 PM', group: 'yesterday', category: TAB_WEEKS, severity: 'critical' },
  { id: '7', type: TYPE_SCORE, title: 'Game Eagles @ Cowboys marked final — 28–24', actor: 'Edward (Admin)', time: 'Yesterday, 9:30 PM', group: 'yesterday', category: TAB_GAMES, severity: 'normal' },
  { id: '8', type: TYPE_USER, title: 'Taylor promoted to Admin', actor: 'Edward (Admin)', time: 'Yesterday, 2:00 PM', group: 'yesterday', category: TAB_USERS, severity: 'important' },
  { id: '9', type: TYPE_LOCK, title: 'Week 2 locked', actor: 'Edward (Admin)', time: 'Yesterday, 1:02 PM', group: 'yesterday', category: TAB_WEEKS, severity: 'normal' },
  { id: '10', type: TYPE_STANDINGS, title: 'Standings recalculated', actor: 'Edward (Admin)', time: 'Yesterday, 1:05 PM', group: 'yesterday', category: TAB_WEEKS, severity: 'normal' },
  { id: '11', type: TYPE_SCORE, title: 'Score updated: Packers @ Bears — 31–14', actor: 'Edward (Admin)', time: 'Sep 20, 11:00 PM', group: 'earlier', category: TAB_GAMES, severity: 'normal' },
  { id: '12', type: TYPE_USER, title: 'Chris disabled', actor: 'Edward (Admin)', time: 'Sep 20, 4:00 PM', group: 'earlier', category: TAB_USERS, severity: 'important' },
  { id: '13', type: TYPE_SETTINGS, title: 'Tie-breaker rule updated', actor: 'Edward (Admin)', time: 'Sep 19, 3:00 PM', group: 'earlier', category: TAB_SETTINGS, severity: 'critical' },
  { id: '14', type: TYPE_LOCK, title: 'Week 2 unlocked (override)', actor: 'Edward (Admin)', time: 'Sep 18, 8:00 PM', group: 'earlier', category: TAB_WEEKS, severity: 'critical' },
  { id: '15', type: TYPE_SCORE, title: 'Game 49ers @ Rams — result entered', actor: 'Edward (Admin)', time: 'Sep 18, 7:45 PM', group: 'earlier', category: TAB_GAMES, severity: 'normal' },
  { id: '16', type: TYPE_USER, title: 'Jamie sent reminder', actor: 'Edward (Admin)', time: 'Sep 18, 2:00 PM', group: 'earlier', category: TAB_USERS, severity: 'normal' },
  { id: '17', type: TYPE_STANDINGS, title: 'Standings recalculated', actor: 'Edward (Admin)', time: 'Sep 17, 11:00 PM', group: 'earlier', category: TAB_WEEKS, severity: 'normal' },
  { id: '18', type: TYPE_LOCK, title: 'Week 1 locked', actor: 'Edward (Admin)', time: 'Sep 12, 1:00 PM', group: 'earlier', category: TAB_WEEKS, severity: 'normal' },
  { id: '19', type: TYPE_SCORE, title: 'Score updated: Dolphins @ Jets — 24–10', actor: 'Edward (Admin)', time: 'Sep 12, 10:00 PM', group: 'earlier', category: TAB_GAMES, severity: 'normal' },
  { id: '20', type: TYPE_USER, title: 'Pat picks reset for Week 2', actor: 'Edward (Admin)', time: 'Sep 11, 9:00 AM', group: 'earlier', category: TAB_USERS, severity: 'important' },
  { id: '21', type: TYPE_SETTINGS, title: 'League timezone set to America/New_York', actor: 'Edward (Admin)', time: 'Sep 10, 5:00 PM', group: 'earlier', category: TAB_SETTINGS, severity: 'normal' },
  { id: '22', type: TYPE_LOCK, title: 'Week 1 unlocked (override)', actor: 'Edward (Admin)', time: 'Sep 9, 8:30 PM', group: 'earlier', category: TAB_WEEKS, severity: 'critical' },
  { id: '23', type: TYPE_SCORE, title: 'Game Ravens @ Steelers marked final — 17–14', actor: 'Edward (Admin)', time: 'Sep 9, 7:00 PM', group: 'earlier', category: TAB_GAMES, severity: 'normal' },
  { id: '24', type: TYPE_USER, title: 'Alex added as Admin', actor: 'Edward (Admin)', time: 'Sep 8, 12:00 PM', group: 'earlier', category: TAB_USERS, severity: 'important' },
  { id: '25', type: TYPE_STANDINGS, title: 'Standings recalculated', actor: 'Edward (Admin)', time: 'Sep 8, 11:55 PM', group: 'earlier', category: TAB_WEEKS, severity: 'normal' },
  { id: '26', type: TYPE_SETTINGS, title: 'Points per correct pick set to 1', actor: 'Edward (Admin)', time: 'Sep 5, 2:00 PM', group: 'earlier', category: TAB_SETTINGS, severity: 'normal' },
  { id: '27', type: TYPE_LOCK, title: 'Week 0 (preseason) created', actor: 'Edward (Admin)', time: 'Sep 1, 10:00 AM', group: 'earlier', category: TAB_WEEKS, severity: 'normal' },
  { id: '28', type: TYPE_SCORE, title: 'Tie-breaker game set: 49ers @ Rams', actor: 'Edward (Admin)', time: 'Aug 28, 3:00 PM', group: 'earlier', category: TAB_GAMES, severity: 'normal' },
  { id: '29', type: TYPE_USER, title: '14 users invited to league', actor: 'Edward (Admin)', time: 'Aug 25, 6:00 PM', group: 'earlier', category: TAB_USERS, severity: 'normal' },
  { id: '30', type: TYPE_SETTINGS, title: 'League created: Family NFL Picks', actor: 'Edward (Admin)', time: 'Aug 15, 12:00 PM', group: 'earlier', category: TAB_SETTINGS, severity: 'normal' },
]

const GROUP_LABELS = { today: 'Today', yesterday: 'Yesterday', earlier: 'Earlier' }
const GROUP_ORDER = ['today', 'yesterday', 'earlier']

// Mock header stats
const MOCK_SUMMARY = {
  totalShown: 30,
  criticalThisWeek: 5,
}

function filterByTab(entries, tab) {
  if (tab === TAB_ALL) return entries
  return entries.filter((e) => e.category === tab)
}

function groupByTime(entries) {
  const groups = { today: [], yesterday: [], earlier: [] }
  entries.forEach((e) => {
    if (groups[e.group]) groups[e.group].push(e)
  })
  return groups
}

function severityStyles(severity) {
  switch (severity) {
    case 'critical':
      return {
        borderLeft: '3px solid rgba(255,82,82,0.7)',
        bgcolor: 'rgba(255,82,82,0.04)',
      }
    case 'important':
      return {
        borderLeft: '3px solid rgba(255,152,0,0.6)',
        bgcolor: 'rgba(255,152,0,0.04)',
      }
    default:
      return {
        borderLeft: '3px solid transparent',
        bgcolor: 'transparent',
      }
  }
}

function LogRow({ entry }) {
  const styles = severityStyles(entry.severity)
  const icon = ICONS[entry.type] ?? '•'

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1.5,
        py: 1.25,
        px: 2,
        borderRadius: 1,
        transition: 'background-color 0.15s ease',
        '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' },
        ...styles,
      }}
    >
      <Typography sx={{ fontSize: '1rem', lineHeight: 1.4, flexShrink: 0 }} aria-hidden>
        {icon}
      </Typography>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ color: '#e9ecf5', fontWeight: 600, fontSize: '0.875rem', lineHeight: 1.35 }}>
          {entry.title}
        </Typography>
        <Typography sx={{ color: 'rgba(233,236,245,0.5)', fontSize: '0.75rem', mt: 0.25 }}>
          by {entry.actor} · {entry.time}
        </Typography>
      </Box>
    </Box>
  )
}

function SectionGroup({ label, entries }) {
  if (!entries.length) return null

  return (
    <Box sx={{ mb: 3 }}>
      <Typography
        component="h3"
        sx={{
          fontSize: '0.7rem',
          fontWeight: 700,
          letterSpacing: '0.12em',
          color: 'rgba(233,236,245,0.4)',
          textTransform: 'uppercase',
          mb: 1.25,
        }}
      >
        {label}
      </Typography>
      <Stack spacing={0.25} divider={<Divider sx={{ borderColor: 'rgba(255,255,255,0.04)' }} />}>
        {entries.map((entry) => (
          <LogRow key={entry.id} entry={entry} />
        ))}
      </Stack>
    </Box>
  )
}

export default function ActivityLog() {
  const [tab, setTab] = useState(TAB_ALL)

  const filtered = useMemo(() => filterByTab(MOCK_ENTRIES, tab), [tab])
  const grouped = useMemo(() => groupByTime(filtered), [filtered])

  return (
    <Box sx={{ color: '#e9ecf5', p: 2 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 800 }}>
          Activity Log
        </Typography>
        <Typography variant="body2" color="rgba(233,236,245,0.6)" sx={{ fontSize: '0.875rem', mb: 1 }}>
          Audit trail and system history. Real logging will be wired with the backend.
        </Typography>
        <Stack direction="row" flexWrap="wrap" gap={2} sx={{ mt: 1.5 }}>
          <Typography variant="caption" sx={{ color: 'rgba(233,236,245,0.5)', fontSize: '0.8rem' }}>
            Showing last {MOCK_SUMMARY.totalShown} actions
          </Typography>
          <Typography variant="caption" sx={{ color: '#ffb74d', fontSize: '0.8rem', fontWeight: 600 }}>
            {MOCK_SUMMARY.criticalThisWeek} critical actions this week
          </Typography>
        </Stack>
      </Box>

      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          mb: 3,
          '& .MuiTab-root': {
            color: 'rgba(233,236,245,0.5)',
            fontSize: '0.8125rem',
            fontWeight: 500,
            textTransform: 'none',
            minHeight: 40,
            px: 2,
            '&.Mui-selected': { color: '#e9ecf5', fontWeight: 600 },
          },
          '& .MuiTabs-indicator': { backgroundColor: '#7c4dff', height: 2 },
        }}
      >
        <Tab label="All" value={TAB_ALL} />
        <Tab label="Weeks" value={TAB_WEEKS} />
        <Tab label="Games" value={TAB_GAMES} />
        <Tab label="Users" value={TAB_USERS} />
        <Tab label="Settings" value={TAB_SETTINGS} />
      </Tabs>

      <Card sx={glassQuiet}>
        <CardContent sx={{ py: 2, px: 0, '&:last-child': { pb: 2 } }}>
          {filtered.length === 0 ? (
            <Typography sx={{ color: 'rgba(233,236,245,0.5)', fontSize: '0.875rem', textAlign: 'center', py: 4 }}>
              No actions match this filter.
            </Typography>
          ) : (
            <Box sx={{ px: 2 }}>
              {GROUP_ORDER.map((key) => (
                <SectionGroup key={key} label={GROUP_LABELS[key]} entries={grouped[key] || []} />
              ))}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}
