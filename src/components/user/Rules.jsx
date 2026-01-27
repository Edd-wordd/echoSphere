import React, { useState } from 'react'
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Stack,
  Divider,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Tabs,
  Tab,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import SportsFootballOutlinedIcon from '@mui/icons-material/SportsFootballOutlined'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { glassyCard } from '../../styles/adminStyles'

const coreRules = [
  'Pick the winner for each matchup every week.',
  'Picks lock at the first kickoff of the week.',
  'You can edit picks until the lock time.',
  'If you miss the deadline: picks count as “no pick” (0 points).',
]

const scoringRules = [
  '1 point per correct pick (MVP).',
  'No penalty for incorrect picks (0 points).',
  'Weekly total = number of correct picks.',
  'Season total = sum of weekly totals.',
]

const tiebreakers = [
  'First: most correct picks this season.',
  'Second: best record last week.',
  'Final: coin flip / admin decides.',
]

const fairPlay = [
  'No changing picks after lock.',
  'Don’t share others’ picks before lock.',
  'Keep it friendly—this is for fun.',
]

const faqItems = [
  {
    q: 'When do picks lock?',
    a: 'At the first kickoff of the week. Make sure to save before then.',
  },
  {
    q: 'Can I edit my picks after submitting?',
    a: 'Yes, until lock time. After lock, picks are frozen.',
  },
  {
    q: 'What happens if I forget to submit picks?',
    a: 'They count as “no pick” (0 points) for that game.',
  },
  {
    q: 'How is the leaderboard calculated?',
    a: 'Season points = sum of weekly correct picks. 1 point per correct pick.',
  },
  {
    q: 'Why do I see “Locked” on my dashboard?',
    a: 'The week has started and picks are frozen until next week.',
  },
  {
    q: 'How do I invite family members?',
    a: 'Ask the admin to add them for now.',
  },
]

const SectionCard = ({ title, children, id }) => (
  <Card id={id} sx={{ ...glassyCard, mb: 3 }}>
    <CardContent sx={{ py: 2.5, px: 2.5 }}>
      <Typography
        variant="h6"
        sx={{
          color: '#e9ecf5',
          fontWeight: 600,
          fontSize: '1.125rem',
          mb: 2,
        }}
        gutterBottom
      >
        {title}
      </Typography>
      <Stack spacing={1}>{children}</Stack>
    </CardContent>
  </Card>
)

