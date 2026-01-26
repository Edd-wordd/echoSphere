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
import { useNavigate, NavLink } from 'react-router-dom'
import { auth } from '../../firebase/firebase'
import { useAuthProfile } from '../../hooks/useAuthProfile'
import { MainListItems, StyledListItemButton } from '../layout/ListItems'
import ListSubheader from '@mui/material/ListSubheader'
import ListItemText from '@mui/material/ListItemText'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import RulesData from '../gameData/RulesData'
import UsersDashboard from '../users/UsersDashboard'
import MakePicks from './MakePicks'
import SuperBowlSquares from './SuperBowlSquares'

const drawerWidth = 240

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  background: 'linear-gradient(90deg, #0b0c0f 0%, #1c0b16 25%, #10141b 55%, #0c1714 100%)',
  color: '#e8ebf4',
  boxShadow: '0 10px 40px rgba(0,0,0,0.55)',
  borderBottom: '1px solid rgba(255,255,255,0.08)',
  backdropFilter: 'blur(12px)',
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
      backgroundColor: 'rgba(10, 10, 12, 0.95)',
      color: '#e9ecf5',
      borderRight: '1px solid rgba(255,255,255,0.08)',
      backdropFilter: 'blur(10px)',
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
  const { user, isAdmin } = useAuthProfile()

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
      navigate('/signin')
    } catch (error) {
      console.error('Error during logout:', error)
    }
  }

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
        return (
          <UsersDashboard
            onManagePicks={() => setSelectedComponent('MakePicks')}
            onViewLeaderboard={() => setSelectedComponent('Leaderboard')}
          />
        )
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
      case 'SuperBowl':
        return <SuperBowlSquares />
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
          {isAdmin && (
            <>
              <Divider sx={{ my: 1 }} />
              <ListSubheader component="div" inset sx={{ color: 'rgba(233,236,245,0.7)' }}>
                Admin
              </ListSubheader>
              <StyledListItemButton component={NavLink} to="/admin/overview">
                <ListItemIcon sx={{ color: '#f5f7ff' }}>
                  <AdminPanelSettingsIcon />
                </ListItemIcon>
                <ListItemText primary="Admin Dashboard" />
              </StyledListItemButton>
            </>
          )}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          background: `
            radial-gradient(circle at 20% 20%, rgba(124,77,255,0.10), transparent 32%),
            radial-gradient(circle at 80% 0%, rgba(0,200,83,0.12), transparent 30%),
            radial-gradient(circle at 50% 120%, rgba(255,64,129,0.18), transparent 35%),
            #050507`,
          color: '#e9ecf5',
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
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: 'rgba(15,15,17,0.9)',
                  color: '#f5f7ff',
                  borderRadius: 2.5,
                  border: '1px solid rgba(255,255,255,0.08)',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.45)',
                  backdropFilter: 'blur(12px)',
                }}
              >
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
