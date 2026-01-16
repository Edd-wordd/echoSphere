import React, { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Typography,
  Grid,
  Box,
} from '@mui/material'
import { styled } from '@mui/system'

const StyledTableCell = styled(TableCell)({
  width: 60, // Adjust the size to make the cells square
  height: 60, // Adjust the size to make the cells square
  textAlign: 'center',
  padding: 0,
  border: '1px solid #ddd',
})

const Superbowl = () => {
  const [assignments, setAssignments] = useState({})
  const [currentUser, setCurrentUser] = useState('')
  const [currentHomeNum, setCurrentHomeNum] = useState('')
  const [currentAwayNum, setCurrentAwayNum] = useState('')

  const handleAssignUser = () => {
    if (currentUser && currentHomeNum !== '' && currentAwayNum !== '') {
      setAssignments((prev) => ({
        ...prev,
        [`${currentHomeNum}-${currentAwayNum}`]: currentUser,
      }))
      setCurrentUser('')
      setCurrentHomeNum('')
      setCurrentAwayNum('')
    }
  }

  const claimSquare = (homeNum, awayNum) => {
    if (currentUser) {
      setAssignments((prev) => ({
        ...prev,
        [`${homeNum}-${awayNum}`]: currentUser,
      }))
      setCurrentUser('')
    }
  }

  // Generate the numbers 0-9 for the table headers
  const numbers = Array.from({ length: 10 }, (_, i) => i)

  const availableSquares = []
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      if (!assignments[`${i}-${j}`]) {
        availableSquares.push(`${i}-${j}`)
      }
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
        <Typography variant="h6">Super Bowl Squares</Typography>
      </div>

      <Grid container spacing={2} style={{ marginBottom: 10 }}>
        {['First Quarter', 'Second Quarter', 'Third Quarter', 'Fourth Quarter'].map((quarter) => (
          <Grid item xs={12} sm={6} md={3} key={quarter}>
            <Box border={1} borderColor="grey.300" padding={2} borderRadius={2}>
              <Typography variant="h6">{quarter} Winner</Typography>
              <Typography variant="body2">No winner assigned</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      <div style={{ display: 'flex', marginBottom: 10 }}>
        <TextField
          label="User Name"
          variant="outlined"
          value={currentUser}
          onChange={(e) => setCurrentUser(e.target.value)}
          style={{ marginRight: 10 }}
        />
        <TextField
          label="Home Num"
          variant="outlined"
          type="number"
          value={currentHomeNum}
          onChange={(e) => setCurrentHomeNum(e.target.value)}
          style={{ marginRight: 10 }}
        />
        <TextField
          label="Away Num"
          variant="outlined"
          type="number"
          value={currentAwayNum}
          onChange={(e) => setCurrentAwayNum(e.target.value)}
          style={{ marginRight: 10 }}
        />
        <Button variant="contained" onClick={handleAssignUser}>
          Assign User
        </Button>
      </div>

      <TableContainer component={Paper} style={{ marginBottom: 20 }}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell></StyledTableCell>
              {numbers.map((num) => (
                <StyledTableCell key={num}>{num}</StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {numbers.map((homeNum) => (
              <TableRow key={homeNum}>
                <StyledTableCell>{homeNum}</StyledTableCell>
                {numbers.map((awayNum) => (
                  <StyledTableCell key={awayNum}>
                    {assignments[`${homeNum}-${awayNum}`] || (
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => claimSquare(homeNum, awayNum)}
                      >
                        Claim
                      </Button>
                    )}
                  </StyledTableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box marginTop={4} padding={2} border={1} borderColor="grey.300" borderRadius={2}>
        <Typography variant="h5" gutterBottom>
          Available Squares
        </Typography>
        <Typography variant="body1">
          Click on a "Claim" button to assign a user to a square. Below are the coordinates of the
          available squares:
        </Typography>
        <Box display="flex" flexWrap="wrap">
          {availableSquares.map((square) => (
            <Box
              key={square}
              margin={1}
              padding={1}
              border={1}
              borderColor="grey.300"
              borderRadius={2}
            >
              <Typography variant="body2">{square}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      <Box marginTop={4} padding={2} border={1} borderColor="grey.300" borderRadius={2}>
        <Typography variant="h5" gutterBottom>
          Prize Details
        </Typography>
        <Typography variant="body1" paragraph>
          Each quarter of the game will have a winner, and the prizes are distributed as follows:
        </Typography>
        <ul>
          <li>
            <Typography variant="body1">
              <strong>First Quarter Prize:</strong> $100
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              <strong>Second Quarter Prize:</strong> $200
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              <strong>Third Quarter Prize:</strong> $300
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              <strong>Fourth Quarter Prize:</strong> $400
            </Typography>
          </li>
        </ul>
        <Typography variant="body1">
          The winners will be determined based on the score at the end of each quarter.
        </Typography>
      </Box>
    </div>
  )
}

export default Superbowl
