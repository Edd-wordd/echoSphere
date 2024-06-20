import React from 'react'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import IconButton from '@mui/material/IconButton'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'

const ProfileDrawer = ({ open, onClose }) => {
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <div>
        <IconButton onClick={onClose}>
          <ChevronLeftIcon />
        </IconButton>
      </div>
      <List>
        <ListItem button>
          <ListItemText primary="Profile Settings" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="Account Details" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Drawer>
  )
}

export default ProfileDrawer