export default function RulesData() {
  const [activeTab, setActiveTab] = useState(0)

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
    // Scroll to section
    const sections = ['core-rules', 'scoring', 'tiebreakers', 'fair-play', 'faq']
    const element = document.getElementById(sections[newValue])
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: 4, color: '#e9ecf5' }}>
      {/* Page Header */}
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
        <SportsFootballOutlinedIcon
          sx={{
            fontSize: 32,
            color: 'rgba(124,77,255,0.7)',
          }}
        />
        <Stack spacing={0.5}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: 'rgba(233,236,245,0.95)',
              fontSize: { xs: '1.5rem', sm: '2rem' },
            }}
          >
            Family NFL Picks
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(233,236,245,0.6)',
              fontSize: '0.8125rem',
            }}
          >
            Rules &amp; FAQ
          </Typography>
        </Stack>
      </Stack>

      {/* Info Banner */}
      <Alert
        severity="info"
        icon={<InfoOutlinedIcon />}
        sx={{
          mb: 3,
          bgcolor: 'rgba(33,150,243,0.1)',
          border: '1px solid rgba(33,150,243,0.2)',
          color: '#90caf9',
          '& .MuiAlert-icon': {
            color: '#64b5f6',
          },
          '& .MuiAlert-message': {
            color: '#90caf9',
          },
        }}
      >
        Make your picks before kickoff. Picks lock at the first game of the week.
      </Alert>

      {/* Tabs Navigation */}
      <Box sx={{ mb: 3, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              color: 'rgba(233,236,245,0.6)',
              fontSize: '0.875rem',
              fontWeight: 500,
              textTransform: 'none',
              minHeight: 48,
              px: 2,
              '&:hover': {
                color: 'rgba(233,236,245,0.9)',
              },
              '&.Mui-selected': {
                color: '#b794f6',
                fontWeight: 600,
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: 'rgba(124,77,255,0.6)',
              height: 2,
            },
          }}
        >
          <Tab label="Core Rules" />
          <Tab label="Scoring" />
          <Tab label="Tiebreakers" />
          <Tab label="Fair Play" />
          <Tab label="FAQ" />
        </Tabs>
      </Box>

      <SectionCard title="Core Rules" id="core-rules">
        <Stack component="ul" spacing={1} sx={{ pl: 2, m: 0, listStyle: 'none' }}>
          {coreRules.map((item, index) => (
            <Box key={index} component="li" sx={{ display: 'flex', alignItems: 'flex-start' }}>
              <Typography
                component="span"
                sx={{
                  color: '#e9ecf5',
                  fontSize: '0.875rem',
                  lineHeight: 1.6,
                  '&::before': {
                    content: '"•"',
                    color: 'rgba(124,77,255,0.7)',
                    fontWeight: 'bold',
                    display: 'inline-block',
                    width: '1em',
                    marginRight: '0.5em',
                  },
                }}
              >
                {item}
              </Typography>
            </Box>
          ))}
        </Stack>
      </SectionCard>

      <SectionCard title="Scoring" id="scoring">
        <Stack component="ul" spacing={1} sx={{ pl: 2, m: 0, listStyle: 'none' }}>
          {scoringRules.map((item, index) => (
            <Box key={index} component="li" sx={{ display: 'flex', alignItems: 'flex-start' }}>
              <Typography
                component="span"
                sx={{
                  color: '#e9ecf5',
                  fontSize: '0.875rem',
                  lineHeight: 1.6,
                  '&::before': {
                    content: '"•"',
                    color: 'rgba(124,77,255,0.7)',
                    fontWeight: 'bold',
                    display: 'inline-block',
                    width: '1em',
                    marginRight: '0.5em',
                  },
                }}
              >
                {item}
              </Typography>
            </Box>
          ))}
        </Stack>
        <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.08)' }} />
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1.5}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
        >
          <Chip
            size="small"
            label="1 pt per correct pick"
            sx={{
              bgcolor: 'rgba(124,77,255,0.15)',
              color: '#b794f6',
              fontWeight: 600,
              fontSize: '0.75rem',
              height: 28,
            }}
          />
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(233,236,245,0.6)',
              fontSize: '0.8125rem',
            }}
          >
            Leaderboard “pts” = season total points.
          </Typography>
        </Stack>
      </SectionCard>

      <SectionCard title="Tiebreakers" id="tiebreakers">
        <Stack component="ul" spacing={1} sx={{ pl: 2, m: 0, listStyle: 'none' }}>
          {tiebreakers.map((item, index) => (
            <Box key={index} component="li" sx={{ display: 'flex', alignItems: 'flex-start' }}>
              <Typography
                component="span"
                sx={{
                  color: '#e9ecf5',
                  fontSize: '0.875rem',
                  lineHeight: 1.6,
                  '&::before': {
                    content: '"•"',
                    color: 'rgba(124,77,255,0.7)',
                    fontWeight: 'bold',
                    display: 'inline-block',
                    width: '1em',
                    marginRight: '0.5em',
                  },
                }}
              >
                {item}
              </Typography>
            </Box>
          ))}
        </Stack>
      </SectionCard>

      <SectionCard title="Fair Play" id="fair-play">
        <Stack component="ul" spacing={1} sx={{ pl: 2, m: 0, listStyle: 'none' }}>
          {fairPlay.map((item, index) => (
            <Box key={index} component="li" sx={{ display: 'flex', alignItems: 'flex-start' }}>
              <Typography
                component="span"
                sx={{
                  color: '#e9ecf5',
                  fontSize: '0.875rem',
                  lineHeight: 1.6,
                  '&::before': {
                    content: '"•"',
                    color: 'rgba(124,77,255,0.7)',
                    fontWeight: 'bold',
                    display: 'inline-block',
                    width: '1em',
                    marginRight: '0.5em',
                  },
                }}
              >
                {item}
              </Typography>
            </Box>
          ))}
        </Stack>
      </SectionCard>

      <SectionCard title="FAQ" id="faq">
        <Stack spacing={1}>
          {faqItems.map((item) => (
            <Accordion
              key={item.q}
              disableGutters
              sx={{
                bgcolor: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '8px !important',
                mb: 1,
                '&:before': {
                  display: 'none',
                },
                '&.Mui-expanded': {
                  bgcolor: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(124,77,255,0.2)',
                },
              }}
            >
              <AccordionSummary
                expandIcon={
                  <ExpandMoreIcon
                    sx={{
                      color: 'rgba(233,236,245,0.7)',
                      '&:hover': {
                        color: '#b794f6',
                      },
                    }}
                  />
                }
                sx={{
                  py: 1.5,
                  px: 2,
                  '& .MuiAccordionSummary-content': {
                    my: 0,
                  },
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.02)',
                  },
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: '#e9ecf5',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                  }}
                >
                  {item.q}
                </Typography>
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  py: 1.5,
                  px: 2,
                  pt: 0,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(233,236,245,0.7)',
                    fontSize: '0.8125rem',
                    lineHeight: 1.6,
                  }}
                >
                  {item.a}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Stack>
      </SectionCard>
    </Container>
  )
}
