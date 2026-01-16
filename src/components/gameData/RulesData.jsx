import * as React from 'react'
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import WarningIcon from '@mui/icons-material/Warning'

const rulesData = [
  {
    category: 'General Rules',
    items: [
      'Respect all participants.',
      'No offensive language.',
      'Follow the instructions given by the moderator.',
    ],
  },
  {
    category: 'Game Rules',
    items: [
      'No cheating or exploiting game bugs.',
      'Play fair and have fun.',
      'Report any suspicious activity.',
    ],
  },
  {
    category: 'Forum Rules',
    items: ['No spamming.', 'Stay on topic.', 'Use appropriate language.'],
  },
  {
    category: 'Privacy Rules',
    items: [
      'Do not share personal information.',
      'Respect the privacy of others.',
      'Follow data protection guidelines.',
    ],
  },
]

export default function Rules() {
  return (
    <Container>
      <Typography variant="h4" gutterBottom align="center" sx={{ mt: 4 }}>
        Community Rules
      </Typography>
      <Divider sx={{ mb: 4 }} />
      <Grid container spacing={4}>
        {rulesData.map((ruleCategory, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h5" gutterBottom>
                {ruleCategory.category}
              </Typography>
              <List>
                {ruleCategory.items.map((rule, idx) => (
                  <ListItem key={idx}>
                    <ListItemIcon>
                      {rule.includes('No') ? (
                        <WarningIcon color="error" />
                      ) : (
                        <CheckCircleIcon color="primary" />
                      )}
                    </ListItemIcon>
                    <ListItemText primary={rule} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Additional Information
        </Typography>
        <Typography variant="body1" paragraph>
          Our community values respect and courtesy. Please ensure that you follow all the rules
          outlined above to maintain a positive and welcoming environment for all participants.
        </Typography>
        <Typography variant="body1" paragraph>
          If you have any questions or concerns about these rules, feel free to reach out to the
          moderators. They are here to help and ensure that everyone has a great experience.
        </Typography>
        <Typography variant="body1" paragraph>
          Thank you for being a part of our community and for your cooperation in following these
          guidelines. Together, we can create a safe and enjoyable space for everyone.
        </Typography>
      </Box>
    </Container>
  )
}
