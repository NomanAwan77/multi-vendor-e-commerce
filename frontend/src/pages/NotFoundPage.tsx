import { Box, Button, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <Box sx={{ textAlign: 'center', py: 6 }}>
      <Typography variant="h3" gutterBottom>
        404
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        This page does not exist.
      </Typography>
      <Button variant="contained" component={RouterLink} to="/">
        Home
      </Button>
    </Box>
  )
}
