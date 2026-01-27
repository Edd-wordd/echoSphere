import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Switch,
  FormControlLabel,
  Button,
  Stack,
  Divider,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Snackbar,
  Skeleton,
  Tooltip,
} from '@mui/material'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import NotificationsIcon from '@mui/icons-material/Notifications'
import TuneIcon from '@mui/icons-material/Tune'
import SecurityIcon from '@mui/icons-material/Security'
import LogoutIcon from '@mui/icons-material/Logout'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import SaveIcon from '@mui/icons-material/Save'
import PhoneIcon from '@mui/icons-material/Phone'
import EmailIcon from '@mui/icons-material/Email'
import { useAuthProfile } from '../../hooks/useAuthProfile'
import { doc, updateDoc } from 'firebase/firestore'
import { signOut, updateProfile as updateAuthProfile } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { auth, firestore } from '../../firebase/firebase'
import { glassyCard } from '../../styles/adminStyles'

// Helper to format phone number
const formatPhoneNumber = (value) => {
  const cleaned = value.replace(/\D/g, '')
  if (cleaned.length <= 3) return cleaned
  if (cleaned.length <= 6) return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`
  return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`
}

// Helper to validate phone
const validatePhone = (phone) => {
  if (!phone) return true // Optional
  const cleaned = phone.replace(/\D/g, '')
  return cleaned.length === 10 || cleaned.length === 11
}

// Get auth provider name
const getProviderName = (user) => {
  if (!user?.providerData?.length) return 'Password'
  const provider = user.providerData[0]?.providerId
  if (provider === 'google.com') return 'Google'
  if (provider === 'facebook.com') return 'Facebook'
  return 'Password'
}

