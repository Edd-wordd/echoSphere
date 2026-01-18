import * as React from 'react'
import { styled } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import MuiDrawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import MuiAppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Badge from '@mui/material/Badge'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import List from '@mui/material/List'
import MenuIcon from '@mui/icons-material/Menu'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import NotificationsIcon from '@mui/icons-material/Notifications'
import { AccountCircle } from '@mui/icons-material'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import AccountBoxIcon from '@mui/icons-material/AccountBox'
import SettingsIcon from '@mui/icons-material/Settings'
import Footer from '../layout/Footer'
import { signOut } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { auth } from '../../firebase/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { MainListItems, SecondaryListItems } from '../layout/ListItems'
import UsersDetails from '../users/UsersDetails'
import RulesData from '../gameData/RulesData'
import UsersDashboard from '../users/UsersDashboard'
import MakePicks from './MakePicks'

const drawerWidth = 240

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}))

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
)

export default function Dashboard() {
  const [open, setOpen] = React.useState(true)
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [selectedComponent, setSelectedComponent] = React.useState('Dashboard')
  const navigate = useNavigate()
  const [user, setUser] = React.useState(null)
  const [isAdmin, setIsAdmin] = React.useState(false)

  // Toggle the drawer
  const toggleDrawer = () => {
    setOpen(!open)
  }

  // Open the profile menu
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  // Close the profile menu
  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth)
      navigate('/SignIn')
    } catch (error) {
      console.error('Error during logout:', error)
    }
  }

  // Subscribe to auth state changes
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        console.log('User logged in:', currentUser) // Debugging
        setUser(currentUser)
        setIsAdmin(!!currentUser?.email?.includes('admin'))
      } else {
        console.log('No user is logged in') // Debugging
        setUser(null)
        setIsAdmin(false)
      }
    })
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe()
      }
    }
  }, [])

  const isMenuOpen = Boolean(anchorEl)

  const menuId = 'primary-search-account-menu'
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>
        <ListItemIcon>
          <AccountBoxIcon />
        </ListItemIcon>
        Profile
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>
        <ListItemIcon>
          <SettingsIcon />
        </ListItemIcon>
        Settings
      </MenuItem>
      <MenuItem onClick={handleLogout}>
        <ListItemIcon>
          <AccountCircle />
        </ListItemIcon>
        Logout
      </MenuItem>
    </Menu>
  )

  const renderSelectedComponent = () => {
    switch (selectedComponent) {
      case 'Dashboard':
        return <UsersDashboard onManagePicks={() => setSelectedComponent('MakePicks')} />
      case 'MakePicks':
        return <MakePicks />
      case 'Leaderboard':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Leaderboard
            </Typography>
            {/* Placeholder leaderboard page content */}
            <Typography variant="body1" color="text.secondary">
              View top records and points here.
            </Typography>
          </Box>
        )
      case 'Rules':
        return <RulesData />
      case 'Settings':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Settings
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your account preferences and notifications.
            </Typography>
          </Box>
        )
      case 'ManageUsers':
        return <UsersDetails />
      case 'ManageWeeks':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Manage Weeks
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Admin tools to manage weeks and lock times.
            </Typography>
          </Box>
        )
      default:
        return <UsersDashboard onManagePicks={() => setSelectedComponent('MakePicks')} />
    }
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="absolute" open={open}>
        <Toolbar
          sx={{
            pr: '24px', // keep right padding when drawer closed
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            sx={{
              marginRight: '36px',
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
            {user ? `${user.displayName}'s Dashboard` : 'Dashboard'}
          </Typography>
          <IconButton color="inherit">
            <Badge badgeContent={4} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton
            edge="end"
            aria-label="account of current user"
            aria-controls={menuId}
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            px: [1],
          }}
        >
          <IconButton onClick={toggleDrawer}>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        <Divider />
        <List component="nav">
          <MainListItems onSelectItem={setSelectedComponent} />
          <Divider sx={{ my: 1 }} />
          <SecondaryListItems onSelectItem={setSelectedComponent} isAdmin={isAdmin} />
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
        }}
      >
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            {/* Main Content */}
            <Grid item xs={12}>
              <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                {renderSelectedComponent()}
              </Paper>
            </Grid>
          </Grid>
          <Footer sx={{ pt: 4 }} />
        </Container>
      </Box>
      {renderMenu}
    </Box>
  )
}
