import React from 'react'
import Typography from '@mui/material/Typography'

function Footer(props) {
  return (
    <Typography variant="body2" color="#f5f7ff" align="center" {...props}>
      {'Copyright © The Huddle '}
      {new Date().getFullYear()}
    </Typography>
  )
}

export default Footer
