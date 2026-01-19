import React from 'react'
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
  Link,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

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
  "Don’t share others’ picks before lock.",
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
  <Card id={id} sx={{ mb: 3 }}>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Stack spacing={1}>{children}</Stack>
    </CardContent>
  </Card>
)

export default function RulesData() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={1} mb={2}>
        <Typography variant="h4">Family NFL Picks</Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Rules &amp; FAQ
        </Typography>
      </Stack>

      <Alert severity="info" sx={{ mb: 3 }}>
        Make your picks before kickoff. Picks lock at the first game of the week.
      </Alert>

      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
        <Link href="#core-rules" underline="hover" variant="body2">
          Core Rules
        </Link>
        <Link href="#scoring" underline="hover" variant="body2">
          Scoring
        </Link>
        <Link href="#tiebreakers" underline="hover" variant="body2">
          Tiebreakers
        </Link>
        <Link href="#fair-play" underline="hover" variant="body2">
          Fair Play
        </Link>
        <Link href="#faq" underline="hover" variant="body2">
          FAQ
        </Link>
      </Box>

      <SectionCard title="Core Rules" id="core-rules">
        <Stack component="ul" spacing={0.5} sx={{ pl: 2, m: 0 }}>
          {coreRules.map((item) => (
            <Typography key={item} component="li" variant="body2">
              {item}
            </Typography>
          ))}
        </Stack>
      </SectionCard>

      <SectionCard title="Scoring" id="scoring">
        <Stack component="ul" spacing={0.5} sx={{ pl: 2, m: 0 }}>
          {scoringRules.map((item) => (
            <Typography key={item} component="li" variant="body2">
              {item}
            </Typography>
          ))}
        </Stack>
        <Divider sx={{ my: 1.5 }} />
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip size="small" label="1 pt per correct pick" color="primary" />
          <Typography variant="body2" color="text.secondary">
            Leaderboard “pts” = season total points.
          </Typography>
        </Stack>
      </SectionCard>

      <SectionCard title="Tiebreakers" id="tiebreakers">
        <Stack component="ul" spacing={0.5} sx={{ pl: 2, m: 0 }}>
          {tiebreakers.map((item) => (
            <Typography key={item} component="li" variant="body2">
              {item}
            </Typography>
          ))}
        </Stack>
      </SectionCard>

      <SectionCard title="Fair Play" id="fair-play">
        <Stack component="ul" spacing={0.5} sx={{ pl: 2, m: 0 }}>
          {fairPlay.map((item) => (
            <Typography key={item} component="li" variant="body2">
              {item}
            </Typography>
          ))}
        </Stack>
      </SectionCard>

      <SectionCard title="FAQ" id="faq">
        <Stack spacing={1}>
          {faqItems.map((item) => (
            <Accordion key={item.q} disableGutters>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="body2" fontWeight={600}>
                  {item.q}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary">
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
