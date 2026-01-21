import * as React from 'react'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ListSubheader from '@mui/material/ListSubheader'
import DashboardIcon from '@mui/icons-material/Dashboard'
import SportsFootballIcon from '@mui/icons-material/SportsFootball'
import RuleIcon from '@mui/icons-material/Rule'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import SettingsIcon from '@mui/icons-material/Settings'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'

export function MainListItems({ onSelectItem }) {
  return (
    <React.Fragment>
      <ListItemButton onClick={() => onSelectItem('Dashboard')}>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItemButton>
      <ListItemButton onClick={() => onSelectItem('MakePicks')}>
        <ListItemIcon>
          <SportsFootballIcon />
        </ListItemIcon>
        <ListItemText primary="Make Picks" />
      </ListItemButton>
      <ListItemButton onClick={() => onSelectItem('Leaderboard')}>
        <ListItemIcon>
          <EmojiEventsIcon />
        </ListItemIcon>
        <ListItemText primary="Leaderboard" />
      </ListItemButton>
      <ListItemButton onClick={() => onSelectItem('Rules')}>
        <ListItemIcon>
          <RuleIcon />
        </ListItemIcon>
        <ListItemText primary="Rules" />
      </ListItemButton>
      <ListItemButton onClick={() => onSelectItem('SuperBowl')}>
        <ListItemIcon>
          <EmojiEventsIcon />
        </ListItemIcon>
        <ListItemText primary="SuperBowl" />
      </ListItemButton>
      <ListItemButton onClick={() => onSelectItem('Settings')}>
        <ListItemIcon>
          <SettingsIcon />
        </ListItemIcon>
        <ListItemText primary="Settings" />
      </ListItemButton>
    </React.Fragment>
  )
}

export function SecondaryListItems({ onSelectItem, isAdmin }) {
  if (!isAdmin) return null

  return (
    <React.Fragment>
      <ListSubheader component="div" inset>
        Admin
      </ListSubheader>
      <ListItemButton onClick={() => onSelectItem('ManageWeeks')}>
        <ListItemIcon>
          <EventAvailableIcon />
        </ListItemIcon>
        <ListItemText primary="Manage Weeks" />
      </ListItemButton>
    </React.Fragment>
  )
}
