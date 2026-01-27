import React from 'react'
import { Card, CardContent, Typography, Stack } from '@mui/material'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import WhatshotIcon from '@mui/icons-material/Whatshot'
import AcUnitIcon from '@mui/icons-material/AcUnit'
import { glassyCard } from '../../styles/adminStyles'

const StatRow = ({ label, value }) => (
  <Stack direction="row" justifyContent="space-between" sx={{ mb: 1.25 }}>
    <Typography
      variant="body2"
      sx={{ color: 'rgba(233,236,245,0.5)', fontSize: '0.75rem', fontWeight: 500 }}
    >
      {label}
    </Typography>
    <Typography variant="body2" sx={{ color: '#e9ecf5', fontWeight: 600, fontSize: '0.875rem' }}>
      {value}
    </Typography>
  </Stack>
)

const UserRecapCard = ({ lastWeekRecord, seasonRecord, currentRank, streak }) => (
  <Card sx={glassyCard}>
    <CardContent sx={{ color: '#e9ecf5', py: 2.5, px: 2.5 }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <EmojiEventsIcon sx={{ fontSize: 18, color: 'rgba(233,236,245,0.5)' }} />
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'rgba(233,236,245,0.95)' }}>
          Your Recap
        </Typography>
      </Stack>
      <StatRow label="Last week" value={lastWeekRecord} />
      <StatRow label="Season" value={seasonRecord} />
      <StatRow label="Current rank" value={currentRank} />
      {streak && (
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{ mt: 1.5, pt: 1.5, borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          {streak.type === 'hot' ? (
            <WhatshotIcon sx={{ fontSize: 18, color: '#ff8a80' }} />
          ) : (
            <AcUnitIcon sx={{ fontSize: 18, color: '#81c784' }} />
          )}
          <Typography
            variant="body2"
            sx={{
              color: streak.type === 'hot' ? '#ff8a80' : '#81c784',
              fontSize: '0.8125rem',
              fontWeight: 500,
            }}
          >
            {streak.label}
          </Typography>
        </Stack>
      )}
    </CardContent>
  </Card>
)

export default UserRecapCard
