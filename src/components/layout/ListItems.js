import * as React from 'react'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ListSubheader from '@mui/material/ListSubheader'
import DashboardIcon from '@mui/icons-material/Dashboard'
import BarChartIcon from '@mui/icons-material/BarChart'
import AssignmentIcon from '@mui/icons-material/Assignment'
import SportsFootballIcon from '@mui/icons-material/SportsFootball'
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'
import PeopleIcon from '@mui/icons-material/People'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'

export function MainListItems({ onSelectItem }) {
  return (
    <React.Fragment>
      <ListItemButton onClick={() => onSelectItem('Dashboard')}>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItemButton>
      <ListItemButton onClick={() => onSelectItem('Users')}>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Users" />
      </ListItemButton>
      <ListItemButton onClick={() => onSelectItem('MatchUps')}>
        <ListItemIcon>
          <SportsFootballIcon />
        </ListItemIcon>
        <ListItemText primary="Match Ups" />
      </ListItemButton>
      <ListItemButton onClick={() => onSelectItem('HadiCapping')}>
        <ListItemIcon>
          <BarChartIcon />
        </ListItemIcon>
        <ListItemText primary="HadiCapping" />
      </ListItemButton>
      <ListItemButton onClick={() => onSelectItem('Rules')}>
        <ListItemIcon>
          <AssignmentTurnedInIcon />
        </ListItemIcon>
        <ListItemText primary="Rules" />
      </ListItemButton>
      <ListItemButton onClick={() => onSelectItem('SuperBowl')}>
        <ListItemIcon>
          <EmojiEventsIcon />
        </ListItemIcon>
        <ListItemText primary="SuperBowl" />
      </ListItemButton>
    </React.Fragment>
  )
}

export function SecondaryListItems({ onSelectItem }) {
  return (
    <React.Fragment>
      <ListSubheader component="div" inset>
        Saved reports
      </ListSubheader>
      <ListItemButton onClick={() => onSelectItem('Current month')}>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Current month" />
      </ListItemButton>
      <ListItemButton onClick={() => onSelectItem('Last quarter')}>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Last quarter" />
      </ListItemButton>
      <ListItemButton onClick={() => onSelectItem('Year-end sale')}>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Year-end sale" />
      </ListItemButton>
    </React.Fragment>
  )
}
