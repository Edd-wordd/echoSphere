import React from 'react'
import { Typography, Grid, Box } from '@mui/material'
import ThisWeekCard from '../dashboard/ThisWeekCard'
import LeaderboardCard from '../dashboard/LeaderboardCard'
import UserRecapCard from '../dashboard/UserRecapCard'
import NextGameCard from '../dashboard/NextGameCard'

const UsersDashboard = ({ onManagePicks = () => {} }) => {
  const thisWeek = {
    weekNumber: 3,
    picksSubmitted: true,
    lockDeadline: 'Sun, 1:00 PM ET',
  }

  const leaderboard = [
    { id: 'u1', name: 'You', record: '8-4', points: 16 },
    { id: 'u2', name: 'Alex', record: '7-5', points: 14 },
    { id: 'u3', name: 'Jordan', record: '7-5', points: 13 },
    { id: 'u4', name: 'Sam', record: '6-6', points: 12 },
    { id: 'u5', name: 'Taylor', record: '6-6', points: 11 },
  ]

  const recap = {
    lastWeekRecord: '3-2',
    seasonRecord: '8-4',
    currentRank: '2 of 12',
  }

  const nextGame = {
    matchup: 'Chiefs @ Bills',
    kickoffTime: 'Sun, 4:25 PM ET',
    timeUntil: 'Kickoff in 2d 5h',
  }

  return (
    <Box padding={2}>
      <Typography variant="h4" gutterBottom>
        Family NFL Picks
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={6}>
          <ThisWeekCard
            weekNumber={thisWeek.weekNumber}
            picksSubmitted={thisWeek.picksSubmitted}
            lockDeadline={thisWeek.lockDeadline}
            onManagePicks={onManagePicks}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <LeaderboardCard entries={leaderboard} currentUserId="u1" />
        </Grid>
        <Grid item xs={12} md={6}>
          <UserRecapCard
            lastWeekRecord={recap.lastWeekRecord}
            seasonRecord={recap.seasonRecord}
            currentRank={recap.currentRank}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <NextGameCard
            matchup={nextGame.matchup}
            kickoffTime={nextGame.kickoffTime}
            timeUntil={nextGame.timeUntil}
          />
        </Grid>
      </Grid>
    </Box>
  )
}

export default UsersDashboard
