import React from 'react'
import {
  Typography,
  Grid,
  Box,
  // Paper,
  // Tabs,
  // Tab,
  Card,
  CardContent,
  LinearProgress,
  CircularProgress,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { styled } from '@mui/system'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'

const TicketContainer = styled(Card)({
  border: '2px solid #000',
  padding: '10px',
  marginBottom: '10px',
  backgroundColor: '#fffbe6',
  textAlign: 'left',
  fontFamily: 'monospace',
})

const TicketHeader = styled(Box)({
  borderBottom: '1px dashed #000',
  paddingBottom: '5px',
  marginBottom: '10px',
})

const TicketFooter = styled(Box)({
  borderTop: '1px dashed #000',
  paddingTop: '5px',
  marginTop: '10px',
})

// const StyledTabs = styled(Tabs)({
//   marginBottom: '20px',
// })

const StatCard = styled(Card)({
  padding: '20px',
  textAlign: 'center',
  backgroundColor: '#f1f1f1',
})

const UsersDashboard = () => {
  const weeks = [
    {
      weekNumber: 1,
      games: [
        { matchup: 'Cowboys vs. Buccaneers', date: 'September 9, 2024', time: '8:20 PM ET' },
        { matchup: 'Eagles vs. Falcons', date: 'September 12, 2024', time: '1:00 PM ET' },
        // ... other games for week 1
      ],
    },
    {
      weekNumber: 2,
      games: [
        { matchup: 'Giants vs. Washington', date: 'September 16, 2024', time: '8:20 PM ET' },
        { matchup: 'Bengals vs. Bears', date: 'September 19, 2024', time: '1:00 PM ET' },
        // ... other games for week 2
      ],
    },
    // Add more weeks as needed
  ]

  const userStats = {
    record: '10-6',
    status: 'Investor',
    totalBets: 16,
    amountWon: '$1200',
    betSuccessRate: 62.5,
    amountWonPercentage: 75,
  }

  return (
    <Box padding={2}>
      <Typography variant="h4" gutterBottom>
        User's NFL Game Picks
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={4}>
          <StatCard>
            <Typography variant="h6" gutterBottom>
              Status: {userStats.status}
            </Typography>
            <Box display="flex" alignItems="center" justifyContent="space-between" marginBottom={2}>
              <Typography variant="body1">Record: {userStats.record}</Typography>
              <Typography variant="body1">Total Bets: {userStats.totalBets}</Typography>
            </Box>
            <Box display="flex" alignItems="center" justifyContent="space-between" marginBottom={2}>
              <Typography variant="body1">Amount Won: {userStats.amountWon}</Typography>
              <Typography variant="body1">Bet Success Rate:</Typography>
              <CircularProgress variant="determinate" value={userStats.betSuccessRate} />
              {/*<CircularProgressLabel>{`${userStats.betSuccessRate}%`}</CircularProgressLabel>*/}
            </Box>
            <Box>
              <Typography variant="body1" gutterBottom>
                Amount Won Percentage:
              </Typography>
              <LinearProgress variant="determinate" value={userStats.amountWonPercentage} />
              <Typography variant="caption">{`${userStats.amountWonPercentage}%`}</Typography>
            </Box>
          </StatCard>
        </Grid>

        <Grid item xs={12} md={8}>
          {weeks.map((week, index) => (
            <Accordion key={index}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`week-${week.weekNumber}-content`}
                id={`week-${week.weekNumber}-header`}
              >
                <Typography variant="h6">Week {week.weekNumber}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {week.games.map((game, gameIndex) => (
                  <TicketContainer key={gameIndex}>
                    <CardContent>
                      <TicketHeader>
                        <Typography variant="h6" align="center">
                          Straight Bet
                        </Typography>
                        <Typography variant="body2" align="center">
                          Week {week.weekNumber}: {game.date.split(' ')[1]} -{' '}
                          {game.date.split(' ')[2]}, 2024
                        </Typography>
                      </TicketHeader>
                      <Box marginY={2}>
                        <Typography variant="body2" display="block">
                          {game.matchup}
                        </Typography>
                        <Typography variant="caption" display="block">
                          {game.date} - {game.time}
                        </Typography>
                      </Box>
                      <TicketFooter>
                        <Typography variant="body2" align="center">
                          Bet Amount: $50
                        </Typography>
                      </TicketFooter>
                    </CardContent>
                  </TicketContainer>
                ))}
              </AccordionDetails>
            </Accordion>
          ))}
        </Grid>
      </Grid>
    </Box>
  )
}

export default UsersDashboard