export default function UserSettings() {
  const { user, profile, loading } = useAuthProfile()
  const navigate = useNavigate()
  const [isDirty, setIsDirty] = useState(false)
  const [saving, setSaving] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  // Form state
  const [formData, setFormData] = useState({
    displayName: '',
    username: '',
    phone: '',
    notifications: {
      weeklyReminder: false,
      lockReminder: false,
      resultsPosted: false,
      superBowlUpdates: false,
      sms: false,
    },
    preferences: {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timeFormat: '12h',
      showLocalKickoff: true,
      compactView: false,
    },
    privacy: {
      showOnLeaderboard: true,
    },
  })

  const [errors, setErrors] = useState({})

  // Load initial data
  useEffect(() => {
    if (profile && user) {
      const displayName =
        profile.displayName ||
        (profile.firstName && profile.lastName
          ? `${profile.firstName} ${profile.lastName}`
          : user.displayName || '')
      setFormData({
        displayName: displayName || '',
        username: profile.username || '',
        phone: profile.phone || '',
        notifications: {
          weeklyReminder: profile.notificationPrefs?.weeklyReminder ?? true,
          lockReminder: profile.notificationPrefs?.lockReminder ?? true,
          resultsPosted: profile.notificationPrefs?.resultsPosted ?? true,
          superBowlUpdates: profile.notificationPrefs?.superBowlUpdates ?? true,
          sms: profile.notificationPrefs?.sms ?? false,
        },
        preferences: {
          timezone:
            profile.preferences?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
          timeFormat: profile.preferences?.timeFormat || '12h',
          showLocalKickoff: profile.preferences?.showLocalKickoff ?? true,
          compactView: profile.preferences?.compactView ?? false,
        },
        privacy: {
          showOnLeaderboard: profile.privacyPrefs?.showOnLeaderboard ?? true,
        },
      })
    }
  }, [profile, user])

  const handleChange = (field, value) => {
    setFormData((prev) => {
      const newData = { ...prev }
      if (field.includes('.')) {
        const [parent, child] = field.split('.')
        newData[parent] = { ...newData[parent], [child]: value }
      } else {
        newData[field] = value
      }
      return newData
    })
    setIsDirty(true)

    // Clear error on change
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validate = () => {
    const newErrors = {}
    if (formData.displayName && formData.displayName.length < 2) {
      newErrors.displayName = 'Display name must be at least 2 characters'
    }
    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validate()) {
      setSnackbar({ open: true, message: 'Please fix errors before saving', severity: 'error' })
      return
    }

    if (!user || !profile) {
      setSnackbar({ open: true, message: 'User not found', severity: 'error' })
      return
    }

    setSaving(true)
    try {
      const userDocRef = doc(firestore, 'users', user.uid)
      const updates = {}

      // Update display name in both Firestore and Auth
      if (formData.displayName !== (profile.displayName || user.displayName)) {
        updates.displayName = formData.displayName
        if (user.displayName !== formData.displayName) {
          await updateAuthProfile(user, { displayName: formData.displayName })
        }
      }

      if (formData.username !== profile.username) {
        updates.username = formData.username
      }

      if (formData.phone !== profile.phone) {
        const cleaned = formData.phone.replace(/\D/g, '')
        updates.phone = cleaned || null
      }

      // Update notification preferences
      updates.notificationPrefs = formData.notifications

      // Update preferences
      updates.preferences = formData.preferences

      // Update privacy preferences
      updates.privacyPrefs = formData.privacy

      await updateDoc(userDocRef, updates)
      setIsDirty(false)
      setSnackbar({ open: true, message: 'Settings saved successfully', severity: 'success' })
    } catch (error) {
      console.error('Error saving settings:', error)
      setSnackbar({ open: true, message: 'Failed to save settings', severity: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      navigate('/signin')
    } catch (error) {
      console.error('Error during logout:', error)
      setSnackbar({ open: true, message: 'Failed to logout', severity: 'error' })
    }
  }

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value)
    handleChange('phone', formatted)
  }

  if (loading) {
    return (
      <Box sx={{ color: '#e9ecf5', p: 2 }}>
        <Skeleton variant="rectangular" height={60} sx={{ mb: 3, borderRadius: 2 }} />
        <Skeleton variant="rectangular" height={200} sx={{ mb: 2, borderRadius: 2 }} />
        <Skeleton variant="rectangular" height={200} sx={{ mb: 2, borderRadius: 2 }} />
      </Box>
    )
  }

  if (!user) {
    return (
      <Box sx={{ color: '#e9ecf5', p: 2 }}>
        <Alert severity="error">Please sign in to access settings.</Alert>
      </Box>
    )
  }

  // Check if user has email/password auth (not OAuth)
  const isEmailPassword = !user.providerData?.some(
    (p) => p.providerId === 'google.com' || p.providerId === 'facebook.com',
  )

  return (
    <Box sx={{ color: '#e9ecf5', p: 2 }}>
      {/* Page Header */}
      <Stack spacing={1} sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: 'rgba(233,236,245,0.95)' }}>
          Settings
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(233,236,245,0.6)', fontSize: '0.8125rem' }}>
          Manage your account preferences and notifications.
        </Typography>
      </Stack>

      <Stack spacing={3}>
        {/* Profile Section */}
        <Card sx={glassyCard}>
          <CardHeader
            avatar={<AccountCircleIcon sx={{ color: 'rgba(124,77,255,0.7)' }} />}
            title={
              <Typography
                variant="h6"
                sx={{ color: '#e9ecf5', fontWeight: 600, fontSize: '1.125rem' }}
              >
                Profile
              </Typography>
            }
            sx={{ pb: 1.5 }}
          />
          <CardContent sx={{ pt: 0 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Display Name"
                  value={formData.displayName}
                  onChange={(e) => handleChange('displayName', e.target.value)}
                  error={!!errors.displayName}
                  helperText={errors.displayName || 'This name appears on the leaderboard'}
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: '#e9ecf5',
                      '& fieldset': {
                        borderColor: 'rgba(255,255,255,0.12)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255,255,255,0.2)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'rgba(124,77,255,0.5)',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(233,236,245,0.7)',
                    },
                    '& .MuiFormHelperText-root': {
                      color: 'rgba(233,236,245,0.5)',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Username"
                  value={formData.username}
                  onChange={(e) => handleChange('username', e.target.value)}
                  helperText="Optional unique identifier"
                  size="small"
                  disabled
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'rgba(233,236,245,0.5)',
                      '& fieldset': {
                        borderColor: 'rgba(255,255,255,0.08)',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(233,236,245,0.5)',
                    },
                    '& .MuiFormHelperText-root': {
                      color: 'rgba(233,236,245,0.4)',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  error={!!errors.phone}
                  helperText={errors.phone || 'Optional. Used for SMS notifications'}
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <PhoneIcon sx={{ fontSize: 18, color: 'rgba(233,236,245,0.5)', mr: 1 }} />
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: '#e9ecf5',
                      '& fieldset': {
                        borderColor: 'rgba(255,255,255,0.12)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255,255,255,0.2)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'rgba(124,77,255,0.5)',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(233,236,245,0.7)',
                    },
                    '& .MuiFormHelperText-root': {
                      color: 'rgba(233,236,245,0.5)',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  value={user.email || ''}
                  disabled
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <EmailIcon sx={{ fontSize: 18, color: 'rgba(233,236,245,0.5)', mr: 1 }} />
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'rgba(233,236,245,0.5)',
                      '& fieldset': {
                        borderColor: 'rgba(255,255,255,0.08)',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(233,236,245,0.5)',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Provider"
                  value={getProviderName(user)}
                  disabled
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'rgba(233,236,245,0.5)',
                      '& fieldset': {
                        borderColor: 'rgba(255,255,255,0.08)',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(233,236,245,0.5)',
                    },
                  }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Notifications Section */}
        <Card sx={glassyCard}>
          <CardHeader
            avatar={<NotificationsIcon sx={{ color: 'rgba(124,77,255,0.7)' }} />}
            title={
              <Typography
                variant="h6"
                sx={{ color: '#e9ecf5', fontWeight: 600, fontSize: '1.125rem' }}
              >
                Notifications
              </Typography>
            }
            sx={{ pb: 1.5 }}
          />
          <CardContent sx={{ pt: 0 }}>
            <Stack spacing={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.notifications.weeklyReminder}
                    onChange={(e) => handleChange('notifications.weeklyReminder', e.target.checked)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: 'rgba(124,77,255,0.8)',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: 'rgba(124,77,255,0.5)',
                      },
                    }}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" sx={{ color: '#e9ecf5', fontWeight: 500 }}>
                      Weekly reminder to make picks
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: 'rgba(233,236,245,0.5)', fontSize: '0.75rem' }}
                    >
                      Get notified at the start of each week
                    </Typography>
                  </Box>
                }
              />
              <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.notifications.lockReminder}
                    onChange={(e) => handleChange('notifications.lockReminder', e.target.checked)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: 'rgba(124,77,255,0.8)',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: 'rgba(124,77,255,0.5)',
                      },
                    }}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" sx={{ color: '#e9ecf5', fontWeight: 500 }}>
                      Picks lock reminder
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: 'rgba(233,236,245,0.5)', fontSize: '0.75rem' }}
                    >
                      Reminder 1 hour before picks lock
                    </Typography>
                  </Box>
                }
              />
              <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.notifications.resultsPosted}
                    onChange={(e) => handleChange('notifications.resultsPosted', e.target.checked)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: 'rgba(124,77,255,0.8)',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: 'rgba(124,77,255,0.5)',
                      },
                    }}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" sx={{ color: '#e9ecf5', fontWeight: 500 }}>
                      Results posted / weekly recap
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: 'rgba(233,236,245,0.5)', fontSize: '0.75rem' }}
                    >
                      Get notified when weekly results are posted
                    </Typography>
                  </Box>
                }
              />
              <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.notifications.superBowlUpdates}
                    onChange={(e) =>
                      handleChange('notifications.superBowlUpdates', e.target.checked)
                    }
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: 'rgba(124,77,255,0.8)',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: 'rgba(124,77,255,0.5)',
                      },
                    }}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" sx={{ color: '#e9ecf5', fontWeight: 500 }}>
                      Super Bowl squares updates
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: 'rgba(233,236,245,0.5)', fontSize: '0.75rem' }}
                    >
                      Board locked, digits assigned, winners posted
                    </Typography>
                  </Box>
                }
              />
              <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.notifications.sms}
                    onChange={(e) => handleChange('notifications.sms', e.target.checked)}
                    disabled={!formData.phone}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: 'rgba(124,77,255,0.8)',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: 'rgba(124,77,255,0.5)',
                      },
                    }}
                  />
                }
                label={
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: formData.phone ? '#e9ecf5' : 'rgba(233,236,245,0.4)',
                        fontWeight: 500,
                      }}
                    >
                      SMS notifications
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: 'rgba(233,236,245,0.5)', fontSize: '0.75rem' }}
                    >
                      {formData.phone
                        ? 'Receive notifications via text message'
                        : 'Add phone number to enable SMS'}
                    </Typography>
                  </Box>
                }
              />
            </Stack>
          </CardContent>
        </Card>

        {/* Preferences Section */}
        <Card sx={glassyCard}>
          <CardHeader
            avatar={<TuneIcon sx={{ color: 'rgba(124,77,255,0.7)' }} />}
            title={
              <Typography
                variant="h6"
                sx={{ color: '#e9ecf5', fontWeight: 600, fontSize: '1.125rem' }}
              >
                Preferences
              </Typography>
            }
            sx={{ pb: 1.5 }}
          />
          <CardContent sx={{ pt: 0 }}>
            <Stack spacing={2}>
              <FormControl fullWidth size="small">
                <InputLabel
                  sx={{
                    color: 'rgba(233,236,245,0.7)',
                    '&.Mui-focused': {
                      color: 'rgba(124,77,255,0.7)',
                    },
                  }}
                >
                  Timezone
                </InputLabel>
                <Select
                  value={formData.preferences.timezone}
                  onChange={(e) => handleChange('preferences.timezone', e.target.value)}
                  label="Timezone"
                  sx={{
                    color: '#e9ecf5',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255,255,255,0.12)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255,255,255,0.2)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(124,77,255,0.5)',
                    },
                    '& .MuiSvgIcon-root': {
                      color: 'rgba(233,236,245,0.7)',
                    },
                  }}
                >
                  <MenuItem value="America/New_York">Eastern Time (ET)</MenuItem>
                  <MenuItem value="America/Chicago">Central Time (CT)</MenuItem>
                  <MenuItem value="America/Denver">Mountain Time (MT)</MenuItem>
                  <MenuItem value="America/Los_Angeles">Pacific Time (PT)</MenuItem>
                  <MenuItem value={Intl.DateTimeFormat().resolvedOptions().timeZone}>
                    {Intl.DateTimeFormat().resolvedOptions().timeZone} (Auto-detected)
                  </MenuItem>
                </Select>
              </FormControl>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.preferences.timeFormat === '24h'}
                    onChange={(e) =>
                      handleChange('preferences.timeFormat', e.target.checked ? '24h' : '12h')
                    }
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: 'rgba(124,77,255,0.8)',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: 'rgba(124,77,255,0.5)',
                      },
                    }}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" sx={{ color: '#e9ecf5', fontWeight: 500 }}>
                      Use 24-hour time format
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: 'rgba(233,236,245,0.5)', fontSize: '0.75rem' }}
                    >
                      Display times in 24-hour format (14:00 instead of 2:00 PM)
                    </Typography>
                  </Box>
                }
              />
              <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.preferences.showLocalKickoff}
                    onChange={(e) => handleChange('preferences.showLocalKickoff', e.target.checked)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: 'rgba(124,77,255,0.8)',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: 'rgba(124,77,255,0.5)',
                      },
                    }}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" sx={{ color: '#e9ecf5', fontWeight: 500 }}>
                      Show local kickoff times
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: 'rgba(233,236,245,0.5)', fontSize: '0.75rem' }}
                    >
                      Display game times in your timezone
                    </Typography>
                  </Box>
                }
              />
              <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.preferences.compactView}
                    onChange={(e) => handleChange('preferences.compactView', e.target.checked)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: 'rgba(124,77,255,0.8)',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: 'rgba(124,77,255,0.5)',
                      },
                    }}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" sx={{ color: '#e9ecf5', fontWeight: 500 }}>
                      Compact view
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: 'rgba(233,236,245,0.5)', fontSize: '0.75rem' }}
                    >
                      Use denser spacing for tables and cards
                    </Typography>
                  </Box>
                }
              />
            </Stack>
          </CardContent>
        </Card>

        {/* Security Section */}
        <Card sx={glassyCard}>
          <CardHeader
            avatar={<SecurityIcon sx={{ color: 'rgba(124,77,255,0.7)' }} />}
            title={
              <Typography
                variant="h6"
                sx={{ color: '#e9ecf5', fontWeight: 600, fontSize: '1.125rem' }}
              >
                Security
              </Typography>
            }
            sx={{ pb: 1.5 }}
          />
          <CardContent sx={{ pt: 0 }}>
            <Stack spacing={2}>
              {isEmailPassword ? (
                <Button
                  variant="outlined"
                  onClick={() => navigate('/forgot-password')}
                  sx={{
                    borderColor: 'rgba(255,255,255,0.2)',
                    color: '#e9ecf5',
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: 'rgba(124,77,255,0.5)',
                      bgcolor: 'rgba(124,77,255,0.1)',
                    },
                  }}
                >
                  Change Password
                </Button>
              ) : (
                <Alert
                  severity="info"
                  sx={{
                    bgcolor: 'rgba(33,150,243,0.1)',
                    border: '1px solid rgba(33,150,243,0.2)',
                    color: '#90caf9',
                  }}
                >
                  Account managed by {getProviderName(user)}. Password changes are handled through
                  your provider.
                </Alert>
              )}
              <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
              <Button
                variant="outlined"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                sx={{
                  borderColor: 'rgba(255,82,82,0.3)',
                  color: '#ff5252',
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: 'rgba(255,82,82,0.5)',
                    bgcolor: 'rgba(255,82,82,0.1)',
                  },
                }}
              >
                Logout
              </Button>
              <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
              <Box>
                <Tooltip title="Contact admin to delete your account">
                  <span>
                    <Button
                      variant="outlined"
                      startIcon={<DeleteForeverIcon />}
                      disabled
                      sx={{
                        borderColor: 'rgba(255,82,82,0.2)',
                        color: 'rgba(255,82,82,0.4)',
                        textTransform: 'none',
                        '&:disabled': {
                          borderColor: 'rgba(255,82,82,0.15)',
                          color: 'rgba(255,82,82,0.3)',
                        },
                      }}
                    >
                      Delete Account
                    </Button>
                  </span>
                </Tooltip>
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    mt: 0.75,
                    color: 'rgba(233,236,245,0.5)',
                    fontSize: '0.75rem',
                  }}
                >
                  Contact admin to delete your account
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* Data & Privacy Section */}
        <Card sx={glassyCard}>
          <CardHeader
            avatar={<SecurityIcon sx={{ color: 'rgba(124,77,255,0.7)' }} />}
            title={
              <Typography
                variant="h6"
                sx={{ color: '#e9ecf5', fontWeight: 600, fontSize: '1.125rem' }}
              >
                Data & Privacy
              </Typography>
            }
            sx={{ pb: 1.5 }}
          />
          <CardContent sx={{ pt: 0 }}>
            <Stack spacing={2}>
              <Typography
                variant="body2"
                sx={{ color: 'rgba(233,236,245,0.7)', fontSize: '0.8125rem' }}
              >
                We store your picks, display name, and phone number (if provided) to operate the
                league. Your data is only visible to other league members and administrators.
              </Typography>
              <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.privacy.showOnLeaderboard}
                    onChange={(e) => handleChange('privacy.showOnLeaderboard', e.target.checked)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: 'rgba(124,77,255,0.8)',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: 'rgba(124,77,255,0.5)',
                      },
                    }}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" sx={{ color: '#e9ecf5', fontWeight: 500 }}>
                      Show display name on leaderboard
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: 'rgba(233,236,245,0.5)', fontSize: '0.75rem' }}
                    >
                      Allow your name to appear in public leaderboards
                    </Typography>
                  </Box>
                }
              />
            </Stack>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={!isDirty || saving}
            sx={{
              bgcolor: 'rgba(124,77,255,0.8)',
              color: '#fff',
              fontWeight: 600,
              textTransform: 'none',
              px: 3,
              py: 1.25,
              '&:hover': {
                bgcolor: 'rgba(124,77,255,0.9)',
              },
              '&:disabled': {
                bgcolor: 'rgba(255,255,255,0.05)',
                color: 'rgba(233,236,245,0.3)',
              },
            }}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>
      </Stack>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{
            bgcolor:
              snackbar.severity === 'success'
                ? 'rgba(76,175,80,0.2)'
                : snackbar.severity === 'error'
                  ? 'rgba(255,82,82,0.2)'
                  : 'rgba(33,150,243,0.2)',
            border:
              snackbar.severity === 'success'
                ? '1px solid rgba(76,175,80,0.3)'
                : snackbar.severity === 'error'
                  ? '1px solid rgba(255,82,82,0.3)'
                  : '1px solid rgba(33,150,243,0.3)',
            color:
              snackbar.severity === 'success'
                ? '#81c784'
                : snackbar.severity === 'error'
                  ? '#ff5252'
                  : '#90caf9',
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}
