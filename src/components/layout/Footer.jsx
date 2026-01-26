import React from 'react'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'

function Footer(props) {
  return (
    <Typography variant="body2" color="#f5f7ff" align="center" {...props}>
      {'Copyright © EchoSphere '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  )
}

export default Footer
