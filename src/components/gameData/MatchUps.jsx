import * as React from 'react'
import {
  Container,
  Grid,
  Paper,
  Typography,
  Radio,
  FormControlLabel,
  Button,
  Box,
  Card,
  CardContent,
} from '@mui/material'
import Divider from '@mui/material/Divider'

const nflTeams = [
  { team1: 'Dallas Cowboys', team2: 'Green Bay Packers' },
  { team1: 'Kansas City Chiefs', team2: 'San Francisco 49ers' },
  { team1: 'New England Patriots', team2: 'Philadelphia Eagles' },
  { team1: 'Pittsburgh Steelers', team2: 'Seattle Seahawks' },
  { team1: 'Chicago Bears', team2: 'Minnesota Vikings' },
  { team1: 'Denver Broncos', team2: 'Las Vegas Raiders' },
  { team1: 'Los Angeles Rams', team2: 'Miami Dolphins' },
  { team1: 'Buffalo Bills', team2: 'Tampa Bay Buccaneers' },
  { team1: 'New York Giants', team2: 'New York Jets' },
  { team1: 'Baltimore Ravens', team2: 'Cleveland Browns' },
  { team1: 'Cincinnati Bengals', team2: 'Houston Texans' },
  { team1: 'Indianapolis Colts', team2: 'Jacksonville Jaguars' },
  { team1: 'Tennessee Titans', team2: 'Arizona Cardinals' },
  { team1: 'Atlanta Falcons', team2: 'Carolina Panthers' },
  { team1: 'New Orleans Saints', team2: 'Detroit Lions' },
  { team1: 'Los Angeles Chargers', team2: 'Washington Commanders' },
]

export default function MatchupSelector() {
  const [selectedTeams, setSelectedTeams] = React.useState(Array(16).fill(''))

  const handleSelectionChange = (index, value) => {
    const newSelections = [...selectedTeams]
    newSelections[index] = value
    setSelectedTeams(newSelections)
  }

  const handleSubmit = () => {
    console.log('Selected Teams:', selectedTeams)
  }

  const getCurrentDateTime = () => {
    const now = new Date()
    return `${now.toLocaleDateString('en-US', { weekday: 'long' })}, ${now.toLocaleString()}`
  }

  return (
    <Container>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{ height: 140, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
          >
            <CardContent>
              <Typography align="center">Current Pot Size</Typography>
              <Typography variant="h6" align="center">
                $150
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              height: 140,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              // backgroundColor: '#2c2c2c', // Lighter grey color
            }}
          >
            <CardContent>
              <Typography align="center">Total Games</Typography>
              <Typography variant="h6" align="center">
                16
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              height: 140,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              // backgroundColor: '#2c2c2c', // Lighter grey color
            }}
          >
            <CardContent>
              <Typography align="center">Remaining Weeks</Typography>
              <Typography variant="h6" align="center">
                11
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{ height: 140, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
          >
            <CardContent>
              <Typography align="center">Submission Deadline</Typography>
              <Typography align="center">
                {/*  add a timer count down here */}
                2d:10hrs:30mins:16secs
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h6" gutterBottom>
          Matchup Selector
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={3}>
          {nflTeams.map((matchup, index) => (
            <Grid item xs={12} key={index}>
              <Paper sx={{ p: 4, position: 'relative', maxWidth: 600, margin: 'auto' }}>
                <Typography variant="caption" sx={{ position: 'absolute', top: 8, left: 8 }}>
                  {getCurrentDateTime()}
                </Typography>
                <Grid container alignItems="center" justifyContent="center" spacing={2}>
                  <Grid
                    item
                    xs={12}
                    sm={5}
                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <img
                      src="https://images.unsplash.com/photo-1537569894557-62db9d9bf404?q=80&w=3570&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      alt={matchup.team1}
                      style={{
                        width: '50px',
                        height: '50px',
                        marginRight: '10px',
                        borderRadius: '50%',
                      }}
                    />
                    <Typography variant="body1" sx={{ mr: 2 }}>
                      {matchup.team1}
                    </Typography>
                    <FormControlLabel value={matchup.team1} control={<Radio />} label="" />
                  </Grid>
                  <Grid item xs={12} sm={2} sx={{ textAlign: 'center' }}>
                    <Typography variant="body1">vs</Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={5}
                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <FormControlLabel value={matchup.team2} control={<Radio />} label="" />
                    <Typography variant="body1" sx={{ ml: 2 }}>
                      {matchup.team2}
                    </Typography>
                    <img
                      src="https://images.unsplash.com/photo-1537569894557-62db9d9bf404?q=80&w=3570&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      alt={matchup.team2}
                      style={{
                        width: '50px',
                        height: '50px',
                        marginLeft: '10px',
                        borderRadius: '50%',
                      }}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}
