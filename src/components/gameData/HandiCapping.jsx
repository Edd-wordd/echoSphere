import * as React from 'react'
import {
  Container,
  Grid,
  Typography,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Card,
  CardContent,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import WarningIcon from '@mui/icons-material/Warning'

const weatherData = [
  {
    game: 'Dallas Cowboys vs Green Bay Packers',
    weather: 'Clear skies, 75°F',
    impact: 'No significant weather impact expected.',
  },
  {
    game: 'Kansas City Chiefs vs San Francisco 49ers',
    weather: 'Rainy, 60°F',
    impact: 'Wet field conditions could affect passing game.',
  },
]

const injuryData = [
  {
    team: 'Dallas Cowboys',
    injuries: ['Player A - Ankle injury, questionable', 'Player B - Concussion, out'],
  },
  {
    team: 'Green Bay Packers',
    injuries: ['Player C - Knee injury, probable', 'Player D - Hamstring injury, questionable'],
  },
]

const bettingInfoData = [
  {
    game: 'Dallas Cowboys vs Green Bay Packers',
    info: 'The Cowboys have covered the spread in 5 of their last 7 games against the Packers.',
    odds: 'Cowboys -3.5',
  },
  {
    game: 'Kansas City Chiefs vs San Francisco 49ers',
    info: 'The Chiefs are 4-1 against the spread in their last 5 road games.',
    odds: 'Chiefs -2.5',
  },
]

const refereeData = [
  {
    game: 'Dallas Cowboys vs Green Bay Packers',
    referees: 'Referee A, Umpire B, Judge C',
  },
  {
    game: 'Kansas City Chiefs vs San Francisco 49ers',
    referees: 'Referee D, Umpire E, Judge F',
  },
]

const teamStatsData = [
  {
    game: 'Dallas Cowboys vs Green Bay Packers',
    stats: 'Cowboys: Offense Rank 5, Defense Rank 7. Packers: Offense Rank 8, Defense Rank 12.',
  },
  {
    game: 'Kansas City Chiefs vs San Francisco 49ers',
    stats: 'Chiefs: Offense Rank 2, Defense Rank 10. 49ers: Offense Rank 6, Defense Rank 3.',
  },
]

const playerPerformanceData = [
  {
    game: 'Dallas Cowboys vs Green Bay Packers',
    performance:
      'Cowboys: Player A - 3 TDs in last 2 games. Packers: Player B - 250+ yards in last 3 games.',
  },
  {
    game: 'Kansas City Chiefs vs San Francisco 49ers',
    performance:
      'Chiefs: Player C - 4 TDs in last 2 games. 49ers: Player D - 300+ yards in last 3 games.',
  },
]

const headToHeadData = [
  {
    game: 'Dallas Cowboys vs Green Bay Packers',
    history: 'Cowboys: 5 wins, Packers: 3 wins in last 8 matchups.',
  },
  {
    game: 'Kansas City Chiefs vs San Francisco 49ers',
    history: 'Chiefs: 6 wins, 49ers: 4 wins in last 10 matchups.',
  },
]

const expertPredictionsData = [
  {
    game: 'Dallas Cowboys vs Green Bay Packers',
    prediction: 'Experts favor Cowboys to win by 3 points.',
  },
  {
    game: 'Kansas City Chiefs vs San Francisco 49ers',
    prediction: 'Experts favor Chiefs to win by 4 points.',
  },
]

const recentFormData = [
  {
    game: 'Dallas Cowboys vs Green Bay Packers',
    form: 'Cowboys: 3 wins in last 5 games. Packers: 2 wins in last 5 games.',
  },
  {
    game: 'Kansas City Chiefs vs San Francisco 49ers',
    form: 'Chiefs: 4 wins in last 5 games. 49ers: 3 wins in last 5 games.',
  },
]

const venueData = [
  {
    game: 'Dallas Cowboys vs Green Bay Packers',
    venue: 'AT&T Stadium: Cowboys 5-1 at home this season. Packers 3-3 on the road.',
  },
  {
    game: 'Kansas City Chiefs vs San Francisco 49ers',
    venue: 'Arrowhead Stadium: Chiefs 6-0 at home this season. 49ers 2-4 on the road.',
  },
]

export default function HadiCapping() {
  const [selectedTab, setSelectedTab] = React.useState(0)

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue)
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom align="center" sx={{ mt: 4 }}>
        HadiCapping NFL News
      </Typography>
      <Divider sx={{ mb: 4 }} />
      <Tabs value={selectedTab} onChange={handleChange} centered>
        <Tab label="Overview" />
        <Tab label="Details" />
      </Tabs>
      {selectedTab === 0 && (
        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h5">Weather Updates</Typography>
                {weatherData.map((weather, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Typography variant="h6">{weather.game}</Typography>
                    <Typography variant="body1">{weather.weather}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {weather.impact}
                    </Typography>
                    <Divider sx={{ mt: 1, mb: 1 }} />
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h5">Injury Reports</Typography>
                {injuryData.map((team, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Typography variant="h6">{team.team}</Typography>
                    <List>
                      {team.injuries.map((injury, idx) => (
                        <ListItem key={idx}>
                          <ListItemIcon>
                            <WarningIcon color="error" />
                          </ListItemIcon>
                          <ListItemText primary={injury} />
                        </ListItem>
                      ))}
                    </List>
                    <Divider sx={{ mt: 1, mb: 1 }} />
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
      {selectedTab === 1 && (
        <Box sx={{ mt: 4 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h5">Betting Information</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {bettingInfoData.map((bettingInfo, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Typography variant="h6">{bettingInfo.game}</Typography>
                      <Typography variant="body1">{bettingInfo.info}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Odds: {bettingInfo.odds}
                      </Typography>
                      <Divider sx={{ mt: 1, mb: 1 }} />
                    </Box>
                  ))}
                </AccordionDetails>
              </Accordion>
            </Grid>
            <Grid item xs={12} md={6}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h5">Referee Information</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {refereeData.map((referee, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Typography variant="h6">{referee.game}</Typography>
                      <Typography variant="body1">{referee.referees}</Typography>
                      <Divider sx={{ mt: 1, mb: 1 }} />
                    </Box>
                  ))}
                </AccordionDetails>
              </Accordion>
            </Grid>
            <Grid item xs={12} md={6}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h5">Team Statistics</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {teamStatsData.map((stats, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Typography variant="h6">{stats.game}</Typography>
                      <Typography variant="body1">{stats.stats}</Typography>
                      <Divider sx={{ mt: 1, mb: 1 }} />
                    </Box>
                  ))}
                </AccordionDetails>
              </Accordion>
            </Grid>
            <Grid item xs={12} md={6}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h5">Player Performance Trends</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {playerPerformanceData.map((performance, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Typography variant="h6">{performance.game}</Typography>
                      <Typography variant="body1">{performance.performance}</Typography>
                      <Divider sx={{ mt: 1, mb: 1 }} />
                    </Box>
                  ))}
                </AccordionDetails>
              </Accordion>
            </Grid>
            <Grid item xs={12} md={6}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h5">Head-to-Head Matchups</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {headToHeadData.map((history, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Typography variant="h6">{history.game}</Typography>
                      <Typography variant="body1">{history.history}</Typography>
                      <Divider sx={{ mt: 1, mb: 1 }} />
                    </Box>
                  ))}
                </AccordionDetails>
              </Accordion>
            </Grid>
            <Grid item xs={12} md={6}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h5">Expert Predictions</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {expertPredictionsData.map((prediction, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Typography variant="h6">{prediction.game}</Typography>
                      <Typography variant="body1">{prediction.prediction}</Typography>
                      <Divider sx={{ mt: 1, mb: 1 }} />
                    </Box>
                  ))}
                </AccordionDetails>
              </Accordion>
            </Grid>
            <Grid item xs={12} md={6}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h5">Recent Form</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {recentFormData.map((form, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Typography variant="h6">{form.game}</Typography>
                      <Typography variant="body1">{form.form}</Typography>
                      <Divider sx={{ mt: 1, mb: 1 }} />
                    </Box>
                  ))}
                </AccordionDetails>
              </Accordion>
            </Grid>
            <Grid item xs={12} md={6}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h5">Venue Information</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {venueData.map((venue, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Typography variant="h6">{venue.game}</Typography>
                      <Typography variant="body1">{venue.venue}</Typography>
                      <Divider sx={{ mt: 1, mb: 1 }} />
                    </Box>
                  ))}
                </AccordionDetails>
              </Accordion>
            </Grid>
          </Grid>
        </Box>
      )}
    </Container>
  )
}
