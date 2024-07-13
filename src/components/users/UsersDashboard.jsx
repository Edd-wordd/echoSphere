import React from 'react'
import { Typography, Grid, Box, Paper } from '@mui/material'
import { styled } from '@mui/system'

const TicketContainer = styled(Paper)({
  border: '2px solid #000',
  padding: '10px',
  marginBottom: '10px',
  backgroundColor: '#fffbe6',
  textAlign: 'left',
  fontFamily: 'monospace',
  maxWidth: '400px',
  margin: '0 auto',
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

const usersDashboard = () => {
  const week1Games = [
    { matchup: 'Cowboys vs. Buccaneers', date: 'September 9, 2024', time: '8:20 PM ET' },
    { matchup: 'Eagles vs. Falcons', date: 'September 12, 2024', time: '1:00 PM ET' },
    { matchup: 'Steelers vs. Bills', date: 'September 12, 2024', time: '1:00 PM ET' },
    { matchup: 'Vikings vs. Bengals', date: 'September 12, 2024', time: '1:00 PM ET' },
    { matchup: '49ers vs. Lions', date: 'September 12, 2024', time: '1:00 PM ET' },
    { matchup: 'Cardinals vs. Titans', date: 'September 12, 2024', time: '1:00 PM ET' },
    { matchup: 'Seahawks vs. Colts', date: 'September 12, 2024', time: '1:00 PM ET' },
    { matchup: 'Chargers vs. Washington', date: 'September 12, 2024', time: '1:00 PM ET' },
    { matchup: 'Jets vs. Panthers', date: 'September 12, 2024', time: '1:00 PM ET' },
    { matchup: 'Jaguars vs. Texans', date: 'September 12, 2024', time: '1:00 PM ET' },
    { matchup: 'Browns vs. Chiefs', date: 'September 12, 2024', time: '4:25 PM ET' },
    { matchup: 'Dolphins vs. Patriots', date: 'September 12, 2024', time: '4:25 PM ET' },
    { matchup: 'Packers vs. Saints', date: 'September 12, 2024', time: '4:25 PM ET' },
    { matchup: 'Broncos vs. Giants', date: 'September 12, 2024', time: '4:25 PM ET' },
    { matchup: 'Bears vs. Rams', date: 'September 12, 2024', time: '8:20 PM ET' },
    { matchup: 'Ravens vs. Raiders', date: 'September 13, 2024', time: '8:15 PM ET' },
  ]

  return (
    <Box padding={2}>
      <Typography variant="h4" gutterBottom>
        User's NFL Game Picks - Week 1
      </Typography>
      <Grid container justifyContent="center">
        <Grid item xs={12} md={8}>
          <TicketContainer>
            <TicketHeader>
              <Typography variant="h6" align="center">
                Straight Bet
              </Typography>
              <Typography variant="body2" align="center">
                Week 1: September 9 - September 13, 2024
              </Typography>
            </TicketHeader>
            {week1Games.map((game, index) => (
              <Box key={index} marginBottom={1}>
                <Typography variant="body2" display="block">
                  {game.matchup}
                </Typography>
                <Typography variant="caption" display="block">
                  {game.date} - {game.time}
                </Typography>
              </Box>
            ))}
            <TicketFooter>
              <Typography variant="body2" align="center">
                Bet Amount: $50
              </Typography>
            </TicketFooter>
          </TicketContainer>
        </Grid>
      </Grid>
    </Box>
  )
}

export default usersDashboard
