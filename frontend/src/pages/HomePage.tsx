import { Box, Button, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

export function HomePage() {
  return (
    <Box className="home-hero">
      <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
        Shop from many vendors in one place
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 560 }}>
        Browse products, manage your cart, and place orders. Vendors can list inventory; admins can
        oversee users.
      </Typography>
      <Button variant="contained" size="large" component={RouterLink} to="/products">
        Browse products
      </Button>
    </Box>
  )
}
