import * as React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { styled } from '@mui/material/styles'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import DashboardIcon from '@mui/icons-material/Dashboard'
import SportsFootballIcon from '@mui/icons-material/SportsFootball'
import RuleIcon from '@mui/icons-material/Rule'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import SettingsIcon from '@mui/icons-material/Settings'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import SportsIcon from '@mui/icons-material/Sports'
import PeopleIcon from '@mui/icons-material/People'
import HistoryIcon from '@mui/icons-material/History'

export const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  transition: 'background 0.2s ease',
  '&:hover': {
    backgroundColor: 'rgba(124, 77, 255, 0.35)',
    color: '#e8ebff',
  },
  '&.Mui-selected': {
    backgroundColor: 'rgba(124, 77, 255, 0.25)',
    color: '#c5b8ff',
  },
  '&.Mui-selected:hover': {
    backgroundColor: 'rgba(124, 77, 255, 0.45)',
  },
}))

export function MainListItems({ onSelectItem }) {
  return (
    <React.Fragment>
      <StyledListItemButton onClick={() => onSelectItem('Dashboard')}>
        <ListItemIcon sx={{ color: '#f5f7ff' }}>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </StyledListItemButton>
      <StyledListItemButton onClick={() => onSelectItem('MakePicks')}>
        <ListItemIcon sx={{ color: '#f5f7ff' }}>
          <SportsFootballIcon />
        </ListItemIcon>
        <ListItemText primary="Make Picks" />
      </StyledListItemButton>
      <StyledListItemButton onClick={() => onSelectItem('Leaderboard')}>
        <ListItemIcon sx={{ color: '#f5f7ff' }}>
          <EmojiEventsIcon />
        </ListItemIcon>
        <ListItemText primary="Leaderboard" />
      </StyledListItemButton>
      <StyledListItemButton onClick={() => onSelectItem('Rules')}>
        <ListItemIcon sx={{ color: '#f5f7ff' }}>
          <RuleIcon />
        </ListItemIcon>
        <ListItemText primary="Rules" />
      </StyledListItemButton>
      <StyledListItemButton onClick={() => onSelectItem('SuperBowl')}>
        <ListItemIcon sx={{ color: '#f5f7ff' }}>
          <EmojiEventsIcon />
        </ListItemIcon>
        <ListItemText primary="SuperBowl" />
      </StyledListItemButton>
      <StyledListItemButton onClick={() => onSelectItem('Settings')}>
        <ListItemIcon sx={{ color: '#f5f7ff' }}>
          <SettingsIcon />
        </ListItemIcon>
        <ListItemText primary="Settings" />
      </StyledListItemButton>
    </React.Fragment>
  )
}

export function SecondaryListItems({ onSelectItem, isAdmin }) {
  if (!isAdmin) return null

  return (
    <React.Fragment>
      {/* <ListSubheader component="div" inset>
        Admin
      </ListSubheader> */}
      <StyledListItemButton onClick={() => onSelectItem('ManageWeeks')}>
        <ListItemIcon sx={{ color: '#f5f7ff' }}>
          <EventAvailableIcon />
        </ListItemIcon>
        <ListItemText primary="Manage Weeks" />
      </StyledListItemButton>
    </React.Fragment>
  )
}

const adminNav = [
  { to: '/admin/overview', label: 'Admin Overview', Icon: DashboardIcon },
  { to: '/admin/weeks', label: 'Weeks', Icon: EventAvailableIcon },
  { to: '/admin/games', label: 'Games', Icon: SportsIcon },
  { to: '/admin/users', label: 'Users', Icon: PeopleIcon },
  { to: '/admin/settings', label: 'Settings', Icon: SettingsIcon },
  { to: '/admin/activity', label: 'Activity Log', Icon: HistoryIcon },
]

export function AdminListItems() {
  const location = useLocation()
  return (
    <>
      {/* <ListSubheader component="div" inset sx={{ color: 'rgba(233,236,245,0.7)' }}>
        Admin
      </ListSubheader> */}
      {adminNav.map(({ to, label, Icon }) => (
        <StyledListItemButton
          key={to}
          component={NavLink}
          to={to}
          selected={location.pathname === to}
          sx={{ '&.Mui-selected': { '& .MuiListItemIcon-root': { color: '#c5b8ff' } } }}
        >
          <ListItemIcon sx={{ color: '#f5f7ff' }}>
            <Icon />
          </ListItemIcon>
          <ListItemText primary={label} />
        </StyledListItemButton>
      ))}
    </>
  )
}
