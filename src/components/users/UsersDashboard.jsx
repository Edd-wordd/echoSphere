import React from 'react'
import { Typography, Grid, Box } from '@mui/material'
import ThisWeekCard from '../dashboard/ThisWeekCard'
import LeaderboardCard from '../dashboard/LeaderboardCard'
import UserRecapCard from '../dashboard/UserRecapCard'
import NextGameCard from '../dashboard/NextGameCard'

const UsersDashboard = ({ onManagePicks = () => {}, onViewLeaderboard = () => {} }) => {
  const dashboardModel = {
    currentWeek: 3,
    user: { id: 'u1', displayName: 'You', role: 'user' },
    gamesThisWeek: [
      {
        id: 'g1',
        week: 3,
        kickoffAt: '2024-10-01T18:25:00Z',
        homeTeam: { id: 'BUF', name: 'Bills', abbrev: 'BUF' },
        awayTeam: { id: 'KC', name: 'Chiefs', abbrev: 'KC' },
        favoriteTeamId: 'KC',
        status: 'FINAL',
        winningTeamId: 'KC',
      },
      {
        id: 'g2',
        week: 3,
        kickoffAt: '2024-10-01T20:25:00Z',
        homeTeam: { id: 'PHI', name: 'Eagles', abbrev: 'PHI' },
        awayTeam: { id: 'DAL', name: 'Cowboys', abbrev: 'DAL' },
        favoriteTeamId: 'PHI',
        status: 'FINAL',
        winningTeamId: 'PHI',
      },
      {
        id: 'g3',
        week: 3,
        kickoffAt: '2024-10-02T00:15:00Z',
        homeTeam: { id: 'CHI', name: 'Bears', abbrev: 'CHI' },
        awayTeam: { id: 'GB', name: 'Packers', abbrev: 'GB' },
        status: 'SCHEDULED',
      },
      {
        id: 'g4',
        week: 3,
        kickoffAt: '2024-10-03T00:20:00Z',
        homeTeam: { id: 'LAR', name: 'Rams', abbrev: 'LAR' },
        awayTeam: { id: 'SF', name: '49ers', abbrev: 'SF' },
        favoriteTeamId: 'SF',
        status: 'SCHEDULED',
      },
    ],
    weekPicks: {
      week: 3,
      userId: 'u1',
      submittedAt: '2024-09-30T18:00:00Z',
      lockAt: '2024-10-01T18:25:00Z',
      picks: [
        { gameId: 'g1', pickedTeamId: 'KC' },
        { gameId: 'g2', pickedTeamId: 'PHI' },
        { gameId: 'g3', pickedTeamId: 'GB' },
        { gameId: 'g4', pickedTeamId: 'SF' },
      ],
    },
    weekResult: {
      completed: true,
      message: '🏆 You went 10–6 last week — tied for 1st',
    },
  }

  const thisWeek = {
    weekNumber: dashboardModel.currentWeek,
    picksSubmitted: !!dashboardModel.weekPicks.submittedAt,
    lockDeadline: 'Sun, 1:00 PM ET',
    lockAt: dashboardModel.weekPicks.lockAt,
    games: dashboardModel.gamesThisWeek,
    picks: dashboardModel.weekPicks.picks,
    tieBreaker: {
      matchup: `${dashboardModel.gamesThisWeek[1].awayTeam.name} @ ${dashboardModel.gamesThisWeek[1].homeTeam.name}`,
      kickoff: new Date(dashboardModel.gamesThisWeek[1].kickoffAt).toLocaleString(),
      totalPoints: 47,
    },
  }

  const leaderboard = [
    { userId: 'u2', displayName: 'Alex', record: '10-2', points: 20, rank: 1, rankDelta: 1 },
    { userId: 'u3', displayName: 'Jordan', record: '9-3', points: 18, rank: 2, rankDelta: 0 },
    { userId: 'u4', displayName: 'Sam', record: '9-3', points: 17, rank: 3, rankDelta: 1 },
    { userId: 'u5', displayName: 'Taylor', record: '8-4', points: 16, rank: 4, rankDelta: -1 },
    { userId: 'u6', displayName: 'Chris', record: '8-4', points: 15, rank: 5, rankDelta: 0 },
    { userId: 'u7', displayName: 'Morgan', record: '7-5', points: 14, rank: 6, rankDelta: 0 },
    { userId: 'u8', displayName: 'Jamie', record: '7-5', points: 13, rank: 7, rankDelta: -1 },
    { userId: 'u9', displayName: 'Pat', record: '6-6', points: 12, rank: 8, rankDelta: 0 },
    { userId: 'u10', displayName: 'Riley', record: '6-6', points: 11, rank: 9, rankDelta: 0 },
    { userId: 'u11', displayName: 'Jordan B', record: '5-7', points: 10, rank: 10, rankDelta: 0 },
    // filler ranks to push current user out of top 10
    { userId: 'u12', displayName: 'Casey', record: '5-7', points: 9, rank: 11, rankDelta: 0 },
    { userId: 'u13', displayName: 'Dakota', record: '5-7', points: 8, rank: 12, rankDelta: 0 },
    { userId: 'u14', displayName: 'Alexis', record: '5-7', points: 7, rank: 13, rankDelta: 0 },
    { userId: 'u15', displayName: 'Cameron', record: '4-8', points: 6, rank: 14, rankDelta: 0 },
    { userId: 'u16', displayName: 'Shawn', record: '4-8', points: 5, rank: 15, rankDelta: 0 },
    { userId: 'u17', displayName: 'Rowan', record: '4-8', points: 4, rank: 16, rankDelta: 0 },
    { userId: 'u18', displayName: 'Skyler', record: '3-9', points: 3, rank: 17, rankDelta: 0 },
    { userId: 'u19', displayName: 'Avery', record: '3-9', points: 2, rank: 18, rankDelta: 0 },
    { userId: 'u20', displayName: 'Quinn', record: '3-9', points: 2, rank: 19, rankDelta: 0 },
    { userId: 'u21', displayName: 'Reese', record: '3-9', points: 2, rank: 20, rankDelta: 0 },
    { userId: 'u22', displayName: 'Blake', record: '3-9', points: 1, rank: 21, rankDelta: 0 },
    { userId: 'u23', displayName: 'Peyton', record: '2-10', points: 1, rank: 22, rankDelta: 0 },
    { userId: 'u24', displayName: 'Drew', record: '2-10', points: 1, rank: 23, rankDelta: 0 },
    { userId: 'u25', displayName: 'Harper', record: '2-10', points: 1, rank: 24, rankDelta: 0 },
    { userId: 'u26', displayName: 'Sawyer', record: '1-11', points: 0, rank: 25, rankDelta: 0 },
    { userId: 'u27', displayName: 'Rory', record: '1-11', points: 0, rank: 26, rankDelta: 0 },
    { userId: 'u28', displayName: 'Jordan C', record: '1-11', points: 0, rank: 27, rankDelta: 0 },
    { userId: 'u29', displayName: 'Devon', record: '1-11', points: 0, rank: 28, rankDelta: 0 },
    { userId: 'u30', displayName: 'Lane', record: '1-11', points: 0, rank: 29, rankDelta: 0 },
    { userId: 'u31', displayName: 'River', record: '1-11', points: 0, rank: 30, rankDelta: 0 },
    { userId: 'u32', displayName: 'Case', record: '1-11', points: 0, rank: 31, rankDelta: 0 },
    { userId: 'u1', displayName: 'You', record: '1-11', points: 0, rank: 32, rankDelta: 0 },
  ]

  const recap = {
    lastWeekRecord: '10-6',
    seasonRecord: '8-4',
    currentRank: '2 of 12',
    streak: { type: 'hot', label: 'Current streak: 3 wins' },
  }

  const nextGame = {
    matchup: 'Chiefs @ Bills',
    kickoffTime: 'Sun, 4:25 PM ET',
    timeUntil: 'Kickoff in 2d 5h',
  }

  return (
    <Box padding={2}>
      {dashboardModel.weekResult?.completed && dashboardModel.weekResult.message && (
        <Box
          mb={2}
          p={2}
          sx={{
            backgroundColor: 'success.light',
            color: 'success.contrastText',
            borderRadius: 1,
          }}
        >
          <Typography variant="body1" fontWeight={600}>
            {dashboardModel.weekResult.message}
          </Typography>
        </Box>
      )}
      <Typography variant="h4" gutterBottom>
        Family NFL Picks
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={6}>
          <ThisWeekCard
            weekNumber={thisWeek.weekNumber}
            picksSubmitted={thisWeek.picksSubmitted}
            lockDeadline={thisWeek.lockDeadline}
            lockAt={thisWeek.lockAt}
            games={thisWeek.games}
            picks={thisWeek.picks}
            onManagePicks={onManagePicks}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <LeaderboardCard
            entries={leaderboard}
            currentUserId={dashboardModel.user.id}
            onViewFull={onViewLeaderboard}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <UserRecapCard
            lastWeekRecord={recap.lastWeekRecord}
            seasonRecord={recap.seasonRecord}
            currentRank={recap.currentRank}
            streak={recap.streak}
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
