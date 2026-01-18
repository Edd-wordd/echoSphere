import React from 'react'
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  Stack,
} from '@mui/material'

const LeaderboardCard = ({ entries = [], currentUserId }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Leaderboard
        </Typography>
        <List dense>
          {entries.slice(0, 5).map((entry, index) => {
            const isCurrent = entry.id === currentUserId
            return (
              <ListItem
                key={entry.id || index}
                disableGutters
                secondaryAction={
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="body2" color="text.secondary">
                      {entry.points} pts
                    </Typography>
                    {isCurrent && <Chip label="You" color="primary" size="small" />}
                  </Stack>
                }
              >
                <ListItemText
                  primary={
                    <Typography variant="body1" fontWeight={isCurrent ? 700 : 500}>
                      {index + 1}. {entry.name}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      {entry.record}
                    </Typography>
                  }
                />
              </ListItem>
            )
          })}
        </List>
      </CardContent>
    </Card>
  )
}

export default LeaderboardCard
